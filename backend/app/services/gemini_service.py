"""Gemini AI Client Service using official google-genai SDK with performance tracking, jittered retry and fallback model."""

import json
import logging
import time
from typing import Any, Optional, Type
from pydantic import BaseModel
from google import genai
from google.genai import types, errors

from app.core.config import settings
from app.core.exceptions import (
    GeminiConfigurationError,
    GeminiAuthError,
    GeminiRateLimitError,
    GeminiUnavailableError,
    GeminiTimeoutError,
    GeminiBadGatewayError,
)
from app.prompts.system_instruction import SYSTEM_INSTRUCTION

logger = logging.getLogger("adgen_ai.gemini")


def is_transient_error(exc: Exception) -> bool:
    """Determine if an exception is transient and safe to retry with exponential backoff.

    Transient errors: 503 (High Demand), 504 (Deadline Exceeded), 502/500 (Temporary Server Error),
    and brief concurrency rate limits without quota depletion.

    Non-transient errors: Auth (401/403), Invalid Arg (400), Not Found (404),
    and unrecoverable Quota / Billing / Plan exhaustion.
    """
    # Never retry configuration or validation errors
    if isinstance(exc, (GeminiConfigurationError, GeminiAuthError, ValueError, KeyError)):
        return False

    msg_str = str(exc).lower()

    # Rule 1: Quota / billing / credit exhaustion is NEVER transient - fail fast to avoid wasted latency
    unrecoverable_quota_terms = ["quota", "billing", "free tier", "credit", "exceeded your current quota"]
    if any(term in msg_str for term in unrecoverable_quota_terms):
        return False

    # Rule 2: Client errors (4xx)
    if isinstance(exc, errors.ClientError):
        code = getattr(exc, "code", None)
        # 400, 401, 403, 404 should never be retried
        if code in (400, 401, 403, 404):
            return False
        # 429 concurrency throttle (if not caught by Rule 1)
        if code == 429:
            return True

    # Rule 3: Known Server errors (500, 502, 503, 504)
    if isinstance(exc, errors.ServerError):
        return True

    # Rule 4: Keywords for transient network or server load issues
    transient_keywords = [
        "high demand",
        "503",
        "unavailable",
        "timeout",
        "deadline",
        "connection",
        "overloaded",
    ]
    return any(k in msg_str for k in transient_keywords)


class GeminiService:
    """Encapsulates interaction with Google Gemini API with performance metrics tracking."""

    def __init__(self):
        self._client: Optional[genai.Client] = None
        self._cached_verify_result: Optional[dict] = None
        self._last_verify_time: float = 0.0
        self._cache_ttl: float = 30.0  # 30 seconds cache to avoid API quota drain

    def get_client(self) -> genai.Client:
        """Get or initialize the Gemini client with configured timeout."""
        if not settings.is_gemini_configured:
            logger.error("Attempted to call Gemini API without GEMINI_API_KEY configured.")
            raise GeminiConfigurationError(
                "Gemini API Key chưa được cấu hình. Vui lòng thiết lập biến môi trường GEMINI_API_KEY trong file .env."
            )
        if self._client is None:
            http_options = types.HttpOptions(timeout=settings.GEMINI_TIMEOUT * 1000)
            self._client = genai.Client(
                api_key=settings.GEMINI_API_KEY,
                http_options=http_options,
            )
        return self._client

    @staticmethod
    def _build_thinking_config(model_name: str) -> Optional[types.ThinkingConfig]:
        """Build appropriate thinking configuration for the specific Gemini model.

        - Lite models (e.g. gemini-3.5-flash-lite): do not support thinking_budget (returns 400).
          They natively operate in low-latency mode and support thinking_level=MINIMAL.
        - Non-lite models (e.g. gemini-3.5-flash): support thinking_budget=0 to disable reasoning overhead.
        """
        m_lower = model_name.lower()
        if "lite" in m_lower:
            try:
                if hasattr(types, "ThinkingLevel") and hasattr(types.ThinkingLevel, "MINIMAL"):
                    return types.ThinkingConfig(thinking_level=types.ThinkingLevel.MINIMAL)
            except Exception:
                pass
            return None
        else:
            try:
                return types.ThinkingConfig(thinking_budget=0)
            except Exception:
                pass
            return None

    def _invoke_with_retry(
        self,
        model_name: str,
        prompt: str,
        config: types.GenerateContentConfig,
    ) -> tuple[Any, int]:
        """Invoke generate_content with limited exponential retry, returning (response, retry_count)."""
        client = self.get_client()
        retries = 0
        max_attempts = max(1, settings.GEMINI_MAX_RETRIES)
        last_exc = None

        for attempt in range(max_attempts):
            try:
                logger.info(
                    "Calling Gemini model '%s' (attempt %d/%d, prompt len=%d, timeout=%ds)",
                    model_name,
                    attempt + 1,
                    max_attempts,
                    len(prompt),
                    settings.GEMINI_TIMEOUT,
                )
                response = client.models.generate_content(
                    model=model_name,
                    contents=prompt,
                    config=config,
                )
                return response, retries
            except Exception as exc:
                last_exc = exc
                if not is_transient_error(exc) or attempt == max_attempts - 1:
                    raise exc
                retries += 1
                backoff_time = min(4.0, 1.0 * (2 ** attempt))
                logger.warning(
                    "Attempt %d/%d for model '%s' failed (%s). Retrying in %.1fs...",
                    attempt + 1,
                    max_attempts,
                    model_name,
                    str(exc)[:120],
                    backoff_time,
                )
                time.sleep(backoff_time)

        raise last_exc

    def generate_structured(
        self,
        prompt: str,
        response_schema: Type[BaseModel],
        system_instruction: str = SYSTEM_INSTRUCTION,
        temperature: float = 0.7,
        max_output_tokens: Optional[int] = None,
    ) -> tuple[str, dict]:
        """Call Gemini API with Structured Output (JSON Schema), performance metrics, and fallback.

        Returns:
            tuple[raw_json_text, usage_dict]
        """
        self.get_client()

        out_limit = max_output_tokens or settings.GEMINI_MAX_OUTPUT_TOKENS

        # Configure base config with structured output and output limit
        cfg_kwargs = {
            "system_instruction": system_instruction,
            "response_mime_type": "application/json",
            "response_schema": response_schema,
            "temperature": temperature,
            "max_output_tokens": out_limit,
        }

        primary_model = settings.GEMINI_MODEL
        fallback_model = settings.GEMINI_FALLBACK_MODEL

        # Configure thinking parameters appropriately for primary model
        primary_thinking = self._build_thinking_config(primary_model)
        if primary_thinking is not None:
            cfg_kwargs["thinking_config"] = primary_thinking

        config = types.GenerateContentConfig(**cfg_kwargs)

        t_gemini_start = time.perf_counter()
        total_calls = 0
        total_retries = 0
        model_used = primary_model
        response = None

        try:
            total_calls += 1
            response, retries = self._invoke_with_retry(primary_model, prompt, config)
            total_retries += retries
            model_used = primary_model
        except Exception as primary_exc:
            logger.warning(
                "Primary model '%s' failed: %s",
                primary_model,
                str(primary_exc)[:150],
            )
            # Try fallback model if configured and error is transient
            if (
                fallback_model
                and fallback_model.strip()
                and fallback_model.strip() != primary_model
                and is_transient_error(primary_exc)
            ):
                target_fallback = fallback_model.strip()
                logger.info(
                    "Switching to verified fallback model '%s' due to primary error.",
                    target_fallback,
                )
                # Adjust thinking config for fallback if needed
                fallback_cfg_kwargs = {
                    "system_instruction": system_instruction,
                    "response_mime_type": "application/json",
                    "response_schema": response_schema,
                    "temperature": temperature,
                    "max_output_tokens": out_limit,
                }
                fallback_thinking = self._build_thinking_config(target_fallback)
                if fallback_thinking is not None:
                    fallback_cfg_kwargs["thinking_config"] = fallback_thinking
                fallback_config = types.GenerateContentConfig(**fallback_cfg_kwargs)

                try:
                    total_calls += 1
                    response, retries = self._invoke_with_retry(target_fallback, prompt, fallback_config)
                    total_retries += retries
                    model_used = target_fallback
                except Exception as fallback_exc:
                    logger.error(
                        "Fallback model '%s' also failed: %s",
                        target_fallback,
                        str(fallback_exc)[:150],
                    )
                    self._raise_mapped_exception(fallback_exc)
            else:
                self._raise_mapped_exception(primary_exc)

        t_gemini_end = time.perf_counter()
        gemini_latency_ms = round((t_gemini_end - t_gemini_start) * 1000, 2)

        if not response or not response.text:
            raise GeminiBadGatewayError("Mô hình Gemini không trả về dữ liệu nội dung.")

        raw_text = response.text.strip()

        prompt_tokens = getattr(response.usage_metadata, "prompt_token_count", 0) if hasattr(response, "usage_metadata") else 0
        candidate_tokens = getattr(response.usage_metadata, "candidates_token_count", 0) if hasattr(response, "usage_metadata") else 0
        total_tokens = getattr(response.usage_metadata, "total_token_count", 0) if hasattr(response, "usage_metadata") else 0

        usage_dict = {
            "model": model_used,
            "prompt_token_count": prompt_tokens,
            "candidates_token_count": candidate_tokens,
            "total_token_count": total_tokens,
            "gemini_calls": total_calls,
            "retry_count": total_retries,
            "gemini_request_ms": gemini_latency_ms,
            "http_status": 200,
        }

        return raw_text, usage_dict

    def _raise_mapped_exception(self, exc: Exception) -> None:
        """Map raw Gemini exceptions to structured application exceptions with accurate HTTP codes."""
        if isinstance(exc, (GeminiConfigurationError, GeminiAuthError, GeminiRateLimitError, GeminiUnavailableError, GeminiTimeoutError, GeminiBadGatewayError)):
            raise exc

        code = getattr(exc, "code", None)
        msg = str(exc)
        msg_lower = msg.lower()

        # 1. Auth errors (401 / 403)
        if code in (401, 403) or "unauthenticated" in msg_lower or "api_key_invalid" in msg_lower or "permission_denied" in msg_lower:
            raise GeminiAuthError(
                "Khóa Gemini API Key không hợp lệ hoặc không có quyền truy cập.",
                status_code=code if code in (401, 403) else 401,
            )

        # 2. Rate limit / Quota exceeded (429)
        if code == 429 or "resource_exhausted" in msg_lower or "quota" in msg_lower or "rate limit" in msg_lower:
            raise GeminiRateLimitError(
                "Đã vượt quá hạn mức sử dụng (Quota / Rate Limit) của Gemini API. Vui lòng thử lại sau.",
            )

        # 3. Timeout (504 / Deadline Exceeded)
        if code == 504 or "deadline" in msg_lower or "timed out" in msg_lower or "timeout" in msg_lower:
            raise GeminiTimeoutError(
                "Quá thời gian phản hồi từ máy chủ Gemini AI (Timeout). Vui lòng thử lại.",
            )

        # 4. High Demand / Service Unavailable (503)
        if code == 503 or "high demand" in msg_lower or "overloaded" in msg_lower or "unavailable" in msg_lower:
            raise GeminiUnavailableError(
                "Mô hình AI hiện đang quá tải (High Demand). Vui lòng thử lại sau giây lát.",
            )

        # 5. Invalid argument / 400
        if code == 400 or "invalid_argument" in msg_lower:
            raise GeminiBadGatewayError(
                f"Cấu hình yêu cầu Gemini không hợp lệ: {getattr(exc, 'message', None) or 'Invalid request'}",
                status_code=400,
            )

        # 6. Default intermediate gateway error (502)
        raise GeminiBadGatewayError(
            "Lỗi kết nối trung gian khi Backend giao tiếp với dịch vụ Gemini AI. Vui lòng thử lại sau.",
        )

    def verify_gemini_connection(self, force_refresh: bool = False) -> dict:
        """Check live Gemini connection without logging secrets, with 30s result caching."""
        if not force_refresh and self._cached_verify_result is not None:
            if (time.time() - self._last_verify_time) < self._cache_ttl:
                return self._cached_verify_result

        if not settings.is_gemini_configured:
            result = {
                "configured": False,
                "status": "not_configured",
                "model": settings.GEMINI_MODEL,
                "fallback_model": settings.GEMINI_FALLBACK_MODEL,
                "message": "Gemini API Key chưa được cấu hình trong backend/.env",
            }
            self._cached_verify_result = result
            self._last_verify_time = time.time()
            return result

        try:
            client = self.get_client()
            client.models.get(model=settings.GEMINI_MODEL)
            result = {
                "configured": True,
                "status": "available",
                "model": settings.GEMINI_MODEL,
                "fallback_model": settings.GEMINI_FALLBACK_MODEL,
                "message": f"Mô hình {settings.GEMINI_MODEL} sẵn sàng hoạt động",
            }
        except Exception as e:
            msg = str(e).lower()
            code = getattr(e, "code", None)
            if code == 503 or "high demand" in msg or "unavailable" in msg or "overloaded" in msg:
                result = {
                    "configured": True,
                    "status": "temporarily_unavailable",
                    "model": settings.GEMINI_MODEL,
                    "fallback_model": settings.GEMINI_FALLBACK_MODEL,
                    "message": "Mô hình Gemini tạm thời quá tải (503 High Demand)",
                }
            elif code == 429 or "resource_exhausted" in msg or "quota" in msg or "rate limit" in msg:
                result = {
                    "configured": True,
                    "status": "temporarily_unavailable",
                    "model": settings.GEMINI_MODEL,
                    "fallback_model": settings.GEMINI_FALLBACK_MODEL,
                    "message": "Mô hình Gemini vượt hạn mức sử dụng (429 Rate Limit / Quota)",
                }
            elif code in (401, 403) or "unauthenticated" in msg or "permission" in msg or "api_key_invalid" in msg:
                result = {
                    "configured": True,
                    "status": "auth_error",
                    "model": settings.GEMINI_MODEL,
                    "fallback_model": settings.GEMINI_FALLBACK_MODEL,
                    "message": "Khóa Gemini API Key không hợp lệ hoặc thiếu quyền truy cập",
                }
            else:
                result = {
                    "configured": True,
                    "status": "unverified",
                    "model": settings.GEMINI_MODEL,
                    "fallback_model": settings.GEMINI_FALLBACK_MODEL,
                    "message": f"Chưa thể xác minh trạng thái kết nối ({str(e)[:100]})",
                }

        self._cached_verify_result = result
        self._last_verify_time = time.time()
        return result


gemini_service = GeminiService()

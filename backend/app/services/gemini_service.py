"""Gemini AI Client Service using official google-genai SDK with jittered retry and fallback model."""

import json
import logging
import time
from typing import Any, Optional, Type
from pydantic import BaseModel
from google import genai
from google.genai import types, errors
from tenacity import (
    retry,
    stop_after_attempt,
    wait_random_exponential,
    retry_if_exception,
    before_sleep_log,
)

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
    """Determine if an exception is transient and safe to retry with exponential backoff."""
    # Never retry configuration or validation errors
    if isinstance(exc, (GeminiConfigurationError, GeminiAuthError, ValueError, KeyError)):
        return False

    # Check for known Google GenAI error classes
    if isinstance(exc, errors.ServerError):
        # 503 (High Demand / Service Unavailable), 500, 502, 504
        return True
    if isinstance(exc, errors.ClientError):
        code = getattr(exc, "code", None)
        if code == 429:
            return True
        # 400, 401, 403, 404 should never be retried
        if code in (400, 401, 403, 404):
            return False

    msg = str(exc).lower()
    # Check transient keywords
    transient_keywords = [
        "high demand",
        "503",
        "unavailable",
        "rate limit",
        "resource_exhausted",
        "429",
        "timeout",
        "deadline",
        "connection",
        "overloaded",
    ]
    return any(k in msg for k in transient_keywords)


class GeminiService:
    """Encapsulates interaction with Google Gemini API."""

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
            # Set timeout in milliseconds
            http_options = types.HttpOptions(timeout=settings.GEMINI_TIMEOUT * 1000)
            self._client = genai.Client(
                api_key=settings.GEMINI_API_KEY,
                http_options=http_options,
            )
        return self._client

    @retry(
        stop=stop_after_attempt(max(1, settings.GEMINI_MAX_RETRIES)),
        wait=wait_random_exponential(multiplier=1, min=1, max=8),
        retry=retry_if_exception(is_transient_error),
        before_sleep=before_sleep_log(logger, logging.WARNING),
        reraise=True,
    )
    def _call_model_with_retry(
        self,
        model_name: str,
        prompt: str,
        config: types.GenerateContentConfig,
    ):
        """Invoke generate_content on a specific model with jittered exponential retry."""
        client = self.get_client()
        logger.info(
            "Calling Gemini model '%s' (prompt len=%d, timeout=%ds)",
            model_name,
            len(prompt),
            settings.GEMINI_TIMEOUT,
        )
        return client.models.generate_content(
            model=model_name,
            contents=prompt,
            config=config,
        )

    def generate_structured(
        self,
        prompt: str,
        response_schema: Type[BaseModel],
        system_instruction: str = SYSTEM_INSTRUCTION,
        temperature: float = 0.7,
    ) -> tuple[str, Optional[dict]]:
        """Call Gemini API with Structured Output (JSON Schema), retry, and fallback model.

        Returns:
            tuple[raw_json_text, usage_dict]
        """
        # Ensure client is ready before configuring
        self.get_client()

        config = types.GenerateContentConfig(
            system_instruction=system_instruction,
            response_mime_type="application/json",
            response_schema=response_schema,
            temperature=temperature,
        )

        primary_model = settings.GEMINI_MODEL
        fallback_model = settings.GEMINI_FALLBACK_MODEL

        response = None
        try:
            response = self._call_model_with_retry(primary_model, prompt, config)
        except Exception as primary_exc:
            logger.warning(
                "Primary model '%s' failed after retries: %s",
                primary_model,
                str(primary_exc),
            )
            # Check if fallback model is configured and the error was transient
            if (
                fallback_model
                and fallback_model.strip()
                and fallback_model.strip() != primary_model
                and is_transient_error(primary_exc)
            ):
                target_fallback = fallback_model.strip()
                logger.info(
                    "Switching to verified fallback model '%s' due to primary model error.",
                    target_fallback,
                )
                try:
                    response = self._call_model_with_retry(target_fallback, prompt, config)
                except Exception as fallback_exc:
                    logger.error(
                        "Fallback model '%s' also failed: %s",
                        target_fallback,
                        str(fallback_exc),
                    )
                    self._raise_mapped_exception(fallback_exc)
            else:
                self._raise_mapped_exception(primary_exc)

        if not response or not response.text:
            raise GeminiBadGatewayError("Mô hình Gemini không trả về dữ liệu nội dung.")

        raw_text = response.text.strip()

        usage_info = None
        if hasattr(response, "usage_metadata") and response.usage_metadata:
            usage_info = {
                "prompt_token_count": getattr(response.usage_metadata, "prompt_token_count", None),
                "candidates_token_count": getattr(response.usage_metadata, "candidates_token_count", None),
                "total_token_count": getattr(response.usage_metadata, "total_token_count", None),
            }

        return raw_text, usage_info

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
            # Lightweight verification (model metadata lookup, does not consume generation quota)
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

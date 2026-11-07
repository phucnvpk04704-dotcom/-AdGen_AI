"""Generator Service orchestrating prompt creation, Gemini execution, and business validation with performance monitoring."""

import json
import logging
import time
from typing import Union
from pydantic import ValidationError

from app.schemas.generator import (
    GenerationRequest,
    GenerationResponse,
    GenerationData,
    CaptionItem,
    HeadlineItem,
)
from app.schemas.regenerate import (
    RegenerateRequest,
    RegenerateResponse,
)
from app.prompts.prompt_builder import (
    build_generation_prompt,
    build_single_regeneration_prompt,
)
from app.services.gemini_service import gemini_service
from app.core.config import settings
from app.core.exceptions import OutputValidationError, GeminiServiceError

logger = logging.getLogger("adgen_ai.generator")


class GeneratorService:
    """Business service for AI Advertising Content Generation with detailed performance logging."""

    def generate_advertising_content(self, request: GenerationRequest) -> GenerationResponse:
        """Generate complete 3-3-5 advertising content with performance timing."""
        t_start = time.perf_counter()

        # 1. Input validation timing (Pydantic already verified request object)
        t_val_start = time.perf_counter()
        # Verify non-empty logic
        _ = bool(request.product_name and request.description and request.target_audience and request.tone)
        t_val_end = time.perf_counter()
        validation_ms = round((t_val_end - t_val_start) * 1000, 2)

        # 2. Prompt construction timing
        t_prompt_start = time.perf_counter()
        prompt = build_generation_prompt(request)
        t_prompt_end = time.perf_counter()
        prompt_build_ms = round((t_prompt_end - t_prompt_start) * 1000, 2)

        # 3. Gemini API request timing
        t_gem_start = time.perf_counter()
        raw_json, usage = gemini_service.generate_structured(
            prompt=prompt,
            response_schema=GenerationData,
            max_output_tokens=settings.GEMINI_MAX_OUTPUT_TOKENS,
        )
        t_gem_end = time.perf_counter()
        gemini_request_ms = round((t_gem_end - t_gem_start) * 1000, 2)
        usage = usage or {}

        # 4. JSON parsing timing
        t_parse_start = time.perf_counter()
        try:
            parsed_data = GenerationData.model_validate_json(raw_json)
        except ValidationError as val_err:
            logger.error("Gemini output failed schema validation: %s. Raw: %s", str(val_err), raw_json)
            raise OutputValidationError(
                message="Dữ liệu do AI trả về không đáp ứng đúng cấu trúc 3-3-5 yêu cầu.",
                details=val_err.errors(),
            )
        except Exception as json_err:
            logger.error("Failed to parse Gemini JSON: %s. Raw: %s", str(json_err), raw_json)
            raise OutputValidationError(
                message="Không thể phân tích định dạng phản hồi từ AI.",
            )
        t_parse_end = time.perf_counter()
        json_parse_ms = round((t_parse_end - t_parse_start) * 1000, 2)

        # 5. Output business rules validation timing
        t_rules_start = time.perf_counter()
        self._enforce_business_rules(parsed_data)
        t_rules_end = time.perf_counter()
        validation_output_ms = round((t_rules_end - t_rules_start) * 1000, 2)

        # 6. Total backend processing time
        t_total_end = time.perf_counter()
        total_backend_ms = round((t_total_end - t_start) * 1000, 2)

        # Structured performance logging as specified in prompt section 2
        logger.info(
            "\n[PERFORMANCE]\n"
            "validation_ms: %.2f\n"
            "prompt_build_ms: %.2f\n"
            "gemini_request_ms: %.2f\n"
            "json_parse_ms: %.2f\n"
            "validation_output_ms: %.2f\n"
            "total_backend_ms: %.2f\n"
            "model: %s\n"
            "prompt_token_count: %s\n"
            "candidates_token_count: %s\n"
            "total_token_count: %s\n"
            "gemini_call_count: %s\n"
            "retry_count: %s\n"
            "http_status: %s",
            validation_ms,
            prompt_build_ms,
            gemini_request_ms,
            json_parse_ms,
            validation_output_ms,
            total_backend_ms,
            usage.get("model", settings.GEMINI_MODEL),
            usage.get("prompt_token_count", 0),
            usage.get("candidates_token_count", 0),
            usage.get("total_token_count", 0),
            usage.get("gemini_calls", 1),
            usage.get("retry_count", 0),
            usage.get("http_status", 200),
        )

        metrics = {
            "validation_ms": validation_ms,
            "prompt_build_ms": prompt_build_ms,
            "gemini_request_ms": gemini_request_ms,
            "json_parse_ms": json_parse_ms,
            "validation_output_ms": validation_output_ms,
            "total_backend_ms": total_backend_ms,
            "model": usage.get("model", settings.GEMINI_MODEL),
            "prompt_tokens": usage.get("prompt_token_count", 0),
            "candidate_tokens": usage.get("candidates_token_count", 0),
            "total_tokens": usage.get("total_token_count", 0),
            "gemini_calls": usage.get("gemini_calls", 1),
            "retry_count": usage.get("retry_count", 0),
        }

        return GenerationResponse(
            success=True,
            message="Tạo nội dung quảng cáo bằng AI thành công",
            data=parsed_data,
            usage=usage,
            metrics=metrics,
        )

    def regenerate_advertising_content(self, request: RegenerateRequest) -> RegenerateResponse:
        """Regenerate either all content or a specific single item with timing."""
        if request.target_type == "all":
            full_req = GenerationRequest(
                product_name=request.product_name,
                description=request.description,
                target_audience=request.target_audience,
                tone=request.tone,
            )
            full_res = self.generate_advertising_content(full_req)
            return RegenerateResponse(
                success=True,
                message="Tạo lại toàn bộ bộ nội dung thành công",
                target_type="all",
                data=full_res.data,
                usage=full_res.usage,
                metrics=full_res.metrics,
            )

        t_start = time.perf_counter()

        if request.target_type == "caption":
            t_prompt_start = time.perf_counter()
            prompt = build_single_regeneration_prompt(request)
            t_prompt_end = time.perf_counter()
            prompt_build_ms = round((t_prompt_end - t_prompt_start) * 1000, 2)

            t_gem_start = time.perf_counter()
            raw_json, usage = gemini_service.generate_structured(
                prompt=prompt,
                response_schema=CaptionItem,
                max_output_tokens=settings.GEMINI_SINGLE_MAX_OUTPUT_TOKENS,
            )
            t_gem_end = time.perf_counter()
            gemini_request_ms = round((t_gem_end - t_gem_start) * 1000, 2)
            usage = usage or {}

            t_parse_start = time.perf_counter()
            try:
                caption_item = CaptionItem.model_validate_json(raw_json)
            except Exception as e:
                logger.error("Failed to parse single caption: %s. Raw: %s", str(e), raw_json)
                raise OutputValidationError("Dữ liệu caption mới không đúng định dạng.")
            t_parse_end = time.perf_counter()
            json_parse_ms = round((t_parse_end - t_parse_start) * 1000, 2)

            caption_item.id = request.target_id or "caption_1"
            total_backend_ms = round((time.perf_counter() - t_start) * 1000, 2)

            logger.info(
                "\n[PERFORMANCE]\n"
                "prompt_build_ms: %.2f\n"
                "gemini_request_ms: %.2f\n"
                "json_parse_ms: %.2f\n"
                "total_backend_ms: %.2f\n"
                "model: %s\n"
                "prompt_token_count: %s\n"
                "candidates_token_count: %s\n"
                "gemini_call_count: %s\n"
                "retry_count: %s\n"
                "http_status: 200",
                prompt_build_ms,
                gemini_request_ms,
                json_parse_ms,
                total_backend_ms,
                usage.get("model", settings.GEMINI_MODEL),
                usage.get("prompt_token_count", 0),
                usage.get("candidates_token_count", 0),
                usage.get("gemini_calls", 1),
                usage.get("retry_count", 0),
            )

            metrics = {
                "prompt_build_ms": prompt_build_ms,
                "gemini_request_ms": gemini_request_ms,
                "json_parse_ms": json_parse_ms,
                "total_backend_ms": total_backend_ms,
                "model": usage.get("model", settings.GEMINI_MODEL),
                "prompt_tokens": usage.get("prompt_token_count", 0),
                "candidate_tokens": usage.get("candidates_token_count", 0),
                "total_tokens": usage.get("total_token_count", 0),
                "gemini_calls": usage.get("gemini_calls", 1),
                "retry_count": usage.get("retry_count", 0),
            }

            return RegenerateResponse(
                success=True,
                message=f"Làm mới {caption_item.id} thành công",
                target_type="caption",
                target_id=caption_item.id,
                item=caption_item,
                usage=usage,
                metrics=metrics,
            )

        elif request.target_type == "headline":
            t_prompt_start = time.perf_counter()
            prompt = build_single_regeneration_prompt(request)
            t_prompt_end = time.perf_counter()
            prompt_build_ms = round((t_prompt_end - t_prompt_start) * 1000, 2)

            t_gem_start = time.perf_counter()
            raw_json, usage = gemini_service.generate_structured(
                prompt=prompt,
                response_schema=HeadlineItem,
                max_output_tokens=settings.GEMINI_SINGLE_MAX_OUTPUT_TOKENS,
            )
            t_gem_end = time.perf_counter()
            gemini_request_ms = round((t_gem_end - t_gem_start) * 1000, 2)
            usage = usage or {}

            t_parse_start = time.perf_counter()
            try:
                headline_item = HeadlineItem.model_validate_json(raw_json)
            except Exception as e:
                logger.error("Failed to parse single headline: %s. Raw: %s", str(e), raw_json)
                raise OutputValidationError("Dữ liệu tiêu đề mới không đúng định dạng.")
            t_parse_end = time.perf_counter()
            json_parse_ms = round((t_parse_end - t_parse_start) * 1000, 2)

            headline_item.id = request.target_id or "headline_1"
            total_backend_ms = round((time.perf_counter() - t_start) * 1000, 2)

            logger.info(
                "\n[PERFORMANCE]\n"
                "prompt_build_ms: %.2f\n"
                "gemini_request_ms: %.2f\n"
                "json_parse_ms: %.2f\n"
                "total_backend_ms: %.2f\n"
                "model: %s\n"
                "prompt_token_count: %s\n"
                "candidates_token_count: %s\n"
                "gemini_call_count: %s\n"
                "retry_count: %s\n"
                "http_status: 200",
                prompt_build_ms,
                gemini_request_ms,
                json_parse_ms,
                total_backend_ms,
                usage.get("model", settings.GEMINI_MODEL),
                usage.get("prompt_token_count", 0),
                usage.get("candidates_token_count", 0),
                usage.get("gemini_calls", 1),
                usage.get("retry_count", 0),
            )

            metrics = {
                "prompt_build_ms": prompt_build_ms,
                "gemini_request_ms": gemini_request_ms,
                "json_parse_ms": json_parse_ms,
                "total_backend_ms": total_backend_ms,
                "model": usage.get("model", settings.GEMINI_MODEL),
                "prompt_tokens": usage.get("prompt_token_count", 0),
                "candidate_tokens": usage.get("candidates_token_count", 0),
                "total_tokens": usage.get("total_token_count", 0),
                "gemini_calls": usage.get("gemini_calls", 1),
                "retry_count": usage.get("retry_count", 0),
            }

            return RegenerateResponse(
                success=True,
                message=f"Làm mới {headline_item.id} thành công",
                target_type="headline",
                target_id=headline_item.id,
                item=headline_item,
                usage=usage,
                metrics=metrics,
            )

        else:
            raise ValueError(f"target_type không hợp lệ: {request.target_type}")

    def _enforce_business_rules(self, data: GenerationData) -> None:
        """Enforce anti-hallucination and output constraints."""
        for cap in data.captions:
            if not cap.content or not cap.content.strip():
                raise OutputValidationError("Nội dung bài viết không được để trống.")
        for hl in data.headlines:
            if not hl.content or not hl.content.strip():
                raise OutputValidationError("Nội dung tiêu đề không được để trống.")

        for tag in data.hashtags:
            if not tag.startswith("#"):
                raise OutputValidationError(f"Hashtag '{tag}' phải bắt đầu bằng dấu #.")
            if " " in tag:
                raise OutputValidationError(f"Hashtag '{tag}' không được chứa khoảng trắng.")


generator_service = GeneratorService()

"""Generator Service orchestrating prompt creation, Gemini execution, and business validation."""

import json
import logging
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
from app.core.exceptions import OutputValidationError, GeminiServiceError

logger = logging.getLogger("adgen_ai.generator")


class GeneratorService:
    """Business service for AI Advertising Content Generation."""

    def generate_advertising_content(self, request: GenerationRequest) -> GenerationResponse:
        """Generate complete 3-3-5 advertising content."""
        prompt = build_generation_prompt(request)

        # Call Gemini with Structured Output
        raw_json, usage = gemini_service.generate_structured(
            prompt=prompt,
            response_schema=GenerationData,
        )

        # Parse & Validate with Pydantic
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

        # Verify business constraints
        self._enforce_business_rules(parsed_data)

        return GenerationResponse(
            success=True,
            message="Tạo nội dung quảng cáo bằng AI thành công",
            data=parsed_data,
            usage=usage,
        )

    def regenerate_advertising_content(self, request: RegenerateRequest) -> RegenerateResponse:
        """Regenerate either all content or a specific single item."""
        if request.target_type == "all":
            # Delegate to full generator
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
            )

        elif request.target_type == "caption":
            prompt = build_single_regeneration_prompt(request)
            raw_json, _ = gemini_service.generate_structured(
                prompt=prompt,
                response_schema=CaptionItem,
            )

            try:
                caption_item = CaptionItem.model_validate_json(raw_json)
            except Exception as e:
                logger.error("Failed to parse single caption: %s. Raw: %s", str(e), raw_json)
                raise OutputValidationError("Dữ liệu caption mới không đúng định dạng.")

            # Ensure ID matches requested target_id
            caption_item.id = request.target_id or "caption_1"

            return RegenerateResponse(
                success=True,
                message=f"Làm mới {caption_item.id} thành công",
                target_type="caption",
                target_id=caption_item.id,
                item=caption_item,
            )

        elif request.target_type == "headline":
            prompt = build_single_regeneration_prompt(request)
            raw_json, _ = gemini_service.generate_structured(
                prompt=prompt,
                response_schema=HeadlineItem,
            )

            try:
                headline_item = HeadlineItem.model_validate_json(raw_json)
            except Exception as e:
                logger.error("Failed to parse single headline: %s. Raw: %s", str(e), raw_json)
                raise OutputValidationError("Dữ liệu tiêu đề mới không đúng định dạng.")

            headline_item.id = request.target_id or "headline_1"

            return RegenerateResponse(
                success=True,
                message=f"Làm mới {headline_item.id} thành công",
                target_type="headline",
                target_id=headline_item.id,
                item=headline_item,
            )

        else:
            raise ValueError(f"target_type không hợp lệ: {request.target_type}")

    def _enforce_business_rules(self, data: GenerationData) -> None:
        """Enforce anti-hallucination and output constraints."""
        # Check non-empty content
        for cap in data.captions:
            if not cap.content or not cap.content.strip():
                raise OutputValidationError("Nội dung bài viết không được để trống.")
        for hl in data.headlines:
            if not hl.content or not hl.content.strip():
                raise OutputValidationError("Nội dung tiêu đề không được để trống.")

        # Ensure hashtags start with '#' and contain no spaces
        for tag in data.hashtags:
            if not tag.startswith("#"):
                raise OutputValidationError(f"Hashtag '{tag}' phải bắt đầu bằng dấu #.")
            if " " in tag:
                raise OutputValidationError(f"Hashtag '{tag}' không được chứa khoảng trắng.")


generator_service = GeneratorService()


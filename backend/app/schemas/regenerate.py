"""Pydantic schemas for regenerating content."""

from typing import Any, Literal, Optional, Union
from pydantic import BaseModel, Field, field_validator
from app.schemas.generator import CaptionItem, HeadlineItem, GenerationData


class RegenerateRequest(BaseModel):
    """Request payload for content regeneration."""

    product_name: str = Field(..., min_length=2, max_length=150)
    description: str = Field(..., min_length=10, max_length=1000)
    target_audience: str = Field(..., min_length=5, max_length=250)
    tone: Literal["funny", "professional", "youthful"] = "youthful"

    target_type: Literal["all", "caption", "headline"] = Field(
        default="all",
        description="Loại nội dung cần tạo lại: all (toàn bộ), caption (1 caption), headline (1 headline)",
    )
    target_id: Optional[str] = Field(
        default=None,
        description="Mã của phần tử cần tạo lại (ví dụ caption_1, caption_2, caption_3, headline_1, v.v.)",
    )
    existing_content: Optional[str] = Field(
        default=None,
        description="Nội dung cũ đang hiển thị cần thay thế",
    )

    @field_validator("product_name", "description", "target_audience", mode="before")
    @classmethod
    def strip_and_validate_non_empty(cls, v: str) -> str:
        if not isinstance(v, str):
            raise ValueError("Trường dữ liệu phải là chuỗi ký tự.")
        cleaned = v.strip()
        if not cleaned:
            raise ValueError("Không được để trống hoặc chỉ chứa khoảng trắng.")
        return cleaned

    @field_validator("target_id")
    @classmethod
    def validate_target_id(cls, v: Optional[str], values) -> Optional[str]:
        target_type = values.data.get("target_type")
        if target_type in ("caption", "headline") and not v:
            raise ValueError(f"target_id là bắt buộc khi target_type là '{target_type}'.")
        return v


class RegenerateSingleResponse(BaseModel):
    """Response payload when regenerating a single item."""

    success: bool = True
    message: str = "Làm mới nội dung thành công"
    target_type: Literal["caption", "headline"]
    target_id: str
    item: Union[CaptionItem, HeadlineItem]


class RegenerateResponse(BaseModel):
    """Unified response payload for regenerate endpoint."""

    success: bool = True
    message: str = "Tạo lại nội dung thành công"
    target_type: Literal["all", "caption", "headline"]
    data: Optional[GenerationData] = None
    item: Optional[Union[CaptionItem, HeadlineItem]] = None
    target_id: Optional[str] = None
    usage: Optional[dict] = Field(default=None, description="Thông tin token usage nếu có")
    metrics: Optional[dict] = Field(
        default=None,
        description="Thông tin đo lường hiệu năng chi tiết (ms và token)",
    )


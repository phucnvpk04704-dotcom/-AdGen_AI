"""Pydantic schemas for AI content generation request and response."""

import re
from typing import List, Literal, Optional
from pydantic import BaseModel, Field, field_validator


class GenerationRequest(BaseModel):
    """Input payload for generating advertising content."""

    product_name: str = Field(
        ...,
        min_length=2,
        max_length=150,
        description="Tên sản phẩm",
        examples=["Bình giữ nhiệt Inox 304 LockStyle"],
    )
    description: str = Field(
        ...,
        min_length=10,
        max_length=1000,
        description="Mô tả đặc điểm, công dụng, lợi ích nổi bật của sản phẩm",
        examples=[
          "Giữ nhiệt nóng và lạnh bền bỉ 12 giờ, nắp chống tràn, inox 304 an toàn thực phẩm, dung tích 500ml nhỏ gọn."
        ],
    )
    target_audience: str = Field(
        ...,
        min_length=5,
        max_length=250,
        description="Khách hàng mục tiêu",
        examples=["Sinh viên, nhân viên văn phòng, người trẻ năng động"],
    )
    tone: Literal["funny", "professional", "youthful"] = Field(
        default="youthful",
        description="Tông giọng: funny (Hài hước), professional (Trang trọng), youthful (Trẻ trung)",
    )

    @field_validator("product_name", "description", "target_audience", mode="before")
    @classmethod
    def strip_and_validate_non_empty(cls, v: str) -> str:
        """Strip whitespace and reject whitespace-only strings."""
        if not isinstance(v, str):
            raise ValueError("Trường dữ liệu phải là chuỗi ký tự.")
        cleaned = v.strip()
        if not cleaned:
            raise ValueError("Không được để trống hoặc chỉ chứa khoảng trắng.")
        return cleaned


class CaptionItem(BaseModel):
    """Single caption output item."""

    id: str = Field(
        ...,
        description="Mã định danh caption (caption_1, caption_2, caption_3)",
    )
    approach: Literal["benefit", "emotional", "call_to_action"] = Field(
        ...,
        description="Góc tiếp cận: benefit (Lợi ích), emotional (Cảm xúc), call_to_action (Hành động)",
    )
    content: str = Field(
        ...,
        min_length=10,
        description="Nội dung bài viết quảng cáo hoàn chỉnh bằng tiếng Việt",
    )


class HeadlineItem(BaseModel):
    """Single headline output item."""

    id: str = Field(
        ...,
        description="Mã định danh headline (headline_1, headline_2, headline_3)",
    )
    content: str = Field(
        ...,
        min_length=5,
        max_length=200,
        description="Tiêu đề quảng cáo ngắn gọn, thu hút",
    )


class GenerationData(BaseModel):
    """Core 3-3-5 AI generation data schema."""

    captions: List[CaptionItem] = Field(
        ...,
        description="Chính xác 03 bài viết quảng cáo với 3 góc tiếp cận khác nhau",
    )
    headlines: List[HeadlineItem] = Field(
        ...,
        description="Chính xác 03 tiêu đề quảng cáo thu hút",
    )
    hashtags: List[str] = Field(
        ...,
        description="Chính xác 05 hashtag liên quan, bắt đầu bằng dấu #",
    )

    @field_validator("captions")
    @classmethod
    def validate_captions_count(cls, captions: List[CaptionItem]) -> List[CaptionItem]:
        if len(captions) != 3:
            raise ValueError(f"Yêu cầu chính xác 03 caption, nhận được {len(captions)}.")
        approaches = [c.approach for c in captions]
        if len(set(approaches)) != 3:
            raise ValueError("3 caption phải có 3 góc tiếp cận khác biệt (benefit, emotional, call_to_action).")
        return captions

    @field_validator("headlines")
    @classmethod
    def validate_headlines_count(cls, headlines: List[HeadlineItem]) -> List[HeadlineItem]:
        if len(headlines) != 3:
            raise ValueError(f"Yêu cầu chính xác 03 headline, nhận được {len(headlines)}.")
        for h in headlines:
            if not h.content.strip():
                raise ValueError("Nội dung headline không được để trống.")
        return headlines

    @field_validator("hashtags")
    @classmethod
    def validate_hashtags_format_and_count(cls, hashtags: List[str]) -> List[str]:
        if len(hashtags) != 5:
            raise ValueError(f"Yêu cầu chính xác 05 hashtag, nhận được {len(hashtags)}.")
        cleaned_tags = []
        for tag in hashtags:
            clean = tag.strip()
            if not clean.startswith("#"):
                clean = f"#{clean}"
            if " " in clean:
                clean = clean.replace(" ", "")
            if len(clean) < 2:
                raise ValueError(f"Hashtag không hợp lệ: '{tag}'")
            cleaned_tags.append(clean)

        # Check unique
        lowered = [t.lower() for t in cleaned_tags]
        if len(set(lowered)) != 5:
            raise ValueError("5 hashtag không được trùng lặp.")
        return cleaned_tags


class GenerationResponse(BaseModel):
    """Full API response for content generation."""

    success: bool = True
    message: str = "Tạo nội dung thành công"
    data: GenerationData
    usage: Optional[dict] = Field(default=None, description="Thông tin token usage nếu có")
    metrics: Optional[dict] = Field(
        default=None,
        description="Thông tin đo lường hiệu năng chi tiết (ms và token)",
    )

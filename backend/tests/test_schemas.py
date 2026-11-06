"""Unit tests for Pydantic input and output validation schemas."""

import pytest
from pydantic import ValidationError
from app.schemas.generator import (
    GenerationRequest,
    GenerationData,
    CaptionItem,
    HeadlineItem,
)
from app.schemas.regenerate import RegenerateRequest


def test_generation_request_valid():
    """Verify valid GenerationRequest."""
    req = GenerationRequest(
        product_name="  Bình giữ nhiệt  ",
        description="  Sản phẩm giữ nhiệt tốt suốt 24 giờ liên tục.  ",
        target_audience="  Sinh viên  ",
        tone="youthful",
    )
    assert req.product_name == "Bình giữ nhiệt"
    assert req.description == "Sản phẩm giữ nhiệt tốt suốt 24 giờ liên tục."
    assert req.target_audience == "Sinh viên"
    assert req.tone == "youthful"


def test_generation_request_whitespace_only_rejected():
    """Verify whitespace-only strings are rejected."""
    with pytest.raises(ValidationError):
        GenerationRequest(
            product_name="   ",
            description="Mô tả hợp lệ cho sản phẩm",
            target_audience="Sinh viên",
            tone="youthful",
        )


def test_generation_request_invalid_tone():
    """Verify tone outside 3 valid options is rejected."""
    with pytest.raises(ValidationError):
        GenerationRequest(
            product_name="Bình giữ nhiệt",
            description="Mô tả hợp lệ cho sản phẩm",
            target_audience="Sinh viên",
            tone="angry",  # Invalid
        )


def test_generation_data_valid_3_3_5():
    """Verify valid 3-3-5 GenerationData schema."""
    data = GenerationData(
        captions=[
            CaptionItem(id="caption_1", approach="benefit", content="Bài viết lợi ích..."),
            CaptionItem(id="caption_2", approach="emotional", content="Bài viết cảm xúc..."),
            CaptionItem(id="caption_3", approach="call_to_action", content="Bài viết hành động..."),
        ],
        headlines=[
            HeadlineItem(id="headline_1", content="Tiêu đề 1"),
            HeadlineItem(id="headline_2", content="Tiêu đề 2"),
            HeadlineItem(id="headline_3", content="Tiêu đề 3"),
        ],
        hashtags=["#BinhGiuNhiet", "#VanPhong", "#GenZ", "#TienLoi", "#HotDeal"],
    )
    assert len(data.captions) == 3
    assert len(data.headlines) == 3
    assert len(data.hashtags) == 5


def test_generation_data_wrong_caption_count_rejected():
    """Verify captions count != 3 is rejected."""
    with pytest.raises(ValidationError):
        GenerationData(
            captions=[
                CaptionItem(id="caption_1", approach="benefit", content="Bài viết 1..."),
                CaptionItem(id="caption_2", approach="emotional", content="Bài viết 2..."),
            ],  # Only 2 captions!
            headlines=[
                HeadlineItem(id="headline_1", content="T1"),
                HeadlineItem(id="headline_2", content="T2"),
                HeadlineItem(id="headline_3", content="T3"),
            ],
            hashtags=["#t1", "#t2", "#t3", "#t4", "#t5"],
        )


def test_generation_data_duplicate_hashtags_rejected():
    """Verify duplicate hashtags are rejected."""
    with pytest.raises(ValidationError):
        GenerationData(
            captions=[
                CaptionItem(id="caption_1", approach="benefit", content="Bài viết 1..."),
                CaptionItem(id="caption_2", approach="emotional", content="Bài viết 2..."),
                CaptionItem(id="caption_3", approach="call_to_action", content="Bài viết 3..."),
            ],
            headlines=[
                HeadlineItem(id="headline_1", content="T1"),
                HeadlineItem(id="headline_2", content="T2"),
                HeadlineItem(id="headline_3", content="T3"),
            ],
            hashtags=["#GiuNhiet", "#giunhiet", "#TienLoi", "#VanPhong", "#Deal"],  # Duplicate!
        )


def test_regenerate_request_target_id_requirement():
    """Verify target_id is required when target_type is caption or headline."""
    with pytest.raises(ValidationError):
        RegenerateRequest(
            product_name="Bình giữ nhiệt",
            description="Mô tả hợp lệ cho sản phẩm",
            target_audience="Sinh viên",
            tone="youthful",
            target_type="caption",
            target_id=None,  # Missing!
        )


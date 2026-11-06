"""Unit tests for prompt builder and tone templates."""

import pytest
from app.schemas.generator import GenerationRequest
from app.schemas.regenerate import RegenerateRequest
from app.prompts.prompt_builder import (
    build_generation_prompt,
    build_single_regeneration_prompt,
)
from app.prompts.tone_prompts import TONE_INSTRUCTIONS


def test_build_generation_prompt_all_tones():
    """Verify prompt builder contains product context and tone instructions."""
    for tone in ["funny", "professional", "youthful"]:
        req = GenerationRequest(
            product_name="Bình giữ nhiệt Inox",
            description="Giữ nhiệt nóng lạnh 12h, nắp chống tràn tiện dụng.",
            target_audience="Dân văn phòng",
            tone=tone,
        )
        prompt = build_generation_prompt(req)

        assert "Bình giữ nhiệt Inox" in prompt
        assert "Giữ nhiệt nóng lạnh 12h" in prompt
        assert "Dân văn phòng" in prompt
        assert "CẤU TRÚC 3-3-5" in prompt
        assert "caption_1" in prompt
        assert "caption_2" in prompt
        assert "caption_3" in prompt
        assert "05 HASHTAGS" in prompt


def test_build_single_regeneration_prompt_caption():
    """Verify single caption regeneration prompt builds correctly with approach context."""
    req = RegenerateRequest(
        product_name="Bình giữ nhiệt Inox",
        description="Giữ nhiệt nóng lạnh 12h, nắp chống tràn tiện dụng.",
        target_audience="Dân văn phòng",
        tone="professional",
        target_type="caption",
        target_id="caption_2",
        existing_content="Nội dung caption cũ...",
    )
    prompt = build_single_regeneration_prompt(req)

    assert "caption_2" in prompt
    assert "emotional" in prompt
    assert "Nội dung caption cũ..." in prompt
    assert "HOÀN TOÀN MỚI" in prompt


def test_build_single_regeneration_prompt_headline():
    """Verify single headline regeneration prompt builds correctly."""
    req = RegenerateRequest(
        product_name="Bình giữ nhiệt Inox",
        description="Giữ nhiệt nóng lạnh 12h, nắp chống tràn tiện dụng.",
        target_audience="Dân văn phòng",
        tone="youthful",
        target_type="headline",
        target_id="headline_1",
        existing_content="Tiêu đề cũ...",
    )
    prompt = build_single_regeneration_prompt(req)

    assert "headline_1" in prompt
    assert "Tiêu đề cũ..." in prompt
    assert "HeadlineItem" in prompt


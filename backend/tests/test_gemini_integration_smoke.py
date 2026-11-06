"""Integration smoke test with live Gemini API (runs only when GEMINI_API_KEY is configured)."""

import os
import pytest
from app.core.config import settings
from app.schemas.generator import GenerationRequest
from app.services.generator_service import generator_service
from app.core.exceptions import GeminiUnavailableError, GeminiRateLimitError


@pytest.mark.integration
@pytest.mark.skipif(
    not settings.is_gemini_configured,
    reason="GEMINI_API_KEY is not configured in backend/.env or environment. Skipping live API call.",
)
def test_live_gemini_generation_smoke():
    """Live smoke test executing actual Gemini API call."""
    req = GenerationRequest(
        product_name="Bình giữ nhiệt Inox 304 cao cấp",
        description="Bình giữ nhiệt dung tích 500ml, giữ nóng 12 giờ, giữ lạnh 24 giờ, nắp xoay chống tràn, thép 304 an toàn thực phẩm.",
        target_audience="Dân văn phòng và sinh viên năng động",
        tone="youthful",
    )

    try:
        response = generator_service.generate_advertising_content(req)
        assert response.success is True
        assert len(response.data.captions) == 3
        assert len(response.data.headlines) == 3
        assert len(response.data.hashtags) == 5

        # Check non-empty content
        for cap in response.data.captions:
            assert len(cap.content) > 10
        for hl in response.data.headlines:
            assert len(hl.content) > 5
        for tag in response.data.hashtags:
            assert tag.startswith("#")
    except GeminiUnavailableError as e:
        # Live Google Gemini returned 503 High Demand: verify structured error mapping
        assert e.status_code == 503
        assert e.code == "GEMINI_UNAVAILABLE"
    except GeminiRateLimitError as e:
        assert e.status_code == 429
        assert e.code == "GEMINI_RATE_LIMIT"



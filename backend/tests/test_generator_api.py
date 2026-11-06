"""API endpoint tests for content generation and regeneration with mocked Gemini service."""

import json
import pytest
from unittest.mock import patch
from fastapi.testclient import TestClient
from app.main import app
from app.core.config import settings
from app.core.exceptions import GeminiServiceError, GeminiConfigurationError, GeminiRateLimitError

client = TestClient(app)

MOCK_3_3_5_JSON = json.dumps({
    "captions": [
        {
            "id": "caption_1",
            "approach": "benefit",
            "content": "Bình giữ nhiệt Inox 304 giữ nóng 12h, tiện lợi và an toàn.",
        },
        {
            "id": "caption_2",
            "approach": "emotional",
            "content": "Mỗi sáng thức giấc với một ngụm cà phê ấm nồng khởi đầu ngày mới.",
        },
        {
            "id": "caption_3",
            "approach": "call_to_action",
            "content": "Đặt hàng ngay hôm nay để nhận ưu đãi đặc biệt từ shop!",
        },
    ],
    "headlines": [
        {"id": "headline_1", "content": "Giữ Nhiệt Hoàn Hảo Đến 12 Giờ"},
        {"id": "headline_2", "content": "Thiết Kế Tối Giản Cho Dân Công Sở"},
        {"id": "headline_3", "content": "Nâng Tầm Phong Cách Sống Của Bạn"},
    ],
    "hashtags": [
        "#BinhGiuNhiet",
        "#Inox304",
        "#VanPhongTienLoi",
        "#PhongCachSong",
        "#DealHot",
    ],
})

MOCK_SINGLE_CAPTION_JSON = json.dumps({
    "id": "caption_2",
    "approach": "emotional",
    "content": "Một tách trà ấm giữa những giờ làm việc căng thẳng giúp bạn tìm lại sự cân bằng.",
})

MOCK_SINGLE_HEADLINE_JSON = json.dumps({
    "id": "headline_1",
    "content": "Bền Bỉ Đồng Hành – Đẳng Cấp Inox 304",
})


def test_generate_endpoint_success():
    """Verify POST /api/v1/generate returns 200 and valid 3-3-5 structure."""
    payload = {
        "product_name": "Bình giữ nhiệt Inox 304",
        "description": "Bình giữ nhiệt 500ml, giữ nóng 12h và lạnh 24h, thép 304 không gỉ.",
        "target_audience": "Dân văn phòng, sinh viên",
        "tone": "youthful",
    }

    with patch("app.services.gemini_service.gemini_service.generate_structured") as mock_gemini:
        mock_gemini.return_value = (MOCK_3_3_5_JSON, {"total_token_count": 350})

        response = client.post("/api/v1/generate", json=payload)
        assert response.status_code == 200
        data = response.json()

        assert data["success"] is True
        assert "data" in data
        assert len(data["data"]["captions"]) == 3
        assert len(data["data"]["headlines"]) == 3
        assert len(data["data"]["hashtags"]) == 5
        assert data["data"]["captions"][0]["approach"] == "benefit"
        assert data["data"]["hashtags"][0] == "#BinhGiuNhiet"


def test_generate_endpoint_invalid_input():
    """Verify POST /api/v1/generate rejects invalid inputs with 422."""
    # Empty product_name
    response = client.post("/api/v1/generate", json={
        "product_name": "   ",
        "description": "Mô tả hợp lệ cho sản phẩm",
        "target_audience": "Sinh viên",
        "tone": "youthful",
    })
    assert response.status_code == 422
    assert response.json()["success"] is False

    # Invalid tone
    response = client.post("/api/v1/generate", json={
        "product_name": "Bình giữ nhiệt",
        "description": "Mô tả hợp lệ cho sản phẩm",
        "target_audience": "Sinh viên",
        "tone": "invalid_tone",
    })
    assert response.status_code == 422


def test_generate_endpoint_missing_api_key():
    """Verify 503 error when Gemini API Key is not configured."""
    payload = {
        "product_name": "Bình giữ nhiệt",
        "description": "Mô tả hợp lệ cho sản phẩm bình giữ nhiệt 500ml",
        "target_audience": "Sinh viên",
        "tone": "youthful",
    }

    with patch("app.services.gemini_service.gemini_service.get_client") as mock_get_client:
        mock_get_client.side_effect = GeminiConfigurationError(
            "Gemini API Key chưa được cấu hình. Vui lòng thiết lập biến môi trường GEMINI_API_KEY trong file .env."
        )

        response = client.post("/api/v1/generate", json=payload)
        assert response.status_code == 503
        data = response.json()
        assert data["success"] is False
        assert data["error"]["code"] == "GEMINI_NOT_CONFIGURED"


def test_generate_endpoint_gemini_quota_error():
    """Verify 429 response when Gemini throws quota exceeded."""
    payload = {
        "product_name": "Bình giữ nhiệt",
        "description": "Mô tả hợp lệ cho sản phẩm bình giữ nhiệt 500ml",
        "target_audience": "Sinh viên",
        "tone": "youthful",
    }

    with patch("app.services.gemini_service.gemini_service.generate_structured") as mock_gemini:
        mock_gemini.side_effect = GeminiRateLimitError(
            message="Đã vượt quá hạn ngạch (quota) của Gemini API.",
            code="GEMINI_RATE_LIMIT",
        )

        response = client.post("/api/v1/generate", json=payload)
        assert response.status_code == 429
        data = response.json()
        assert data["success"] is False
        assert data["error"]["code"] == "GEMINI_RATE_LIMIT"


def test_regenerate_endpoint_single_caption():
    """Verify POST /api/v1/regenerate for single caption."""
    payload = {
        "product_name": "Bình giữ nhiệt Inox 304",
        "description": "Mô tả hợp lệ cho sản phẩm bình giữ nhiệt",
        "target_audience": "Dân văn phòng",
        "tone": "youthful",
        "target_type": "caption",
        "target_id": "caption_2",
        "existing_content": "Nội dung caption cũ",
    }

    with patch("app.services.gemini_service.gemini_service.generate_structured") as mock_gemini:
        mock_gemini.return_value = (MOCK_SINGLE_CAPTION_JSON, None)

        response = client.post("/api/v1/regenerate", json=payload)
        assert response.status_code == 200
        data = response.json()

        assert data["success"] is True
        assert data["target_type"] == "caption"
        assert data["target_id"] == "caption_2"
        assert data["item"]["id"] == "caption_2"
        assert data["item"]["approach"] == "emotional"


def test_regenerate_endpoint_single_headline():
    """Verify POST /api/v1/regenerate for single headline."""
    payload = {
        "product_name": "Bình giữ nhiệt Inox 304",
        "description": "Mô tả hợp lệ cho sản phẩm bình giữ nhiệt",
        "target_audience": "Dân văn phòng",
        "tone": "youthful",
        "target_type": "headline",
        "target_id": "headline_1",
        "existing_content": "Tiêu đề cũ",
    }

    with patch("app.services.gemini_service.gemini_service.generate_structured") as mock_gemini:
        mock_gemini.return_value = (MOCK_SINGLE_HEADLINE_JSON, None)

        response = client.post("/api/v1/regenerate", json=payload)
        assert response.status_code == 200
        data = response.json()

        assert data["success"] is True
        assert data["target_type"] == "headline"
        assert data["target_id"] == "headline_1"
        assert data["item"]["id"] == "headline_1"

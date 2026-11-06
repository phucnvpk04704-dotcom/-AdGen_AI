"""Unit test suite verifying Gemini retry, error mapping, timeout, and fallback resilience.

All tests in this file use mock providers and do not consume Gemini quota.
"""

import json
from unittest.mock import MagicMock, patch
import pytest
from google.genai import errors
from fastapi.testclient import TestClient

from app.main import app
from app.services.gemini_service import GeminiService
from app.schemas.generator import GenerationData, GenerationRequest
from app.services.generator_service import generator_service
from app.core.exceptions import (
    GeminiUnavailableError,
    GeminiRateLimitError,
    GeminiAuthError,
    GeminiTimeoutError,
)

client = TestClient(app)

MOCK_RAW_JSON = json.dumps({
    "captions": [
        {"id": "caption_1", "approach": "benefit", "content": "Bình giữ nhiệt 500ml giữ nóng 12 giờ an toàn và bền bỉ."},
        {"id": "caption_2", "approach": "emotional", "content": "Khởi đầu ngày mới tỉnh táo với tách cà phê nóng thơm lừng."},
        {"id": "caption_3", "approach": "call_to_action", "content": "Đặt mua ngay hôm nay để nhận ưu đãi giảm 20% cho 50 khách đầu tiên."},
    ],
    "headlines": [
        {"id": "headline_1", "content": "Giữ Nhiệt Suốt Cả Ngày Dài"},
        {"id": "headline_2", "content": "Đẳng Cấp Thép Không Gỉ 304"},
        {"id": "headline_3", "content": "Người Bạn Đồng Hành Công Sở"},
    ],
    "hashtags": [
        "#BinhGiuNhiet",
        "#Inox304",
        "#VanPhong",
        "#GiuNhiet12h",
        "#TienLoi",
    ],
})


def _create_mock_response(text: str):
    mock_resp = MagicMock()
    mock_resp.text = text
    mock_resp.usage_metadata = MagicMock(prompt_token_count=120, candidates_token_count=350, total_token_count=470)
    return mock_resp


def _create_mock_server_error(code: int, message: str):
    status_str = "DEADLINE_EXCEEDED" if code == 504 else "UNAVAILABLE"
    return errors.ServerError(code, {"error": {"code": code, "message": message, "status": status_str}}, None)


def _create_mock_client_error(code: int, message: str):
    return errors.ClientError(code, {"error": {"code": code, "message": message, "status": "CLIENT_ERROR"}}, None)


# 1. Gemini returns success
def test_scenario_1_gemini_success():
    """1. Gemini returns success: verify data parsing, usage metadata, and HTTP 200."""
    service = GeminiService()
    mock_client = MagicMock()
    mock_client.models.generate_content.return_value = _create_mock_response(MOCK_RAW_JSON)

    with patch.object(service, "get_client", return_value=mock_client):
        raw_text, usage = service.generate_structured("test prompt", GenerationData)
        assert raw_text == MOCK_RAW_JSON
        assert usage["total_token_count"] == 470

    # API Endpoint check
    payload = {
        "product_name": "Bình giữ nhiệt Inox 304",
        "description": "Bình giữ nhiệt 500ml giữ nhiệt tốt suốt 12 giờ",
        "target_audience": "Dân công sở",
        "tone": "youthful",
    }
    with patch("app.services.gemini_service.gemini_service.generate_structured", return_value=(MOCK_RAW_JSON, usage)):
        resp = client.post("/api/v1/generate", json=payload)
        assert resp.status_code == 200
        data = resp.json()
        assert data["success"] is True
        assert len(data["data"]["captions"]) == 3
        assert len(data["data"]["headlines"]) == 3
        assert len(data["data"]["hashtags"]) == 5


# 2. Gemini returns 503 on 1st attempt, succeeds on retry
def test_scenario_2_gemini_503_retry_success():
    """2. Gemini returns 503 at 1st attempt, retry succeeds: verify tenacity retry executes."""
    service = GeminiService()
    mock_client = MagicMock()
    err_503 = _create_mock_server_error(503, "This model is currently experiencing high demand.")
    mock_resp = _create_mock_response(MOCK_RAW_JSON)

    # First call raises 503, second call succeeds
    mock_client.models.generate_content.side_effect = [err_503, mock_resp]

    with patch.object(service, "get_client", return_value=mock_client):
        raw_text, _ = service.generate_structured("test prompt", GenerationData)
        assert raw_text == MOCK_RAW_JSON
        assert mock_client.models.generate_content.call_count == 2


# 3. Gemini returns 503 continuously -> raises HTTP 503 GEMINI_UNAVAILABLE
def test_scenario_3_gemini_503_continuous_failure():
    """3. Gemini returns 503 repeatedly: verify HTTP 503, not 502, no crash, stops at max retries."""
    service = GeminiService()
    mock_client = MagicMock()
    err_503 = _create_mock_server_error(503, "This model is currently experiencing high demand.")
    mock_client.models.generate_content.side_effect = err_503

    with patch.object(service, "get_client", return_value=mock_client):
        with patch("app.core.config.settings.GEMINI_FALLBACK_MODEL", None):
            with pytest.raises(GeminiUnavailableError) as exc_info:
                service.generate_structured("test prompt", GenerationData)
            assert exc_info.value.status_code == 503
            assert exc_info.value.code == "GEMINI_UNAVAILABLE"
            assert mock_client.models.generate_content.call_count <= 3

    # Verify FastAPI exception handler translates to clean HTTP 503 JSON (not 502)
    payload = {
        "product_name": "Bình giữ nhiệt Inox 304",
        "description": "Bình giữ nhiệt 500ml giữ nhiệt tốt suốt 12 giờ",
        "target_audience": "Dân công sở",
        "tone": "youthful",
    }
    with patch("app.services.gemini_service.gemini_service.generate_structured", side_effect=GeminiUnavailableError("High demand")):
        resp = client.post("/api/v1/generate", json=payload)
        assert resp.status_code == 503
        data = resp.json()
        assert data["success"] is False
        assert data["error"]["code"] == "GEMINI_UNAVAILABLE"


# 4. Gemini returns 429 Rate Limit
def test_scenario_4_gemini_429_rate_limit():
    """4. Gemini returns 429: verify HTTP 429 GEMINI_RATE_LIMIT, does not retry indefinitely."""
    service = GeminiService()
    mock_client = MagicMock()
    err_429 = _create_mock_client_error(429, "Resource has been exhausted (quota limit reached).")
    mock_client.models.generate_content.side_effect = err_429

    with patch.object(service, "get_client", return_value=mock_client):
        with patch("app.core.config.settings.GEMINI_FALLBACK_MODEL", None):
            with pytest.raises(GeminiRateLimitError) as exc_info:
                service.generate_structured("test prompt", GenerationData)
            assert exc_info.value.status_code == 429
            assert exc_info.value.code == "GEMINI_RATE_LIMIT"
            # Should not retry excessively
            assert mock_client.models.generate_content.call_count <= 3

    payload = {
        "product_name": "Bình giữ nhiệt",
        "description": "Mô tả sản phẩm bình giữ nhiệt văn phòng",
        "target_audience": "Sinh viên",
        "tone": "youthful",
    }
    with patch("app.services.gemini_service.gemini_service.generate_structured", side_effect=GeminiRateLimitError("Quota exceeded")):
        resp = client.post("/api/v1/generate", json=payload)
        assert resp.status_code == 429
        data = resp.json()
        assert data["success"] is False
        assert data["error"]["code"] == "GEMINI_RATE_LIMIT"


# 5. Invalid API Key (401 / 403)
def test_scenario_5_gemini_invalid_api_key():
    """5. Invalid API key: verify 401/403 GEMINI_AUTH_ERROR, NO retry attempted."""
    service = GeminiService()
    mock_client = MagicMock()
    err_401 = _create_mock_client_error(401, "API_KEY_INVALID: API key not valid.")
    mock_client.models.generate_content.side_effect = err_401

    with patch.object(service, "get_client", return_value=mock_client):
        with pytest.raises(GeminiAuthError) as exc_info:
            service.generate_structured("test prompt", GenerationData)
        assert exc_info.value.status_code == 401
        assert exc_info.value.code == "GEMINI_AUTH_ERROR"
        # Must fail immediately without any retry
        assert mock_client.models.generate_content.call_count == 1

    payload = {
        "product_name": "Bình giữ nhiệt",
        "description": "Mô tả sản phẩm bình giữ nhiệt văn phòng",
        "target_audience": "Sinh viên",
        "tone": "youthful",
    }
    with patch("app.services.gemini_service.gemini_service.generate_structured", side_effect=GeminiAuthError("Invalid key")):
        resp = client.post("/api/v1/generate", json=payload)
        assert resp.status_code == 401
        data = resp.json()
        assert data["success"] is False
        assert data["error"]["code"] == "GEMINI_AUTH_ERROR"


# 6. Gemini Timeout (504 DEADLINE_EXCEEDED)
def test_scenario_6_gemini_timeout():
    """6. Gemini timeout: verify HTTP 504 GEMINI_TIMEOUT, request does not hang."""
    service = GeminiService()
    mock_client = MagicMock()
    err_504 = _create_mock_server_error(504, "Deadline expired before operation could complete.")
    mock_client.models.generate_content.side_effect = err_504

    with patch.object(service, "get_client", return_value=mock_client):
        with patch("app.core.config.settings.GEMINI_FALLBACK_MODEL", None):
            with pytest.raises(GeminiTimeoutError) as exc_info:
                service.generate_structured("test prompt", GenerationData)
            assert exc_info.value.status_code == 504
            assert exc_info.value.code == "GEMINI_TIMEOUT"

    payload = {
        "product_name": "Bình giữ nhiệt",
        "description": "Mô tả sản phẩm bình giữ nhiệt văn phòng",
        "target_audience": "Sinh viên",
        "tone": "youthful",
    }
    with patch("app.services.gemini_service.gemini_service.generate_structured", side_effect=GeminiTimeoutError("Deadline exceeded")):
        resp = client.post("/api/v1/generate", json=payload)
        assert resp.status_code == 504
        data = resp.json()
        assert data["success"] is False
        assert data["error"]["code"] == "GEMINI_TIMEOUT"


# 7. Fallback Model Activation
def test_scenario_7_fallback_model_activation():
    """7. Fallback model: verify fallback model is called when primary model fails with transient error."""
    service = GeminiService()
    mock_client = MagicMock()

    primary_error = _create_mock_server_error(503, "High demand on gemini-3.8-flash")
    fallback_response = _create_mock_response(MOCK_RAW_JSON)

    called_models = []

    def mock_generate_content(model, contents, config):
        called_models.append(model)
        if model == "gemini-3.8-flash":
            raise primary_error
        elif model == "gemini-3.5-flash":
            return fallback_response
        raise ValueError(f"Unexpected model: {model}")

    mock_client.models.generate_content.side_effect = mock_generate_content

    with patch.object(service, "get_client", return_value=mock_client):
        with patch("app.core.config.settings.GEMINI_MODEL", "gemini-3.8-flash"):
            with patch("app.core.config.settings.GEMINI_FALLBACK_MODEL", "gemini-3.5-flash"):
                raw_text, usage = service.generate_structured("test prompt", GenerationData)
                assert raw_text == MOCK_RAW_JSON
                # Verify primary model was tried first, then fallback was called
                assert "gemini-3.8-flash" in called_models
                assert "gemini-3.5-flash" in called_models
                assert called_models[-1] == "gemini-3.5-flash"

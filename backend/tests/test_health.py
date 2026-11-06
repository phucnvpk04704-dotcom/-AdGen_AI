"""Tests for Health Check API and CORS configuration."""

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health_check_endpoint():
    """Verify GET /api/v1/health returns 200 and expected schema."""
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["message"] == "AdGen AI Backend is running"
    assert data["status"] == "healthy"


def test_cors_preflight_headers():
    """Verify CORS middleware responds with correct headers for allowed origins."""
    headers = {
        "Origin": "http://localhost:5173",
        "Access-Control-Request-Method": "GET",
    }
    response = client.options("/api/v1/health", headers=headers)
    assert response.status_code == 200
    assert response.headers.get("access-control-allow-origin") == "http://localhost:5173"


def test_root_endpoint():
    """Verify root GET / returns metadata and HTTP 200."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "service" in data
    assert data["docs_url"] == "/docs"


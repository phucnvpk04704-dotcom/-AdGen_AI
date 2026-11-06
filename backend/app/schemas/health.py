"""Health check schema definition."""

from typing import Optional
from pydantic import BaseModel, Field


class GeminiHealthInfo(BaseModel):
    """Gemini AI connectivity details."""

    configured: bool = Field(..., description="Whether Gemini API key is configured")
    status: str = Field(
        ...,
        description="Gemini status: 'available', 'temporarily_unavailable', 'auth_error', 'not_configured', 'unverified'",
    )
    model: str = Field(..., description="Primary Gemini model")
    fallback_model: Optional[str] = Field(default=None, description="Fallback Gemini model if configured")
    message: str = Field(..., description="Human-readable Gemini status message")


class HealthResponse(BaseModel):
    """Health check response model conforming to specification."""

    success: bool = Field(default=True, description="Whether the request succeeded")
    message: str = Field(default="AdGen AI Backend is running", description="Response message")
    status: str = Field(default="healthy", description="Application status flag")
    gemini: Optional[GeminiHealthInfo] = Field(default=None, description="Gemini AI connectivity status")

    model_config = {
        "json_schema_extra": {
            "example": {
                "success": True,
                "message": "AdGen AI Backend is running",
                "status": "healthy",
                "gemini": {
                    "configured": True,
                    "status": "available",
                    "model": "gemini-3.8-flash",
                    "fallback_model": None,
                    "message": "Mô hình gemini-3.8-flash sẵn sàng hoạt động",
                },
            }
        }
    }



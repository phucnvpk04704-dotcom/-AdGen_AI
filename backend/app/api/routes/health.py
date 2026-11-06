"""Health check route."""

from fastapi import APIRouter, status
from app.schemas.health import HealthResponse, GeminiHealthInfo
from app.services.gemini_service import gemini_service

router = APIRouter()


@router.get(
    "/health",
    response_model=HealthResponse,
    status_code=status.HTTP_200_OK,
    summary="Health Check",
    description="Check the operational status of the AdGen AI backend service and Gemini AI connectivity.",
)
async def check_health() -> HealthResponse:
    """Return application health check response including Gemini AI readiness."""
    gemini_info = gemini_service.verify_gemini_connection()
    return HealthResponse(
        success=True,
        message="AdGen AI Backend is running",
        status="healthy",
        gemini=GeminiHealthInfo(**gemini_info),
    )



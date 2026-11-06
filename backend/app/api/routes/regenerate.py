"""Route for regenerating advertising content."""

from fastapi import APIRouter, status
from app.schemas.regenerate import RegenerateRequest, RegenerateResponse
from app.services.generator_service import generator_service

router = APIRouter()


@router.post(
    "/regenerate",
    response_model=RegenerateResponse,
    status_code=status.HTTP_200_OK,
    summary="Regenerate Content",
    description="Regenerate all content or a specific caption/headline item while preserving context.",
)
async def regenerate_content(request: RegenerateRequest) -> RegenerateResponse:
    """Regenerate advertising content (all or specific target)."""
    return generator_service.regenerate_advertising_content(request)


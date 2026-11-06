"""Route for generating advertising content."""

from fastapi import APIRouter, status
from app.schemas.generator import GenerationRequest, GenerationResponse
from app.services.generator_service import generator_service

router = APIRouter()


@router.post(
    "/generate",
    response_model=GenerationResponse,
    status_code=status.HTTP_200_OK,
    summary="Generate Advertising Content",
    description="Analyze product features, target audience and tone of voice using Gemini AI to generate 3 captions, 3 headlines and 5 hashtags.",
)
async def generate_content(request: GenerationRequest) -> GenerationResponse:
    """Generate 3-3-5 advertising content using Gemini AI."""
    return generator_service.generate_advertising_content(request)


"""API routes router registration."""

from fastapi import APIRouter
from app.api.routes import health, generate, regenerate

api_router = APIRouter()
api_router.include_router(health.router, tags=["Health"])
api_router.include_router(generate.router, tags=["Generator"])
api_router.include_router(regenerate.router, tags=["Regenerator"])

__all__ = ["api_router"]

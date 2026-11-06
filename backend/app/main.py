"""AdGen AI - FastAPI Main Application Entrypoint."""

import logging
from fastapi import FastAPI, HTTPException, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.routes import api_router
from app.core.config import settings
from app.core.exceptions import AdGenAIException

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger("adgen_ai")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.PROJECT_VERSION,
    description="Backend API for AdGen AI – AI Advertising Content Generator powered by Google Gemini",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url=f"{settings.API_V1_PREFIX}/openapi.json",
)

# Configure Cross-Origin Resource Sharing (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Exception Handlers
@app.exception_handler(AdGenAIException)
async def adgen_ai_exception_handler(request: Request, exc: AdGenAIException):
    """Handle custom application exceptions without exposing internals."""
    logger.warning("AdGenAIException [%s]: %s", exc.code, exc.message)
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "message": exc.message,
            "error": {
                "code": exc.code,
                "message": exc.message,
            },
        },
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Handle request payload validation errors cleanly."""
    error_details = []
    for err in exc.errors():
        field = " -> ".join(str(loc) for loc in err.get("loc", []))
        error_details.append(f"{field}: {err.get('msg')}")

    user_message = "Dữ liệu đầu vào không hợp lệ: " + "; ".join(error_details)
    return JSONResponse(
        status_code=422,
        content={
            "success": False,
            "message": user_message,
            "error": {
                "code": "VALIDATION_ERROR",
                "message": user_message,
                "details": error_details,
            },
        },
    )


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    """Handle standard HTTP exceptions with consistent response format."""
    message = exc.detail if isinstance(exc.detail, str) else "HTTP Exception"
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "message": message,
            "error": {
                "code": f"HTTP_{exc.status_code}",
                "message": message,
            },
        },
    )


@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    """Handle uncaught internal exceptions securely."""
    logger.exception("Unhandled server exception: %s", str(exc))
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "message": "Đã xảy ra lỗi nội bộ trên máy chủ. Vui lòng thử lại sau.",
            "error": {
                "code": "INTERNAL_SERVER_ERROR",
                "message": "Đã xảy ra lỗi nội bộ trên máy chủ. Vui lòng thử lại sau.",
            },
        },
    )


# Root route
@app.get("/", tags=["Root"])
async def root():
    """Service root endpoint returning basic metadata."""
    return {
        "service": settings.PROJECT_NAME,
        "version": settings.PROJECT_VERSION,
        "environment": settings.APP_ENV,
        "docs_url": "/docs",
        "api_v1_prefix": settings.API_V1_PREFIX,
        "gemini_configured": settings.is_gemini_configured,
        "gemini_model": settings.GEMINI_MODEL,
        "gemini_fallback_model": settings.GEMINI_FALLBACK_MODEL,
    }


# Include versioned API router
app.include_router(api_router, prefix=settings.API_V1_PREFIX)

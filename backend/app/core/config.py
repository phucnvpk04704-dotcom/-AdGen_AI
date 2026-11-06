"""Application configuration settings using Pydantic Settings."""

from typing import List, Optional
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings class."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    PROJECT_NAME: str = "AdGen AI API"
    PROJECT_VERSION: str = "1.0.0"
    API_V1_PREFIX: str = "/api/v1"
    APP_ENV: str = Field(
        default="development",
        description="Environment: development, production, test",
    )
    FRONTEND_ORIGIN: str = Field(
        default="http://localhost:5173",
        description="Allowed frontend origin for CORS",
    )

    # Gemini Configuration
    GEMINI_API_KEY: str = Field(
        default="",
        description="Google Gemini API Key (Secret: never expose to frontend)",
    )
    GEMINI_MODEL: str = Field(
        default="gemini-3.8-flash",
        description="Primary Gemini model identifier",
    )
    GEMINI_FALLBACK_MODEL: Optional[str] = Field(
        default="gemini-3.5-flash",
        description="Fallback Gemini model identifier if primary is unavailable",
    )
    GEMINI_TIMEOUT: int = Field(
        default=25,
        description="Timeout for each Gemini API request attempt in seconds",
    )
    GEMINI_MAX_RETRIES: int = Field(
        default=2,
        description="Maximum retry attempts for transient Gemini errors (default 2)",
    )

    @property
    def is_gemini_configured(self) -> bool:
        """Check if Gemini API Key is configured without exposing it."""
        return bool(self.GEMINI_API_KEY and self.GEMINI_API_KEY.strip())

    @property
    def cors_origins(self) -> List[str]:
        """Return list of allowed CORS origins."""
        origins = {self.FRONTEND_ORIGIN.strip()}
        origins.add("http://localhost:5173")
        origins.add("http://127.0.0.1:5173")
        origins.add("http://localhost:3000")
        return [origin for origin in origins if origin]


settings = Settings()

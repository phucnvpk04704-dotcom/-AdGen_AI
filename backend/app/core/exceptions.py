"""Custom application exceptions for AdGen AI with distinct HTTP status codes."""

from typing import Any, Optional


class AdGenAIException(Exception):
    """Base exception for AdGen AI application."""

    def __init__(self, message: str, code: str = "INTERNAL_ERROR", status_code: int = 500, details: Optional[Any] = None):
        super().__init__(message)
        self.message = message
        self.code = code
        self.status_code = status_code
        self.details = details


class GeminiConfigurationError(AdGenAIException):
    """Raised when Gemini API key or model configuration is missing."""

    def __init__(
        self,
        message: str = "Gemini API Key chưa được cấu hình trên máy chủ Backend.",
        code: str = "GEMINI_NOT_CONFIGURED",
    ):
        super().__init__(message=message, code=code, status_code=503)


class GeminiAuthError(AdGenAIException):
    """Raised when Gemini API Key is invalid or permission is denied (401 / 403)."""

    def __init__(
        self,
        message: str = "Khóa Gemini API Key không hợp lệ hoặc không có quyền truy cập.",
        code: str = "GEMINI_AUTH_ERROR",
        status_code: int = 401,
    ):
        super().__init__(message=message, code=code, status_code=status_code)


class GeminiRateLimitError(AdGenAIException):
    """Raised when Gemini quota or rate limit is exceeded (429)."""

    def __init__(
        self,
        message: str = "Đã vượt quá hạn mức sử dụng (Quota / Rate Limit) của Gemini API. Vui lòng thử lại sau.",
        code: str = "GEMINI_RATE_LIMIT",
    ):
        super().__init__(message=message, code=code, status_code=429)


class GeminiUnavailableError(AdGenAIException):
    """Raised when Gemini is temporarily unavailable or overloaded / high demand (503)."""

    def __init__(
        self,
        message: str = "Mô hình AI hiện đang quá tải (High Demand). Vui lòng thử lại sau giây lát.",
        code: str = "GEMINI_UNAVAILABLE",
    ):
        super().__init__(message=message, code=code, status_code=503)


class GeminiTimeoutError(AdGenAIException):
    """Raised when request to Gemini API exceeds timeout threshold (504)."""

    def __init__(
        self,
        message: str = "Quá thời gian phản hồi từ máy chủ Gemini AI (Timeout). Vui lòng thử lại.",
        code: str = "GEMINI_TIMEOUT",
    ):
        super().__init__(message=message, code=code, status_code=504)


class GeminiBadGatewayError(AdGenAIException):
    """Raised when intermediate communication with Gemini fails unexpectedly (502)."""

    def __init__(
        self,
        message: str = "Lỗi kết nối trung gian đến dịch vụ Gemini AI. Vui lòng thử lại sau.",
        code: str = "GEMINI_BAD_GATEWAY",
        status_code: int = 502,
    ):
        super().__init__(message=message, code=code, status_code=status_code)


# Backwards compatibility alias
GeminiServiceError = GeminiBadGatewayError


class OutputValidationError(AdGenAIException):
    """Raised when AI response fails business validation (wrong count, invalid hashtags)."""

    def __init__(
        self,
        message: str = "Nội dung do AI tạo ra không đáp ứng đúng cấu trúc chuẩn 3-3-5.",
        code: str = "OUTPUT_VALIDATION_ERROR",
        details: Optional[Any] = None,
    ):
        super().__init__(message=message, code=code, status_code=422, details=details)

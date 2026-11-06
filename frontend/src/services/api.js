/**
 * Centralized Axios API client configuration.
 */

import axios from 'axios';

// Read API Base URL from environment variables, fallback to local backend default
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60s request timeout synchronized with Backend/Gemini retry cycle
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Ready for future token or request tracing headers
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Standardize error formats
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    let normalizedError = {
      success: false,
      message: 'Không thể kết nối đến máy chủ Backend',
      code: 'NETWORK_ERROR',
      status: error.response?.status || 0,
      details: null,
    };

    if (error.response) {
      // Server responded with non-2xx status code
      const responseData = error.response.data;
      const statusCode = error.response.status;
      const serverMessage = responseData?.error?.message || responseData?.message;
      const serverCode = responseData?.error?.code;

      normalizedError.status = statusCode;
      normalizedError.code = serverCode || `HTTP_${statusCode}`;
      normalizedError.details = responseData;

      if (serverMessage) {
        normalizedError.message = serverMessage;
      } else if (statusCode === 503) {
        normalizedError.message =
          'Dịch vụ Gemini AI hiện đang quá tải (503 Service Unavailable / High Demand). Hệ thống đã tự động thử lại nhưng máy chủ Google vẫn chưa thể xử lý. Vui lòng thử lại sau giây lát.';
      } else if (statusCode === 429) {
        normalizedError.message =
          'Đã vượt quá hạn mức sử dụng (429 Rate Limit / Quota Exceeded). Vui lòng đợi một lát rồi thử lại.';
      } else if (statusCode === 504) {
        normalizedError.message =
          'Quá thời gian phản hồi từ máy chủ Gemini AI (504 Gateway Timeout). Vui lòng thử lại.';
      } else if (statusCode === 502) {
        normalizedError.message =
          'Lỗi kết nối trung gian đến máy chủ AI (502 Bad Gateway). Vui lòng thử lại sau.';
      } else if (statusCode === 401 || statusCode === 403) {
        normalizedError.message =
          'Khóa xác thực Gemini API không hợp lệ hoặc thiếu quyền truy cập.';
      } else {
        normalizedError.message = `Lỗi từ máy chủ (HTTP ${statusCode})`;
      }
    } else if (error.code === 'ECONNABORTED') {
      normalizedError.code = 'TIMEOUT';
      normalizedError.status = 504;
      normalizedError.message =
        'Yêu cầu kết nối máy chủ quá thời gian chờ (Timeout 60s). Máy chủ AI hoặc đường truyền đang bị nghẽn, vui lòng thử lại.';
    } else if (error.request) {
      // Request made but no response received (Backend down or CORS block)
      normalizedError.code = 'BACKEND_OFFLINE';
      normalizedError.message =
        'Không nhận được phản hồi từ Backend (Backend offline hoặc lỗi mạng).';
    } else {
      normalizedError.message = error.message;
    }

    return Promise.reject(normalizedError);
  }
);

export default apiClient;


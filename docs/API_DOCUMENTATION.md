# AdGen AI - API Documentation

Phiên bản: 1.0 (Phase 3 - Gemini AI Integration)  
Giao thức: HTTP/REST  
Định dạng: JSON  
Prefix: `/api/v1`

---

## 1. Health Check Endpoint

Kiểm tra trạng thái hoạt động của Backend server.

- **URL:** `/api/v1/health`
- **Method:** `GET`
- **Auth:** Không yêu cầu
- **Response Codes:**
  - `200 OK`: Server hoạt động bình thường.

### Response mẫu (200 OK):
```json
{
  "success": true,
  "message": "AdGen AI Backend is running",
  "status": "healthy"
}
```

---

## 2. Content Generation Endpoint

Phân tích thông tin sản phẩm và sử dụng mô hình Google Gemini AI để tạo bộ nội dung hoàn chỉnh gồm chính xác 03 Caption (với 3 góc tiếp cận: Lợi ích, Cảm xúc, Kêu gọi hành động), 03 Headline và 05 Hashtag.

- **URL:** `/api/v1/generate`
- **Method:** `POST`
- **Content-Type:** `application/json`
- **Auth:** Đọc `GEMINI_API_KEY` từ cấu hình Backend (.env)

### Request Body:
```json
{
  "product_name": "Bình giữ nhiệt Inox 304",
  "description": "Giữ nhiệt 24h, thiết kế nhỏ gọn thời trang, nắp chống tràn an toàn",
  "target_audience": "Dân văn phòng, học sinh sinh viên",
  "tone": "youthful"
}
```

### Response mẫu (200 OK):
```json
{
  "success": true,
  "message": "Tạo nội dung quảng cáo bằng AI thành công",
  "data": {
    "captions": [
      {
        "id": "caption_1",
        "approach": "benefit",
        "content": "Bình giữ nhiệt Inox 304 giữ nóng 12h, lạnh 24h tiện lợi cho ngày dài..."
      },
      {
        "id": "caption_2",
        "approach": "emotional",
        "content": "Một ngụm nước mát lành giữa những giờ làm việc căng thẳng tiếp thêm năng lượng..."
      },
      {
        "id": "caption_3",
        "approach": "call_to_action",
        "content": "Đừng bỏ lỡ ưu đãi! Đặt ngay hôm nay để nhận quà tặng độc quyền từ shop!"
      }
    ],
    "headlines": [
      {
        "id": "headline_1",
        "content": "Giữ Trọn Nhiệt Độ Hoàn Hảo Cả Ngày Dài"
      },
      {
        "id": "headline_2",
        "content": "Phụ Kiện Tiện Ích Đồng Hành Cùng Dân Công Sở"
      },
      {
        "id": "headline_3",
        "content": "Nâng Tầm Phong Cách Sống Năng Động"
      }
    ],
    "hashtags": [
      "#BinhGiuNhiet",
      "#Inox304",
      "#VanPhongTienLoi",
      "#GenZStyle",
      "#SongNangDong"
    ]
  },
  "usage": {
    "prompt_token_count": 280,
    "candidates_token_count": 350,
    "total_token_count": 630
  }
}
```

---

## 3. Regenerate Endpoint

Tạo lại toàn bộ bộ nội dung hoặc làm mới riêng một caption hoặc một headline thông qua Gemini AI mà không ảnh hưởng tới các phần tử khác.

- **URL:** `/api/v1/regenerate`
- **Method:** `POST`
- **Content-Type:** `application/json`

### A. Làm mới riêng 1 Caption:
```json
{
  "product_name": "Bình giữ nhiệt Inox 304",
  "description": "Giữ nhiệt 24h, thiết kế nhỏ gọn thời trang",
  "target_audience": "Dân văn phòng",
  "tone": "youthful",
  "target_type": "caption",
  "target_id": "caption_2",
  "existing_content": "Nội dung caption cũ cần làm mới..."
}
```

Response mẫu:
```json
{
  "success": true,
  "message": "Làm mới caption_2 thành công",
  "target_type": "caption",
  "target_id": "caption_2",
  "item": {
    "id": "caption_2",
    "approach": "emotional",
    "content": "Nội dung caption mới được sinh bởi AI..."
  }
}
```

### B. Làm mới riêng 1 Headline:
```json
{
  "product_name": "Bình giữ nhiệt Inox 304",
  "description": "Giữ nhiệt 24h, thiết kế nhỏ gọn thời trang",
  "target_audience": "Dân văn phòng",
  "tone": "youthful",
  "target_type": "headline",
  "target_id": "headline_1",
  "existing_content": "Tiêu đề cũ..."
}
```

### C. Làm mới toàn bộ (All):
```json
{
  "product_name": "Bình giữ nhiệt Inox 304",
  "description": "Giữ nhiệt 24h, thiết kế nhỏ gọn",
  "target_audience": "Dân văn phòng",
  "tone": "youthful",
  "target_type": "all"
}
```

---

## 4. Chuẩn hóa lỗi hệ thống (Standard Error Response)

Mọi phản hồi lỗi từ Backend đều tuân theo định dạng chuẩn:

```json
{
  "success": false,
  "message": "Mô tả chi tiết lỗi",
  "error": {
    "code": "GEMINI_NOT_CONFIGURED",
    "message": "Gemini API Key chưa được cấu hình. Vui lòng thiết lập biến môi trường GEMINI_API_KEY trong file .env."
  }
}
```

### Bảng mã lỗi chuẩn:
| HTTP Status | Mã lỗi (`code`) | Ý nghĩa |
| :--- | :--- | :--- |
| `422` | `VALIDATION_ERROR` | Dữ liệu đầu vào không hợp lệ (trống, sai độ dài, sai tone) |
| `422` | `OUTPUT_VALIDATION_ERROR` | Dữ liệu AI trả về không đạt chuẩn 3-3-5 hoặc sai quy tắc nghiệp vụ |
| `429` | `GEMINI_QUOTA_EXCEEDED` | Hạn ngạch (Quota/Rate limit) của Gemini API bị vượt |
| `502` | `GEMINI_SERVICE_UNAVAILABLE` | Lỗi kết nối hoặc sự cố mạng tới máy chủ Gemini AI |
| `503` | `GEMINI_NOT_CONFIGURED` | Backend chưa được cấu hình biến môi trường `GEMINI_API_KEY` |
| `500` | `INTERNAL_SERVER_ERROR` | Lỗi máy chủ nội bộ chưa xác định |

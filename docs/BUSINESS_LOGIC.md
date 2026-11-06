# AdGen AI - Business Logic Specification

Tài liệu đặc tả các quy tắc và logic nghiệp vụ cốt lõi của hệ thống **AdGen AI (AI Advertising Content Generator)**.

---

## 1. Mục tiêu nghiệp vụ
Hỗ trợ chủ shop, marketer và nhân viên kinh doanh tạo nhanh bộ nội dung quảng cáo hoàn chỉnh từ thông tin đầu vào sản phẩm, sử dụng mô hình Gemini AI.

---

## 2. Quy tắc dữ liệu đầu vào (Input Rules)

| Trường thông tin | Kiểu | Bắt buộc | Ràng buộc nghiệp vụ |
| :--- | :--- | :--- | :--- |
| `product_name` | String | Có | Không rỗng, không chỉ chứa khoảng trắng, độ dài từ 2 đến 150 ký tự |
| `description` | String | Có | Mô tả đặc tính/lợi ích sản phẩm, độ dài từ 10 đến 1000 ký tự |
| `target_audience`| String | Có | Đối tượng mục tiêu cụ thể, độ dài từ 5 đến 250 ký tự |
| `tone` | Enum | Có | Chỉ chấp nhận 1 trong 3 giá trị: `funny`, `professional`, `youthful` |

### Định hướng tông giọng (Tone of Voice):
- **funny (Hài hước):** Giọng văn dí dỏm, tạo tiếng cười tự nhiên, không lố lăng hay phản cảm.
- **professional (Trang trọng):** Ngắn gọn, chuyên nghiệp, đáng tin cậy, nhấn mạnh vào chất lượng và cam kết thực tế.
- **youthful (Trẻ trung):** Năng động, bắt trend, gần gũi với giới trẻ và Gen Z.

---

## 3. Quy chuẩn nội dung đầu ra (Output Rules 3-3-5)

Mỗi lần sinh nội dung hợp lệ bắt buộc phải có cấu trúc chính xác:
- **03 Captions:**
  - Caption 1: Định hướng **Lợi ích thực tế** (Benefit-driven)
  - Caption 2: Định hướng **Cảm xúc & Lối sống** (Emotional / Lifestyle)
  - Caption 3: Định hướng **Kêu gọi hành động** (Conversion / Call to Action)
- **03 Headlines:**
  - Tiêu đề ngắn gọn, giật tít tinh tế, đa dạng góc tiếp cận.
- **05 Hashtags:**
  - Bắt đầu bằng `#`, không chứa khoảng trắng, viết liền không trùng lặp, liên quan chặt chẽ đến sản phẩm và ngành hàng.

### Nguyên tắc chống ảo giác (Anti-Hallucination):
- AI chỉ được khai thác và suy luận từ các dữ liệu do người dùng cung cấp.
- Tuyệt đối không tự ý bịa đặt giá cả, phần trăm giảm giá, nguồn gốc xuất xứ, chứng chỉ kiểm định hay công dụng y tế nếu người dùng không nhập.

---

## 4. Quy tắc quản lý lịch sử (History Rules)
- Lưu trữ phía Client thông qua `localStorage` (không dùng Database trong phạm vi MVP).
- Cấu trúc bản ghi lịch sử bao gồm: `id` (UUID), `created_at` (ISO timestamp), `input` (thông tin đã nhập), `result` (bộ 3-3-5 nội dung).
- Người dùng có thể xem lại chi tiết và xóa từng bản ghi mà không ảnh hưởng đến các bản ghi khác.

---

## 5. Quy tắc đếm ký tự & Cảnh báo (Character Counter)
- Đếm theo ký tự Unicode chuẩn (hỗ trợ tiếng Việt có dấu và Emoji).
- Ngưỡng cảnh báo nội bộ (Internal warning threshold):
  - Instagram Caption: 2.200 ký tự.
  - Facebook Caption: Ngưỡng tối ưu hiển thị (250 ký tự cho short-form, 2.000 ký tự cho long-form).
- Khi vượt ngưỡng, hệ thống hiển thị cảnh báo màu vàng/đỏ nhưng **không** tự động cắt xén nội dung của người dùng.


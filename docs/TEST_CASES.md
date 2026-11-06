# AdGen AI - Test Cases Matrix

Bảng danh sách các ca kiểm thử theo đặc tả trong `PROJECT_MASTER.md`.

---

## 1. Test Cases Danh mục

| ID | Nhóm kiểm thử | Tình huống kiểm thử | Kết quả mong đợi | Trạng thái Phase 1 |
| :--- | :--- | :--- | :--- | :--- |
| **TC00** | **Foundation** | Khởi chạy Backend FastAPI & gọi endpoint `/api/v1/health` | Trả về HTTP 200, JSON success: true, message: "AdGen AI Backend is running" | **PASS** |
| **TC00-CORS** | **Foundation** | Gửi request từ Frontend Vite (port 5173) tới Backend (port 8000) | CORS cho phép request, response thành công không có lỗi CORS | **PASS** |
| **TC00-ROUTE** | **Foundation** | Kiểm tra các đường dẫn cơ bản trên Frontend: `/`, `/generator`, `/history`, `/guide` | Hiển thị đúng component trang placeholder, không lỗi 404 | **PASS** |
| **TC01** | Normal | Nhập đủ 4 trường hợp lệ và bấm tạo nội dung | Nhận đúng bộ kết quả chuẩn: 3 captions, 3 headlines, 5 hashtags | Phase 3 |
| **TC02** | Normal | Chọn tone `professional` | Văn phong trang trọng, chuẩn xác | Phase 3 |
| **TC03** | Invalid | Bỏ trống tên sản phẩm | Báo lỗi validation, chặn submit | Phase 2 |
| **TC04** | Invalid | Mô tả chỉ chứa khoảng trắng | Báo lỗi validation, chặn submit | Phase 2 |
| **TC05** | Boundary | Caption vượt ngưỡng ký tự cảnh báo | Hiển thị cảnh báo trực quan | Phase 4 |
| **TC06** | Failure | Gemini API lỗi hoặc timeout | Báo lỗi thân thiện, giữ nguyên input trong form | Phase 3 |
| **TC07** | Output Validation | Gemini trả thiếu số lượng output (ví dụ 2 captions) | Backend từ chối kết quả, không trả cho UI | Phase 3 |
| **TC08** | Output Validation | Gemini trả hashtag bị trùng lặp | Hệ thống tự chuẩn hóa hoặc báo lỗi | Phase 3 |
| **TC09** | History | Reload trang trình duyệt | Lịch sử trong localStorage vẫn được bảo toàn | Phase 5 |
| **TC10** | History | Xóa một bản ghi lịch sử cụ thể | Chỉ xóa đúng bản ghi được chọn | Phase 5 |
| **TC11** | Clipboard | Nhấn sao chép một caption hoặc headline | Nội dung được chép vào Clipboard hệ thống, hiện toast "Đã sao chép" | Phase 4 |
| **TC12** | Regenerate | Tạo lại riêng caption thứ 2 | Chỉ caption thứ 2 được làm mới, các mục khác giữ nguyên | Phase 4 |
| **TC13** | UX | Bấm nút Submit liên tục khi đang xử lý | Nút bị disabled, không phát sinh request kép | Phase 2 |
| **TC14** | Responsive | Mở trên thiết bị di động | Giao diện hiển thị dọc, không tràn chiều ngang | Phase 2 |


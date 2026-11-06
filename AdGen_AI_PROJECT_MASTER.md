# AdGen AI --- Project Master Specification

**Phiên bản:** 1.0\
**Ngày cập nhật:** 06/11/2026\
**Mục đích tài liệu:** Nguồn sự thật duy nhất (Single Source of Truth)
để định hướng Antigravity và các thành viên trong suốt quá trình xây
dựng sản phẩm.

------------------------------------------------------------------------

## 0. Cách sử dụng tài liệu này với Antigravity

Tài liệu này là đặc tả gốc của dự án. Mỗi lần giao việc cho Antigravity,
hãy yêu cầu công cụ:

1.  Đọc toàn bộ `PROJECT_MASTER.md` trước khi thay đổi mã nguồn.
2.  Xác định phần việc được giao thuộc module nào và yêu cầu nào trong
    tài liệu.
3.  Không tự ý thay đổi kiến trúc, công nghệ, nghiệp vụ, thiết kế hoặc
    phạm vi MVP.
4.  Trước khi sửa, nêu ngắn gọn file sẽ tạo/sửa và lý do.
5.  Chỉ triển khai đúng phạm vi được giao; không tự tiện refactor các
    module không liên quan.
6.  Sau khi triển khai, chạy kiểm tra phù hợp, báo cáo file đã thay đổi,
    kết quả test, vấn đề còn tồn tại.
7.  Nếu yêu cầu mới mâu thuẫn với tài liệu này, dừng và nêu rõ mâu
    thuẫn; không tự chọn một hướng khác.

### Quy tắc ưu tiên

Thứ tự ưu tiên khi có mâu thuẫn:

1.  Yêu cầu chính thức của Ban tổ chức (BTC) và đề bài cuộc thi.
2.  Tài liệu `PROJECT_MASTER.md` này.
3.  Các quyết định được chủ dự án xác nhận bằng văn bản sau thời điểm
    tài liệu được cập nhật.
4.  Suy luận mặc định của AI/công cụ phát triển.

Không được xem đề xuất mở rộng là chức năng bắt buộc. Không được bỏ qua
yêu cầu bắt buộc để làm tính năng mới.

------------------------------------------------------------------------

# 1. Tổng quan sản phẩm

## 1.1. Tên và định vị

-   **Tên sản phẩm:** AdGen AI
-   **Tên mô tả:** AI Advertising Content Generator
-   **Loại sản phẩm:** Web Mini App responsive.
-   **Đối tượng:** Chủ shop, người bán hàng online, marketer và nhân
    viên kinh doanh.
-   **Giá trị cốt lõi:** Biến thông tin sản phẩm thành một bộ nội dung
    quảng cáo có thể sử dụng, chỉnh sửa và sao chép nhanh chóng.

AdGen AI không phải hệ thống quản trị marketing tổng thể, không phải nền
tảng lên lịch đăng bài và không tự động đăng nội dung lên
Facebook/Instagram trong phạm vi MVP.

## 1.2. Bối cảnh và vấn đề

Chủ shop và marketer thường mất thời gian nghĩ nội dung đăng fanpage mỗi
ngày. Họ phải xác định lợi ích sản phẩm, hiểu khách hàng mục tiêu, lựa
chọn cách diễn đạt, viết caption, headline và hashtag.

AdGen AI giải quyết công việc này bằng cách tiếp nhận thông tin sản phẩm
và sử dụng Gemini API để tạo nội dung quảng cáo.

## 1.3. Mục tiêu sản phẩm

1.  Hoàn thành đầy đủ 5 nhóm chức năng bắt buộc của đề bài.
2.  Tích hợp Gemini API thật qua Backend Python.
3.  Tạo đúng số lượng đầu ra: 03 caption, 03 headline, 05 hashtag.
4.  Cho phép sao chép từng nội dung, tạo lại nội dung và xem/xóa lịch
    sử.
5.  Hiển thị số ký tự cho từng caption và cảnh báo theo ngưỡng nền tảng
    đã cấu hình.
6.  Giao diện dễ hiểu, thao tác ngắn, responsive trên desktop và mobile.
7.  Mã nguồn có cấu trúc rõ ràng, dễ kiểm thử, dễ trình bày và bàn giao.

## 1.4. Phạm vi MVP

### Bắt buộc

-   Form nhập tên sản phẩm.
-   Form nhập mô tả ngắn.
-   Form nhập đối tượng khách hàng.
-   Chọn một trong ba tông giọng: hài hước, trang trọng, trẻ trung.
-   Gemini tạo đúng 03 caption, 03 headline, 05 hashtag.
-   Copy riêng từng caption, headline và hashtag.
-   Tạo lại toàn bộ bộ nội dung.
-   Tạo lại riêng một caption hoặc headline.
-   Lưu lịch sử bằng `localStorage`.
-   Xem lại và xóa từng lịch sử.
-   Đếm ký tự từng caption.
-   Cảnh báo khi caption vượt ngưỡng cấu hình.
-   Loading, thông báo thành công và xử lý lỗi.

### Không thuộc MVP

Không tự ý triển khai các chức năng sau nếu chưa được chủ dự án yêu cầu:

-   Đăng nhập, đăng ký, phân quyền.
-   Database server như MongoDB/PostgreSQL.
-   Đồng bộ lịch sử giữa nhiều thiết bị.
-   Tự động đăng bài lên mạng xã hội.
-   Lên lịch nội dung.
-   Quản lý fanpage.
-   Thanh toán, gói thuê bao.
-   Huấn luyện mô hình AI riêng.
-   Phân tích hình ảnh sản phẩm.
-   Dashboard quản trị marketing phức tạp.

### Mở rộng có điều kiện

Chỉ thực hiện sau khi toàn bộ MVP đã hoàn thành và kiểm thử:

-   AI Content Score.
-   Chọn nền tảng Facebook/Instagram để điều chỉnh phong cách.
-   AI giải thích chiến lược viết nội dung.
-   Tạo lại nội dung theo chỉ dẫn tùy chỉnh.

------------------------------------------------------------------------

# 2. Người dùng và nghiệp vụ

## 2.1. Nhóm người dùng

  -----------------------------------------------------------------------
  Người dùng              Nhu cầu chính           Kết quả mong muốn
  ----------------------- ----------------------- -----------------------
  Chủ shop                Tạo caption bán hàng    Có nội dung dùng được
                          nhanh                   ngay

  Marketer                Có nhiều phương án      So sánh và chọn phương
                          content                 án phù hợp

  Nhân viên kinh doanh    Giới thiệu sản phẩm     Nội dung rõ ràng, đúng
                                                  thông tin
  -----------------------------------------------------------------------

MVP không yêu cầu tài khoản. Người dùng mở ứng dụng và sử dụng trực
tiếp.

## 2.2. Luồng sử dụng chính

**Luồng A --- Tạo nội dung lần đầu**

1.  Người dùng mở trang Tạo nội dung.
2.  Nhập tên sản phẩm.
3.  Nhập mô tả ngắn, gồm lợi ích/đặc điểm đã biết.
4.  Nhập đối tượng khách hàng.
5.  Chọn tông giọng.
6.  Nhấn "Tạo nội dung bằng AI".
7.  Frontend kiểm tra dữ liệu cơ bản.
8.  Backend kiểm tra dữ liệu lần nữa.
9.  Backend xây dựng prompt và gọi Gemini.
10. Backend kiểm tra/chuẩn hóa kết quả.
11. Frontend hiển thị 03 caption, 03 headline, 05 hashtag.
12. Lưu một bản ghi lịch sử vào localStorage sau khi kết quả hợp lệ.

**Luồng B --- Sao chép**

1.  Người dùng nhấn nút Copy tại một mục.
2.  Ứng dụng sao chép đúng nội dung của mục đó.
3.  Hiển thị trạng thái "Đã sao chép".
4.  Nếu Clipboard API thất bại, thông báo lỗi phù hợp.

**Luồng C --- Tạo lại riêng một nội dung**

1.  Người dùng chọn "Tạo lại" trên một caption hoặc headline.
2.  Frontend gửi loại nội dung, vị trí, ngữ cảnh sản phẩm và nội dung
    cũ.
3.  Backend xác thực yêu cầu.
4.  Gemini sinh một nội dung thay thế.
5.  Backend kiểm tra kết quả.
6.  Chỉ thay thế mục được chọn; giữ nguyên các mục còn lại.
7.  Cập nhật bản ghi lịch sử hiện tại.

**Luồng D --- Tạo lại toàn bộ**

1.  Người dùng nhấn "Tạo lại tất cả".
2.  Ứng dụng xác nhận trạng thái đang xử lý.
3.  Backend gọi Gemini để tạo một bộ mới.
4.  Chỉ thay thế bộ kết quả khi response hợp lệ.
5.  Lưu kết quả mới vào lịch sử.

**Luồng E --- Lịch sử**

1.  Người dùng mở mục Lịch sử.
2.  Ứng dụng đọc dữ liệu localStorage.
3.  Hiển thị danh sách lần tạo theo thứ tự mới nhất.
4.  Người dùng chọn một bản ghi để xem chi tiết.
5.  Người dùng có thể xóa từng bản ghi.
6.  Xóa phải cập nhật cả giao diện và localStorage.

## 2.3. Quy tắc nghiệp vụ

### Form

-   Tất cả bốn trường đầu vào đều bắt buộc.
-   Không chấp nhận chuỗi chỉ có khoảng trắng.
-   Chuẩn hóa khoảng trắng đầu/cuối.
-   `tone` chỉ nhận một trong ba giá trị: `funny`, `professional`,
    `youthful`.
-   Giới hạn độ dài đầu vào phải được định nghĩa tập trung và dùng nhất
    quán ở Frontend/Backend.
-   Không gửi request khi dữ liệu không hợp lệ.
-   Trong lúc request đang chạy, vô hiệu hóa nút tạo để tránh gửi lặp.

### Kết quả AI

-   `captions`: chính xác 3 phần tử.
-   `headlines`: chính xác 3 phần tử.
-   `hashtags`: chính xác 5 phần tử.
-   Không chấp nhận phần tử rỗng.
-   Hashtag phải có ký hiệu `#`, không chứa khoảng trắng bên trong và
    không trùng nhau sau chuẩn hóa.
-   Không tự bịa giá, khuyến mãi, chứng nhận, xuất xứ, thông số, công
    dụng hoặc cam kết mà người dùng chưa cung cấp.
-   Ba caption nên khác nhau về hướng tiếp cận:
    -   Caption 1: nhấn mạnh lợi ích.
    -   Caption 2: cảm xúc/lối sống.
    -   Caption 3: thúc đẩy hành động, không dùng lời hứa sai sự thật.
-   Ba headline phải có cách diễn đạt khác nhau.
-   Nội dung phải phù hợp tông giọng đã chọn.
-   Nếu kết quả không đạt schema hoặc thiếu số lượng, không hiển thị như
    kết quả thành công và không lưu vào lịch sử.

### Lịch sử

-   Dùng `localStorage`, không tạo database server cho MVP.
-   Lưu input, output, id và thời điểm tạo.
-   Lịch sử chỉ tồn tại trên cùng trình duyệt/thiết bị.
-   Có xử lý trường hợp localStorage lỗi hoặc đầy.
-   Xóa một bản ghi không được xóa các bản ghi khác.
-   Không lưu API key hoặc dữ liệu bí mật vào localStorage.

### Bộ đếm ký tự

-   Bộ đếm áp dụng cho từng caption.
-   Hiển thị dạng `số ký tự hiện tại / ngưỡng cảnh báo`.
-   Ngưỡng phải nằm trong cấu hình tập trung, không hard-code rải rác.
-   Có cảnh báo trực quan khi vượt ngưỡng.
-   Cảnh báo không tự động cắt nội dung.
-   Dùng cách đếm ký tự Unicode phù hợp với ký tự tiếng Việt và emoji.
-   Không tuyên bố ngưỡng cảnh báo là giới hạn chính thức của nền tảng
    nếu chưa có nguồn xác minh.

**Cấu hình ban đầu đề xuất:** - Instagram: 2.200 ký tự/caption. -
Facebook: đặt giá trị cấu hình riêng, ghi rõ là ngưỡng cảnh báo nội bộ
của ứng dụng; cần xác minh lại trước khi công bố là giới hạn nền tảng.

------------------------------------------------------------------------

# 3. AI Engine và tích hợp Gemini

## 3.1. Vai trò Gemini

Gemini là mô hình ngôn ngữ bên ngoài được gọi qua API. Dự án không tự
huấn luyện mô hình nền tảng.

Gemini thực hiện:

1.  Hiểu thông tin sản phẩm.
2.  Suy luận lợi ích dựa trên dữ liệu được cung cấp.
3.  Điều chỉnh cách diễn đạt theo đối tượng khách hàng.
4.  Áp dụng tông giọng.
5.  Sinh caption, headline và hashtag theo schema.

## 3.2. Prompt Engineering

Prompt phải được quản lý trong module riêng, không viết rải rác trong
route.

### System instruction bắt buộc

-   Đóng vai chuyên gia sáng tạo nội dung quảng cáo.
-   Viết bằng tiếng Việt tự nhiên.
-   Chỉ sử dụng thông tin được cung cấp.
-   Không tự bịa thông số, giá, khuyến mãi, chứng nhận, xuất xứ, công
    dụng hoặc kết quả.
-   Không đưa ra tuyên bố tuyệt đối hoặc cam kết không có căn cứ.
-   Phân biệt rõ ba tông giọng.
-   Tạo các phương án có góc tiếp cận khác nhau.
-   Không lặp lại cùng một câu chỉ bằng cách thay vài từ.
-   Trả đúng cấu trúc JSON đã định nghĩa.
-   Không thêm lời dẫn hoặc Markdown bên ngoài dữ liệu có cấu trúc.

### Mapping tông giọng

  Giá trị API      Tên hiển thị   Định hướng
  ---------------- -------------- --------------------------------------
  `funny`          Hài hước       Vui vẻ, dí dỏm, không phản cảm
  `professional`   Trang trọng    Rõ ràng, đáng tin cậy, chuyên nghiệp
  `youthful`       Trẻ trung      Năng động, gần gũi, hiện đại

### Hướng tiếp cận caption

  Caption   Mục tiêu            Lưu ý
  --------- ------------------- --------------------------------------
  1         Benefit-driven      Làm rõ lợi ích thực tế
  2         Emotional           Gắn sản phẩm với tình huống/lối sống
  3         Conversion-driven   CTA tự nhiên, không gây hiểu nhầm

## 3.3. Structured output và validation

Ưu tiên sử dụng chế độ structured output/JSON schema được SDK và model
Gemini đang chọn hỗ trợ. Không giả định mọi model đều hỗ trợ mọi cấu
hình.

Sau khi nhận response:

1.  Kiểm tra response có nội dung.
2.  Parse JSON.
3.  Validate bằng Pydantic.
4.  Kiểm tra đúng số lượng.
5.  Kiểm tra chuỗi rỗng.
6.  Kiểm tra hashtag.
7.  Kiểm tra trùng lặp cơ bản.
8.  Chỉ trả kết quả hợp lệ cho Frontend.

Nếu model không trả JSON hợp lệ: - Có thể thực hiện tối đa một lần
sửa/repair có kiểm soát nếu phù hợp. - Nếu vẫn lỗi, trả lỗi rõ ràng. -
Không lặp vô hạn. - Không trả dữ liệu sai cấu trúc như thể đã thành
công.

## 3.4. Regenerate

Hỗ trợ hai kiểu:

-   `all`: tạo lại toàn bộ bộ nội dung.
-   `single`: tạo lại đúng một caption hoặc headline.

Regenerate single phải giữ nguyên các phần tử khác. Backend chỉ sinh
loại nội dung được yêu cầu, không gọi tạo lại toàn bộ nếu không cần
thiết.

Hashtag regenerate riêng chỉ triển khai nếu có yêu cầu mở rộng; không
bắt buộc trong MVP ban đầu.

## 3.5. Bảo mật và giới hạn

-   Gemini API key chỉ lưu ở Backend trong `.env`.
-   Không đưa key vào code Frontend.
-   Không commit `.env`.
-   Có `.env.example` với giá trị giả.
-   Thiết lập timeout.
-   Retry có giới hạn đối với lỗi tạm thời.
-   Không retry vô hạn đối với lỗi cấu hình hoặc lỗi xác thực.
-   Không log API key.
-   Có xử lý rate limit/quota.
-   Thông báo lỗi cho người dùng bằng ngôn ngữ dễ hiểu, không lộ stack
    trace.

------------------------------------------------------------------------

# 4. Công nghệ và kiến trúc

## 4.1. Stack cố định

  Lớp                Công nghệ                                  Trách nhiệm
  ------------------ ------------------------------------------ ---------------------------
  Frontend           ReactJS + Vite                             UI, tương tác, routing
  Styling            Tailwind CSS                               Design system, responsive
  Backend            Python 3.11+                               Nghiệp vụ và API
  API framework      FastAPI                                    REST API
  Validation         Pydantic                                   Validate request/response
  AI SDK             `google-genai`                             Gọi Gemini API
  Config             `pydantic-settings` hoặc `python-dotenv`   Quản lý cấu hình
  Retry              `tenacity` (nếu cần)                       Retry có giới hạn
  Frontend storage   localStorage                               Lịch sử
  Backend tests      pytest + httpx                             Kiểm thử
  Version control    Git + GitHub                               Quản lý source

Không sử dụng Streamlit thay cho React trong kiến trúc đã chốt. Không
dùng MongoDB/PostgreSQL cho MVP.

## 4.2. Kiến trúc logic

``` text
Browser
  |
  v
React Application
  |
  | HTTP / JSON
  v
FastAPI
  |
  +--> API Routes
  |
  +--> Pydantic Schemas
  |
  +--> Application Services
  |       |
  |       +--> Prompt Builder
  |       |
  |       +--> Gemini Service
  |       |
  |       +--> Output Validator
  |
  v
Gemini API

React Application
  |
  +--> localStorage (history)
  +--> Character Counter
  +--> Clipboard API
```

## 4.3. Cấu trúc thư mục mục tiêu

``` text
ADGEN-AI/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   ├── layout/
│   │   │   ├── generator/
│   │   │   ├── results/
│   │   │   └── history/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── .env.example
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── routes/
│   │   ├── core/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── prompts/
│   │   └── main.py
│   ├── tests/
│   ├── requirements.txt
│   └── .env.example
│
├── docs/
│   ├── BUSINESS_LOGIC.md
│   ├── API_DOCUMENTATION.md
│   └── TEST_CASES.md
│
├── PROJECT_MASTER.md
├── README.md
└── .gitignore
```

Có thể điều chỉnh tên file nhỏ khi cần, nhưng phải giữ nguyên nguyên tắc
phân lớp: route không chứa prompt dài hoặc logic gọi Gemini phức tạp;
service không phụ thuộc trực tiếp vào UI.

## 4.4. API contract

### `POST /api/v1/generate`

Request:

``` json
{
  "product_name": "Bình giữ nhiệt Inox",
  "description": "Giữ nhiệt 12 giờ, thiết kế nhỏ gọn",
  "target_audience": "Sinh viên, nhân viên văn phòng",
  "tone": "youthful"
}
```

Response thành công:

``` json
{
  "success": true,
  "data": {
    "captions": ["...", "...", "..."],
    "headlines": ["...", "...", "..."],
    "hashtags": ["#...", "#...", "#...", "#...", "#..."]
  },
  "message": "Tạo nội dung thành công"
}
```

### `POST /api/v1/regenerate`

Request single:

``` json
{
  "content_type": "caption",
  "content_index": 1,
  "product_context": {
    "product_name": "Bình giữ nhiệt Inox",
    "description": "Giữ nhiệt 12 giờ, thiết kế nhỏ gọn",
    "target_audience": "Sinh viên, nhân viên văn phòng",
    "tone": "youthful"
  },
  "previous_content": "Nội dung cũ..."
}
```

`content_index` dùng chỉ số bắt đầu từ 0 ở tầng API. Frontend có thể
hiển thị số thứ tự bắt đầu từ 1.

Response nên trả về loại nội dung, index và nội dung mới để Frontend cập
nhật đúng phần tử.

### `GET /api/v1/health`

Trả trạng thái Backend. Không trả API key hoặc thông tin bí mật.

### `GET /api/v1/config`

Trả cấu hình công khai cần cho UI, ví dụ ngưỡng cảnh báo ký tự. Không
trả biến môi trường bí mật.

## 4.5. Schema dữ liệu

### GenerationRequest

-   `product_name`: string, bắt buộc.
-   `description`: string, bắt buộc.
-   `target_audience`: string, bắt buộc.
-   `tone`: enum `funny | professional | youthful`.

### GenerationResult

-   `captions`: list\[str\], đúng 3.
-   `headlines`: list\[str\], đúng 3.
-   `hashtags`: list\[str\], đúng 5.

### HistoryRecord (Frontend)

``` json
{
  "id": "uuid",
  "created_at": "ISO-8601 timestamp",
  "input": {
    "product_name": "...",
    "description": "...",
    "target_audience": "...",
    "tone": "youthful"
  },
  "result": {
    "captions": ["...", "...", "..."],
    "headlines": ["...", "...", "..."],
    "hashtags": ["#...", "#...", "#...", "#...", "#..."]
  }
}
```

------------------------------------------------------------------------

# 5. UI/UX --- DESIGN SYSTEM

## 5.1. Định hướng thiết kế

**Phong cách:** Burgundy Enterprise SaaS + AI Creative Studio.

Từ khóa: - Chuyên nghiệp. - Công nghệ. - Doanh nghiệp. - Tối giản. - Rõ
thứ bậc thông tin. - Tập trung vào tác vụ tạo nội dung. - Không lạm dụng
hiệu ứng, gradient hoặc hình minh họa trang trí.

Ứng dụng phải trông như một sản phẩm SaaS thực tế, không giống landing
page quảng cáo hoặc template dashboard chung chung.

## 5.2. Bảng màu chính thức

  Token            Màu             Hex         Sử dụng
  ---------------- --------------- ----------- ------------------------
  Primary          Burgundy        `#800020`   Logo, CTA, điểm nhấn
  Secondary        Wine Red        `#A52A2A`   Accent, trạng thái phụ
  Background       Ivory           `#FAF9F6`   Nền ứng dụng
  Text Primary     Charcoal        `#1A1A1A`   Tiêu đề, nội dung
  Text Secondary   Dark Gray       `#555555`   Mô tả, nhãn
  Button Hover     Deep Burgundy   `#660018`   Hover CTA

### Màu bổ trợ được phép

Để đảm bảo khả năng đọc và trạng thái hệ thống, được sử dụng màu trung
tính và màu trạng thái:

-   White: `#FFFFFF` --- card, navbar.
-   Border: `#E8E3E0` --- đường viền.
-   Muted: `#F1EEEB` --- vùng phụ.
-   Success: xanh lá có độ tương phản tốt.
-   Warning: vàng/cam dễ nhận biết.
-   Error: đỏ cảnh báo.

Không dùng màu bổ trợ để thay thế màu Burgundy thương hiệu.

## 5.3. Typography

-   Ưu tiên Inter hoặc font sans-serif hiện đại tương đương.
-   Heading: đậm vừa, rõ ràng.
-   Body: dễ đọc, line-height thoáng.
-   Không dùng quá nhiều kiểu chữ.
-   Cỡ chữ desktop và mobile phải có phân cấp rõ.

## 5.4. Layout tổng thể

### Desktop

-   Sidebar cố định bên trái, chiều rộng khoảng 240--260px.
-   Main content chiếm phần còn lại.
-   Navbar/header phía trên vùng nội dung.
-   Content max-width hợp lý, không kéo các form quá rộng.
-   Form và kết quả phải có khoảng cách rõ ràng.
-   Tránh nhồi nhiều card nhỏ không cần thiết.

### Mobile

-   Sidebar chuyển thành menu drawer hoặc bottom navigation gọn.
-   Form hiển thị một cột.
-   CTA rộng, dễ chạm.
-   Kết quả xếp dọc.
-   Copy/Regenerate có vùng chạm đủ lớn.
-   Không có horizontal overflow.
-   Lịch sử và chi tiết nội dung dễ thao tác bằng một tay.

## 5.5. Điều hướng

MVP chỉ cần ba mục điều hướng chính:

1.  **Tạo nội dung** --- màn hình làm việc chính.
2.  **Lịch sử** --- xem lại các lần tạo.
3.  **Hướng dẫn** --- hướng dẫn nhập dữ liệu và sử dụng.

Không cần dashboard thống kê phức tạp. Nếu có trang chủ, trang chủ phải
dẫn nhanh đến chức năng tạo nội dung.

## 5.6. Màn hình 1 --- Generator

Đây là màn hình quan trọng nhất. Mục tiêu: người dùng nhìn thấy ngay
mình cần làm gì.

### Bố cục đề xuất

**Header** - Logo biểu tượng chữ A hoặc sparkles kết hợp wordmark
`AdGen AI`. - Menu Tạo nội dung, Lịch sử, Hướng dẫn. - Không cần
avatar/tài khoản giả lập.

**Page introduction** - Tiêu đề: "Tạo nội dung quảng cáo" - Mô tả: "Biến
thông tin sản phẩm thành nội dung thu hút với AI." - Có thể có nhãn
"Powered by Gemini", nhưng không phóng đại hoặc ngụ ý Google chứng nhận
sản phẩm.

**Input panel** - Tên sản phẩm. - Mô tả ngắn. - Đối tượng khách hàng. -
Tông giọng dạng segmented control hoặc radio card. - CTA chính: "Tạo nội
dung bằng AI".

**Output area** - Chỉ hiển thị khi đã có kết quả. - Chia thành ba nhóm:
Caption, Headline, Hashtag. - Mỗi nội dung có Copy. - Caption/Headline
có Regenerate riêng. - Có nút "Tạo lại tất cả". - Mỗi caption có
character counter.

### Nguyên tắc UX

-   Không bắt người dùng đi qua nhiều bước hoặc modal không cần thiết.
-   Giữ input đang nhập sau khi API lỗi.
-   Khi tạo thành công, cuộn nhẹ đến kết quả nếu phù hợp.
-   Không tự động xóa form.
-   Không làm mất kết quả cũ nếu lần tạo mới thất bại.
-   Loading phải có nội dung rõ ràng, ví dụ "AI đang phân tích thông tin
    sản phẩm...".
-   Nút tạo phải có trạng thái disabled trong lúc xử lý.

## 5.7. Màn hình 2 --- History

Mục tiêu: tìm và xem lại nội dung cũ nhanh chóng.

Mỗi history item hiển thị: - Tên sản phẩm. - Tông giọng. - Thời điểm
tạo. - Một đoạn preview caption. - Nút "Xem nội dung". - Nút xóa.

Chi tiết bản ghi: - Hiển thị lại input. - Hiển thị 3 caption, 3
headline, 5 hashtag. - Cho phép copy. - Không tự gọi Gemini khi chỉ xem
lại lịch sử.

Trạng thái rỗng: - Icon đơn giản. - Nội dung: "Bạn chưa có nội dung nào
được lưu." - CTA: "Tạo nội dung đầu tiên".

## 5.8. Màn hình 3 --- Hướng dẫn

Nội dung ngắn: 1. Nhập tên và mô tả sản phẩm. 2. Mô tả đúng lợi ích đã
xác minh. 3. Chọn khách hàng mục tiêu. 4. Chọn tông giọng. 5. Tạo, xem,
sao chép hoặc tạo lại nội dung.

Có cảnh báo: AI có thể tạo nội dung chưa chính xác; người dùng cần kiểm
tra thông tin, giá, khuyến mãi và các tuyên bố trước khi đăng.

## 5.9. Component design

Các component nên tái sử dụng:

-   `AppShell`
-   `Sidebar`
-   `Topbar`
-   `PageHeader`
-   `ProductForm`
-   `TextField`
-   `ToneSelector`
-   `PrimaryButton`
-   `CaptionCard`
-   `HeadlineCard`
-   `HashtagGroup`
-   `CharacterCounter`
-   `CopyButton`
-   `RegenerateButton`
-   `HistoryList`
-   `HistoryItem`
-   `EmptyState`
-   `LoadingState`
-   `ErrorMessage`
-   `ConfirmDialog`
-   `Toast`

Không tạo component chỉ để bọc một thẻ HTML đơn giản nếu không có giá
trị tái sử dụng hoặc quản lý logic.

## 5.10. UI states bắt buộc

Mỗi màn hình cần được thiết kế đủ trạng thái:

-   Initial/Empty.
-   Typing.
-   Validation error.
-   Loading.
-   Success.
-   API error.
-   Empty history.
-   History loaded.
-   Delete confirmation.
-   Clipboard success/failure.
-   Regenerate loading.
-   Character limit warning.

Không chỉ thiết kế trạng thái thành công.

------------------------------------------------------------------------

# 6. Kiểm thử và tiêu chí nghiệm thu

## 6.1. Functional acceptance criteria

  ID     Tiêu chí nghiệm thu
  ------ ---------------------------------
  AC01   Form có đủ 4 trường yêu cầu
  AC02   Chỉ chấp nhận 3 tone hợp lệ
  AC03   Sinh đúng 3 caption
  AC04   Sinh đúng 3 headline
  AC05   Sinh đúng 5 hashtag
  AC06   Copy riêng từng nội dung
  AC07   Regenerate toàn bộ
  AC08   Regenerate một caption/headline
  AC09   Lưu lịch sử bằng localStorage
  AC10   Xem lại lịch sử sau reload
  AC11   Xóa đúng một lịch sử
  AC12   Đếm ký tự từng caption
  AC13   Cảnh báo khi vượt ngưỡng
  AC14   Xử lý lỗi API rõ ràng
  AC15   Responsive desktop/mobile

## 6.2. Test cases tối thiểu

  -----------------------------------------------------------------------
  ID                Nhóm              Tình huống        Kết quả mong đợi
  ----------------- ----------------- ----------------- -----------------
  TC01              Normal            Nhập đủ dữ liệu   Nhận 3-3-5
                                      hợp lệ            

  TC02              Normal            Chọn tone         Giọng văn trang
                                      professional      trọng

  TC03              Invalid           Bỏ trống tên sản  Chặn submit
                                      phẩm              

  TC04              Invalid           Mô tả chỉ có      Báo lỗi
                                      khoảng trắng      

  TC05              Boundary          Caption vượt      Hiện cảnh báo
                                      ngưỡng            

  TC06              Failure           Gemini            Báo lỗi, giữ form
                                      lỗi/timeout       

  TC07              Output            Gemini trả thiếu  Từ chối kết quả
                                      caption           

  TC08              Output            Gemini trả        Validate/repair
                                      hashtag trùng     có giới hạn

  TC09              History           Reload trang      Lịch sử còn

  TC10              History           Xóa một bản ghi   Chỉ bản ghi đó bị
                                                        xóa

  TC11              Copy              Copy caption      Clipboard đúng
                                                        nội dung

  TC12              Regenerate        Tạo lại caption   Mục khác giữ
                                      thứ hai           nguyên

  TC13              UX                Bấm tạo liên tục  Không tạo request
                                                        trùng

  TC14              Responsive        Mở trên mobile    Không tràn ngang
  -----------------------------------------------------------------------

Đây là test plan. Chỉ đánh dấu Pass sau khi thực thi thực tế.

## 6.3. Kiểm thử kỹ thuật

-   Unit test validation.
-   API test generate.
-   API test regenerate.
-   Test response lỗi Gemini.
-   Test JSON sai cấu trúc.
-   Test localStorage.
-   Test character counter với tiếng Việt/emoji.
-   Test clipboard.
-   Test responsive.
-   Test bảo mật API key.

------------------------------------------------------------------------

# 7. Triển khai và bàn giao

## 7.1. Deployment mục tiêu

-   Frontend: Vercel hoặc static hosting tương đương.
-   Backend: Render, Cloud Run hoặc Python hosting phù hợp.
-   Gemini API key: biến môi trường phía Backend.
-   Frontend gọi Backend qua HTTPS.
-   Cấu hình CORS theo domain Frontend thực tế.

## 7.2. Biến môi trường mẫu

Backend `.env.example`:

``` env
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=your_supported_gemini_model
APP_ENV=development
FRONTEND_ORIGIN=http://localhost:5173
```

Frontend `.env.example`:

``` env
VITE_API_BASE_URL=http://localhost:8000
```

Không commit `.env` thật.

## 7.3. Hồ sơ bàn giao

-   Source code đầy đủ.
-   README hướng dẫn cài đặt/chạy.
-   PROJECT_MASTER.md.
-   API documentation.
-   Test cases và kết quả test thực tế.
-   Video demo theo thời lượng BTC.
-   Minh chứng sử dụng AI/Vibe Coding theo yêu cầu BTC.
-   Link demo và QR Code nếu có.

------------------------------------------------------------------------

# 8. Kế hoạch phát triển theo thứ tự phụ thuộc

Không phát triển tất cả cùng lúc. Thứ tự khuyến nghị:

## Phase 1 --- Project foundation

-   Khởi tạo repository.
-   Khởi tạo React/Vite.
-   Khởi tạo FastAPI.
-   Cấu hình môi trường.
-   Tạo health endpoint.
-   Kiểm tra Frontend gọi Backend.

**Definition of Done:** Frontend và Backend chạy độc lập, gọi được
endpoint health.

## Phase 2 --- UI foundation

-   Xây dựng design tokens Burgundy.
-   Xây dựng AppShell, navigation.
-   Xây dựng Generator page.
-   Xây dựng responsive layout.
-   Xây dựng form và validation phía Client.

**Definition of Done:** UI hoàn chỉnh với dữ liệu giả, chưa cần AI.

## Phase 3 --- Gemini integration

-   Tích hợp `google-genai`.
-   Quản lý API key an toàn.
-   Xây dựng prompt module.
-   Xây dựng schema.
-   Xây dựng generate service.
-   Kiểm tra response thật từ Gemini.

**Definition of Done:** API trả đúng cấu trúc 3-3-5 với Gemini thật.

## Phase 4 --- Result interactions

-   Hiển thị kết quả.
-   Copy từng nội dung.
-   Regenerate single.
-   Regenerate all.
-   Character counter.
-   Loading/error/success states.

**Definition of Done:** Tất cả thao tác kết quả hoạt động.

## Phase 5 --- History

-   Lưu localStorage.
-   Đọc lịch sử.
-   Xem chi tiết.
-   Xóa từng bản ghi.
-   Xử lý dữ liệu lỗi hoặc storage đầy.

**Definition of Done:** Lịch sử tồn tại sau reload và xóa chính xác.

## Phase 6 --- QA and deployment

-   Chạy test suite.
-   Kiểm thử thủ công.
-   Sửa lỗi.
-   Kiểm tra bảo mật.
-   Deploy.
-   Quay video và chuẩn bị hồ sơ.

**Definition of Done:** Có link demo hoạt động, source và tài liệu bàn
giao.

------------------------------------------------------------------------

# 9. Quy tắc làm việc với Antigravity

Đây là phần bắt buộc phải tuân thủ để tránh AI coding đi lệch hướng.

## 9.1. Trước mỗi task

Antigravity phải: - Đọc `PROJECT_MASTER.md`. - Đọc file liên quan đến
module đang sửa. - Xác định acceptance criteria. - Xác định
dependency. - Nêu kế hoạch sửa ngắn gọn.

## 9.2. Trong khi code

-   Không tự đổi stack.
-   Không tự đổi màu thương hiệu.
-   Không tự thêm database.
-   Không đưa Gemini API key lên Frontend.
-   Không hard-code prompt trong nhiều file.
-   Không viết toàn bộ dự án vào một file.
-   Không xóa chức năng đã hoàn thành khi sửa chức năng khác.
-   Không thay dữ liệu thật bằng mock data trong bản demo cuối.
-   Không giả lập AI bằng câu trả lời cố định.
-   Không đánh dấu tính năng hoàn thành khi chưa chạy thử.
-   Không tạo file trùng lặp hoặc module không được sử dụng.
-   Không tự cài thêm thư viện lớn nếu chưa giải thích lý do.

## 9.3. Sau mỗi task

Antigravity phải báo cáo:

1.  Đã làm gì?
2.  Đã sửa/tạo file nào?
3.  Yêu cầu nào đã hoàn thành?
4.  Đã chạy lệnh/test nào?
5.  Kết quả test?
6.  Lỗi còn tồn tại?
7.  Có thay đổi nào ảnh hưởng module khác không?

## 9.4. Không được tự suy diễn

Nếu thiếu thông tin: - Đánh dấu phần chưa rõ. - Nêu các phương án. - Đề
xuất phương án ít rủi ro nhất. - Chờ chủ dự án xác nhận nếu quyết định
ảnh hưởng kiến trúc, nghiệp vụ, bảo mật hoặc phạm vi.

------------------------------------------------------------------------


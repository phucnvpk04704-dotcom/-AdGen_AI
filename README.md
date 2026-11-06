# AdGen AI – AI Advertising Content Generator

> Nền tảng Web Mini App tự động tạo nội dung quảng cáo thông minh cho chủ shop và marketer ứng dụng mô hình ngôn ngữ lớn **Google Gemini AI**.

---

## 1. Tổng quan dự án

Dự án phát triển theo định hướng **Single Source of Truth** tại `PROJECT_MASTER.md`.
- **Giai đoạn hiện tại:** Phase 3 – Gemini AI Integration (Tích hợp AI tạo nội dung thực tế).
- **Backend:** Python 3.11+, FastAPI REST API, Pydantic v2, Google GenAI SDK (`google-genai`), Uvicorn, CORS.
- **Frontend:** ReactJS, Vite, Tailwind CSS (Burgundy Enterprise SaaS Theme), Lucide React, React Router DOM, Axios.

---

## 2. Cấu trúc thư mục

```text
ADGEN-AI/
│
├── frontend/                     # Ứng dụng React + Vite
│   ├── public/
│   │   └── vite.svg
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── common/           # Button, Badge, Toast, EmptyState, LoadingState, ConfirmDialog...
│   │   │   ├── generator/        # ProductForm, ToneSelector...
│   │   │   ├── results/          # ResultsSection, CaptionCard, HeadlineCard, HashtagGroup...
│   │   │   ├── history/          # HistoryItem, HistoryList, HistoryDetailModal...
│   │   │   └── layout/           # Sidebar, Topbar, Layout...
│   │   ├── pages/                # HomePage, GeneratorPage, HistoryPage, GuidePage
│   │   ├── services/             # api.js, healthService.js, generatorService.js, mockGenerator.js
│   │   ├── hooks/                # useBackendHealth.js, useToast.js
│   │   ├── utils/                # constants.js, characterUtils.js
│   │   ├── styles/               # index.css (Tailwind)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── .env
│   └── .env.example
│
├── backend/                      # Ứng dụng Python FastAPI
│   ├── app/
│   │   ├── api/
│   │   │   └── routes/           # health.py, generate.py, regenerate.py
│   │   ├── core/                 # config.py, exceptions.py
│   │   ├── schemas/              # health.py, generator.py, regenerate.py
│   │   ├── services/             # gemini_service.py, generator_service.py
│   │   ├── prompts/              # system_instruction.py, prompt_builder.py, tone_prompts.py
│   │   └── main.py               # FastAPI entrypoint
│   │
│   ├── tests/                    # pytest test suite
│   │   ├── test_prompts.py
│   │   ├── test_schemas.py
│   │   ├── test_generator_api.py
│   │   ├── test_gemini_integration_smoke.py
│   │   └── test_health.py
│   ├── requirements.txt
│   ├── .env
│   └── .env.example
│
├── docs/                         # Tài liệu hệ thống
│   ├── BUSINESS_LOGIC.md
│   ├── API_DOCUMENTATION.md
│   └── TEST_CASES.md
│
├── PROJECT_MASTER.md             # Đặc tả gốc của dự án
├── README.md                     # Hướng dẫn cài đặt và vận hành
└── .gitignore                    # Cấu hình bỏ qua git
```

---

## 3. Cấu hình Gemini AI & Biến môi trường

### Cấu hình Backend (`backend/.env`):
Tạo hoặc chỉnh sửa file `backend/.env` dựa trên `backend/.env.example`:

```env
APP_ENV=development
FRONTEND_ORIGIN=http://localhost:5173

# Khóa bí mật Google Gemini (Chỉ lưu ở Backend, không commit vào Git)
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-3.8-flash

GEMINI_TIMEOUT=60
GEMINI_MAX_RETRIES=2
```

> **Lưu ý bảo mật:**
> - `GEMINI_API_KEY` chỉ được đọc duy nhất tại Backend thông qua Pydantic Settings.
> - Tuyệt đối không đưa API Key sang thư mục Frontend hoặc lưu trên Client.

---

## 4. Hướng dẫn khởi chạy

### A. Khởi chạy Backend (FastAPI)

1. Mở terminal tại thư mục `backend`:
   ```bash
   cd backend
   ```

2. Kích hoạt môi trường ảo Python (`venv`):
   - **Windows:**
     ```powershell
     .\venv\Scripts\activate
     ```
   - **Linux / macOS:**
     ```bash
     source venv/bin/activate
     ```

3. Cài đặt dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Khởi chạy server FastAPI:
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```

5. Kiểm tra hoạt động:
   - **API Docs (Swagger UI):** [http://localhost:8000/docs](http://localhost:8000/docs)
   - **Health API:** [http://localhost:8000/api/v1/health](http://localhost:8000/api/v1/health)

---

### B. Khởi chạy Frontend (React + Vite)

1. Mở terminal tại thư mục `frontend`:
   ```bash
   cd frontend
   ```

2. Cài đặt dependencies:
   ```bash
   npm install
   ```

3. Khởi chạy máy chủ phát triển Vite:
   ```bash
   npm run dev
   ```

4. Truy cập giao diện ứng dụng tại: [http://localhost:5173](http://localhost:5173)

---

## 5. Chạy kiểm thử tự động (Testing)

### Chạy toàn bộ test suite Backend (pytest):
```bash
cd backend
.\venv\Scripts\pytest -v
```

Kiểm thử bao gồm:
- Unit tests cho Prompt Builder (3 tông giọng, quy tắc chống bịa đặt).
- Unit tests cho Pydantic Schemas (Input Validation, Output 3-3-5, Hashtags).
- API tests cho `POST /api/v1/generate` và `POST /api/v1/regenerate`.
- Kiểm thử các ca lỗi: thiếu API Key (503), input không hợp lệ (422), Quota (429), lỗi mạng (502).
- Integration live smoke test (tự động bỏ qua an toàn khi chưa cấu hình key, kích hoạt khi có key).

### Kiểm thử Production Build Frontend:
```bash
cd frontend
npm run build
```

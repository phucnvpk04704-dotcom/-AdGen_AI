"""Prompt Builder module for constructing prompts for Gemini AI."""

from typing import Optional
from app.schemas.generator import GenerationRequest
from app.schemas.regenerate import RegenerateRequest
from app.prompts.tone_prompts import TONE_INSTRUCTIONS


def build_generation_prompt(request: GenerationRequest) -> str:
    """Build user prompt for full 3-3-5 advertising content generation."""
    tone_instruction = TONE_INSTRUCTIONS.get(request.tone, TONE_INSTRUCTIONS["youthful"])

    prompt = f"""Hãy sáng tạo một bộ nội dung quảng cáo hoàn chỉnh cho sản phẩm sau:

[THÔNG TIN SẢN PHẨM]
- Tên sản phẩm: {request.product_name}
- Mô tả & Lợi ích: {request.description}
- Khách hàng mục tiêu: {request.target_audience}
- Tông giọng yêu cầu: {request.tone}

[ĐỊNH HƯỚNG TÔNG GIỌNG]
{tone_instruction}

[YÊU CẦU ĐẦU RA BẮT BUỘC (CẤU TRÚC 3-3-5)]
1. 03 BÀI VIẾT QUẢNG CÁO (CAPTIONS):
   - caption_1 (approach: "benefit"): Tập trung làm nổi bật lợi ích thực tế và giá trị cụ thể của sản phẩm mang lại cho khách hàng.
   - caption_2 (approach: "emotional"): Tập trung gắn liền sản phẩm với cảm xúc, câu chuyện đời sống hoặc phong cách cá nhân của người dùng.
   - caption_3 (approach: "call_to_action"): Kêu gọi hành động tự nhiên, tạo sự hào hứng và thúc đẩy tương tác/mua sắm mà không hứa hẹn sai sự thật.
   * Lưu ý: Cả 3 caption phải có nội dung hoàn chỉnh (từ mở đầu thu hút, thân bài đến kết bài), có độ dài vừa vặn (khoảng 150 - 450 từ mỗi bài), không lặp từ và đúng tông giọng đã chọn.

2. 03 TIÊU ĐỀ (HEADLINES):
   - headline_1: Tiêu đề nhấn mạnh lợi ích cốt lõi.
   - headline_2: Tiêu đề gắn với nhu cầu hoặc tình huống sử dụng thực tế.
   - headline_3: Tiêu đề gợi mở sự tò mò và thôi thúc hành động.
   * Lưu ý: Ngắn gọn, súc tích, ấn tượng, không giật tít câu view sai sự thật.

3. 05 HASHTAGS:
   - Đúng 05 hashtag liên quan trực tiếp đến tên sản phẩm, ngành hàng, tệp khách hàng và lối sống.
   - Bắt buộc bắt đầu bằng dấu #, viết liền không dấu hoặc có dấu liền nhau, không chứa khoảng trắng và không được trùng nhau.

Hãy trả về dữ liệu đúng theo JSON Schema được chỉ định."""
    return prompt


def build_single_regeneration_prompt(request: RegenerateRequest) -> str:
    """Build prompt for regenerating a single caption or headline."""
    tone_instruction = TONE_INSTRUCTIONS.get(request.tone, TONE_INSTRUCTIONS["youthful"])

    target_type = request.target_type
    target_id = request.target_id or ("caption_1" if target_type == "caption" else "headline_1")
    existing_content = request.existing_content or ""

    if target_type == "caption":
        approach_mapping = {
            "caption_1": ("benefit", "lợi ích thực tế và giá trị sử dụng"),
            "caption_2": ("emotional", "cảm xúc, phong cách sống và sự đồng cảm"),
            "caption_3": ("call_to_action", "kêu gọi hành động tự nhiên và thúc đẩy tương tác"),
        }
        approach_code, approach_desc = approach_mapping.get(
            target_id, ("benefit", "lợi ích thực tế")
        )

        prompt = f"""Hãy sáng tạo MỘT bài viết quảng cáo mới (Caption) thay thế cho nội dung cũ:

[THÔNG TIN SẢN PHẨM]
- Tên sản phẩm: {request.product_name}
- Mô tả & Lợi ích: {request.description}
- Khách hàng mục tiêu: {request.target_audience}
- Tông giọng yêu cầu: {request.tone}

[ĐỊNH HƯỚNG TÔNG GIỌNG]
{tone_instruction}

[YÊU CẦU LÀM MỚI RIÊNG LẺ]
- Phần tử cần làm mới: {target_id}
- Góc tiếp cận bắt buộc: {approach_code} ({approach_desc})
- Nội dung cũ cần thay thế: "{existing_content}"

YÊU CẦU QUAN TRỌNG:
- Tạo một phương án caption HOÀN TOÀN MỚI, không lặp lại ý tưởng và câu chữ của nội dung cũ.
- Viết bằng tiếng Việt tự nhiên, chuẩn xác, hấp dẫn theo đúng tông giọng và góc tiếp cận.
- Trả về đối tượng CaptionItem gồm id="{target_id}", approach="{approach_code}", content="Nội dung mới..."."""
        return prompt

    else:  # headline
        prompt = f"""Hãy sáng tạo MỘT tiêu đề quảng cáo mới (Headline) thay thế cho tiêu đề cũ:

[THÔNG TIN SẢN PHẨM]
- Tên sản phẩm: {request.product_name}
- Mô tả & Lợi ích: {request.description}
- Khách hàng mục tiêu: {request.target_audience}
- Tông giọng: {request.tone}

[YÊU CẦU LÀM MỚI TIÊU ĐỀ]
- Phần tử cần làm mới: {target_id}
- Tiêu đề cũ cần thay thế: "{existing_content}"

YÊU CẦU:
- Tiêu đề mới phải ấn tượng, ngắn gọn, phù hợp với sản phẩm và không lặp lại tiêu đề cũ.
- Trả về đối tượng HeadlineItem gồm id="{target_id}", content="Tiêu đề mới..."."""
        return prompt


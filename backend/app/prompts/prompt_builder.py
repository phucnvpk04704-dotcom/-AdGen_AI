"""Prompt Builder module for constructing prompts for Gemini AI."""

from app.schemas.generator import GenerationRequest
from app.schemas.regenerate import RegenerateRequest
from app.prompts.tone_prompts import TONE_INSTRUCTIONS


def build_generation_prompt(request: GenerationRequest) -> str:
    """Build optimized user prompt for full 3-3-5 advertising content generation."""
    tone_instruction = TONE_INSTRUCTIONS.get(request.tone, TONE_INSTRUCTIONS["youthful"])

    prompt = f"""Tạo bộ nội dung quảng cáo hoàn chỉnh cho sản phẩm sau:

[THÔNG TIN SẢN PHẨM]
- Tên sản phẩm: {request.product_name}
- Mô tả & Lợi ích: {request.description}
- Khách hàng mục tiêu: {request.target_audience}
- Tông giọng: {request.tone}

[ĐỊNH HƯỚNG TÔNG GIỌNG]
{tone_instruction}

[YÊU CẦU ĐẦU RA BẮT BUỘC (CẤU TRÚC 3-3-5)]
1. 03 BÀI VIẾT QUẢNG CÁO (CAPTIONS):
   - caption_1 (approach: "benefit"): Nhấn mạnh lợi ích thực tế và giá trị sử dụng.
   - caption_2 (approach: "emotional"): Kết nối cảm xúc, phong cách sống và sự đồng cảm.
   - caption_3 (approach: "call_to_action"): Kêu gọi hành động tự nhiên, thúc đẩy tương tác.
   * Yêu cầu: Độ dài 80 - 180 từ/bài, mở đầu ấn tượng, nội dung súc tích, lời kết, đúng tông giọng.

2. 03 TIÊU ĐỀ (HEADLINES):
   - headline_1: Tiêu đề lợi ích cốt lõi.
   - headline_2: Tiêu đề tình huống thực tế.
   - headline_3: Tiêu đề gợi mở, thôi thúc.
   * Yêu cầu: Ngắn gọn, thu hút, trung thực.

3. 05 HASHTAGS:
   - 05 hashtag độc nhất, liên quan trực tiếp, bắt đầu bằng '#', viết liền không khoảng trắng, ngắn gọn dưới 30 ký tự, không lặp lại từ."""
    return prompt


def build_single_regeneration_prompt(request: RegenerateRequest) -> str:
    """Build optimized prompt for regenerating a single caption or headline."""
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

        prompt = f"""Tạo một Caption quảng cáo mới thay thế nội dung cũ:

[THÔNG TIN SẢN PHẨM]
- Tên sản phẩm: {request.product_name}
- Mô tả & Lợi ích: {request.description}
- Khách hàng mục tiêu: {request.target_audience}
- Tông giọng: {request.tone}

[ĐỊNH HƯỚNG TÔNG GIỌNG]
{tone_instruction}

[YÊU CẦU LÀM MỚI]
- Mục tiêu: {target_id} (approach: "{approach_code}" - {approach_desc})
- Nội dung cũ cần thay thế: "{existing_content}"
- Viết một phương án HOÀN TOÀN MỚI, sáng tạo, không trùng lặp ý tưởng và câu chữ cũ, độ dài 80 - 180 từ."""
        return prompt

    else:  # headline
        prompt = f"""Tạo một Headline (tiêu đề) quảng cáo mới thay thế tiêu đề cũ:

[THÔNG TIN SẢN PHẨM]
- Tên sản phẩm: {request.product_name}
- Mô tả & Lợi ích: {request.description}
- Khách hàng mục tiêu: {request.target_audience}
- Tông giọng: {request.tone}

[YÊU CẦU LÀM MỚI]
- Mục tiêu: {target_id}
- Tiêu đề cũ cần thay thế: "{existing_content}"
- Viết mới đối tượng HeadlineItem ngắn gọn, ấn tượng, phù hợp sản phẩm, không trùng lặp tiêu đề cũ."""
        return prompt

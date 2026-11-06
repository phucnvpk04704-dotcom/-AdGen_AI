/**
 * Mock Content Generator Service for Phase 2 UI/UX Foundation.
 * Conforms strictly to the API contract defined in PROJECT_MASTER.md.
 * 
 * IMPORTANT: This module provides structured demo data for UI verification.
 * It is completely separated from future Gemini AI integration (Phase 3).
 */

const DEMO_COPY_VARIANTS = {
  youthful: {
    captions: [
      {
        id: 'cap-1',
        approach: 'Benefit-driven (Nhấn mạnh lợi ích thực tế)',
        text: '🔥 Năng lượng cả ngày dài cùng bạn! Giữ trọn độ nóng hổi của cà phê sáng đến 12 giờ hoặc độ mát lạnh sảng khoái của trà hoa quả buổi xế chiều. Thiết kế nhỏ gọn, lớp vỏ nhám hiện đại chống trơn trượt – chiếc bình giữ nhiệt này sinh ra để cùng bạn "cân" mọi deadline từ giảng đường đến văn phòng!',
      },
      {
        id: 'cap-2',
        approach: 'Emotional / Lifestyle (Cảm xúc & Phong cách sống)',
        text: '✨ Một ngụm nước mát lúc tan ca hay một ngụm trà ấm giữa tiết trời se lạnh – những điều nhỏ bé tạo nên ngày làm việc trọn vẹn. Hãy chăm sóc bản thân từ thói quen uống đủ nước mỗi ngày cùng phụ kiện tối giản, thanh lịch!',
      },
      {
        id: 'cap-3',
        approach: 'Call to Action (Thúc đẩy hành động)',
        text: '⚡ Đừng bỏ lỡ ưu đãi đặc quyền tuần này! Số lượng giới hạn cho phiên bản màu giới hạn cực trendy. Nhấn "Gửi tin nhắn" ngay để nhận mã giảm giá 15% và freeship toàn quốc hôm nay!',
      },
    ],
    headlines: [
      'Giữ Trọn Nhiệt Độ Yêu Thích Suốt 12 Giờ Liền',
      'Phong Cách Tối Giản – Tiện Lợi Đồng Hành Mọi Lúc',
      'Nâng Cấp Lối Sống Năng Động Cùng Phụ Kiện Chuẩn Gu',
    ],
    hashtags: [
      '#BinhGiuNhiet',
      '#GenZStyle',
      '#VanPhongTienLoi',
      '#SongChatMoiNgay',
      '#DealHotTuanNay',
    ],
  },
  funny: {
    captions: [
      {
        id: 'cap-1',
        approach: 'Benefit-driven (Nhấn mạnh lợi ích thực tế)',
        text: '☕ Trà sữa có thể nguội, người yêu có thể đổi thay, nhưng đá trong chiếc bình này thì 12 tiếng sau vẫn còn nguyên tảng! Inox 304 bao bền, nắp xoay bao kín – rơi từ bàn làm việc xuống cũng chỉ làm sếp giật mình chứ bình thì không hề hấn gì.',
      },
      {
        id: 'cap-2',
        approach: 'Emotional / Lifestyle (Cảm xúc & Phong cách sống)',
        text: '😂 Bí quyết để sống sót qua những cuộc họp dài 3 tiếng đồng hồ: một bình cà phê đượm vị thơm lừng đặt ngay trước mặt. Đồng nghiệp nhìn thèm thuồng, sếp nhìn tưởng chăm chỉ, còn bạn thì tỉnh táo 100%!',
      },
      {
        id: 'cap-3',
        approach: 'Call to Action (Thúc đẩy hành động)',
        text: '🛒 Đừng chần chừ nữa kẻo đứa bàn bên mua mất màu đẹp nhất! Bấm link bên dưới hoặc inbox ngay để rước em nó về dinh trước khi mùa nóng ập đến!',
      },
    ],
    headlines: [
      'Người Yêu Có Thể Lạnh Nhạt, Bình Này Thì Luôn Ấm Áp',
      'Uống Nước Cũng Phải Đẹp – Cân Mọi Áp Lực Công Việc',
      'Chống Buồn Ngủ Đỉnh Cao Cho Dân Văn Phòng',
    ],
    hashtags: [
      '#HaiHuocMoiNgay',
      '#BinhGiuNhietBaDao',
      '#DanVanPhongVuiVe',
      '#DoGiaDungThongMinh',
      '#DealHaiHuoc',
    ],
  },
  professional: {
    captions: [
      {
        id: 'cap-1',
        approach: 'Benefit-driven (Nhấn mạnh lợi ích thực tế)',
        text: '💼 Tối ưu hiệu suất làm việc với giải pháp bảo toàn nhiệt độ tối ưu. Sử dụng công nghệ chân không đa lớp kết hợp chất liệu Inox 304 tiêu chuẩn y tế, sản phẩm duy trì nhiệt độ ổn định trong suốt ngày làm việc dài, đảm bảo trọn vẹn hương vị và an toàn sức khỏe.',
      },
      {
        id: 'cap-2',
        approach: 'Emotional / Lifestyle (Cảm xúc & Phong cách sống)',
        text: '👔 Sự chỉn chu đến từ những chi tiết nhỏ nhất trong phong cách làm việc. Thiết kế nguyên khối tinh tế, đường nét công thái học chuẩn mực, đây không chỉ là vật dụng cá nhân mà còn khẳng định phong thái chuyên nghiệp trong từng buổi gặp gỡ đối tác.',
      },
      {
        id: 'cap-3',
        approach: 'Call to Action (Thúc đẩy hành động)',
        text: '🤝 Trải nghiệm tiêu chuẩn chất lượng cao cấp với chính sách bảo hành chính hãng 12 tháng. Quý khách vui lòng liên hệ hotline hoặc để lại thông tin để nhận tư vấn chi tiết từ đội ngũ chuyên viên.',
      },
    ],
    headlines: [
      'Giải Pháp Bảo Toàn Nhiệt Độ Tiêu Chuẩn Doanh Nhân',
      'Chất Liệu Inox 304 Cao Cấp – An Toàn Tuyệt Đối',
      'Khẳng Định Đẳng Cấp Chuyên Nghiệp Trong Từng Chi Tiết',
    ],
    hashtags: [
      '#DoanhNhanThanhDat',
      '#Inox304ChinhHang',
      '#PhongCachChuyenNghiep',
      '#ChatLuongCaoCap',
      '#GiaiPhapTienIch',
    ],
  },
};

// Single regeneration pool
const REGEN_CAPTION_POOL = [
  '🌟 Bạn đồng hành lý tưởng cho những ngày làm việc bận rộn! Công nghệ chân không kép giúp đồ uống giữ nhiệt bền bỉ, không đọng sương bề mặt và dễ dàng vệ sinh sau mỗi lần dùng.',
  '🎯 Đừng để sự gián đoạn làm giảm hiệu suất của bạn. Một bình nước ấm luôn sẵn sàng bên cạnh để duy trì sự tập trung tối đa suốt 8 tiếng công sở.',
  '🌿 Thân thiện với môi trường, loại bỏ hoàn toàn đồ nhựa dùng một lần. Lựa chọn văn minh và tiết kiệm cho cuộc sống hiện đại.',
];

const REGEN_HEADLINE_POOL = [
  'Bền Bỉ Vượt Thời Gian – Người Bạn Đồng Hành Đáng Tin Cậy',
  'Thiết Kế Tinh Giản, Tối Ưu Hóa Mọi Trải Nghiệm Uống',
  'Sự Tiện Nghi Hoàn Hảo Cho Không Gian Làm Việc Hiện Đại',
];

/**
 * Simulate AI content generation with realistic network delay.
 * @param {object} input
 * @returns {Promise<object>}
 */
export const generateMockContent = async (input) => {
  // Simulate AI processing latency (700ms - 1100ms)
  await new Promise((resolve) => setTimeout(resolve, 850));

  const toneKey = input.tone && DEMO_COPY_VARIANTS[input.tone] ? input.tone : 'youthful';
  const dataset = DEMO_COPY_VARIANTS[toneKey];

  return {
    success: true,
    isDemo: true,
    message: 'Tạo nội dung demo thành công (Dữ liệu mẫu Phase 2)',
    data: {
      captions: dataset.captions.map((c) => c.text),
      headlines: [...dataset.headlines],
      hashtags: [...dataset.hashtags],
    },
    meta: {
      product_name: input.product_name,
      tone: input.tone,
      generated_at: new Date().toISOString(),
    },
  };
};

/**
 * Simulate single item regeneration.
 * @param {'caption' | 'headline'} type
 * @param {number} index
 * @param {string} tone
 * @returns {Promise<string>}
 */
export const regenerateMockSingle = async (type, index, tone) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  if (type === 'caption') {
    const randomIdx = Math.floor(Math.random() * REGEN_CAPTION_POOL.length);
    return REGEN_CAPTION_POOL[randomIdx];
  } else {
    const randomIdx = Math.floor(Math.random() * REGEN_HEADLINE_POOL.length);
    return REGEN_HEADLINE_POOL[randomIdx];
  }
};

/**
 * Mock History dataset for previewing Phase 2 UI.
 */
export const MOCK_HISTORY_ITEMS = [
  {
    id: 'demo-hist-1',
    created_at: '2026-11-06T10:15:00Z',
    product_name: 'Bình giữ nhiệt Inox 304 LockStyle',
    description: 'Giữ nhiệt 12h, dung tích 500ml, nắp chống tràn, thép 304 không gỉ',
    target_audience: 'Sinh viên, nhân viên văn phòng',
    tone: 'youthful',
    preview_caption: '🔥 Năng lượng cả ngày dài cùng bạn! Giữ trọn độ nóng hổi của cà phê sáng đến 12 giờ...',
    result: {
      captions: DEMO_COPY_VARIANTS.youthful.captions.map((c) => c.text),
      headlines: DEMO_COPY_VARIANTS.youthful.headlines,
      hashtags: DEMO_COPY_VARIANTS.youthful.hashtags,
    },
  },
  {
    id: 'demo-hist-2',
    created_at: '2026-11-05T14:30:00Z',
    product_name: 'Bút ký cao cấp mạ vàng Regal',
    description: 'Bút dạ bi ngòi 0.5mm êm ái, thân kim loại mạ vàng sang trọng, kèm hộp quà',
    target_audience: 'Doanh nhân, quản lý, quà tặng đối tác',
    tone: 'professional',
    preview_caption: '💼 Tối ưu hiệu suất làm việc với nét chữ sắc nét, thể hiện sự chỉn chu và phong thái đẳng cấp...',
    result: {
      captions: DEMO_COPY_VARIANTS.professional.captions.map((c) => c.text),
      headlines: DEMO_COPY_VARIANTS.professional.headlines,
      hashtags: DEMO_COPY_VARIANTS.professional.hashtags,
    },
  },
  {
    id: 'demo-hist-3',
    created_at: '2026-11-04T09:00:00Z',
    product_name: 'Gối tựa lưng công thái học Comfy',
    description: 'Đệm cao su non êm ái, chống mỏi lưng cho dân văn phòng ngồi làm việc 8 tiếng',
    target_audience: 'Dân văn phòng, người ngồi làm việc nhiều',
    tone: 'funny',
    preview_caption: '😂 Cứu tinh cho những chiếc lưng "lục cục" tuổi 25! Ngồi làm việc 8 tiếng không lo đau lưng...',
    result: {
      captions: DEMO_COPY_VARIANTS.funny.captions.map((c) => c.text),
      headlines: DEMO_COPY_VARIANTS.funny.headlines,
      hashtags: DEMO_COPY_VARIANTS.funny.hashtags,
    },
  },
];


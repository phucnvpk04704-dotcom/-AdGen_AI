/**
 * Constants and Configuration for AdGen AI Frontend.
 * Follows PROJECT_MASTER.md specifications.
 */

// Tone configurations
export const TONE_OPTIONS = [
  {
    id: 'funny',
    label: 'Hài hước',
    tagline: 'Vui vẻ & Dí dỏm',
    description: 'Tạo tiếng cười tự nhiên, gần gũi, không gây phản cảm.',
    icon: '😄',
  },
  {
    id: 'professional',
    label: 'Trang trọng',
    tagline: 'Rõ ràng & Uy tín',
    description: 'Chuyên nghiệp, đáng tin cậy, nhấn mạnh chất lượng thực tế.',
    icon: '💼',
  },
  {
    id: 'youthful',
    label: 'Trẻ trung',
    tagline: 'Năng động & Hiện đại',
    description: 'Bắt trend, phù hợp với người trẻ, sinh viên và Gen Z.',
    icon: '⚡',
  },
];

// Validation limits
export const VALIDATION_LIMITS = {
  PRODUCT_NAME: {
    MIN: 2,
    MAX: 150,
  },
  DESCRIPTION: {
    MIN: 10,
    MAX: 1000,
  },
  TARGET_AUDIENCE: {
    MIN: 5,
    MAX: 250,
  },
};

// Storage Keys
export const STORAGE_KEYS = {
  HISTORY: 'adgen_ai_history',
};

// Platform character warning thresholds
export const CHARACTER_THRESHOLDS = {
  INSTAGRAM: 2200,
  FACEBOOK_RECOMMENDED: 250,
};

// Mock data for Phase 2 UI verification
export const MOCK_GENERATION_RESULT = {
  captions: [
    "🔥 Đừng để ngày làm việc trôi qua trong uể oải! Bình giữ nhiệt Inox 304 thế hệ mới giữ cà phê nóng hổi suốt 12 giờ hoặc nước ép mát lạnh cả ngày dài. Chất liệu thép không gỉ cao cấp, an toàn tuyệt đối cho sức khỏe, nhỏ gọn đồng hành cùng bạn từ bàn làm việc đến phòng tập gym. Trải nghiệm sự tiện lợi ngay hôm nay!",
    "☕ Mỗi sáng thức dậy cùng ly trà thơm ấm nóng nguyên vị như vừa pha. Chiếc bình giữ nhiệt nhỏ gọn không chỉ là một phụ kiện thời thượng trên bàn làm việc, mà còn là người bạn đồng hành chăm sóc sức khỏe của bạn trong từng ngụm nước.",
    "🚀 Ưu đãi có hạn dành riêng cho tháng này! Nâng cấp phong cách sống năng động cùng bình giữ nhiệt Inox 304 siêu nhẹ chống tràn. Nhắn tin ngay cho shop hoặc để lại bình luận để nhận ưu đãi giảm 20% cùng quà tặng độc quyền!",
  ],
  headlines: [
    "Bình Giữ Nhiệt Inox 304 – Giữ Trọn Hương Vị Cả Ngày",
    "Phong Cách Tối Giản, Tiện Lợi Bất Tận Cho Giới Trẻ",
    "Thức Uống Luôn Chuẩn Vị Với Công Nghệ Giữ Nhiệt 12 Giờ",
  ],
  hashtags: [
    "#BinhGiuNhiet",
    "#Inox304",
    "#VanPhongTienLoi",
    "#SongNangDong",
    "#DoGiaDungThongMinh",
  ],
};


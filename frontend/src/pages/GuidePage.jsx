import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  FileText,
  Sliders,
  Users,
  Smile,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Copy,
} from 'lucide-react';
import { Button } from '../components/common/Button';

export const GuidePage = () => {
  const navigate = useNavigate();

  const steps = [
    {
      step: '01',
      title: 'Nhập tên sản phẩm',
      desc: 'Điền tên sản phẩm cụ thể, ngắn gọn (ví dụ: "Bình giữ nhiệt Inox 304 LockStyle"). Tránh viết hoa toàn bộ hoặc thêm ký tự đặc biệt không cần thiết.',
      icon: FileText,
    },
    {
      step: '02',
      title: 'Mô tả đặc điểm & lợi ích nổi bật',
      desc: 'Nêu rõ công dụng, chất liệu, tính năng giải quyết vấn đề gì cho khách hàng. AI chỉ suy luận dựa trên dữ liệu thật bạn cung cấp, không tự bịa đặt.',
      icon: Sliders,
    },
    {
      step: '03',
      title: 'Xác định đối tượng khách hàng',
      desc: 'Làm rõ ai là người sẽ mua hoặc sử dụng sản phẩm (ví dụ: học sinh sinh viên, dân văn phòng, mẹ bỉm sữa, doanh nhân).',
      icon: Users,
    },
    {
      step: '04',
      title: 'Lựa chọn tông giọng phù hợp',
      desc: 'Chọn 1 trong 3 phong cách: Hài hước (funny) dí dỏm, Trang trọng (professional) uy tín, hoặc Trẻ trung (youthful) năng động.',
      icon: Smile,
    },
    {
      step: '05',
      title: 'Tạo, xem, sao chép & tinh chỉnh',
      desc: 'Nhận bộ kết quả chuẩn gồm 03 Caption, 03 Headline và 05 Hashtag. Dễ dàng sao chép từng mục bằng 1 cú nhấp hoặc tạo lại nếu muốn.',
      icon: Copy,
    },
  ];

  const tips = [
    'Mô tả càng chi tiết lợi ích, nội dung AI viết càng chạm đúng insight khách hàng.',
    'Dùng nút "Sao chép toàn bộ" để lưu nhanh bộ ý tưởng vào ghi chú cá nhân.',
    'Chú ý bộ đếm ký tự trên từng caption để chọn bài viết phù hợp với Instagram hay Facebook.',
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="pb-2 border-b border-border">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-burgundy/10 text-burgundy text-[11px] font-semibold mb-2">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Tài liệu hướng dẫn</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-charcoal tracking-tight">
          Hướng dẫn sử dụng AdGen AI
        </h1>
        <p className="mt-1 text-sm text-charcoal-muted leading-relaxed">
          Quy trình 5 bước tối ưu hóa nội dung quảng cáo với công nghệ AI thông minh.
        </p>
      </div>

      {/* Mandatory Caution Notice */}
      <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3.5">
        <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0 text-amber-800">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div className="text-xs sm:text-sm leading-relaxed">
          <h3 className="font-bold text-amber-950 mb-0.5">Lưu ý quan trọng về trách nhiệm nội dung</h3>
          <p>
            AI có thể tạo nội dung chưa chính xác. Người dùng cần kiểm tra thông tin, giá, chương trình khuyến mãi và các tuyên bố trước khi đăng tải lên mạng xã hội.
          </p>
        </div>
      </div>

      {/* 5 Steps Grid */}
      <div>
        <h2 className="text-lg font-bold text-charcoal mb-4 flex items-center gap-2">
          <span>Quy trình làm việc 5 bước</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="bg-white p-5 rounded-2xl border border-border shadow-xs hover:border-burgundy/30 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-bold text-burgundy bg-burgundy/10 px-2.5 py-1 rounded-lg">
                      Bước {item.step}
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-ivory flex items-center justify-center text-charcoal-muted border border-border">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="font-bold text-charcoal text-base mb-1.5">
                    {item.title}
                  </h3>
                  <p className="text-xs text-charcoal-muted leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}

          {/* Quick CTA Box */}
          <div className="bg-burgundy text-white p-6 rounded-2xl flex flex-col justify-between shadow-sm">
            <div>
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white mb-3">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-lg text-white mb-1">
                Sẵn sàng trải nghiệm?
              </h3>
              <p className="text-xs text-white/80 leading-relaxed">
                Tạo ngay bộ 3 caption, 3 headline và 5 hashtag đầu tiên của bạn chỉ trong vài giây.
              </p>
            </div>
            <div className="pt-4">
              <Button
                variant="outline"
                className="bg-white text-burgundy hover:bg-ivory border-none w-full"
                onClick={() => navigate('/generator')}
              >
                Bắt đầu tạo nội dung
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Pro Tips Section */}
      <div className="bg-white rounded-2xl border border-border p-6 shadow-xs">
        <h3 className="font-bold text-base text-charcoal mb-3 flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-burgundy" />
          <span>Bí quyết tạo nội dung bán hàng hiệu quả</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-charcoal-muted">
          {tips.map((tip, idx) => (
            <div key={idx} className="flex items-start gap-2.5 bg-ivory p-3.5 rounded-xl border border-border/60">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span className="leading-relaxed">{tip}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  Palette,
  Layers,
  History,
  FileEdit,
  Sliders,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '../components/common/Button';

export const HomePage = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: 'AI Content Generation',
      subtitle: 'Tạo nội dung quảng cáo bằng AI',
      desc: 'Tự động phân tích sản phẩm và sáng tạo nội dung bán hàng chuyên nghiệp, tiết kiệm tối đa thời gian cho shop.',
      icon: Sparkles,
    },
    {
      title: 'Multiple Writing Styles',
      subtitle: 'Đa dạng phong cách truyền thông',
      desc: 'Linh hoạt biến chuyển theo 3 tông giọng thực tế: Hài hước (dí dỏm), Trang trọng (uy tín) và Trẻ trung (năng động).',
      icon: Palette,
    },
    {
      title: 'Ready-to-use Content',
      subtitle: 'Bộ nội dung chuẩn 3-3-5',
      desc: 'Nhận ngay trọn bộ 03 Caption đa góc tiếp cận, 03 Headline bắt mắt và 05 Hashtag thịnh hành, sẵn sàng đăng bài ngay.',
      icon: Layers,
    },
    {
      title: 'Easy Content Management',
      subtitle: 'Lưu trữ & quản lý thông minh',
      desc: 'Tự động lưu lịch sử trên trình duyệt, dễ dàng xem lại, sao chép 1 cú nhấp hoặc nạp lại thông tin để sáng tạo tiếp.',
      icon: History,
    },
  ];

  const steps = [
    {
      step: '01',
      title: 'Nhập thông tin sản phẩm',
      desc: 'Cung cấp tên sản phẩm, đặc điểm nổi bật và lợi ích cốt lõi bạn muốn truyền tải đến khách hàng.',
      icon: FileEdit,
    },
    {
      step: '02',
      title: 'Chọn đối tượng và phong cách',
      desc: 'Xác định tệp khách hàng mục tiêu và lựa chọn 1 trong 3 tông giọng phù hợp nhất với thương hiệu của bạn.',
      icon: Sliders,
    },
    {
      step: '03',
      title: 'Nhận nội dung quảng cáo từ AI',
      desc: 'Chỉ sau vài giây, AI sẽ tạo bộ 3-3-5 hoàn chỉnh để bạn duyệt, sao chép hoặc tạo lại theo ý muốn.',
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-10 lg:space-y-12">
      {/* Khu vực 1 – Hero Section */}
      <section className="bg-white rounded-2xl sm:rounded-3xl border border-border p-5 sm:p-8 lg:p-12 shadow-xs relative overflow-hidden">
        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-burgundy/10 text-burgundy text-[11px] sm:text-xs font-bold mb-3 sm:mb-5">
            <Sparkles className="w-3.5 h-3.5 text-burgundy" />
            <span>AI Advertising Content Generator</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-charcoal tracking-tight leading-snug sm:leading-tight">
            Tạo nội dung quảng cáo chuyên nghiệp cùng <span className="text-burgundy">AdGen AI</span>
          </h1>

          <p className="mt-2.5 sm:mt-4 text-sm sm:text-base lg:text-lg text-charcoal-muted leading-relaxed">
            Biến thông tin sản phẩm thành bộ nội dung quảng cáo hấp dẫn, phù hợp với khách hàng mục tiêu chỉ trong vài giây.
          </p>

          <div className="mt-5 sm:mt-8 flex flex-col sm:flex-row gap-2.5 sm:gap-3.5">
            <Button
              variant="primary"
              size="lg"
              className="w-full sm:w-auto min-h-[46px] justify-center text-sm sm:text-base font-semibold"
              icon={<Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />}
              onClick={() => navigate('/generator')}
            >
              Bắt đầu tạo nội dung
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto min-h-[46px] justify-center text-sm sm:text-base font-medium"
              icon={<BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-charcoal" />}
              onClick={() => navigate('/guide')}
            >
              Khám phá cách sử dụng
            </Button>
          </div>
        </div>

        {/* Decorative background shape */}
        <div className="hidden lg:block absolute -right-16 -bottom-16 w-96 h-96 rounded-full bg-burgundy/5 pointer-events-none" />
      </section>

      {/* Khu vực 2 – Giá trị nổi bật (4 Feature Cards) */}
      <section className="space-y-3 sm:space-y-4">
        <div>
          <h2 className="text-lg sm:text-2xl font-bold text-charcoal tracking-tight">
            Giá trị nổi bật cho nhà bán hàng & marketer
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-muted mt-0.5 sm:mt-1">
            Được tối ưu hóa chuyên sâu cho quy trình sáng tạo quảng cáo mạng xã hội và sàn thương mại điện tử.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="bg-white p-4 sm:p-6 rounded-2xl border border-border shadow-xs hover:border-burgundy/40 hover:shadow-sm transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-burgundy/10 text-burgundy flex items-center justify-center font-bold mb-3 sm:mb-4">
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <h3 className="font-bold text-charcoal text-sm sm:text-base">
                    {feat.title}
                  </h3>
                  <p className="text-xs font-semibold text-burgundy mt-0.5">
                    {feat.subtitle}
                  </p>
                  <p className="text-xs text-charcoal-muted mt-1.5 sm:mt-2.5 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Khu vực 3 – Quy trình sử dụng (3 Bước đơn giản) */}
      <section className="space-y-3 sm:space-y-4">
        <div>
          <h2 className="text-lg sm:text-2xl font-bold text-charcoal tracking-tight">
            Quy trình tạo bài viết chỉ với 3 bước
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-muted mt-0.5 sm:mt-1">
            Không cần kỹ năng viết prompt phức tạp, giao diện trực quan hỗ trợ thao tác nhanh gọn.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-5">
          {steps.map((st, idx) => {
            const Icon = st.icon;
            return (
              <div
                key={idx}
                className="bg-white p-4 sm:p-6 rounded-2xl border border-border shadow-xs hover:border-burgundy/30 transition-all flex flex-col justify-between relative"
              >
                <div>
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <span className="text-xs font-mono font-bold text-burgundy bg-burgundy/10 px-2.5 py-1 rounded-lg">
                      Bước {st.step}
                    </span>
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-ivory flex items-center justify-center text-charcoal-muted border border-border">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="font-bold text-charcoal text-sm sm:text-base mb-1">
                    {st.title}
                  </h3>
                  <p className="text-xs text-charcoal-muted leading-relaxed">
                    {st.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Khu vực 4 – CTA cuối trang */}
      <section className="bg-gradient-to-r from-burgundy to-burgundy-hover text-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-12 shadow-md relative overflow-hidden text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-5 sm:gap-6">
        <div className="max-w-xl">
          <h2 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
            Sẵn sàng tạo nội dung quảng cáo hiệu quả hơn?
          </h2>
          <p className="text-white/80 text-xs sm:text-sm mt-1.5 sm:mt-2 leading-relaxed">
            Trải nghiệm ngay khả năng tự động hóa nội dung cùng AdGen AI để tăng tốc doanh số của bạn.
          </p>
        </div>

        <Button
          size="lg"
          variant="outline"
          className="w-full sm:w-auto min-h-[46px] justify-center bg-white text-burgundy hover:bg-ivory border-none shadow-sm flex-shrink-0 font-bold text-sm sm:text-base"
          icon={<ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-burgundy" />}
          onClick={() => navigate('/generator')}
        >
          Bắt đầu ngay
        </Button>
      </section>
    </div>
  );
};

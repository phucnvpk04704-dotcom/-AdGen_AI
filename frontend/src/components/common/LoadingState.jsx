import React, { useState, useEffect } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';

const HINTS = [
  'Hệ thống AI đang khởi tạo quy trình sáng tạo...',
  'AI đang phân tích insight sản phẩm và đối tượng khách hàng...',
  'Đang sáng tạo 03 Caption theo tông giọng đã chọn...',
  'Đang tạo 03 Headline thu hút và 05 Hashtag thịnh hành...',
  'Hệ thống tự động tối ưu hóa cấu trúc và định dạng...',
];

/**
 * AI Generation Loading State component.
 */
export const LoadingState = ({
  message = 'AI đang phân tích thông tin sản phẩm và sáng tạo nội dung...',
  subtext,
}) => {
  const [hintIndex, setHintIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setHintIndex((prev) => (prev + 1) % HINTS.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-6 sm:p-12 bg-white rounded-xl sm:rounded-2xl border border-border shadow-sm text-center">
      <div className="relative mb-5">
        <div className="w-16 h-16 rounded-2xl bg-burgundy/10 flex items-center justify-center text-burgundy">
          <Sparkles className="w-8 h-8 animate-pulse text-burgundy" />
        </div>
        <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow-sm">
          <Loader2 className="w-5 h-5 animate-spin text-burgundy" />
        </div>
      </div>
      <h3 className="text-base sm:text-lg font-bold text-charcoal tracking-tight">
        {message}
      </h3>
      <p className="text-xs sm:text-sm text-charcoal-muted mt-2 max-w-md transition-all duration-300">
        {subtext || HINTS[hintIndex]}
      </p>

      {/* Progress placeholder line */}
      <div className="w-48 h-1 bg-ivory-dark rounded-full overflow-hidden mt-6">
        <div className="w-full h-full bg-burgundy animate-pulse"></div>
      </div>
    </div>
  );
};


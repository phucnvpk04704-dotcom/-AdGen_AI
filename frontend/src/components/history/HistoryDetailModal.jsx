import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  Calendar,
  Layers,
  Heading,
  Hash,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Info,
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

const TONE_NAMES = {
  funny: 'Hài hước',
  professional: 'Trang trọng',
  youthful: 'Trẻ trung',
};

const APPROACH_LABELS = {
  benefit: 'Lợi ích thực tế',
  emotional: 'Cảm xúc & Lối sống',
  call_to_action: 'Kêu gọi hành động',
};

export const HistoryDetailModal = ({
  item,
  isOpen,
  onClose,
  onCopyNotice,
  onReuse,
}) => {
  const [copiedItem, setCopiedItem] = useState(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [showContext, setShowContext] = useState(false);

  if (!isOpen || !item) return null;

  const captions = item.captions || item.result?.captions || [];
  const headlines = item.headlines || item.result?.headlines || [];
  const hashtags = item.hashtags || item.result?.hashtags || [];

  const handleCopy = async (text, label, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItem(id);
      if (onCopyNotice) onCopyNotice(text, label);
      setTimeout(() => setCopiedItem(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleCopyAll = async () => {
    try {
      const formattedHeadlines = headlines.map((h, i) => {
        const text = typeof h === 'object' ? h?.content || '' : String(h);
        return `${i + 1}. ${text}`;
      });

      const formattedCaptions = captions.map((c, i) => {
        const text = typeof c === 'object' ? c?.content || '' : String(c);
        const approach = typeof c === 'object' && c?.approach ? ` (${APPROACH_LABELS[c.approach] || c.approach})` : '';
        return `[Caption ${i + 1}${approach}]\n${text}\n`;
      });

      const formattedHashtags = hashtags.map((t) => (t.startsWith('#') ? t : `#${t}`)).join(' ');

      const fullContent = [
        `=== ADGEN AI - LỊCH SỬ NỘI DUNG QUẢNG CÁO ===`,
        `Sản phẩm: ${item.product_name}`,
        `Tông giọng: ${TONE_NAMES[item.tone] || item.tone}`,
        `Thời gian tạo: ${new Date(item.created_at).toLocaleString('vi-VN')}`,
        '',
        `--- 03 TIÊU ĐỀ (HEADLINES) ---`,
        ...formattedHeadlines,
        '',
        `--- 03 BÀI VIẾT (CAPTIONS) ---`,
        ...formattedCaptions,
        `--- 05 HASHTAGS ---`,
        formattedHashtags,
      ].join('\n');

      await navigator.clipboard.writeText(fullContent);
      setCopiedAll(true);
      if (onCopyNotice) onCopyNotice(fullContent, 'toàn bộ bộ nội dung');
      setTimeout(() => setCopiedAll(false), 2000);
    } catch (err) {
      console.error('Failed to copy full bundle:', err);
    }
  };

  const formattedDate = new Date(item.created_at).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end sm:justify-center sm:items-center p-0 sm:p-4 bg-charcoal/60 backdrop-blur-xs transition-opacity animate-fade-in">
      {/* Backdrop click area for mobile top or desktop borders */}
      <div className="fixed inset-0 -z-10" onClick={onClose} aria-hidden="true" />

      <div className="bg-white rounded-t-3xl sm:rounded-2xl max-w-3xl w-full max-h-[92dvh] sm:max-h-[88vh] flex flex-col border border-border sm:shadow-2xl shadow-[0_-10px_35px_rgba(0,0,0,0.18)] overflow-hidden animate-slide-up sm:animate-scale-up">
        {/* Mobile Pull Handle Indicator */}
        <div className="sm:hidden pt-2.5 pb-1 flex justify-center bg-ivory/80 flex-shrink-0">
          <div className="w-12 h-1.5 bg-charcoal-muted/30 rounded-full" />
        </div>

        {/* Modal Sticky Header */}
        <div className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4 border-b border-border bg-ivory/80 backdrop-blur-sm sticky top-0 z-10 flex-shrink-0">
          <div className="min-w-0 pr-3">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h2 className="text-base sm:text-lg font-bold text-charcoal truncate max-w-[220px] sm:max-w-md">
                {item.product_name}
              </h2>
              <Badge variant="burgundy" size="sm">
                {TONE_NAMES[item.tone] || item.tone}
              </Badge>
            </div>
            <p className="text-[11px] sm:text-xs text-charcoal-muted flex items-center gap-1.5 truncate">
              <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
              <span>Được tạo: {formattedDate}</span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-11 h-11 sm:w-9 sm:h-9 text-charcoal-muted hover:text-charcoal rounded-xl hover:bg-ivory active:bg-border transition-colors flex items-center justify-center flex-shrink-0"
            title="Đóng modal"
            aria-label="Đóng"
          >
            <X className="w-5 h-5 sm:w-4 sm:h-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto overscroll-contain space-y-4 sm:space-y-6 text-sm flex-1">
          {/* Collapsible Product Context Box (Saves screen space on mobile) */}
          <div className="bg-ivory rounded-xl border border-border overflow-hidden transition-all">
            <button
              type="button"
              onClick={() => setShowContext(!showContext)}
              className="w-full px-3.5 py-2.5 flex items-center justify-between text-left hover:bg-ivory-dark/60 transition-colors"
            >
              <div className="flex items-center gap-2 min-w-0">
                <Info className="w-4 h-4 text-burgundy flex-shrink-0" />
                <span className="text-xs font-semibold text-charcoal">
                  Thông tin đầu vào ({item.product_name})
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs text-charcoal-muted font-medium flex-shrink-0">
                <span>{showContext ? 'Thu gọn' : 'Chi tiết'}</span>
                {showContext ? (
                  <ChevronUp className="w-4 h-4 text-charcoal-muted" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-charcoal-muted" />
                )}
              </div>
            </button>

            {showContext && (
              <div className="px-3.5 pb-3.5 pt-1 space-y-2 border-t border-border/60 text-xs">
                <div>
                  <span className="font-semibold text-charcoal block">Mô tả sản phẩm:</span>
                  <p className="text-charcoal-muted mt-0.5 leading-relaxed">{item.description}</p>
                </div>
                <div>
                  <span className="font-semibold text-charcoal block">Đối tượng khách hàng:</span>
                  <p className="text-charcoal-muted mt-0.5 leading-relaxed">{item.target_audience}</p>
                </div>
              </div>
            )}
          </div>

          {/* 3 Captions */}
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-charcoal flex items-center gap-2">
              <Layers className="w-4 h-4 text-burgundy" />
              <span>03 Bài viết quảng cáo (Captions)</span>
            </h3>
            <div className="space-y-3">
              {captions.map((caption, idx) => {
                const text = typeof caption === 'object' ? caption?.content || '' : String(caption);
                const approach = typeof caption === 'object' ? caption?.approach : null;
                const approachLabel = approach ? APPROACH_LABELS[approach] || approach : null;

                return (
                  <div
                    key={idx}
                    className="bg-white p-3.5 sm:p-4 rounded-xl border border-border hover:border-burgundy/30 transition-colors shadow-2xs"
                  >
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-border/60 gap-2 flex-wrap">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-xs font-bold text-burgundy">Caption {idx + 1}</span>
                        {approachLabel && (
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-ivory-dark text-charcoal-muted font-medium border border-border truncate max-w-[150px] sm:max-w-none">
                            {approachLabel}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 ml-auto">
                        <span className="text-[11px] text-charcoal-muted font-mono">
                          {text.length} ký tự
                        </span>
                        <button
                          onClick={() => handleCopy(text, `Caption ${idx + 1}`, `cap-${idx}`)}
                          className="inline-flex items-center gap-1 min-h-[36px] sm:min-h-[30px] px-2.5 py-1 rounded-lg text-xs font-semibold bg-ivory text-charcoal-muted hover:text-charcoal border border-border active:scale-95 transition-all"
                        >
                          {copiedItem === `cap-${idx}` ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-600 font-semibold">Đã chép</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Sao chép</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm leading-relaxed text-charcoal whitespace-pre-line break-words">
                      {text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3 Headlines */}
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-charcoal flex items-center gap-2">
              <Heading className="w-4 h-4 text-burgundy" />
              <span>03 Tiêu đề (Headlines)</span>
            </h3>
            <div className="space-y-2">
              {headlines.map((headline, idx) => {
                const text = typeof headline === 'object' ? headline?.content || '' : String(headline);
                return (
                  <div
                    key={idx}
                    className="flex items-start sm:items-center justify-between p-3 rounded-xl border border-border bg-white gap-2"
                  >
                    <span className="text-xs sm:text-sm font-semibold text-charcoal break-words whitespace-normal leading-snug flex-1">
                      {idx + 1}. {text}
                    </span>
                    <button
                      onClick={() => handleCopy(text, `Tiêu đề ${idx + 1}`, `hl-${idx}`)}
                      className="inline-flex items-center justify-center min-w-[36px] min-h-[36px] sm:min-w-[30px] sm:min-h-[30px] rounded-lg bg-ivory text-charcoal-muted hover:text-burgundy border border-border active:scale-95 transition-all flex-shrink-0 ml-1"
                      title="Sao chép tiêu đề"
                    >
                      {copiedItem === `hl-${idx}` ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 5 Hashtags */}
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-charcoal flex items-center gap-2">
              <Hash className="w-4 h-4 text-burgundy" />
              <span>05 Hashtag</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {hashtags.map((tag, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleCopy(tag, `Hashtag ${tag}`, `tag-${idx}`)}
                  className="cursor-pointer min-h-[36px] px-3 py-1.5 rounded-xl bg-ivory text-burgundy border border-border text-xs font-mono font-medium hover:bg-burgundy/10 active:scale-95 transition-all inline-flex items-center gap-1"
                  title="Nhấn để sao chép hashtag"
                >
                  {copiedItem === `tag-${idx}` ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Hash className="w-3.5 h-3.5 opacity-60" />
                  )}
                  <span>{tag.replace(/^#/, '')}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Sticky Footer / Action Bar with iOS Home Bar Safe Area */}
        <div className="p-3.5 sm:p-4 bg-white/95 sm:bg-ivory border-t border-border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3 sticky bottom-0 z-10 flex-shrink-0 pb-[calc(0.875rem+env(safe-area-inset-bottom,0px))] sm:pb-4 shadow-sm">
          <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
            {onReuse && (
              <Button
                variant="primary"
                size="md"
                onClick={() => onReuse(item)}
                icon={<Sparkles className="w-4 h-4" />}
                className="w-full sm:w-auto min-h-[44px] sm:min-h-[38px] font-semibold"
              >
                Dùng lại trên Generator
              </Button>
            )}
            <Button
              variant="outline"
              size="md"
              onClick={handleCopyAll}
              icon={copiedAll ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              className="w-full sm:w-auto min-h-[44px] sm:min-h-[38px]"
            >
              {copiedAll ? 'Đã sao chép tất cả' : 'Sao chép toàn bộ'}
            </Button>
          </div>

          <Button
            variant="outline"
            size="md"
            onClick={onClose}
            className="w-full sm:w-auto min-h-[44px] sm:min-h-[38px] text-charcoal-muted"
          >
            Đóng
          </Button>
        </div>
      </div>
    </div>
  );
};

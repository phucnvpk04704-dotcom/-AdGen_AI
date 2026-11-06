import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  Calendar,
  FileText,
  Hash,
  Layers,
  Heading,
  Sparkles,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/50 backdrop-blur-xs transition-opacity">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col border border-border shadow-2xl overflow-hidden animate-scale-up">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-border bg-ivory/50">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-lg font-bold text-charcoal">{item.product_name}</h2>
              <Badge variant="burgundy" size="sm">
                {TONE_NAMES[item.tone] || item.tone}
              </Badge>
            </div>
            <p className="text-xs text-charcoal-muted flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>Được tạo lúc: {formattedDate}</span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-charcoal-muted hover:text-charcoal rounded-lg hover:bg-ivory transition-colors"
            title="Đóng modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          {/* Product context box */}
          <div className="bg-ivory p-4 rounded-xl border border-border space-y-2">
            <div>
              <span className="text-xs font-semibold text-charcoal block">Mô tả sản phẩm:</span>
              <p className="text-xs text-charcoal-muted mt-0.5 leading-relaxed">{item.description}</p>
            </div>
            <div>
              <span className="text-xs font-semibold text-charcoal block">Đối tượng khách hàng:</span>
              <p className="text-xs text-charcoal-muted mt-0.5 leading-relaxed">{item.target_audience}</p>
            </div>
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
                    className="bg-white p-4 rounded-xl border border-border hover:border-burgundy/30 transition-colors"
                  >
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-border/60">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-burgundy">Caption {idx + 1}</span>
                        {approachLabel && (
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-ivory-dark text-charcoal-muted font-medium border border-border">
                            {approachLabel}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-charcoal-muted font-mono">
                          {text.length} ký tự
                        </span>
                        <button
                          onClick={() => handleCopy(text, `Caption ${idx + 1}`, `cap-${idx}`)}
                          className="inline-flex items-center gap-1 text-xs text-charcoal-muted hover:text-burgundy"
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
                    <p className="text-xs leading-relaxed text-charcoal whitespace-pre-line">{text}</p>
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
                    className="flex items-center justify-between p-3 rounded-xl border border-border bg-white"
                  >
                    <span className="text-xs font-semibold text-charcoal">
                      {idx + 1}. {text}
                    </span>
                    <button
                      onClick={() => handleCopy(text, `Tiêu đề ${idx + 1}`, `hl-${idx}`)}
                      className="inline-flex items-center gap-1 text-xs text-charcoal-muted hover:text-burgundy flex-shrink-0 ml-2"
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
                <span
                  key={idx}
                  onClick={() => handleCopy(tag, `Hashtag ${tag}`, `tag-${idx}`)}
                  className="cursor-pointer px-3 py-1 rounded-lg bg-ivory text-burgundy border border-border text-xs font-mono font-medium hover:bg-burgundy/10 transition-colors"
                  title="Nhấn để sao chép hashtag"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-ivory border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {onReuse && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => onReuse(item)}
                icon={<Sparkles className="w-3.5 h-3.5" />}
                className="w-full sm:w-auto"
              >
                Dùng lại trên Generator
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyAll}
              icon={copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              className="w-full sm:w-auto"
            >
              {copiedAll ? 'Đã sao chép tất cả' : 'Sao chép toàn bộ'}
            </Button>
          </div>

          <Button variant="outline" size="sm" onClick={onClose} className="w-full sm:w-auto">
            Đóng
          </Button>
        </div>
      </div>
    </div>
  );
};


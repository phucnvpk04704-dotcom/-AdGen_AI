import React, { useState } from 'react';
import { Copy, Check, RefreshCw } from 'lucide-react';

/**
 * Headline Card Component supporting both object and string formats.
 */
export const HeadlineCard = ({
  headline,
  index,
  onCopy,
  onRegenerate,
  isRegenerating = false,
}) => {
  const [copied, setCopied] = useState(false);

  const headlineText = typeof headline === 'string' ? headline : headline?.content || '';
  const headlineId = typeof headline === 'object' && headline?.id ? headline.id : `headline_${index + 1}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(headlineText);
      setCopied(true);
      if (onCopy) onCopy(headlineText, `Tiêu đề ${index + 1}`);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy headline:', err);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-border p-3.5 sm:p-4 shadow-xs hover:border-burgundy/30 transition-all flex items-start sm:items-center justify-between gap-2.5 sm:gap-3 group">
      <div className="flex items-start sm:items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
        <span className="w-6 h-6 rounded-md bg-ivory-dark text-charcoal-muted font-mono font-bold text-xs flex items-center justify-center flex-shrink-0 border border-border mt-0.5 sm:mt-0">
          {String(index + 1).padStart(2, '0')}
        </span>
        <h4 className="text-xs sm:text-sm font-semibold text-charcoal tracking-tight break-words whitespace-normal leading-snug">
          {headlineText}
        </h4>
      </div>

      <div className="flex items-center gap-1.5 flex-shrink-0">
        <button
          onClick={() => onRegenerate(index, headlineId, headlineText)}
          disabled={isRegenerating}
          title="Tạo lại riêng tiêu đề này"
          className="w-9 h-9 sm:w-8 sm:h-8 rounded-lg text-charcoal-muted hover:text-burgundy hover:bg-ivory border border-border transition-colors disabled:opacity-50 flex items-center justify-center active:bg-ivory-dark"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin text-burgundy' : ''}`}
          />
        </button>

        <button
          onClick={handleCopy}
          title="Sao chép tiêu đề"
          className={`inline-flex items-center gap-1 px-2.5 py-1.5 min-h-[36px] sm:min-h-[32px] rounded-lg text-xs font-semibold border transition-all active:scale-95 ${
            copied
              ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
              : 'bg-ivory text-charcoal-muted hover:text-charcoal hover:bg-ivory-dark border-border'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Đã chép</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sao chép</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

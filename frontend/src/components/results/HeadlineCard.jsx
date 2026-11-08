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
    <div className="bg-white rounded-xl border border-border px-3 py-2.5 sm:px-4 sm:py-3.5 shadow-xs hover:border-burgundy/30 transition-all flex items-center justify-between gap-2 sm:gap-3 group">
      <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1 mr-1 sm:mr-0">
        <span className="w-6 h-6 rounded-md bg-ivory-dark text-charcoal-muted font-mono font-bold text-xs flex items-center justify-center flex-shrink-0 border border-border">
          {String(index + 1).padStart(2, '0')}
        </span>
        <h4 className="text-xs sm:text-sm font-semibold text-charcoal tracking-tight break-words whitespace-normal leading-snug flex-1">
          {headlineText}
        </h4>
      </div>

      <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
        <button
          type="button"
          onClick={() => onRegenerate(index, headlineId, headlineText)}
          disabled={isRegenerating}
          title="Tạo lại riêng tiêu đề này"
          className="w-8 h-8 rounded-lg text-charcoal-muted hover:text-burgundy hover:bg-ivory border border-border transition-colors disabled:opacity-50 flex items-center justify-center active:bg-ivory-dark flex-shrink-0"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin text-burgundy' : ''}`}
          />
        </button>

        <button
          type="button"
          onClick={handleCopy}
          title="Sao chép tiêu đề"
          className={`inline-flex items-center justify-center gap-1 w-8 h-8 sm:w-auto sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-semibold border transition-all active:scale-95 flex-shrink-0 ${
            copied
              ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
              : 'bg-ivory text-charcoal-muted hover:text-charcoal hover:bg-ivory-dark border-border'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
              <span className="hidden sm:inline">Đã chép</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="hidden sm:inline">Sao chép</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

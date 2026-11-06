import React, { useState } from 'react';
import { Hash, Copy, Check } from 'lucide-react';
import { Button } from '../common/Button';

/**
 * Hashtags Group Component.
 */
export const HashtagGroup = ({ hashtags = [], onCopy }) => {
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const handleCopySingle = async (tag, idx) => {
    try {
      await navigator.clipboard.writeText(tag);
      setCopiedIndex(idx);
      if (onCopy) onCopy(tag, `Hashtag ${tag}`);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy hashtag:', err);
    }
  };

  const handleCopyAll = async () => {
    try {
      const allText = hashtags.join(' ');
      await navigator.clipboard.writeText(allText);
      setCopiedAll(true);
      if (onCopy) onCopy(allText, 'Tất cả 5 hashtag');
      setTimeout(() => setCopiedAll(false), 2000);
    } catch (err) {
      console.error('Failed to copy all hashtags:', err);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-border p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-3 border-b border-border/80">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-burgundy/10 text-burgundy flex items-center justify-center">
            <Hash className="w-3.5 h-3.5" />
          </div>
          <h4 className="text-sm font-bold text-charcoal">
            Bộ Hashtag đề xuất ({hashtags.length})
          </h4>
        </div>

        <Button
          size="sm"
          variant="outline"
          onClick={handleCopyAll}
          icon={
            copiedAll ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )
          }
        >
          {copiedAll ? 'Đã sao chép tất cả' : 'Sao chép tất cả'}
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {hashtags.map((tag, idx) => {
          const isCopied = copiedIndex === idx;

          return (
            <button
              key={idx}
              type="button"
              onClick={() => handleCopySingle(tag, idx)}
              title="Nhấn để sao chép hashtag này"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold font-mono transition-all duration-150 border ${
                isCopied
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300 ring-2 ring-emerald-200'
                  : 'bg-ivory text-burgundy border-border hover:bg-burgundy/10 hover:border-burgundy/30'
              }`}
            >
              {isCopied ? (
                <Check className="w-3 h-3 text-emerald-600" />
              ) : (
                <Hash className="w-3 h-3 opacity-60" />
              )}
              <span>{tag.replace(/^#/, '')}</span>
            </button>
          );
        })}
      </div>
      <p className="text-[11px] text-charcoal-muted mt-3">
        * Nhấn vào từng hashtag để sao chép nhanh hoặc sao chép toàn bộ bộ tag cùng lúc.
      </p>
    </div>
  );
};


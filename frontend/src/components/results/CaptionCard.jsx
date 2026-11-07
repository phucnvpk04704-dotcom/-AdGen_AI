import React, { useState } from 'react';
import { Copy, Check, RefreshCw } from 'lucide-react';
import { CharacterCounter } from '../common/CharacterCounter';
import { Badge } from '../common/Badge';

const CAPTION_APPROACH_LABELS = {
  benefit: 'Lợi ích thực tế (Benefit-driven)',
  emotional: 'Cảm xúc & Phong cách (Emotional / Lifestyle)',
  call_to_action: 'Thúc đẩy hành động (Call to Action)',
};

/**
 * Caption Card Component supporting both object and string formats.
 */
export const CaptionCard = ({
  caption,
  index,
  onCopy,
  onRegenerate,
  isRegenerating = false,
}) => {
  const [copied, setCopied] = useState(false);

  const captionText = typeof caption === 'string' ? caption : caption?.content || '';
  const captionId = typeof caption === 'object' && caption?.id ? caption.id : `caption_${index + 1}`;
  const approachKey = typeof caption === 'object' && caption?.approach ? caption.approach : null;
  const approachLabel =
    approachKey && CAPTION_APPROACH_LABELS[approachKey]
      ? CAPTION_APPROACH_LABELS[approachKey]
      : index === 0
      ? 'Lợi ích thực tế (Benefit-driven)'
      : index === 1
      ? 'Cảm xúc & Phong cách (Emotional / Lifestyle)'
      : 'Thúc đẩy hành động (Call to Action)';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(captionText);
      setCopied(true);
      if (onCopy) onCopy(captionText, `Caption ${index + 1}`);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy caption:', err);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-border p-4 sm:p-5 shadow-xs hover:border-burgundy/30 transition-all flex flex-col justify-between group">
      <div>
        {/* Card Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-border/80">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-burgundy/10 text-burgundy font-bold text-xs flex items-center justify-center font-mono flex-shrink-0">
              {String(index + 1).padStart(2, '0')}
            </span>
            <Badge variant="burgundy" size="sm">
              {approachLabel}
            </Badge>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onRegenerate(index, captionId, captionText)}
              disabled={isRegenerating}
              title="Tạo lại riêng caption này"
              className="w-9 h-9 sm:w-8 sm:h-8 rounded-lg text-charcoal-muted hover:text-burgundy hover:bg-ivory border border-border transition-colors disabled:opacity-50 flex items-center justify-center active:bg-ivory-dark"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin text-burgundy' : ''}`}
              />
            </button>

            <button
              onClick={handleCopy}
              title="Sao chép nội dung"
              className={`inline-flex items-center gap-1 px-3 py-1.5 min-h-[36px] sm:min-h-[32px] rounded-lg text-xs font-semibold border transition-all active:scale-95 ${
                copied
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : 'bg-ivory text-charcoal-muted hover:text-charcoal hover:bg-ivory-dark border-border'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Đã chép</span>
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

        {/* Caption Content */}
        <p className="text-sm text-charcoal leading-relaxed whitespace-pre-line font-normal break-words">
          {captionText}
        </p>
      </div>

      {/* Card Footer: Character Counter */}
      <div className="pt-3 mt-4 border-t border-border/60 flex items-center justify-between">
        <CharacterCounter text={captionText} threshold={2200} label="Instagram" />
      </div>
    </div>
  );
};

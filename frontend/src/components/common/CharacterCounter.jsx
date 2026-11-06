import React from 'react';
import { AlertCircle } from 'lucide-react';
import { CHARACTER_THRESHOLDS } from '../../utils/constants';
import { countUnicodeCharacters } from '../../utils/characterUtils';

export { countUnicodeCharacters };

/**
 * Character Counter with threshold alert.
 * @param {{ text: string, threshold?: number, label?: string }} props
 */
export const CharacterCounter = ({
  text = '',
  threshold = CHARACTER_THRESHOLDS.INSTAGRAM,
  label = 'Instagram',
}) => {
  const count = countUnicodeCharacters(text);
  const isOverThreshold = count > threshold;

  return (
    <div className="flex items-center gap-1.5 text-xs font-mono select-none">
      <span
        className={`font-semibold ${
          isOverThreshold ? 'text-rose-600' : 'text-charcoal'
        }`}
      >
        {count.toLocaleString()}
      </span>
      <span className="text-charcoal-muted">/</span>
      <span className="text-charcoal-muted">
        {threshold.toLocaleString()} ký tự
      </span>

      {isOverThreshold ? (
        <span className="ml-1 inline-flex items-center gap-1 text-[11px] font-sans px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200">
          <AlertCircle className="w-3 h-3 text-rose-600" />
          Vượt ngưỡng gợi ý {label}
        </span>
      ) : (
        <span className="text-[11px] font-sans text-charcoal-muted hidden sm:inline">
          (Ngưỡng gợi ý {label})
        </span>
      )}
    </div>
  );
};

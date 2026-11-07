import React from 'react';
import { Smile, Briefcase, Zap, Check } from 'lucide-react';

export const TONE_CONFIG = [
  {
    id: 'funny',
    name: 'Hài hước',
    tagline: 'Vui vẻ & Dí dỏm',
    description: 'Vui vẻ, dí dỏm, gần gũi, tạo tiếng cười tự nhiên.',
    icon: Smile,
  },
  {
    id: 'professional',
    name: 'Trang trọng',
    tagline: 'Rõ ràng & Uy tín',
    description: 'Chuyên nghiệp, đáng tin cậy, nhấn mạnh chất lượng thực tế.',
    icon: Briefcase,
  },
  {
    id: 'youthful',
    name: 'Trẻ trung',
    tagline: 'Năng động & Hiện đại',
    description: 'Năng động, hiện đại, bắt trend phù hợp với giới trẻ.',
    icon: Zap,
  },
];

/**
 * Tone of Voice selector component using Lucide icons.
 */
export const ToneSelector = ({ selectedTone, onSelectTone, disabled = false }) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-charcoal">
        Tông giọng nội dung <span className="text-burgundy">*</span>
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
        {TONE_CONFIG.map((tone) => {
          const isSelected = selectedTone === tone.id;
          const IconComponent = tone.icon;

          return (
            <button
              key={tone.id}
              type="button"
              disabled={disabled}
              onClick={() => onSelectTone(tone.id)}
              className={`p-3 sm:p-3.5 rounded-xl sm:rounded-2xl border text-left transition-all duration-200 relative flex sm:flex-col justify-between items-center sm:items-stretch gap-3 sm:gap-2 min-h-[52px] ${
                isSelected
                  ? 'border-burgundy bg-burgundy/5 ring-2 ring-burgundy/20 shadow-xs'
                  : 'border-border bg-white hover:border-burgundy/40 hover:bg-ivory'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <div className="flex items-center sm:justify-between gap-3 sm:gap-0 sm:w-full flex-1 sm:flex-none min-w-0">
                <div
                  className={`w-9 h-9 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                    isSelected
                      ? 'bg-burgundy text-white'
                      : 'bg-ivory text-charcoal-muted border border-border'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                </div>

                {/* Mobile horizontal layout info */}
                <div className="sm:hidden flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className={`font-bold text-sm ${isSelected ? 'text-burgundy' : 'text-charcoal'}`}>
                      {tone.name}
                    </p>
                    <span className="text-[11px] text-charcoal-muted font-normal truncate">• {tone.tagline}</span>
                  </div>
                  <p className="text-[11px] text-charcoal-muted truncate mt-0.5">
                    {tone.description}
                  </p>
                </div>

                {/* Desktop top-right check badge */}
                <div className="hidden sm:flex items-center justify-end">
                  {isSelected && (
                    <span className="w-5 h-5 rounded-full bg-burgundy text-white flex items-center justify-center text-xs">
                      <Check className="w-3 h-3" />
                    </span>
                  )}
                </div>
              </div>

              {/* Desktop text content */}
              <div className="hidden sm:block">
                <p
                  className={`font-bold text-sm ${
                    isSelected ? 'text-burgundy' : 'text-charcoal'
                  }`}
                >
                  {tone.name}
                </p>
                <p className="text-[11px] text-charcoal-muted mt-0.5 line-clamp-2 leading-relaxed">
                  {tone.description}
                </p>
              </div>

              {/* Mobile right checkmark / circle indicator */}
              <div className="sm:hidden flex-shrink-0">
                {isSelected ? (
                  <span className="w-5 h-5 rounded-full bg-burgundy text-white flex items-center justify-center text-xs">
                    <Check className="w-3 h-3" />
                  </span>
                ) : (
                  <span className="w-5 h-5 rounded-full border border-border" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {TONE_CONFIG.map((tone) => {
          const isSelected = selectedTone === tone.id;
          const IconComponent = tone.icon;

          return (
            <button
              key={tone.id}
              type="button"
              disabled={disabled}
              onClick={() => onSelectTone(tone.id)}
              className={`p-3.5 rounded-2xl border text-left transition-all duration-200 relative flex flex-col justify-between ${
                isSelected
                  ? 'border-burgundy bg-burgundy/5 ring-2 ring-burgundy/20 shadow-xs'
                  : 'border-border bg-white hover:border-burgundy/40 hover:bg-ivory'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <div className="flex items-center justify-between w-full mb-2">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                    isSelected
                      ? 'bg-burgundy text-white'
                      : 'bg-ivory text-charcoal-muted border border-border'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                </div>
                {isSelected && (
                  <span className="w-5 h-5 rounded-full bg-burgundy text-white flex items-center justify-center text-xs">
                    <Check className="w-3 h-3" />
                  </span>
                )}
              </div>

              <div>
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
            </button>
          );
        })}
      </div>
    </div>
  );
};

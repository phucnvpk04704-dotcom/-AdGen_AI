import React, { useState } from 'react';
import {
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  Layers,
  Heading,
  Hash,
  CheckCircle2,
} from 'lucide-react';
import { CaptionCard } from './CaptionCard';
import { HeadlineCard } from './HeadlineCard';
import { HashtagGroup } from './HashtagGroup';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

/**
 * Complete Results Display Section powered by Gemini AI.
 */
export const ResultsSection = ({
  results,
  onCopyNotice,
  onRegenerateSingle,
  onRegenerateAll,
  isRegeneratingAll = false,
  regeneratingItem = null, // { type: 'caption'|'headline', index: number }
  isLiveAI = true,
}) => {
  const [copiedFull, setCopiedFull] = useState(false);

  if (!results) return null;

  const { captions = [], headlines = [], hashtags = [] } = results;

  const handleCopyFullBundle = async () => {
    try {
      const formattedHeadlines = headlines.map((h, i) => {
        const text = typeof h === 'string' ? h : h?.content || '';
        return `${i + 1}. ${text}`;
      });

      const formattedCaptions = captions.map((c, i) => {
        const text = typeof c === 'string' ? c : c?.content || '';
        return `[Caption ${i + 1}]\n${text}\n`;
      });

      const fullContent = [
        '=== ADGEN AI - BỘ NỘI DUNG QUẢNG CÁO ===',
        '',
        '--- 03 TIÊU ĐỀ (HEADLINES) ---',
        ...formattedHeadlines,
        '',
        '--- 03 CAPTION QUẢNG CÁO ---',
        ...formattedCaptions,
        '--- 05 HASHTAGS ---',
        hashtags.join(' '),
      ].join('\n');

      await navigator.clipboard.writeText(fullContent);
      setCopiedFull(true);
      if (onCopyNotice) {
        onCopyNotice(fullContent, 'Toàn bộ nội dung quảng cáo');
      }
      setTimeout(() => setCopiedFull(false), 2000);
    } catch (err) {
      console.error('Failed to copy full content:', err);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Live AI Status Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-burgundy/5 border border-burgundy/20 text-xs">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-6 h-6 rounded-lg bg-burgundy text-white flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <span className="font-bold text-burgundy">Bộ nội dung hoàn chỉnh:</span>
            <span className="text-charcoal-muted ml-1.5 leading-relaxed">
              Đã tối ưu hóa cấu trúc tiêu chuẩn (03 Caption • 03 Headline • 05 Hashtag)
            </span>
          </div>
        </div>

        <Badge variant="success" size="sm" className="self-start sm:self-center flex-shrink-0" icon={<CheckCircle2 className="w-3 h-3 text-emerald-600" />}>
          Chuẩn 3-3-5
        </Badge>
      </div>

      {/* Main Results Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white rounded-2xl border border-border shadow-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-charcoal text-base">Bộ nội dung quảng cáo</span>
          <Badge variant="burgundy" size="sm">
            Ready to Publish
          </Badge>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            size="sm"
            variant="outline"
            onClick={onRegenerateAll}
            isLoading={isRegeneratingAll}
            icon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Tạo lại tất cả
          </Button>

          <Button
            size="sm"
            variant="primary"
            onClick={handleCopyFullBundle}
            icon={
              copiedFull ? (
                <Check className="w-3.5 h-3.5 text-white" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )
            }
          >
            {copiedFull ? 'Đã sao chép toàn bộ' : 'Sao chép toàn bộ'}
          </Button>
        </div>
      </div>

      {/* 1. Captions Area (03 items) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-burgundy" />
            <h3 className="font-bold text-sm text-charcoal tracking-tight">
              03 Bài viết quảng cáo (Captions)
            </h3>
          </div>
          <span className="text-xs text-charcoal-muted">Benefit • Emotional • Call to Action</span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {captions.map((caption, idx) => (
            <CaptionCard
              key={idx}
              caption={caption}
              index={idx}
              onCopy={onCopyNotice}
              onRegenerate={(index, targetId, text) =>
                onRegenerateSingle('caption', index, targetId, text)
              }
              isRegenerating={
                regeneratingItem?.type === 'caption' &&
                regeneratingItem?.index === idx
              }
            />
          ))}
        </div>
      </div>

      {/* 2. Headlines Area (03 items) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heading className="w-4 h-4 text-burgundy" />
            <h3 className="font-bold text-sm text-charcoal tracking-tight">
              03 Tiêu đề thu hút (Headlines)
            </h3>
          </div>
          <span className="text-xs text-charcoal-muted">3 góc nhìn giật tít đa chiều</span>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {headlines.map((headline, idx) => (
            <HeadlineCard
              key={idx}
              headline={headline}
              index={idx}
              onCopy={onCopyNotice}
              onRegenerate={(index, targetId, text) =>
                onRegenerateSingle('headline', index, targetId, text)
              }
              isRegenerating={
                regeneratingItem?.type === 'headline' &&
                regeneratingItem?.index === idx
              }
            />
          ))}
        </div>
      </div>

      {/* 3. Hashtags Area (05 items) */}
      <div>
        <HashtagGroup hashtags={hashtags} onCopy={onCopyNotice} />
      </div>
    </div>
  );
};

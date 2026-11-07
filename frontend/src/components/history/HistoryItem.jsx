import React from 'react';
import { Eye, Trash2, Calendar, Tag } from 'lucide-react';
import { Badge } from '../common/Badge';

const TONE_NAMES = {
  funny: 'Hài hước',
  professional: 'Trang trọng',
  youthful: 'Trẻ trung',
};

/**
 * Single History Item Card.
 */
export const HistoryItem = ({ item, onView, onDelete }) => {
  const formattedDate = new Date(item.created_at).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const captionCount = item.captions?.length || item.result?.captions?.length || 0;
  const headlineCount = item.headlines?.length || item.result?.headlines?.length || 0;
  const hashtagCount = item.hashtags?.length || item.result?.hashtags?.length || 0;

  const previewText =
    item.preview_caption ||
    (typeof item.captions?.[0] === 'object' ? item.captions[0]?.content : item.captions?.[0]) ||
    item.result?.captions?.[0] ||
    'Không có nội dung xem trước';

  return (
    <div className="bg-white rounded-2xl border border-border p-4 sm:p-5 shadow-xs hover:border-burgundy/40 hover:shadow-sm transition-all flex flex-col justify-between group">
      <div>
        {/* Header: Product name & Tone badge */}
        <div className="flex items-start justify-between gap-2.5 mb-2.5">
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-sm sm:text-base text-charcoal group-hover:text-burgundy transition-colors truncate">
              {item.product_name}
            </h3>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] sm:text-xs text-charcoal-muted">
              <Calendar className="w-3.5 h-3.5 text-charcoal-muted flex-shrink-0" />
              <span>{formattedDate}</span>
            </div>
          </div>

          <Badge variant="burgundy" size="sm" className="flex-shrink-0">
            {TONE_NAMES[item.tone] || item.tone}
          </Badge>
        </div>

        {/* Snippet Preview */}
        <p className="text-xs text-charcoal-muted line-clamp-2 leading-relaxed bg-ivory p-2.5 rounded-xl border border-border/60 break-words">
          {previewText}
        </p>
      </div>

      {/* Actions */}
      <div className="pt-3 mt-3.5 border-t border-border/80 flex items-center justify-between gap-2">
        <span className="text-[11px] text-charcoal-muted font-mono truncate">
          {captionCount}c • {headlineCount}h • {hashtagCount}t
        </span>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={() => onView(item)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[38px] sm:min-h-[32px] rounded-xl text-xs font-semibold text-charcoal hover:text-burgundy bg-ivory hover:bg-ivory-dark border border-border active:scale-95 transition-all"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Xem</span>
          </button>

          <button
            onClick={() => onDelete(item)}
            className="w-9.5 h-9.5 sm:w-8 sm:h-8 rounded-xl text-charcoal-muted hover:text-rose-600 hover:bg-rose-50 border border-border hover:border-rose-200 active:scale-95 transition-all flex items-center justify-center flex-shrink-0"
            title="Xóa bản ghi này"
            aria-label="Xóa"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};


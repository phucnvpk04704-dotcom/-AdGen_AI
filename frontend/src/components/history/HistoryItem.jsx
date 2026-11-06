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
    <div className="bg-white rounded-2xl border border-border p-5 shadow-xs hover:border-burgundy/40 hover:shadow-sm transition-all flex flex-col justify-between group">
      <div>
        {/* Header: Product name & Tone badge */}
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div>
            <h3 className="font-bold text-base text-charcoal group-hover:text-burgundy transition-colors line-clamp-1">
              {item.product_name}
            </h3>
            <div className="flex items-center gap-2 mt-1 text-xs text-charcoal-muted">
              <Calendar className="w-3.5 h-3.5 text-charcoal-muted" />
              <span>{formattedDate}</span>
            </div>
          </div>

          <Badge variant="burgundy" size="sm">
            {TONE_NAMES[item.tone] || item.tone}
          </Badge>
        </div>

        {/* Snippet Preview */}
        <p className="text-xs text-charcoal-muted line-clamp-2 leading-relaxed bg-ivory p-2.5 rounded-xl border border-border/60">
          {previewText}
        </p>
      </div>

      {/* Actions */}
      <div className="pt-3 mt-4 border-t border-border/80 flex items-center justify-between">
        <span className="text-[11px] text-charcoal-muted font-mono">
          {captionCount} captions • {headlineCount} headlines • {hashtagCount} hashtags
        </span>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onView(item)}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-charcoal hover:text-burgundy bg-ivory hover:bg-ivory-dark border border-border transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Xem</span>
          </button>

          <button
            onClick={() => onDelete(item)}
            className="p-1.5 rounded-lg text-charcoal-muted hover:text-rose-600 hover:bg-rose-50 border border-border hover:border-rose-200 transition-colors"
            title="Xóa bản ghi này"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};


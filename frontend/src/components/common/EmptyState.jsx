import React from 'react';
import { Inbox } from 'lucide-react';
import { Button } from './Button';

/**
 * Reusable Empty State component.
 */
export const EmptyState = ({
  icon = <Inbox className="w-10 h-10 text-charcoal-muted" />,
  title = 'Chưa có dữ liệu',
  description = 'Hiện tại chưa có thông tin nào được hiển thị.',
  actionLabel,
  onAction,
  actionIcon,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-white rounded-2xl border border-dashed border-border ${className}`}
    >
      <div className="w-16 h-16 rounded-2xl bg-ivory flex items-center justify-center mb-4 border border-border shadow-xs">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-charcoal">{title}</h3>
      <p className="text-sm text-charcoal-muted max-w-sm mt-1.5 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <div className="mt-6">
          <Button onClick={onAction} icon={actionIcon} variant="primary">
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
};


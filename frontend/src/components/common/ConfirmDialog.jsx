import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from './Button';

/**
 * Reusable Confirmation Dialog Modal.
 */
export const ConfirmDialog = ({
  isOpen,
  title = 'Xác nhận xóa',
  message = 'Bạn có chắc chắn muốn xóa bản ghi này? Thao tác này không thể hoàn tác.',
  confirmLabel = 'Xóa vĩnh viễn',
  cancelLabel = 'Hủy bỏ',
  onConfirm,
  onCancel,
  isLoading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/50 backdrop-blur-xs transition-opacity">
      <div className="bg-white rounded-2xl max-w-md w-full border border-border shadow-2xl overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-charcoal text-base">{title}</h3>
          </div>
          <button
            onClick={onCancel}
            className="text-charcoal-muted hover:text-charcoal p-1.5 rounded-lg hover:bg-ivory transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 text-sm text-charcoal-muted leading-relaxed">
          {message}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-4 bg-ivory border-t border-border">
          <Button variant="outline" size="sm" onClick={onCancel} disabled={isLoading}>
            {cancelLabel}
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};


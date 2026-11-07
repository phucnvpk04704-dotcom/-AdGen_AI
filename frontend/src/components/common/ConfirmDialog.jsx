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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/50 backdrop-blur-xs transition-opacity animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full border border-border shadow-2xl overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 flex-shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-charcoal text-base">{title}</h3>
          </div>
          <button
            onClick={onCancel}
            className="w-10 h-10 sm:w-8 sm:h-8 text-charcoal-muted hover:text-charcoal rounded-xl hover:bg-ivory active:bg-border transition-colors flex items-center justify-center flex-shrink-0"
            title="Đóng"
            aria-label="Đóng"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-5 text-sm text-charcoal-muted leading-relaxed">
          {message}
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-3 p-4 bg-ivory border-t border-border">
          <Button
            variant="outline"
            size="md"
            onClick={onCancel}
            disabled={isLoading}
            className="w-full sm:w-auto min-h-[44px] sm:min-h-[38px] justify-center"
          >
            {cancelLabel}
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={onConfirm}
            isLoading={isLoading}
            className="w-full sm:w-auto min-h-[44px] sm:min-h-[38px] justify-center font-semibold"
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};


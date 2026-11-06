import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

/**
 * Toast Notification using Lucide icons.
 */
export const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const bgStyles = {
    success: 'bg-emerald-700 text-white shadow-emerald-900/20',
    error: 'bg-rose-700 text-white shadow-rose-900/20',
    info: 'bg-charcoal text-white shadow-charcoal/20',
  };

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-200" />,
    error: <AlertCircle className="w-4 h-4 text-rose-200" />,
    info: <Info className="w-4 h-4 text-sky-200" />,
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 transition-all duration-300 ease-out">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-sm font-medium border border-white/10 ${
          bgStyles[type] || bgStyles.success
        }`}
      >
        <span className="flex-shrink-0">{icons[type]}</span>
        <span className="leading-snug">{message}</span>
        <button
          onClick={onClose}
          className="ml-2 text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          aria-label="Đóng"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

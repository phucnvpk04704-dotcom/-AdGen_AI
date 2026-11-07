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
    <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 left-4 sm:left-auto max-w-sm sm:max-w-md mx-auto sm:mx-0 z-50 transition-all duration-300 ease-out animate-slide-up sm:animate-fade-in pointer-events-none">
      <div
        className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-xl shadow-xl text-xs sm:text-sm font-medium border border-white/10 ${
          bgStyles[type] || bgStyles.success
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="flex-shrink-0">{icons[type]}</span>
          <span className="leading-snug break-words">{message}</span>
        </div>
        <button
          onClick={onClose}
          className="ml-2 text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors flex-shrink-0"
          aria-label="Đóng"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

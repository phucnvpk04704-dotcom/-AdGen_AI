import { useState, useCallback } from 'react';

/**
 * Hook to manage Toast state.
 */
export const useToast = () => {
  const [toast, setToast] = useState({
    message: '',
    type: 'success', // 'success' | 'error' | 'info'
  });

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
  }, []);

  const hideToast = useCallback(() => {
    setToast({ message: '', type: 'success' });
  }, []);

  return {
    toast,
    showToast,
    hideToast,
  };
};


import { useState, useEffect, useCallback } from 'react';
import { checkBackendHealth } from '../services/healthService';

/**
 * Custom hook to monitor Backend health state.
 */
export const useBackendHealth = () => {
  const [status, setStatus] = useState('checking'); // 'checking' | 'online' | 'offline'
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [latency, setLatency] = useState(null);
  const [lastChecked, setLastChecked] = useState(null);

  const performCheck = useCallback(async () => {
    setStatus('checking');
    setError(null);
    const startTime = performance.now();

    try {
      const result = await checkBackendHealth();
      const endTime = performance.now();
      setLatency(Math.round(endTime - startTime));
      setData(result);
      if (result && result.success) {
        setStatus('online');
      } else {
        setStatus('offline');
        setError(result?.message || 'Trạng thái phản hồi không hợp lệ');
      }
    } catch (err) {
      const endTime = performance.now();
      setLatency(Math.round(endTime - startTime));
      setData(null);
      setStatus('offline');
      setError(err?.message || 'Không thể kết nối đến Backend');
    } finally {
      setLastChecked(new Date());
    }
  }, []);

  useEffect(() => {
    performCheck();
  }, [performCheck]);

  return {
    status,
    data,
    error,
    latency,
    lastChecked,
    refetch: performCheck,
  };
};


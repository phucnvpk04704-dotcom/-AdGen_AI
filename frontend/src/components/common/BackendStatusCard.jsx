import React from 'react';
import { CheckCircle2, XCircle, RotateCw, Server, Activity } from 'lucide-react';
import { useBackendHealth } from '../../hooks/useBackendHealth';

export const BackendStatusCard = () => {
  const { status, data, error, latency, lastChecked, refetch } = useBackendHealth();
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

  const isOnline = status === 'online';
  const isOffline = status === 'offline';
  const isChecking = status === 'checking';

  return (
    <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-ivory-dark flex items-center justify-center text-charcoal border border-border">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-charcoal">
              Trạng thái kết nối Backend
            </h3>
            <p className="text-xs text-charcoal-muted mt-0.5">
              API Host: <code className="bg-ivory-dark px-1.5 py-0.5 rounded text-burgundy font-mono text-[11px]">{apiBaseUrl}/api/v1/health</code>
            </p>
          </div>
        </div>

        {/* Live Status Badge & Refetch Button */}
        <div className="flex items-center gap-2.5">
          <div
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              isOnline
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : isOffline
                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}
          >
            {isOnline ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            ) : isOffline ? (
              <XCircle className="w-3.5 h-3.5 text-rose-600" />
            ) : (
              <Activity className="w-3.5 h-3.5 text-amber-600 animate-spin" />
            )}
            <span>
              {isOnline && 'Backend Online'}
              {isOffline && 'Backend Offline'}
              {isChecking && 'Đang kiểm tra...'}
            </span>
          </div>

          <button
            onClick={refetch}
            disabled={isChecking}
            title="Kiểm tra lại kết nối"
            className="p-2 rounded-xl text-burgundy bg-burgundy/5 hover:bg-burgundy/10 disabled:opacity-50 border border-burgundy/20 transition-colors"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Details Box */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-charcoal-muted">
        <div className="bg-ivory p-3.5 rounded-xl border border-border/80">
          <span className="font-semibold text-charcoal block mb-1">Dữ liệu phản hồi thực tế:</span>
          {isChecking && <p className="italic text-charcoal-muted">Đang gửi GET request...</p>}
          {isOnline && data && (
            <div className="space-y-0.5 font-mono text-[11px] text-charcoal">
              <p><span className="text-charcoal-muted">status:</span> {data.status}</p>
              <p><span className="text-charcoal-muted">message:</span> {data.message}</p>
              <p><span className="text-charcoal-muted">gemini_status:</span> {data.gemini?.status || '---'}</p>
              <p><span className="text-charcoal-muted">gemini_model:</span> {data.gemini?.model || '---'}</p>
              {data.gemini?.fallback_model && (
                <p><span className="text-charcoal-muted">fallback_model:</span> {data.gemini.fallback_model}</p>
              )}
            </div>
          )}
          {isOffline && (
            <p className="text-rose-600 font-medium">
              {error || 'Không nhận được tín hiệu từ máy chủ Backend'}
            </p>
          )}
        </div>

        <div className="bg-ivory p-3.5 rounded-xl border border-border/80 flex flex-col justify-between">
          <div>
            <span className="font-semibold text-charcoal block mb-1">Thông số kỹ thuật:</span>
            <p>Độ trễ (Latency): <span className="font-mono text-charcoal">{latency !== null ? `${latency} ms` : '---'}</span></p>
            <p>Kiểm tra lúc: <span className="font-mono text-charcoal">{lastChecked ? lastChecked.toLocaleTimeString() : '---'}</span></p>
          </div>
          <p className="text-[11px] text-charcoal-muted mt-2">
            * Kiểm tra thực tế chu kỳ Axios &rarr; FastAPI Backend.
          </p>
        </div>
      </div>
    </div>
  );
};

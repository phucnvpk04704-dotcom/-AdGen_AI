import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { History, Sparkles, Inbox, Trash2, HardDrive } from 'lucide-react';
import { HistoryItem } from '../components/history/HistoryItem';
import { HistoryDetailModal } from '../components/history/HistoryDetailModal';
import { EmptyState } from '../components/common/EmptyState';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { Toast } from '../components/common/Toast';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { useToast } from '../hooks/useToast';
import {
  getHistory,
  deleteHistory,
  clearHistory,
} from '../services/historyService';

export const HistoryPage = () => {
  const navigate = useNavigate();
  const [historyItems, setHistoryItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isPromptClearAll, setIsPromptClearAll] = useState(false);
  const { toast, showToast, hideToast } = useToast();

  const loadHistoryData = () => {
    try {
      const items = getHistory();
      setHistoryItems(items);
    } catch (err) {
      console.error('Failed to load history items:', err);
      setHistoryItems([]);
    }
  };

  useEffect(() => {
    loadHistoryData();
  }, []);

  const handleOpenDetail = (item) => {
    setSelectedItem(item);
  };

  const handleCloseDetail = () => {
    setSelectedItem(null);
  };

  const handleReuseInGenerator = (item) => {
    handleCloseDetail();
    navigate('/generator', { state: { prefill: item } });
  };

  const handlePromptDelete = (item) => {
    setItemToDelete(item);
  };

  const handleConfirmDelete = () => {
    if (!itemToDelete) return;
    const success = deleteHistory(itemToDelete.id);
    if (success) {
      showToast(`Đã xóa bản ghi "${itemToDelete.product_name}" khỏi lịch sử`, 'success');
      loadHistoryData();
    } else {
      showToast('Không tìm thấy bản ghi để xóa', 'error');
    }
    setItemToDelete(null);
  };

  const handleConfirmClearAll = () => {
    clearHistory();
    showToast('Đã xóa toàn bộ lịch sử tạo nội dung', 'success');
    loadHistoryData();
    setIsPromptClearAll(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-burgundy/10 text-burgundy text-[11px] font-semibold mb-2">
            <History className="w-3.5 h-3.5" />
            <span>Bộ nhớ nội dung cá nhân</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-charcoal tracking-tight">
              Lịch sử tạo nội dung
            </h1>
            {historyItems.length > 0 && (
              <Badge variant="burgundy" size="md">
                {historyItems.length} bản ghi
              </Badge>
            )}
          </div>
          <p className="mt-1 text-sm text-charcoal-muted leading-relaxed">
            Xem lại, sao chép và tái sử dụng các bộ nội dung quảng cáo đã tạo.
          </p>
        </div>

        {/* Clear All Action */}
        {historyItems.length > 0 && (
          <div className="flex items-center gap-2 self-start sm:self-center">
            <button
              onClick={() => setIsPromptClearAll(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Xóa toàn bộ lịch sử</span>
            </button>
          </div>
        )}
      </div>

      {/* Storage Information Notice */}
      <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-ivory border border-border text-charcoal-muted text-xs">
        <HardDrive className="w-4 h-4 text-burgundy flex-shrink-0" />
        <div className="flex-1 leading-relaxed">
          Dữ liệu được lưu trữ an toàn và riêng tư trực tiếp trên thiết bị của bạn. Bạn có thể xem lại, sao chép hoặc xóa bất cứ lúc nào mà không lo thất lạc.
        </div>
      </div>

      {/* History Items List or Empty State */}
      {historyItems.length === 0 ? (
        <EmptyState
          icon={<Inbox className="w-10 h-10 text-charcoal-muted" />}
          title="Bạn chưa có nội dung nào trong lịch sử."
          description="Sau khi tạo nội dung quảng cáo thành công tại trang Generator, toàn bộ kết quả sẽ tự động được lưu trữ tại đây."
          actionLabel="Tạo nội dung đầu tiên"
          actionIcon={<Sparkles className="w-4 h-4" />}
          onAction={() => navigate('/generator')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {historyItems.map((item) => (
            <HistoryItem
              key={item.id}
              item={item}
              onView={handleOpenDetail}
              onDelete={handlePromptDelete}
            />
          ))}
        </div>
      )}

      {/* Detail Modal */}
      <HistoryDetailModal
        item={selectedItem}
        isOpen={Boolean(selectedItem)}
        onClose={handleCloseDetail}
        onReuse={handleReuseInGenerator}
        onCopyNotice={(text, label) =>
          showToast(`Đã sao chép ${label} vào clipboard!`, 'success')
        }
      />

      {/* Single Item Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(itemToDelete)}
        title="Xác nhận xóa bản ghi"
        message={`Bạn có chắc chắn muốn xóa bản ghi "${itemToDelete?.product_name}" khỏi danh sách lịch sử? Thao tác này sẽ không thể khôi phục.`}
        confirmLabel="Xóa bản ghi"
        cancelLabel="Giữ lại"
        onConfirm={handleConfirmDelete}
        onCancel={() => setItemToDelete(null)}
      />

      {/* Clear All Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isPromptClearAll}
        title="Xác nhận xóa toàn bộ lịch sử"
        message={`Bạn có chắc chắn muốn xóa tất cả ${historyItems.length} bản ghi khỏi lịch sử? Toàn bộ nội dung đã lưu trên trình duyệt này sẽ bị xóa vĩnh viễn.`}
        confirmLabel="Xóa tất cả"
        cancelLabel="Hủy bỏ"
        onConfirm={handleConfirmClearAll}
        onCancel={() => setIsPromptClearAll(false)}
      />

      {/* Toast Feedback */}
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={hideToast}
      />
    </div>
  );
};

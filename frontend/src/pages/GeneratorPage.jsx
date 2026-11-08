import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Sparkles, RotateCcw, AlertTriangle, X } from 'lucide-react';
import { ProductForm } from '../components/generator/ProductForm';
import { ResultsSection } from '../components/results/ResultsSection';
import { LoadingState } from '../components/common/LoadingState';
import { Toast } from '../components/common/Toast';
import { useToast } from '../hooks/useToast';
import {
  generateAdvertisingContent,
  regenerateAdvertisingContent,
} from '../services/generatorService';
import { saveHistory, updateHistoryItem } from '../services/historyService';

export const GeneratorPage = () => {
  const location = useLocation();
  const prefillData = location.state?.prefill;

  const [results, setResults] = useState(null);
  const [currentInput, setCurrentInput] = useState(null);
  const [currentHistoryId, setCurrentHistoryId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [generationError, setGenerationError] = useState(null);
  const [isRegeneratingAll, setIsRegeneratingAll] = useState(false);
  const [regeneratingItem, setRegeneratingItem] = useState(null); // { type, index }
  const [perfMetrics, setPerfMetrics] = useState(null);

  const { toast, showToast, hideToast } = useToast();

  const resultsRef = useRef(null);
  const hasSubmittedRef = useRef(false);

  // Smoothly scroll to results section only after user triggers generation and results arrive
  useEffect(() => {
    if (isLoading) {
      hasSubmittedRef.current = true;
    }
  }, [isLoading]);

  useEffect(() => {
    if (!isLoading && results && hasSubmittedRef.current && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [isLoading, results]);

  // Support query param for UI/UX alignment verification (?mock=loading, ?mock=results)
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const mock = searchParams.get('mock');
    if (mock === 'loading') {
      setIsLoading(true);
      setCurrentInput({
        product_name: 'Bình giữ nhiệt Inox 304 LockStyle',
        description: 'Khả năng giữ nhiệt nóng và lạnh bền bỉ suốt 12 giờ, thiết kế tối giản hiện đại chống tràn tuyệt đối, chất liệu thép Inox 304 an toàn thực phẩm, dung tích 500ml nhỏ gọn tiện mang theo mọi lúc.',
        target_audience: 'Sinh viên, nhân viên văn phòng, người trẻ năng động',
        tone: 'youthful',
      });
    } else if (mock === 'results') {
      setCurrentInput({
        product_name: 'Bình giữ nhiệt Inox 304 LockStyle',
        description: 'Khả năng giữ nhiệt nóng và lạnh bền bỉ suốt 12 giờ, thiết kế tối giản hiện đại chống tràn tuyệt đối, chất liệu thép Inox 304 an toàn thực phẩm, dung tích 500ml nhỏ gọn tiện mang theo mọi lúc.',
        target_audience: 'Sinh viên, nhân viên văn phòng, người trẻ năng động',
        tone: 'youthful',
      });
      setResults({
        captions: [
          {
            id: 'cap-1',
            approach: 'benefit',
            content: '🔥 Năng lượng cả ngày dài cùng bạn! Giữ trọn độ nóng hổi của cà phê sáng đến 12 giờ hoặc độ mát lạnh sảng khoái của trà hoa quả buổi xế chiều. Thiết kế nhỏ gọn, lớp vỏ nhám hiện đại chống trơn trượt – chiếc bình giữ nhiệt này sinh ra để cùng bạn "cân" mọi deadline từ giảng đường đến văn phòng!',
          },
          {
            id: 'cap-2',
            approach: 'emotional',
            content: '✨ Một ngụm nước mát lúc tan ca hay một ngụm trà ấm giữa tiết trời se lạnh – những điều nhỏ bé tạo nên ngày làm việc trọn vẹn. Hãy chăm sóc bản thân từ thói quen uống đủ nước mỗi ngày cùng phụ kiện tối giản, thanh lịch!',
          },
          {
            id: 'cap-3',
            approach: 'call_to_action',
            content: '⚡ Đừng bỏ lỡ ưu đãi đặc quyền tuần này! Số lượng giới hạn cho phiên bản màu giới hạn cực trendy. Nhấn "Gửi tin nhắn" ngay để nhận mã giảm giá 15% và freeship toàn quốc hôm nay!',
          },
        ],
        headlines: [
          { id: 'head-1', content: 'Xe máy VinFast hiện đại – Phong cách sống xanh thông minh' },
          { id: 'head-2', content: 'Khẳng định phong cách lịch lãm, làm chủ mọi hành trình cùng công nghệ pin đỉnh cao' },
          { id: 'head-3', content: 'Bạn đã sẵn sàng trải nghiệm công nghệ dẫn đầu ngay hôm nay?' },
        ],
        hashtags: [
          '#BinhGiuNhiet',
          '#GenZStyle',
          '#VanPhongTienLoi',
          '#SongChatMoiNgay',
          '#DealHotTuanNay',
        ],
      });
    }
  }, [location.search]);

  // Handle prefilled data from History Page
  useEffect(() => {
    if (prefillData) {
      setCurrentInput({
        product_name: prefillData.product_name || '',
        description: prefillData.description || '',
        target_audience: prefillData.target_audience || '',
        tone: prefillData.tone || 'youthful',
      });

      if (prefillData.captions && prefillData.captions.length > 0) {
        setResults({
          captions: prefillData.captions,
          headlines: prefillData.headlines,
          hashtags: prefillData.hashtags,
        });
        setCurrentHistoryId(prefillData.id);
      }
      showToast('Đã nạp thông tin từ Lịch sử vào Generator!', 'info');
    }
  }, [prefillData]);

  const handleGenerate = async (formData) => {
    if (isLoading || isRegeneratingAll || regeneratingItem) return;
    setIsLoading(true);
    setGenerationError(null);
    setCurrentInput(formData);
    const tStart = performance.now();

    try {
      const response = await generateAdvertisingContent(formData);
      const tEnd = performance.now();
      const frontendWaitMs = Math.round(tEnd - tStart);

      if (response && response.success && response.data) {
        setResults(response.data);
        setGenerationError(null);

        const metricsData = {
          frontend_waiting_ms: frontendWaitMs,
          backend_ms: response.metrics?.total_backend_ms,
          gemini_ms: response.metrics?.gemini_request_ms,
          model: response.metrics?.model || response.usage?.model,
          prompt_tokens: response.usage?.prompt_token_count,
          candidates_tokens: response.usage?.candidates_token_count,
        };
        setPerfMetrics(metricsData);

        // Automatically persist valid generation to LocalStorage
        try {
          const savedItem = saveHistory({
            ...formData,
            captions: response.data.captions,
            headlines: response.data.headlines,
            hashtags: response.data.hashtags,
            model: metricsData.model || 'AdGen AI Engine',
          });
          setCurrentHistoryId(savedItem.id);
        } catch (saveErr) {
          console.error('Failed to save to history:', saveErr);
        }

        const timeNotice = metricsData.gemini_ms
          ? ` (${(frontendWaitMs / 1000).toFixed(1)}s)`
          : '';
        showToast(`Tạo nội dung thành công!${timeNotice}`, 'success');
      } else {
        throw new Error(response?.message || 'Không thể tạo nội dung.');
      }
    } catch (error) {
      setGenerationError({
        title: 'Không thể kết nối đến hệ thống AI',
        message: 'Hệ thống đang bận hoặc gặp sự cố tạm thời. Vui lòng thử lại sau giây lát.',
      });
      showToast('Không thể kết nối đến hệ thống AI. Vui lòng thử lại sau.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerateSingle = async (type, index, targetId, existingContent) => {
    if (isLoading || isRegeneratingAll || regeneratingItem) return;
    if (!results || !currentInput) return;
    setRegeneratingItem({ type, index });

    try {
      const response = await regenerateAdvertisingContent({
        ...currentInput,
        target_type: type,
        target_id: targetId || (type === 'caption' ? `caption_${index + 1}` : `headline_${index + 1}`),
        existing_content: existingContent || '',
      });

      if (response && response.success && response.item) {
        let updatedCaptions = [...results.captions];
        let updatedHeadlines = [...results.headlines];

        if (type === 'caption') {
          updatedCaptions[index] = response.item;
          setResults((prev) => ({ ...prev, captions: updatedCaptions }));
          showToast(`Đã làm mới Caption ${index + 1} thành công!`, 'success');
        } else if (type === 'headline') {
          updatedHeadlines[index] = response.item;
          setResults((prev) => ({ ...prev, headlines: updatedHeadlines }));
          showToast(`Đã làm mới Tiêu đề ${index + 1} thành công!`, 'success');
        }

        // In-place update existing history record without creating duplicate entries
        if (currentHistoryId) {
          try {
            updateHistoryItem(currentHistoryId, {
              captions: updatedCaptions,
              headlines: updatedHeadlines,
              hashtags: results.hashtags,
            });
          } catch (updateErr) {
            console.error('Failed to update history item:', updateErr);
          }
        }
      } else {
        throw new Error(response?.message || 'Không thể làm mới nội dung.');
      }
    } catch (err) {
      showToast('Không thể kết nối đến hệ thống AI. Vui lòng thử lại sau.', 'error');
    } finally {
      setRegeneratingItem(null);
    }
  };

  const handleRegenerateAll = async () => {
    if (isLoading || isRegeneratingAll || regeneratingItem) return;
    if (!currentInput) return;
    setIsRegeneratingAll(true);
    const tStart = performance.now();

    try {
      const response = await regenerateAdvertisingContent({
        ...currentInput,
        target_type: 'all',
      });
      const tEnd = performance.now();
      const frontendWaitMs = Math.round(tEnd - tStart);

      if (response && response.success && response.data) {
        setResults(response.data);

        setPerfMetrics({
          frontend_waiting_ms: frontendWaitMs,
          backend_ms: response.metrics?.total_backend_ms,
          gemini_ms: response.metrics?.gemini_request_ms,
          model: response.metrics?.model || response.usage?.model,
          prompt_tokens: response.usage?.prompt_token_count,
          candidates_tokens: response.usage?.candidates_token_count,
        });

        // User requirement: When regenerating all content, save as a new generation record
        try {
          const newSaved = saveHistory({
            ...currentInput,
            captions: response.data.captions,
            headlines: response.data.headlines,
            hashtags: response.data.hashtags,
            model: response.metrics?.model || 'AdGen AI Engine',
          });
          setCurrentHistoryId(newSaved.id);
        } catch (saveErr) {
          console.error('Failed to save regenerated history:', saveErr);
        }

        showToast('Tạo nội dung thành công!', 'success');
      } else {
        throw new Error(response?.message || 'Không thể tạo lại bộ nội dung.');
      }
    } catch (err) {
      showToast('Không thể kết nối đến hệ thống AI. Vui lòng thử lại sau.', 'error');
    } finally {
      setIsRegeneratingAll(false);
    }
  };

  const handleCopyNotice = (text, label) => {
    showToast(`Đã sao chép ${label} vào clipboard!`, 'success');
  };

  const handleReset = () => {
    setResults(null);
    setCurrentInput(null);
    setCurrentHistoryId(null);
    setGenerationError(null);
    setPerfMetrics(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-5 sm:space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-3 border-b border-border">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-burgundy/10 text-burgundy text-[11px] font-semibold mb-1.5 sm:mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Advertising Generator</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-bold text-charcoal tracking-tight">
            Tạo nội dung quảng cáo
          </h1>
          <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-charcoal-muted leading-relaxed">
            Biến thông tin sản phẩm thành nội dung quảng cáo thu hút chỉ trong vài giây.
          </p>
        </div>

        {results && (
          <button
            onClick={handleReset}
            className="self-start sm:self-center inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[40px] rounded-xl text-xs font-semibold text-charcoal-muted hover:text-charcoal bg-white border border-border hover:bg-ivory transition-colors shadow-xs active:bg-ivory-dark"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Tạo sản phẩm mới</span>
          </button>
        )}
      </div>

      {/* Generation Error Banner with Retry Action */}
      {generationError && (
        <div className="p-3.5 sm:p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 animate-fade-in">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-rose-950 text-sm">
                {generationError.title || 'Không thể kết nối đến hệ thống AI'}
              </p>
              <p className="text-xs text-rose-800 mt-0.5 leading-relaxed">
                {generationError.message}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-stretch sm:self-center justify-end">
            {currentInput && (
              <button
                type="button"
                onClick={() => handleGenerate(currentInput)}
                disabled={isLoading}
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 min-h-[40px] rounded-xl text-xs font-semibold text-rose-800 bg-rose-100 hover:bg-rose-200 border border-rose-300 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Thử lại ngay</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setGenerationError(null)}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-rose-600 hover:bg-rose-100 transition-colors"
              title="Đóng thông báo"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 1. Form nhập thông tin sản phẩm */}
      <div className="w-full">
        <ProductForm
          onSubmit={handleGenerate}
          isLoading={isLoading}
          initialValues={currentInput}
        />
      </div>

      {/* 2. Khung trạng thái xử lý AI (xuất hiện ngay bên dưới Form trên cùng trục căn giữa) */}
      {isLoading && (
        <div className="w-full scroll-mt-24 animate-fade-in">
          <LoadingState
            message="Đang tạo nội dung..."
            subtext="AI đang sáng tạo chính xác 03 Caption, 03 Headline và 05 Hashtag theo tông giọng đã chọn..."
          />
        </div>
      )}

      {/* 3. Khung kết quả AI (xuất hiện bên dưới Form trên cùng trục căn giữa khi hoàn thành) */}
      {!isLoading && results && (
        <div ref={resultsRef} className="w-full scroll-mt-24 animate-fade-in">
          <ResultsSection
            results={results}
            onCopyNotice={handleCopyNotice}
            onRegenerateSingle={handleRegenerateSingle}
            onRegenerateAll={handleRegenerateAll}
            isRegeneratingAll={isRegeneratingAll}
            regeneratingItem={regeneratingItem}
            isLiveAI={true}
          />
        </div>
      )}

      {/* Toast Feedback */}
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={hideToast}
      />
    </div>
  );
};

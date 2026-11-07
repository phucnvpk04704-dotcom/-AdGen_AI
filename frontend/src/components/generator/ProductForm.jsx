import React, { useState } from 'react';
import { Sparkles, FileText, AlertCircle, HelpCircle } from 'lucide-react';
import { ToneSelector } from './ToneSelector';
import { Button } from '../common/Button';
import { VALIDATION_LIMITS } from '../../utils/constants';

/**
 * Product Input Form for Content Generation.
 */
export const ProductForm = ({ onSubmit, isLoading = false, initialValues = null }) => {
  const [formData, setFormData] = useState({
    product_name: initialValues?.product_name || '',
    description: initialValues?.description || '',
    target_audience: initialValues?.target_audience || '',
    tone: initialValues?.tone || 'youthful',
  });

  const [errors, setErrors] = useState({});

  React.useEffect(() => {
    if (initialValues) {
      setFormData({
        product_name: initialValues.product_name || '',
        description: initialValues.description || '',
        target_audience: initialValues.target_audience || '',
        tone: initialValues.tone || 'youthful',
      });
      setErrors({});
    }
  }, [initialValues]);

  const validate = () => {
    const newErrors = {};

    // 1. Tên sản phẩm
    const nameTrimmed = formData.product_name.trim();
    if (!nameTrimmed) {
      newErrors.product_name = 'Vui lòng nhập tên sản phẩm';
    } else if (nameTrimmed.length < VALIDATION_LIMITS.PRODUCT_NAME.MIN) {
      newErrors.product_name = `Tên sản phẩm cần tối thiểu ${VALIDATION_LIMITS.PRODUCT_NAME.MIN} ký tự`;
    } else if (nameTrimmed.length > VALIDATION_LIMITS.PRODUCT_NAME.MAX) {
      newErrors.product_name = `Tên sản phẩm không vượt quá ${VALIDATION_LIMITS.PRODUCT_NAME.MAX} ký tự`;
    }

    // 2. Mô tả sản phẩm
    const descTrimmed = formData.description.trim();
    if (!descTrimmed) {
      newErrors.description = 'Vui lòng nhập mô tả hoặc lợi ích nổi bật của sản phẩm';
    } else if (descTrimmed.length < VALIDATION_LIMITS.DESCRIPTION.MIN) {
      newErrors.description = `Mô tả cần tối thiểu ${VALIDATION_LIMITS.DESCRIPTION.MIN} ký tự để AI có đủ thông tin`;
    } else if (descTrimmed.length > VALIDATION_LIMITS.DESCRIPTION.MAX) {
      newErrors.description = `Mô tả không vượt quá ${VALIDATION_LIMITS.DESCRIPTION.MAX} ký tự`;
    }

    // 3. Đối tượng khách hàng
    const audienceTrimmed = formData.target_audience.trim();
    if (!audienceTrimmed) {
      newErrors.target_audience = 'Vui lòng xác định đối tượng khách hàng mục tiêu';
    } else if (audienceTrimmed.length < VALIDATION_LIMITS.TARGET_AUDIENCE.MIN) {
      newErrors.target_audience = `Đối tượng cần tối thiểu ${VALIDATION_LIMITS.TARGET_AUDIENCE.MIN} ký tự`;
    } else if (audienceTrimmed.length > VALIDATION_LIMITS.TARGET_AUDIENCE.MAX) {
      newErrors.target_audience = `Đối tượng không vượt quá ${VALIDATION_LIMITS.TARGET_AUDIENCE.MAX} ký tự`;
    }

    // 4. Tông giọng
    if (!['funny', 'professional', 'youthful'].includes(formData.tone)) {
      newErrors.tone = 'Vui lòng chọn 1 trong 3 tông giọng hợp lệ';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      product_name: formData.product_name.trim(),
      description: formData.description.trim(),
      target_audience: formData.target_audience.trim(),
      tone: formData.tone,
    });
  };

  const handleFillSample = () => {
    setFormData({
      product_name: 'Bình giữ nhiệt Inox 304 LockStyle',
      description: 'Khả năng giữ nhiệt nóng và lạnh bền bỉ suốt 12 giờ, thiết kế tối giản hiện đại chống tràn tuyệt đối, chất liệu thép Inox 304 an toàn thực phẩm, dung tích 500ml nhỏ gọn tiện mang theo mọi lúc.',
      target_audience: 'Sinh viên, nhân viên văn phòng, người trẻ năng động',
      tone: 'youthful',
    });
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-border p-4 sm:p-6 shadow-sm space-y-4 sm:space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-burgundy/10 text-burgundy flex items-center justify-center flex-shrink-0">
            <FileText className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h2 className="text-base font-bold text-charcoal">Thông tin sản phẩm</h2>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              Cung cấp dữ liệu chính xác để AI sáng tạo nội dung hiệu quả
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleFillSample}
          disabled={isLoading}
          className="self-start sm:self-center flex-shrink-0 text-xs font-semibold text-burgundy bg-burgundy/5 hover:bg-burgundy/10 px-3 py-1.5 min-h-[36px] rounded-lg border border-burgundy/20 transition-colors inline-flex items-center justify-center active:bg-burgundy/15"
        >
          Nạp dữ liệu mẫu
        </button>
      </div>

      {/* 1. Tên sản phẩm */}
      <div>
        <label className="block text-sm font-semibold text-charcoal mb-1">
          Tên sản phẩm <span className="text-burgundy">*</span>
        </label>
        <input
          type="text"
          value={formData.product_name}
          onChange={(e) => handleChange('product_name', e.target.value)}
          disabled={isLoading}
          placeholder="Ví dụ: Bình giữ nhiệt Inox cao cấp"
          className={`w-full px-3.5 sm:px-4 py-2.5 sm:py-2 rounded-xl border text-base sm:text-sm text-charcoal placeholder:text-charcoal-muted/50 focus:outline-none focus:ring-2 focus:ring-burgundy/20 focus:border-burgundy transition-colors ${
            errors.product_name ? 'border-rose-400 bg-rose-50/20' : 'border-border bg-white'
          }`}
        />
        {errors.product_name && (
          <p className="mt-1.5 flex items-center gap-1 text-xs text-rose-600 font-medium">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            {errors.product_name}
          </p>
        )}
      </div>

      {/* 2. Mô tả sản phẩm */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-sm font-semibold text-charcoal">
            Mô tả sản phẩm & Lợi ích <span className="text-burgundy">*</span>
          </label>
          <span className="text-[11px] text-charcoal-muted font-mono">
            {formData.description.length}/{VALIDATION_LIMITS.DESCRIPTION.MAX}
          </span>
        </div>
        <textarea
          rows={3}
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          disabled={isLoading}
          placeholder="Mô tả đặc điểm và lợi ích nổi bật của sản phẩm..."
          className={`w-full px-3.5 sm:px-4 py-2.5 sm:py-2 rounded-xl border text-base sm:text-sm text-charcoal placeholder:text-charcoal-muted/50 focus:outline-none focus:ring-2 focus:ring-burgundy/20 focus:border-burgundy transition-colors resize-none sm:rows-4 ${
            errors.description ? 'border-rose-400 bg-rose-50/20' : 'border-border bg-white'
          }`}
        />
        <div className="mt-1 flex items-start gap-1 text-[11px] text-charcoal-muted">
          <HelpCircle className="w-3.5 h-3.5 text-charcoal-muted flex-shrink-0 mt-0.5" />
          <span>Gợi ý: Nêu rõ công dụng, chất liệu, tính năng nổi bật hoặc ưu đãi để AI tạo nội dung chính xác.</span>
        </div>
        {errors.description && (
          <p className="mt-1 flex items-center gap-1 text-xs text-rose-600 font-medium">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            {errors.description}
          </p>
        )}
      </div>

      {/* 3. Đối tượng khách hàng */}
      <div>
        <label className="block text-sm font-semibold text-charcoal mb-1">
          Đối tượng khách hàng <span className="text-burgundy">*</span>
        </label>
        <input
          type="text"
          value={formData.target_audience}
          onChange={(e) => handleChange('target_audience', e.target.value)}
          disabled={isLoading}
          placeholder="Ví dụ: Sinh viên, nhân viên văn phòng, người trẻ"
          className={`w-full px-3.5 sm:px-4 py-2.5 sm:py-2 rounded-xl border text-base sm:text-sm text-charcoal placeholder:text-charcoal-muted/50 focus:outline-none focus:ring-2 focus:ring-burgundy/20 focus:border-burgundy transition-colors ${
            errors.target_audience ? 'border-rose-400 bg-rose-50/20' : 'border-border bg-white'
          }`}
        />
        {errors.target_audience && (
          <p className="mt-1.5 flex items-center gap-1 text-xs text-rose-600 font-medium">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            {errors.target_audience}
          </p>
        )}
      </div>

      {/* 4. Tông giọng */}
      <ToneSelector
        selectedTone={formData.tone}
        onSelectTone={(toneId) => handleChange('tone', toneId)}
        disabled={isLoading}
      />
      {errors.tone && (
        <p className="mt-1 flex items-center gap-1 text-xs text-rose-600 font-medium">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          {errors.tone}
        </p>
      )}

      {/* CTA Button */}
      <div className="pt-2">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          icon={<Sparkles className="w-5 h-5 text-white" />}
          className="w-full min-h-[48px] py-3.5 sm:py-3 text-base sm:text-sm font-semibold shadow-md active:scale-[0.99] transition-transform"
        >
          Tạo nội dung bằng AI
        </Button>
        <p className="text-center text-[11px] text-charcoal-muted mt-2">
          Chuẩn đầu ra: 03 Caption, 03 Headline, 05 Hashtag
        </p>
      </div>
    </form>
  );
};

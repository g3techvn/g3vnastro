import React, { useState, useEffect } from 'react';
import ModalBuyNowForm from '../../react/ModalBuyNowForm';
import { COMPANY_INFO } from '../../../constants';
import CTASkeleton from '../skeletons/CTASkeleton';

interface MobileCTASectionProps {
  product: any;
  variant?: 'primary' | 'secondary' | 'final';
  disableLoading?: boolean;
}

const MobileCTASection: React.FC<MobileCTASectionProps> = ({ product, variant = 'primary', disableLoading = false }) => {
  const [showBuyNowModal, setShowBuyNowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(!disableLoading);

  // Quick loading for CTA (only if loading not disabled)
  useEffect(() => {
    if (!disableLoading) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [disableLoading]);

  if (isLoading && !disableLoading) {
    return <CTASkeleton variant={variant} />;
  }

  // Function to open buy now modal
  const handleBuyNow = () => {
    setShowBuyNowModal(true);
  };

  // Function to open Zalo chat
  const handleZaloChat = () => {
    window.open(COMPANY_INFO.zalo, '_blank');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const hasDiscount = product?.original_price && product.original_price > (product?.price || 0);
  const discountPercent = hasDiscount 
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  const ctaVariants = {
    primary: {
      title: '🎯 Đặt hàng ngay - Nhận ưu đãi đặc biệt',
      subtitle: 'Giao hàng trong 24h tại Hà Nội & TP.HCM',
      buttonText: 'Đặt hàng ngay',
      buttonColor: 'from-red-500 to-red-600',
      benefits: ['🚚 Giao hàng 24h', '🔧 Miễn phí lắp đặt', '🛡️ Bảo hành 12 tháng']
    },
    secondary: {
      title: '💡 Đừng bỏ lỡ cơ hội sở hữu',
      subtitle: 'Hàng ngàn khách hàng đã tin tưởng lựa chọn',
      buttonText: 'Thêm vào giỏ hàng',
      buttonColor: 'from-green-500 to-green-600',
      benefits: ['✅ Chất lượng đảm bảo', '💰 Giá tốt nhất', '🎁 Quà tặng kèm']
    },
    final: {
      title: '🔥 Quyết định ngay hôm nay!',
      subtitle: 'Đầu tư cho sức khỏe - Tiết kiệm chi phí y tế',
      buttonText: 'Mua ngay - Ưu đãi cuối cùng',
      buttonColor: 'from-orange-500 to-red-500',
      benefits: ['⚡ Khuyến mãi có hạn', '🎯 Số lượng giới hạn', '💎 Chất lượng premium']
    }
  };

  const currentVariant = ctaVariants[variant];

  return (
    <div className="bg-white mb-2 border-2 border-red-200 rounded-lg overflow-hidden">
      {/* Header */}
      <div className={`bg-gradient-to-r ${currentVariant.buttonColor} text-white p-4`}>
        <h3 className="text-lg font-bold mb-1">{currentVariant.title}</h3>
        <p className="text-white/90 text-sm">{currentVariant.subtitle}</p>
      </div>

      <div className="p-4">
        {/* Price Display */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Giá sản phẩm:</span>
            {hasDiscount && (
              <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-bold">
                Giảm {discountPercent}%
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-red-600">
              {formatPrice(product?.price || 0)}
            </span>
            {hasDiscount && (
              <span className="text-lg text-gray-500 line-through">
                {formatPrice(product.original_price)}
              </span>
            )}
          </div>

          {hasDiscount && (
            <div className="text-sm text-green-600 font-medium mt-1">
              Tiết kiệm: {formatPrice(product.original_price - product.price)}
            </div>
          )}
        </div>

        {/* Quantity Selector - REMOVED (available in modal) */}

        {/* Benefits */}
        <div className="grid grid-cols-1 gap-2 mb-4">
          {currentVariant.benefits.map((benefit, index) => (
            <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
              <span>{benefit}</span>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="space-y-3">
          <button 
            onClick={handleBuyNow}
            className={`w-full bg-gradient-to-r ${currentVariant.buttonColor} text-white py-4 rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 button-press animate-pulse-slow animate-glow`}
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              {currentVariant.buttonText}
            </span>
          </button>
          
          {variant !== 'final' && (
            <button 
              onClick={handleZaloChat}
              className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-all duration-200 button-press hover-lift"
            >
              <span className="flex items-center justify-center gap-2">
                <span className="animate-bounce">💬</span>
                Tư vấn miễn phí
              </span>
            </button>
          )}
        </div>

        {/* Trust Signals */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-center gap-4 text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
              </svg>
              <span>Thanh toán an toàn</span>
            </div>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span>Cam kết chất lượng</span>
            </div>
          </div>
        </div>

        {/* Urgency Message */}
        {variant === 'final' && (
          <div className="mt-4 bg-orange-50 border border-orange-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-orange-700">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
              </svg>
              <div className="text-sm">
                <div className="font-semibold">⏰ Ưu đãi kết thúc trong hôm nay!</div>
                <div className="text-xs">Không упустите cơ hội sở hữu với giá tốt nhất</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Buy Now Modal */}
      <ModalBuyNowForm
        open={showBuyNowModal}
        onClose={() => setShowBuyNowModal(false)}
        product={{
          name: product?.name || '',
          price: product?.price || 0,
          image_url: product?.image_url || '',
          original_price: product?.original_price || 0,
        }}
      />
    </div>
  );
};

export default MobileCTASection;
import React, { useState, useEffect } from 'react';

interface MobileProductHeroProps {
  product: any;
  availability?: string;
}

const MobileProductHero: React.FC<MobileProductHeroProps> = ({ product, availability = 'in_stock' }) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 45,
    seconds: 30
  });

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const hasDiscount = product?.original_price && product.original_price > (product?.price || 0);
  const discountPercent = hasDiscount 
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  // Get availability display info
  const getAvailabilityInfo = (availability: string) => {
    switch (availability) {
      case 'in_stock':
        return {
          text: 'Còn hàng',
          bgColor: 'bg-green-500',
          icon: '✓'
        };
      case 'limited_availability':
        return {
          text: 'Sắp hết hàng',
          bgColor: 'bg-orange-500',
          icon: '⚠'
        };
      case 'out_of_stock':
        return {
          text: 'Hết hàng',
          bgColor: 'bg-red-700',
          icon: '✗'
        };
      default:
        return {
          text: 'Còn hàng',
          bgColor: 'bg-green-500',
          icon: '✓'
        };
    }
  };

  const availabilityInfo = getAvailabilityInfo(availability);

  return (
    <div className="bg-gradient-to-br from-red-600 via-red-500 to-orange-500 text-white relative overflow-hidden animate-gradient">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16 animate-float"></div>
        <div className="absolute bottom-0 right-0 w-24 h-24 bg-white rounded-full translate-x-12 translate-y-12 animate-float" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative px-4 py-6 fade-in-on-scroll">
        {/* Badges Row */}
        <div className="flex flex-wrap gap-2 mb-4">
          {/* Availability Badge */}
          <div className={`${availabilityInfo.bgColor} text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 animate-bounce-in animate-stagger-1 hover-scale`}>
            <span>{availabilityInfo.icon}</span>
            {availabilityInfo.text.toUpperCase()}
          </div>
          
          <div className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 animate-bounce-in animate-stagger-2 hover-scale">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            BESTSELLER
          </div>
          
          {hasDiscount && (
            <div className="bg-green-400 text-green-900 px-3 py-1 rounded-full text-xs font-bold animate-bounce-in animate-stagger-3 hover-scale animate-pulse-slow">
              GIẢM {discountPercent}%
            </div>
          )}
          
          <div className="bg-blue-400 text-blue-900 px-3 py-1 rounded-full text-xs font-bold animate-bounce-in animate-stagger-4 hover-scale">
            MIỄN PHÍ SHIP
          </div>
        </div>

        {/* Main Value Proposition */}
        <div className="mb-4">
          <h1 className="text-xl font-bold mb-2 leading-tight animate-fade-in-up animate-stagger-1">
            {product?.name || 'Sản phẩm chất lượng cao'}
          </h1>
          
          {/* Price Display */}
          <div className="mb-3 animate-scale-in animate-stagger-2">
            <div className="flex items-center gap-3 mb-1">
              <span className="text-2xl font-bold text-white animate-glow">
                {product?.price ? new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND',
                  minimumFractionDigits: 0,
                }).format(product.price) : 'Liên hệ'}
              </span>
              {hasDiscount && (
                <span className="text-lg text-white/70 line-through animate-fade-in animate-stagger-3">
                  {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                    minimumFractionDigits: 0,
                  }).format(product.original_price)}
                </span>
              )}
            </div>
            {hasDiscount && (
              <div className="text-sm text-yellow-300 font-medium animate-bounce-in animate-stagger-4">
                Tiết kiệm: {new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND',
                  minimumFractionDigits: 0,
                }).format(product.original_price - product.price)}
              </div>
            )}
          </div>

          <p className="text-white/90 text-sm leading-relaxed">
            ✨ Thiết kế ergonomic chuẩn quốc tế<br/>
            🏥 Được bác sĩ khuyên dùng cho dân văn phòng<br/>
            💪 Giảm 90% đau lưng khi ngồi lâu
          </p>
        </div>

        {/* Flash Sale Countdown */}
        {hasDiscount && (
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">⚡ Flash Sale kết thúc sau:</span>
              <span className="text-xs bg-white/20 px-2 py-1 rounded">Số lượng có hạn</span>
            </div>
            <div className="flex gap-2">
              <div className="bg-white text-red-600 rounded px-2 py-1 min-w-[40px] text-center">
                <div className="text-lg font-bold">{timeLeft.hours.toString().padStart(2, '0')}</div>
                <div className="text-xs">Giờ</div>
              </div>
              <div className="flex items-center text-white">:</div>
              <div className="bg-white text-red-600 rounded px-2 py-1 min-w-[40px] text-center">
                <div className="text-lg font-bold">{timeLeft.minutes.toString().padStart(2, '0')}</div>
                <div className="text-xs">Phút</div>
              </div>
              <div className="flex items-center text-white">:</div>
              <div className="bg-white text-red-600 rounded px-2 py-1 min-w-[40px] text-center">
                <div className="text-lg font-bold">{timeLeft.seconds.toString().padStart(2, '0')}</div>
                <div className="text-xs">Giây</div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Benefits */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
            <div className="text-2xl mb-1">🚚</div>
            <div className="text-xs font-medium">Giao hàng 24h</div>
            <div className="text-xs text-white/80">Nội thành HN, HCM</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
            <div className="text-2xl mb-1">🔧</div>
            <div className="text-xs font-medium">Miễn phí lắp đặt</div>
            <div className="text-xs text-white/80">HN & HCM</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileProductHero;
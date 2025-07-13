import React from 'react';
import type { Product } from '../../../types/Product';

interface MobileProductPriceProps {
  product: Product;
  soldCount?: number;
}

export default function MobileProductPrice({ product, soldCount = 0 }: MobileProductPriceProps) {
  // Format currency
  const formatCurrency = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Calculate discount percentage
  const discountPercentage = product.original_price && product.price 
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  // Get brand name
  const brandName = typeof product.brand === 'string' 
    ? product.brand 
    : product.brand?.title || 'G3 - TECH';

  return (
    <div className="bg-white p-4 space-y-3 md:hidden">
      {/* Price Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold text-red-600">
            {product.price ? formatCurrency(product.price) : 'Liên hệ'}
          </span>
          {product.original_price && product.original_price > (product.price || 0) && (
            <span className="text-base text-gray-500 line-through">
              {formatCurrency(product.original_price)}
            </span>
          )}
        </div>
        {discountPercentage > 0 && (
          <span className="px-2 py-1 bg-red-100 text-red-600 text-sm font-medium rounded">
            -{discountPercentage}%
          </span>
        )}
      </div>

      {/* Rating and Sales Info */}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center gap-3">
          {/* Rating */}
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <span className="text-gray-700 font-medium">4.9</span>
          </span>
          
          <span className="text-gray-300">•</span>
          
          {/* Sales Count */}
          <span className="text-gray-600">
            Đã bán {soldCount > 0 ? soldCount : Math.floor(Math.random() * 1000) + 100}
          </span>
        </div>

        {/* Brand */}
        <div className="text-gray-600">
          <span className="font-medium">{brandName}</span>
        </div>
      </div>

      {/* Special Offers */}
      <div className="flex flex-wrap gap-2">
        <div className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <span>Freeship toàn quốc</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <span>Giao hàng trong 24h</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
          </svg>
          <span>Bảo hành 12 tháng</span>
        </div>
      </div>

      {/* Payment Options */}
      <div className="pt-2 border-t border-gray-100">
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
            <line x1="1" y1="10" x2="23" y2="10"/>
          </svg>
          <span>Hỗ trợ trả góp 0% lãi suất</span>
        </div>
      </div>
    </div>
  );
}
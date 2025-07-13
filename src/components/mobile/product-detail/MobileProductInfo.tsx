import React from 'react';
import type { Product } from '../../../types/Product';

interface MobileProductInfoProps {
  product: Product;
}

export default function MobileProductInfo({ product }: MobileProductInfoProps) {
  // Static tags for ergonomic products
  const tags: string[] = ['Công thái học', 'Văn phòng', 'Sức khỏe', 'Làm việc lâu dài', 'Hỗ trợ lưng'];

  return (
    <div className="bg-white mb-2 md:hidden">
      {/* Product Name */}
      <h1 className="text-lg font-medium text-gray-900 px-4 pt-4 pb-2">{product.name}</h1>
      
      {/* Promotional Information */}
      <div className="flex flex-wrap gap-2 mt-2 bg-red-50 justify-start w-full px-4 py-3">
        <span className="text-red-600 font-semibold text-xs flex items-center">
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          Miễn phí vận chuyển
        </span>
        <span className="text-gray-400">•</span>
        <span className="text-red-600 font-semibold text-xs flex items-center">
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          Bảo hành 12 tháng
        </span>
        <span className="text-gray-400">•</span>
        <span className="text-red-600 font-semibold text-xs flex items-center">
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
            <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          Giao hàng nhanh HN-HCM
        </span>
      </div>

      {/* Product Tags */}
      <div className="flex flex-wrap gap-2 px-4 mt-3 pb-4">
        {tags.map((tag: string, idx: number) => (
          <span
            key={idx}
            className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium border border-gray-200"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Short Description */}
      {product.description && (
        <div className="px-4 pb-4">
          <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
            {product.description}
          </p>
        </div>
      )}
    </div>
  );
}
import React from 'react';
import { EyeIcon } from '@heroicons/react/24/outline';

export interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    original_price?: number;
    image_url?: string;
    rating?: number;
    sold_count?: number;
  };
  onQuickView?: (product: any) => void;
  showQuickView?: boolean;
  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView, showQuickView = true, className = '' }) => {
  const discountPercentage = product.original_price && product.original_price > product.price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  return (
    <div className={`bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col h-full overflow-hidden ${className}`}>
      <div className="aspect-square w-full relative group">
        {/* Badge giảm giá */}
        {discountPercentage > 0 && (
          <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-lg z-10">
            -{discountPercentage}%
          </div>
        )}
        <a href={`/san-pham/${product.slug}`}>
          <img
            src={product.image_url || '/images/placeholder-product.jpg'}
            alt={product.name}
            className="object-contain w-full h-full cursor-pointer"
          />
        </a>
        {/* Quick view icon */}
        {showQuickView && onQuickView && (
          <button
            type="button"
            aria-label="Xem nhanh"
            className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/10 rounded transition-all duration-200 opacity-0 group-hover:opacity-100 z-10"
            tabIndex={-1}
            onClick={e => { e.preventDefault(); e.stopPropagation(); onQuickView(product); }}
          >
            <span className="bg-white/90 text-gray-700 rounded-full p-2 shadow hover:bg-red-600 hover:text-white transition-colors duration-200">
              <EyeIcon className="h-7 w-7" />
            </span>
          </button>
        )}
      </div>
      <div className="flex-1 flex flex-col px-2 pt-2 pb-1">
        <div className="h-10 font-medium text-sm text-gray-900 line-clamp-2 mb-1">{product.name}</div>
        <div className="flex items-end gap-2 mb-1 mt-auto">
          <span className="text-red-600 font-bold text-base">{product.price.toLocaleString('vi-VN')}₫</span>
          {product.original_price && (
            <span className="text-xs text-gray-400 line-through">{product.original_price.toLocaleString('vi-VN')}₫</span>
          )}
        </div>
        <div className="flex items-center justify-between gap-2 text-xs text-gray-500 mb-1">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-0.5">
              <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <polygon points="9.9,1.1 7.6,6.6 1.6,7.3 6.1,11.2 4.8,17.1 9.9,14.1 15,17.1 13.7,11.2 18.2,7.3 12.2,6.6" />
              </svg>
              {(product.rating || 4.9).toFixed(1)}
            </span>
            <span>•</span>
            <span>Đã bán {product.sold_count || 0}</span>
          </div>
          {/* Nút thêm vào giỏ hàng có thể truyền prop nếu muốn */}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

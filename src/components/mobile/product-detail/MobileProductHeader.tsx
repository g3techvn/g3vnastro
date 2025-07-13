import React, { useState } from 'react';
import type { Product } from '../../../types/Product';

interface MobileProductHeaderProps {
  product: Product;
  totalCartItems?: number;
  onShareClick?: () => void;
  onFeedbackClick?: () => void;
}

export default function MobileProductHeader({ 
  product, 
  totalCartItems = 0, 
  onShareClick, 
  onFeedbackClick 
}: MobileProductHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const brandName = typeof product.brand === 'string' 
    ? product.brand 
    : product.brand?.title || 'G3 - TECH';

  const handleGoBack = () => {
    if (typeof window !== 'undefined') {
      window.history.back();
    }
  };

  const handleShare = () => {
    if (navigator.share && typeof window !== 'undefined') {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      });
    } else if (onShareClick) {
      onShareClick();
    }
  };

  return (
    <div className="sticky top-0 z-20 bg-white border-b border-gray-200 md:hidden">
      <div className="flex items-center h-14 relative">
        {/* Back Button */}
        <button
          onClick={handleGoBack}
          className="flex items-center justify-center w-10 h-10 text-gray-600 hover:text-gray-900 -ml-2"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        {/* Brand Name */}
        <div className="absolute left-0 right-0 top-0 h-14 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <div className="text-sm font-medium text-gray-900">{brandName}</div>
          </div>
        </div>

        {/* Right Actions */}
        <div className="ml-auto flex items-center gap-2">
     

          {/* Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center justify-center w-10 h-10 text-gray-600 hover:text-gray-900"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Dropdown Menu */}
      {isMenuOpen && (
        <div className="absolute top-14 right-0 w-48 bg-white border border-gray-200 rounded-bl-lg shadow-lg">
          <div className="py-2">
            <button
              onClick={handleShare}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
              Chia sẻ
            </button>
            <button
              onClick={onFeedbackClick}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              Phản hồi
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
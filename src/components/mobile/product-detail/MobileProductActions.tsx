import React, { useState } from 'react';
import type { Product } from '../../../types';
import ModalBuyNowForm from '../../react/ModalBuyNowForm';
import { COMPANY_INFO } from '../../../constants';

interface MobileProductActionsProps {
  product: Product;
  onBuyNow?: () => void;
  onContactSeller?: () => void;
}

export default function MobileProductActions({ 
  product, 
  onBuyNow, 
  onContactSeller 
}: MobileProductActionsProps) {
  const [showBuyNowModal, setShowBuyNowModal] = useState(false);

  const handleBuyNow = () => {
    if (onBuyNow) {
      onBuyNow();
    } else {
      // Open modal same as PC version
      setShowBuyNowModal(true);
    }
  };

  const handleContactSeller = () => {
    if (onContactSeller) {
      onContactSeller();
    } else {
      // Redirect to Zalo chat
      window.open(COMPANY_INFO.zalo, '_blank');
    }
  };

  return (
    <>
      {/* Sticky Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-[60] md:hidden shadow-lg">
        <div className="flex items-center gap-3">
          {/* Chat Zalo Button */}
          <button
            onClick={handleContactSeller}
            className="flex-1 bg-blue-500 text-white py-3 px-4 rounded-lg font-medium text-sm hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Chat Zalo
          </button>

          {/* Buy Now Button */}
          <button
            onClick={handleBuyNow}
            className="flex-1 bg-red-600 text-white py-3 px-4 rounded-lg font-medium text-sm hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Mua ngay
          </button>
        </div>
      </div>

      {/* Buy Now Modal - Same as PC */}
      <ModalBuyNowForm
        open={showBuyNowModal}
        onClose={() => setShowBuyNowModal(false)}
        product={{
          name: product.name,
          price: product.price,
          image_url: product.image_url,
          original_price: product.original_price,
        }}
      />
    </>
  );
}
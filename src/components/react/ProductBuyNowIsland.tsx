import React, { useState } from 'react';
import ModalBuyNowForm from './ModalBuyNowForm';

interface ProductBuyNowIslandProps {
  product: {
    name: string;
    price: number;
    image_url?: string;
    original_price?: number;
  };
}

const ProductBuyNowIsland: React.FC<ProductBuyNowIslandProps> = ({ product }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
        onClick={() => setOpen(true)}
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        Mua ngay
      </button>
      <ModalBuyNowForm open={open} onClose={() => setOpen(false)} product={product} />
    </>
  );
};

export default ProductBuyNowIsland; 
import React, { useState, useEffect } from 'react';
import ModalBuyNowForm from './ModalBuyNowForm';

interface Product {
  id: number;
  name: string;
  price: number;
  original_price?: number;
  image_url?: string;
  rating?: number;
  sold_count?: number;
}

const CategoryBuyNowModal: React.FC = () => {
  const [modalProduct, setModalProduct] = useState<Product | null>(null);

  useEffect(() => {
    // Listen for global modal open events
    const handleOpenModal = (event: CustomEvent<Product>) => {
      setModalProduct(event.detail);
    };

    // Listen for global modal close events
    const handleCloseModal = () => {
      setModalProduct(null);
    };

    // Add event listeners
    window.addEventListener('openCategoryBuyNowModal', handleOpenModal as EventListener);
    window.addEventListener('closeCategoryBuyNowModal', handleCloseModal as EventListener);

    return () => {
      // Cleanup event listeners
      window.removeEventListener('openCategoryBuyNowModal', handleOpenModal as EventListener);
      window.removeEventListener('closeCategoryBuyNowModal', handleCloseModal as EventListener);
    };
  }, []);

  const handleCloseModal = () => {
    setModalProduct(null);
  };

  return (
    <>
      {modalProduct && (
        <ModalBuyNowForm
          open={!!modalProduct}
          onClose={handleCloseModal}
          product={modalProduct}
        />
      )}
    </>
  );
};

export default CategoryBuyNowModal; 
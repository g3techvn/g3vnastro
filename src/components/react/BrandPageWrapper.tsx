import React from 'react';
import BrandPage from './BrandPage';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  original_price?: number;
  image_url?: string;
  image_square_url?: string;
  rating?: number;
  sold_count?: number;
  brand_id?: string;
  pd_cat_id?: string;
  brands?: { title: string; slug: string };
  product_cats?: { title: string; slug: string };
}

interface Category {
  id: string;
  title: string;
  slug: string;
}

interface BrandPageWrapperProps {
  brandSlug: string;
  brandData: {
    id: string;
    title: string;
    description?: string;
    image_url?: string;
    slug: string;
  };
  initialProducts?: Product[];
  availableCategories?: Category[];
}

const BrandPageWrapper: React.FC<BrandPageWrapperProps> = ({ 
  brandSlug, 
  brandData, 
  initialProducts = [],
  availableCategories = []
}) => {
  return (
    <BrandPage 
      brandSlug={brandSlug} 
      brandData={brandData}
      initialProducts={initialProducts}
      availableCategories={availableCategories}
    />
  );
};

export default BrandPageWrapper;
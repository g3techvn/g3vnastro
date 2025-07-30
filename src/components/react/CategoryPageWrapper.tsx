import React from 'react';
import CategoryPage from './CategoryPage';

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

interface Brand {
  id: string;
  title: string;
  slug: string;
}

interface CategoryPageWrapperProps {
  categorySlug: string;
  categoryData: {
    id: string;
    title: string;
    description?: string;
    image_url?: string;
    slug: string;
  };
  initialProducts?: Product[];
  availableBrands?: Brand[];
}

const CategoryPageWrapper: React.FC<CategoryPageWrapperProps> = ({ 
  categorySlug, 
  categoryData, 
  initialProducts = [],
  availableBrands = []
}) => {
  return (
    <CategoryPage 
      categorySlug={categorySlug} 
      categoryData={categoryData}
      initialProducts={initialProducts}
      availableBrands={availableBrands}
    />
  );
};

export default CategoryPageWrapper;
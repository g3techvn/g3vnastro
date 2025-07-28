import React from 'react';
import CategoryPage from './CategoryPage';

interface CategoryPageWrapperProps {
  categorySlug: string;
  categoryData: {
    id: string;
    title: string;
    description?: string;
    image_url?: string;
    slug: string;
  };
}

const CategoryPageWrapper: React.FC<CategoryPageWrapperProps> = ({ categorySlug, categoryData }) => {
  return <CategoryPage categorySlug={categorySlug} categoryData={categoryData} />;
};

export default CategoryPageWrapper;
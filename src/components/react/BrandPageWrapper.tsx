import React from 'react';
import BrandPage from './BrandPage';

interface BrandPageWrapperProps {
  brandSlug: string;
  brandData: {
    id: string;
    title: string;
    description?: string;
    image_url?: string;
    slug: string;
  };
}

const BrandPageWrapper: React.FC<BrandPageWrapperProps> = ({ brandSlug, brandData }) => {
  return <BrandPage brandSlug={brandSlug} brandData={brandData} />;
};

export default BrandPageWrapper;
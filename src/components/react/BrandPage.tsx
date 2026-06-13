import React, { useState } from 'react';
import type { FilterState } from './BrandFilter';
import BrandPageMobile from './BrandPageMobile';
import BrandPageDesktop from './BrandPageDesktop';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  original_price?: number;
  image_url?: string;
  image_square_url?: string;
  optimized_image_url?: string;
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

interface BrandPageProps {
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

const BrandPage: React.FC<BrandPageProps> = ({ 
  brandSlug, 
  brandData, 
  initialProducts = [],
  availableCategories = []
}) => {
  const [filters, setFilters] = useState<FilterState>({
    priceRange: { min: 0, max: 5000000 },
    categories: []
  });
  const [filteredCount, setFilteredCount] = useState(0);
  const [sortBy, setSortBy] = useState('name');
  const [gridView, setGridView] = useState('grid');

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
  };

  const handleGridViewChange = (newGridView: string) => {
    setGridView(newGridView);
  };

  const handleFilteredCountChange = (count: number) => {
    setFilteredCount(count);
  };

  return (
    <>
      {/* Mobile Version */}
      <div className="md:hidden">
        <BrandPageMobile
          brandData={brandData}
          filters={filters}
          sortBy={sortBy}
          gridView={gridView}
          filteredCount={filteredCount}
          onFilterChange={handleFilterChange}
          onSortChange={handleSortChange}
          onGridViewChange={handleGridViewChange}
          onFilteredCountChange={handleFilteredCountChange}
          initialProducts={initialProducts}
          availableCategories={availableCategories}
        />
      </div>

      {/* Desktop Version */}
      <div className="hidden md:block">
        <BrandPageDesktop
          brandData={brandData}
          filters={filters}
          sortBy={sortBy}
          gridView={gridView}
          filteredCount={filteredCount}
          onFilterChange={handleFilterChange}
          onSortChange={handleSortChange}
          onGridViewChange={handleGridViewChange}
          onFilteredCountChange={handleFilteredCountChange}
          initialProducts={initialProducts}
          availableCategories={availableCategories}
        />
      </div>
    </>
  );
};

export default BrandPage;
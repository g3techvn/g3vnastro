import React, { useState } from 'react';
import type { FilterState } from './CategoryFilter';
import CategoryPageMobile from './CategoryPageMobile';
import CategoryPageDesktop from './CategoryPageDesktop';

interface CategoryPageProps {
  categorySlug: string;
  categoryData: {
    id: string;
    title: string;
    description?: string;
    image_url?: string;
    slug: string;
  };
}

const CategoryPage: React.FC<CategoryPageProps> = ({ categorySlug, categoryData }) => {
  const [filters, setFilters] = useState<FilterState>({
    priceRange: { min: 0, max: 5000000 },
    brands: []
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
        <CategoryPageMobile
          categoryData={categoryData}
          filters={filters}
          sortBy={sortBy}
          gridView={gridView}
          filteredCount={filteredCount}
          onFilterChange={handleFilterChange}
          onSortChange={handleSortChange}
          onGridViewChange={handleGridViewChange}
          onFilteredCountChange={handleFilteredCountChange}
        />
      </div>

      {/* Desktop Version */}
      <div className="hidden md:block">
        <CategoryPageDesktop
          categoryData={categoryData}
          filters={filters}
          sortBy={sortBy}
          gridView={gridView}
          filteredCount={filteredCount}
          onFilterChange={handleFilterChange}
          onSortChange={handleSortChange}
          onGridViewChange={handleGridViewChange}
          onFilteredCountChange={handleFilteredCountChange}
        />
      </div>
    </>
  );
};

export default CategoryPage;
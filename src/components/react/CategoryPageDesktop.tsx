import React from 'react';
import CategoryFilter from './CategoryFilter';
import type { FilterState } from './CategoryFilter';
import CategoryProductList from './CategoryProductList';

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

interface CategoryPageDesktopProps {
  categoryData: {
    id: string;
    title: string;
    description?: string;
    image_url?: string;
    slug: string;
  };
  filters: FilterState;
  sortBy: string;
  gridView: string;
  filteredCount: number;
  onFilterChange: (filters: FilterState) => void;
  onSortChange: (sortBy: string) => void;
  onGridViewChange: (gridView: string) => void;
  onFilteredCountChange: (count: number) => void;
  initialProducts?: Product[];
  availableBrands?: Brand[];
}

const CategoryPageDesktop: React.FC<CategoryPageDesktopProps> = ({
  categoryData,
  filters,
  sortBy,
  gridView,
  filteredCount,
  onFilterChange,
  onSortChange,
  onGridViewChange,
  onFilteredCountChange,
  initialProducts = [],
  availableBrands = [],
}) => {
  const orderOptions = [
    { value: 'name', label: 'Tên A-Z' },
    { value: 'price_asc', label: 'Giá thấp đến cao' },
    { value: 'price_desc', label: 'Giá cao đến thấp' }
  ];

  return (
    <div className="mx-10 py-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-6">
        {/* Sidebar Filter */}
        <div className="md:col-span-1">
          <CategoryFilter 
            onFilterChange={onFilterChange}
            initialFilters={filters}
            categoryId={categoryData.id}
            availableBrands={availableBrands}
          />
        </div>

        {/* Products Grid */}
        <div className="md:col-span-5">
          {/* Combined Breadcrumb and Controls */}
          <div className="bg-white rounded-lg mb-6">
            <div className="flex items-center justify-between h-[56px] px-2">
              {/* Breadcrumb - Desktop */}
              <nav className="flex text-sm">
                <a href="/" className="text-gray-500 hover:text-gray-700">Trang chủ</a>
                <span className="mx-2 text-gray-400">/</span>
                <span className="text-gray-900">{categoryData.title}</span>
              </nav>   
           
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  Hiển thị {filteredCount} sản phẩm
                </span>
                
                {/* Sort dropdown - Desktop */}
                <select 
                  value={sortBy}
                  onChange={(e) => onSortChange(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  {orderOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                {/* View mode toggle - Desktop */}
                <div className="flex rounded-md border border-gray-300 overflow-hidden">
                  <button 
                    onClick={() => onGridViewChange('grid')}
                    className={`p-2 ${gridView === 'grid' ? 'bg-red-600 text-white' : 'bg-white text-gray-600'}`}
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => onGridViewChange('list')}
                    className={`p-2 ${gridView === 'list' ? 'bg-red-600 text-white' : 'bg-white text-gray-600'}`}
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 8a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 12a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 16a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Products */}
          <CategoryProductList 
            filters={filters}
            sortBy={sortBy}
            gridView={gridView}
            categoryId={categoryData.id}
            onFilteredCountChange={onFilteredCountChange}
            initialProducts={initialProducts}
          />
        </div>
      </div>
    </div>
  );
};

export default CategoryPageDesktop;
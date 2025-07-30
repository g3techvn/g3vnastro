import React, { useState } from 'react';
import CategoryFilter from './CategoryFilter';
import type { FilterState } from './CategoryFilter';
import CategoryProductListMobile from './CategoryProductListMobile';

interface CategoryPageMobileProps {
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
}

const CategoryPageMobile: React.FC<CategoryPageMobileProps> = ({
  categoryData,
  filters,
  sortBy,
  gridView,
  filteredCount,
  onFilterChange,
  onSortChange,
  onGridViewChange,
  onFilteredCountChange,
}) => {
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  const orderOptions = [
    { value: 'name', label: 'Tên A-Z' },
    { value: 'price_asc', label: 'Giá thấp đến cao' },
    { value: 'price_desc', label: 'Giá cao đến thấp' }
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Mobile Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="flex items-center px-4 py-3">
          <a href="/categories" className="mr-3 p-1 flex items-center justify-center h-8 w-8">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </a>
          <div className="flex items-center justify-between flex-1 h-8">
            <div className="flex items-center flex-1 min-w-0 h-full">
              {categoryData.image_url && (
                <img src={categoryData.image_url} alt={categoryData.title} className="w-8 h-8 rounded-full mr-2 flex-shrink-0" />
              )}
              <h1 className="text-base font-semibold text-gray-900 truncate leading-none flex items-center h-full">{categoryData.title}</h1>
            </div>
            <p className="text-xs text-gray-500 ml-2 flex-shrink-0 leading-none flex items-center h-full">{filteredCount} sản phẩm</p>
          </div>
          {/* Filter Button in Header */}
          <button 
            onClick={() => setShowMobileFilter(true)}
            className="ml-2 p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center h-8 w-8"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Controls */}
      <div className="bg-white border-b border-gray-100 px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <span>Sắp xếp:</span>
            <select 
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="px-2 py-1 border border-gray-200 rounded text-xs bg-white focus:outline-none focus:ring-1 focus:ring-red-500"
            >
              {orderOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="text-xs text-gray-500">
            {filteredCount} kết quả
          </div>
        </div>
      </div>

      {/* Mobile Products */}
      <div className="pt-4 pb-4 px-4">
        <CategoryProductListMobile 
          filters={filters}
          sortBy={sortBy}
          categoryId={categoryData.id}
          onFilteredCountChange={onFilteredCountChange}
        />
      </div>

      {/* Mobile Filter Modal */}
      {showMobileFilter && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setShowMobileFilter(false)}
          />
          
          {/* Modal */}
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-xl max-h-[85vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between rounded-t-xl">
              <h3 className="text-lg font-semibold text-gray-900">Bộ lọc sản phẩm</h3>
              <button
                onClick={() => setShowMobileFilter(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4">
              <CategoryFilter 
                onFilterChange={onFilterChange}
                initialFilters={filters}
                categoryId={categoryData.id}
              />
              <div className="flex gap-3 pt-6 border-t border-gray-200 mt-6">
                <button 
                  onClick={() => {
                    onFilterChange({ priceRange: { min: 0, max: 5000000 }, brands: [] });
                    setShowMobileFilter(false);
                  }}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Xóa bộ lọc
                </button>
                <button 
                  onClick={() => setShowMobileFilter(false)}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  Áp dụng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryPageMobile;
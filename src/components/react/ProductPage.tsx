import React, { useState, useEffect } from 'react';
import ProductFilter from './ProductFilter';
import type { FilterState } from './ProductFilter';
import ProductList from './ProductList';

const ProductPage: React.FC = () => {
  const [filters, setFilters] = useState<FilterState>({
    priceRange: { min: 0, max: 5000000 },
    brands: [],
    categories: []
  });
  const [filteredCount, setFilteredCount] = useState(0);
  const [sortBy, setSortBy] = useState('price_desc');
  const [gridView, setGridView] = useState('grid');
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  const orderOptions = [
    { value: 'name', label: 'Tên A-Z' },
    { value: 'price_asc', label: 'Giá thấp đến cao' },
    { value: 'price_desc', label: 'Giá cao đến thấp' }
  ];

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
  };

  const handleGridViewChange = (newGridView: string) => {
    setGridView(newGridView);
  };

  const handleCountChange = (count: number) => {
    setFilteredCount(count);
  };

  return (
    <div className="md:mx-10 md:py-8 px-4 md:px-0 w-full md:w-auto">
              {/* Mobile Filter Button */}
        <div className="md:hidden mb-4">
        <button
          onClick={() => setShowMobileFilter(true)}
          className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 flex items-center justify-between shadow-sm"
        >
          <span className="text-gray-700">Bộ lọc sản phẩm</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-6">
        {/* Sidebar Filter - Hidden on mobile, visible on desktop */}
        <div className="hidden md:block md:col-span-1">
          <ProductFilter 
            onFilterChange={handleFilterChange}
            initialFilters={filters}
          />
        </div>

        {/* Products Grid - Full width on mobile, 5 columns on desktop */}
        <div className="col-span-1 md:col-span-5">
          <div className="bg-white rounded-lg mb-6">
            {/* Mobile Layout */}
            <div className="md:hidden">
              {/* Breadcrumb - Mobile */}
              <div className="py-2 border-b border-gray-100">
                <nav className="flex items-center text-xs">
                  <a href="/" className="text-gray-500 hover:text-gray-700 truncate">Trang chủ</a>
                  <svg className="mx-1 w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                  <span className="text-gray-900 font-medium truncate">Sản phẩm</span>
                </nav>
              </div>
              
              {/* Controls - Mobile */}
              <div className="py-3 flex items-center justify-between">
                <span className="text-xs text-gray-600">
                  {filteredCount} sản phẩm
                </span>
                
                <div className="flex items-center gap-3">
                  {/* Sort dropdown - Mobile */}
                  <select 
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="px-2 py-1 border border-gray-300 rounded text-xs bg-white"
                  >
                    {orderOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>

                  {/* View mode toggle - Mobile */}
                  <div className="flex rounded border border-gray-300 overflow-hidden">
                    <button 
                      onClick={() => handleGridViewChange('grid')}
                      className={`p-1.5 ${gridView === 'grid' ? 'bg-red-600 text-white' : 'bg-white text-gray-600'}`}
                    >
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                    </button>
                    <button 
                      onClick={() => handleGridViewChange('list')}
                      className={`p-1.5 ${gridView === 'list' ? 'bg-red-600 text-white' : 'bg-white text-gray-600'}`}
                    >
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 8a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 12a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 16a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden md:flex items-center justify-between h-[56px] px-2">
              {/* Breadcrumb - Desktop */}
              <nav className="flex text-sm">
                <a href="/" className="text-gray-500 hover:text-gray-700">Trang chủ</a>
                <span className="mx-2 text-gray-400">/</span>
                <span className="text-gray-900">Sản phẩm</span>
              </nav>

              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  Hiển thị {filteredCount} sản phẩm
                </span>
                
                {/* Sort dropdown - Desktop */}
                <select 
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
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
                    onClick={() => handleGridViewChange('grid')}
                    className={`p-2 ${gridView === 'grid' ? 'bg-red-600 text-white' : 'bg-white text-gray-600'}`}
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => handleGridViewChange('list')}
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

          {/* Products List */}
          <ProductList 
            filters={filters}
            sortBy={sortBy}
            gridView={gridView}
            onCountChange={handleCountChange}
          />
        </div>
      </div>

      {/* Mobile Filter Modal */}
      {showMobileFilter && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setShowMobileFilter(false)}
          />
          
          {/* Modal */}
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-lg max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 py-3 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Bộ lọc</h3>
              <button
                onClick={() => setShowMobileFilter(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="px-0 py-4">
              <ProductFilter 
                onFilterChange={handleFilterChange}
                initialFilters={filters}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage; 
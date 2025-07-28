import React, { useState, useEffect } from 'react';
import BrandFilter from './BrandFilter';
import type { FilterState } from './BrandFilter';
import BrandProductList from './BrandProductList';

interface BrandPageProps {
  brandSlug: string;
  brandData: {
    id: string;
    title: string;
    description?: string;
    image_url?: string;
    slug: string;
  };
}

const BrandPage: React.FC<BrandPageProps> = ({ brandSlug, brandData }) => {
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [],
    categories: []
  });
  const [filteredCount, setFilteredCount] = useState(0);
  const [sortBy, setSortBy] = useState('name');
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

  const handleFilteredCountChange = (count: number) => {
    setFilteredCount(count);
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-gray-200">
        <div className="flex items-center px-4 py-4">
          <a href="/brands" className="mr-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </a>
          <div className="flex items-center">
            {brandData.image_url && (
              <img src={brandData.image_url} alt={brandData.title} className="w-10 h-10 rounded-full mr-3" />
            )}
            <div>
              <h1 className="text-lg font-semibold text-gray-900">{brandData.title}</h1>
              <p className="text-sm text-gray-600">{filteredCount} sản phẩm</p>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Content */}
      <div className="hidden md:block mx-10 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-6">
          {/* Sidebar Filter */}
          <div className="md:col-span-1">
            <BrandFilter 
              onFilterChange={handleFilterChange}
              initialFilters={filters}
              brandId={brandData.id}
            />
          </div>

          {/* Products Grid */}
          <div className="md:col-span-5">
            {/* Combined Breadcrumb and Controls */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <nav aria-label="Breadcrumb" className="flex">
                  <ol role="list" className="flex items-center space-x-3 h-12">
                    <li className="flex">
                      <div className="flex items-center">
                        <a href="/" className="text-gray-400 hover:text-gray-500">
                          <svg className="size-4 shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                            <path fillRule="evenodd" d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z" clipRule="evenodd" />
                          </svg>
                          <span className="sr-only">Trang chủ</span>
                        </a>
                      </div>
                    </li>
                    <li className="flex">
                      <div className="flex items-center">
                        <svg
                          fill="currentColor"
                          viewBox="0 0 24 44"
                          preserveAspectRatio="none"
                          aria-hidden="true"
                          className="h-full w-5 shrink-0 text-gray-200"
                        >
                          <path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z" />
                        </svg>
                        <a
                          href="/brands"
                          className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
                        >
                          Thương hiệu
                        </a>
                      </div>
                    </li>
                    <li className="flex">
                      <div className="flex items-center">
                        <svg
                          fill="currentColor"
                          viewBox="0 0 24 44"
                          preserveAspectRatio="none"
                          aria-hidden="true"
                          className="h-full w-5 shrink-0 text-gray-200"
                        >
                          <path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z" />
                        </svg>
                        <span
                          aria-current="page"
                          className="ml-4 text-sm font-medium text-gray-900"
                        >
                          {brandData.title}
                        </span>
                      </div>
                    </li>
                  </ol>
                </nav>
                
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">
                    Hiển thị {filteredCount} sản phẩm
                  </span>
                  
                  {/* Sort dropdown */}
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

                  {/* View mode toggle */}
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

            {/* Products */}
            <BrandProductList 
              filters={filters}
              sortBy={sortBy}
              gridView={gridView}
              brandId={brandData.id}
              onFilteredCountChange={handleFilteredCountChange}
            />
          </div>
        </div>
      </div>

      {/* Mobile Filter Button */}
      <div className="md:hidden fixed bottom-20 left-4 right-4 z-10">
        <button 
          onClick={() => setShowMobileFilter(true)}
          className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 flex items-center justify-center shadow-lg"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
          </svg>
          <span className="text-gray-700">Bộ lọc sản phẩm</span>
        </button>
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
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
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
            <div className="p-4">
              <BrandFilter 
                onFilterChange={handleFilterChange}
                initialFilters={filters}
                brandId={brandData.id}
              />
              <div className="flex gap-3 pt-4 border-t border-gray-200 mt-4">
                <button 
                  onClick={() => {
                    setFilters({ priceRange: [], categories: [] });
                    setShowMobileFilter(false);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700"
                >
                  Xóa bộ lọc
                </button>
                <button 
                  onClick={() => setShowMobileFilter(false)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md"
                >
                  Áp dụng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BrandPage;
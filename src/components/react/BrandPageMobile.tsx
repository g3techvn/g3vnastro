import React, { useState, useEffect } from 'react';
import MobileBrandFilter from '../mobile/MobileBrandFilter';
import MobileSortModal from '../mobile/MobileSortModal';
import type { FilterState } from '../mobile/MobileBrandFilter';
import BrandProductListMobile from './BrandProductListMobile';

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

interface BrandPageMobileProps {
  brandData: {
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
  availableCategories?: Category[];
}

const BrandPageMobile: React.FC<BrandPageMobileProps> = ({
  brandData,
  filters,
  sortBy,
  gridView,
  filteredCount,
  onFilterChange,
  onSortChange,
  onGridViewChange,
  onFilteredCountChange,
  initialProducts = [],
  availableCategories = [],
}) => {
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [showMobileSort, setShowMobileSort] = useState(false);
  const [isScrolledDown, setIsScrolledDown] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      setIsScrolledDown(scrollTop > 50);
    };

    setIsScrolledDown(false);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getSortLabel = (sortValue: string) => {
    const sortLabels: { [key: string]: string } = {
      'name': 'Tên A-Z',
      'price_asc': 'Giá thấp đến cao',
      'price_desc': 'Giá cao đến thấp'
    };
    return sortLabels[sortValue] || 'Tên A-Z';
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Mobile Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="relative flex items-center px-4 py-3 h-14">
          {/* Back Button - Only visible when scrolled down */}
          <a 
            href="/brands" 
            className={`absolute left-4 p-1 flex items-center justify-center h-8 w-8 z-10 transition-all duration-300 ease-in-out ${
              isScrolledDown 
                ? 'opacity-100 translate-x-0' 
                : 'opacity-0 -translate-x-4 pointer-events-none'
            }`}
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </a>
          
          {/* Dynamic Title Position */}
          <div 
            className={`absolute inset-0 flex items-center transition-all duration-300 ease-in-out ${
              isScrolledDown 
                ? 'justify-center px-16' 
                : 'justify-start pl-4 pr-16'
            }`}
          >
            <div className="flex items-center">
              {brandData.image_url && (
                <img 
                  src={brandData.image_url} 
                  alt={brandData.title} 
                  className="w-8 h-8 rounded-full mr-2 flex-shrink-0" 
                />
              )}
              <h1 className="text-base font-semibold text-gray-900 truncate leading-none">
                {brandData.title}
              </h1>
            </div>
          </div>
          
          {/* Share Button */}
          <button 
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: brandData.title,
                  url: window.location.href
                });
              } else {
                navigator.clipboard.writeText(window.location.href);
              }
            }}
            className="absolute right-4 p-1 flex items-center justify-center h-8 w-8 z-10 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
          </button>
        </div>
      </div>     
 {/* Mobile Controls */}
      <div className="bg-white border-b border-gray-100 px-4 py-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">
            {filteredCount} sản phẩm
          </span>
          
          <div className="flex items-center gap-3">
            {/* Sort button */}
            <button
              onClick={() => setShowMobileSort(true)}
              className="flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm bg-white"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
              </svg>
              {getSortLabel(sortBy)}
            </button>

            {/* Filter button */}
            <button
              onClick={() => setShowMobileFilter(true)}
              className="flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm bg-white"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Lọc
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Products */}
      <div className="px-4 pb-20">
        <BrandProductListMobile 
          filters={filters}
          sortBy={sortBy}
          brandId={brandData.id}
          onFilteredCountChange={onFilteredCountChange}
          initialProducts={initialProducts}
        />
      </div>

      {/* Mobile Filter Modal */}
      <MobileBrandFilter
        isOpen={showMobileFilter}
        onClose={() => setShowMobileFilter(false)}
        onFilterChange={onFilterChange}
        initialFilters={filters}
        brandId={brandData.id}
        availableCategories={availableCategories}
      />

      {/* Mobile Sort Modal */}
      <MobileSortModal
        isOpen={showMobileSort}
        onClose={() => setShowMobileSort(false)}
        sortBy={sortBy}
        onSortChange={onSortChange}
        options={[
          { value: 'name', label: 'Tên A-Z' },
          { value: 'price_asc', label: 'Giá thấp đến cao' },
          { value: 'price_desc', label: 'Giá cao đến thấp' }
        ]}
      />
    </div>
  );
};

export default BrandPageMobile;
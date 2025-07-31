import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import DualRangeSlider from '../react/DualRangeSlider';
import type { FilterState } from '../react/CategoryFilter';

interface Brand {
  id: string;
  title: string;
  slug: string;
  product_count: number;
}

interface MobileCategoryFilterProps {
  onFilterChange: (filters: FilterState) => void;
  initialFilters?: FilterState;
  categoryId: string;
  isOpen: boolean;
  onClose: () => void;
  availableBrands?: Array<{
    id: string;
    title: string;
    slug: string;
  }>;
}



const MobileCategoryFilter: React.FC<MobileCategoryFilterProps> = ({ 
  onFilterChange, 
  initialFilters, 
  categoryId, 
  isOpen, 
  onClose,
  availableBrands = []
}) => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(availableBrands.length === 0);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(5000000);
  const [filters, setFilters] = useState<FilterState>({
    priceRange: initialFilters?.priceRange || { min: 0, max: 5000000 },
    brands: initialFilters?.brands || []
  });

  useEffect(() => {
    if (isOpen) {
      if (availableBrands.length === 0) {
        fetchFilterData();
      } else {
        fetchPriceData();
      }
    }
  }, [categoryId, isOpen, availableBrands.length]);

  const fetchPriceData = async () => {
    try {
      setLoading(true);
      const supabase = createClient(
        import.meta.env.PUBLIC_SUPABASE_URL,
        import.meta.env.PUBLIC_SUPABASE_ANON_KEY
      );

      // Fetch products in this category for price calculation
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('price, brand_id')
        .eq('pd_cat_id', categoryId);

      if (productsError) {
        console.error('Error fetching products:', productsError);
      } else {
        // Calculate price range
        const prices = products.map(p => p.price).filter(Boolean);
        if (prices.length > 0) {
          const minProductPrice = Math.min(...prices);
          const maxProductPrice = Math.max(...prices);
          setMinPrice(minProductPrice);
          setMaxPrice(maxProductPrice);

          if (filters.priceRange.min === 0 && filters.priceRange.max === 5000000) {
            setFilters(prev => ({
              ...prev,
              priceRange: { min: minProductPrice, max: maxProductPrice }
            }));
          }
        }

        // Use pre-fetched brands and add product counts
        const brandsWithCount = availableBrands
          .map(brand => ({
            id: brand.id,
            title: brand.title,
            slug: brand.slug,
            product_count: products.filter(p => p.brand_id === brand.id).length
          }))
          .filter(brand => brand.product_count > 0);

        setBrands(brandsWithCount);
      }
    } catch (error) {
      console.error('Error fetching price data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFilterData = async () => {
    try {
      setLoading(true);
      const supabase = createClient(
        import.meta.env.PUBLIC_SUPABASE_URL,
        import.meta.env.PUBLIC_SUPABASE_ANON_KEY
      );

      // Fetch products in this category
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('price, brand_id')
        .eq('pd_cat_id', categoryId);

      if (productsError) {
        console.error('Error fetching products:', productsError);
      } else {
        // Calculate price range
        const prices = products.map(p => p.price).filter(Boolean);
        if (prices.length > 0) {
          const minProductPrice = Math.min(...prices);
          const maxProductPrice = Math.max(...prices);
          setMinPrice(minProductPrice);
          setMaxPrice(maxProductPrice);

          if (filters.priceRange.min === 0 && filters.priceRange.max === 5000000) {
            setFilters(prev => ({
              ...prev,
              priceRange: { min: minProductPrice, max: maxProductPrice }
            }));
          }
        }

        // Get brands
        const brandIds = [...new Set(products.map(p => p.brand_id).filter(Boolean))];

        if (brandIds.length > 0) {
          const { data: brandsData, error: brandsError } = await supabase
            .from('brands')
            .select('id, title, slug')
            .in('id', brandIds)
            .order('title');

          if (!brandsError && brandsData) {
            const brandsWithCount = brandsData
              .map(brand => ({
                id: brand.id,
                title: brand.title,
                slug: brand.slug,
                product_count: products.filter(p => p.brand_id === brand.id).length
              }))
              .filter(brand => brand.product_count > 0);

            setBrands(brandsWithCount);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching filter data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePriceRangeChange = (min: number, max: number) => {
    setFilters(prev => ({
      ...prev,
      priceRange: { min, max }
    }));
  };

  const handleBrandChange = (brandId: string) => {
    setFilters(prev => {
      const newBrands = prev.brands.includes(brandId)
        ? prev.brands.filter(id => id !== brandId)
        : [...prev.brands, brandId];
      return {
        ...prev,
        brands: newBrands
      };
    });
  };

  const clearAllFilters = () => {
    setFilters({
      priceRange: { min: minPrice, max: maxPrice },
      brands: []
    });
  };

  const applyFilters = () => {
    onFilterChange(filters);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-xl max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between rounded-t-xl">
          <h3 className="text-lg font-semibold text-gray-900">Bộ lọc sản phẩm</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="space-y-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="space-y-3">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-12 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Brand Filter */}
              {brands.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-4 text-base">Thương hiệu</h4>
                  <div className="space-y-3">
                    {brands.map((brand) => (
                      <label key={brand.id} className="flex items-center justify-between cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
                        <div className="flex items-center min-w-0 flex-1">
                          <input
                            type="checkbox"
                            checked={filters.brands.includes(brand.id)}
                            onChange={() => handleBrandChange(brand.id)}
                            className="rounded border-gray-300 text-red-600 focus:ring-red-500 w-5 h-5 flex-shrink-0"
                          />
                          <span className="ml-3 text-base text-gray-700 truncate">{brand.title}</span>
                        </div>
                        <span className="text-sm text-gray-500 ml-2 flex-shrink-0">({brand.product_count})</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Price Range Filter */}
              <div>
                <h4 className="font-medium text-gray-900 mb-4 text-base">Khoảng giá</h4>
                <div className="px-2">
                  <DualRangeSlider
                    min={minPrice}
                    max={maxPrice}
                    value={filters.priceRange}
                    step={500000}
                    onChange={(newRange) => handlePriceRangeChange(newRange.min, newRange.max)}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
          <div className="flex gap-3">
            <button 
              onClick={clearAllFilters}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors text-base"
            >
              Xóa bộ lọc
            </button>
            <button 
              onClick={applyFilters}
              className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors text-base"
            >
              Áp dụng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileCategoryFilter;
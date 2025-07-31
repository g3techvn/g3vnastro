import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import DualRangeSlider from '../react/DualRangeSlider';
import type { FilterState } from '../react/BrandFilter';

interface Category {
  id: string;
  title: string;
  slug: string;
  product_count: number;
}

interface MobileBrandFilterProps {
  onFilterChange: (filters: FilterState) => void;
  initialFilters?: FilterState;
  brandId: string;
  isOpen: boolean;
  onClose: () => void;
  availableCategories?: Array<{
    id: string;
    title: string;
    slug: string;
  }>;
}



const MobileBrandFilter: React.FC<MobileBrandFilterProps> = ({ 
  onFilterChange, 
  initialFilters, 
  brandId, 
  isOpen, 
  onClose,
  availableCategories = []
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(availableCategories.length === 0);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(5000000);
  const [filters, setFilters] = useState<FilterState>({
    priceRange: initialFilters?.priceRange || { min: 0, max: 5000000 },
    categories: initialFilters?.categories || []
  });

  useEffect(() => {
    if (isOpen) {
      if (availableCategories.length === 0) {
        fetchFilterData();
      } else {
        fetchPriceData();
      }
    }
  }, [brandId, isOpen, availableCategories.length]);

  const fetchPriceData = async () => {
    try {
      setLoading(true);
      const supabase = createClient(
        import.meta.env.PUBLIC_SUPABASE_URL,
        import.meta.env.PUBLIC_SUPABASE_ANON_KEY
      );

      // Fetch products in this brand for price calculation
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('price, pd_cat_id')
        .eq('brand_id', brandId);

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

        // Use pre-fetched categories and add product counts
        const categoriesWithCount = availableCategories
          .map(category => ({
            id: category.id,
            title: category.title,
            slug: category.slug,
            product_count: products.filter(p => p.pd_cat_id === category.id).length
          }))
          .filter(category => category.product_count > 0);

        setCategories(categoriesWithCount);
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

      // Fetch products in this brand
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('price, pd_cat_id')
        .eq('brand_id', brandId);

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

        // Get categories
        const categoryIds = [...new Set(products.map(p => p.pd_cat_id).filter(Boolean))];

        if (categoryIds.length > 0) {
          const { data: categoriesData, error: categoriesError } = await supabase
            .from('product_cats')
            .select('id, title, slug')
            .in('id', categoryIds)
            .order('title');

          if (!categoriesError && categoriesData) {
            const categoriesWithCount = categoriesData
              .map(category => ({
                id: category.id,
                title: category.title,
                slug: category.slug,
                product_count: products.filter(p => p.pd_cat_id === category.id).length
              }))
              .filter(category => category.product_count > 0);

            setCategories(categoriesWithCount);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching filter data:', error);
    } finally {
      setLoading(false);
    }
  }; 
 useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const handlePriceRangeChange = (min: number, max: number) => {
    setFilters(prev => ({
      ...prev,
      priceRange: { min, max }
    }));
  };

  const handleCategoryChange = (categoryId: string) => {
    setFilters(prev => {
      const newCategories = prev.categories.includes(categoryId)
        ? prev.categories.filter(id => id !== categoryId)
        : [...prev.categories, categoryId];
      return {
        ...prev,
        categories: newCategories
      };
    });
  };

  const clearAllFilters = () => {
    setFilters({
      priceRange: { min: minPrice, max: maxPrice },
      categories: []
    });
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
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-lg max-h-[80vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Bộ lọc</h3>
          <div className="flex items-center gap-3">
            {((filters.priceRange.min !== minPrice || filters.priceRange.max !== maxPrice) || filters.categories.length > 0) && (
              <button
                onClick={clearAllFilters}
                className="text-sm text-red-600 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50 transition-colors"
              >
                Xóa tất cả
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-4">
          {loading ? (
            <div className="space-y-4">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="space-y-2">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-4 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Category Filter */}
              {categories.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Danh mục</h4>
                  <div className="space-y-3">
                    {categories.map((category) => (
                      <label key={category.id} className="flex items-center justify-between cursor-pointer p-2 rounded hover:bg-gray-50 transition-colors">
                        <div className="flex items-center min-w-0 flex-1">
                          <input
                            type="checkbox"
                            checked={filters.categories.includes(category.id)}
                            onChange={() => handleCategoryChange(category.id)}
                            className="rounded border-gray-300 text-red-600 focus:ring-red-500 w-4 h-4 flex-shrink-0"
                          />
                          <span className="ml-3 text-sm text-gray-700 truncate">{category.title}</span>
                        </div>
                        <span className="text-xs text-gray-500 ml-2 flex-shrink-0">({category.product_count})</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Price Range Filter */}
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Khoảng giá</h4>
                <DualRangeSlider
                  min={minPrice}
                  max={maxPrice}
                  value={filters.priceRange}
                  step={500000}
                  onChange={(newRange) => handlePriceRangeChange(newRange.min, newRange.max)}
                />
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t border-gray-200 mt-6">
            <button 
              onClick={() => {
                clearAllFilters();
                onClose();
              }}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700"
            >
              Xóa bộ lọc
            </button>
            <button 
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md"
            >
              Áp dụng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileBrandFilter;
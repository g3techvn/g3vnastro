import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import DualRangeSlider from './DualRangeSlider';

interface Category {
  id: string;
  title: string;
  slug: string;
  product_count: number;
}

interface BrandFilterProps {
  onFilterChange: (filters: FilterState) => void;
  initialFilters?: FilterState;
  brandId: string;
}

export interface FilterState {
  priceRange: {
    min: number;
    max: number;
  };
  categories: string[];
}

const BrandFilter: React.FC<BrandFilterProps> = ({ onFilterChange, initialFilters, brandId }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(5000000);
  const [filters, setFilters] = useState<FilterState>({
    priceRange: initialFilters?.priceRange || { min: 0, max: 5000000 },
    categories: initialFilters?.categories || []
  });

  useEffect(() => {
    fetchFilterData();
  }, [brandId]);

  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const fetchFilterData = async () => {
    try {
      setLoading(true);
      const supabase = createClient(
        import.meta.env.PUBLIC_SUPABASE_URL,
        import.meta.env.PUBLIC_SUPABASE_ANON_KEY
      );

      // Fetch products in this brand to calculate price range counts and categories
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('price, pd_cat_id')
        .eq('brand_id', brandId);

      if (productsError) {
        console.error('Error fetching products:', productsError);
      } else {
        // Calculate min and max prices from products
        const prices = products.map(p => p.price).filter(Boolean);
        if (prices.length > 0) {
          const minProductPrice = Math.min(...prices);
          const maxProductPrice = Math.max(...prices);
          setMinPrice(minProductPrice);
          setMaxPrice(maxProductPrice);
          
          // Update filters if they're at default values
          if (filters.priceRange.min === 0 && filters.priceRange.max === 5000000) {
            setFilters(prev => ({
              ...prev,
              priceRange: { min: minProductPrice, max: maxProductPrice }
            }));
          }
        }

        // Get unique category IDs from products in this brand
        const categoryIds = [...new Set(products.map(p => p.pd_cat_id).filter(Boolean))];
        
        if (categoryIds.length > 0) {
          // Fetch categories that have products in this brand
          const { data: categoriesData, error: categoriesError } = await supabase
            .from('product_cats')
            .select('id, title, slug')
            .in('id', categoryIds)
            .order('title');

          if (categoriesError) {
            console.error('Error fetching categories:', categoriesError);
          } else {
            // Count products for each category in this brand
            const categoriesWithCount = (categoriesData || [])
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

  const handlePriceRangeChange = (min: number, max: number) => {
    setFilters(prev => ({
      ...prev,
      priceRange: { min, max }
    }));
  };

  const handleCategoryChange = (categoryId: string) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter(id => id !== categoryId)
        : [...prev.categories, categoryId]
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      priceRange: { min: minPrice, max: maxPrice },
      categories: []
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4 sticky top-4">
        <h3 className="font-semibold text-gray-900 mb-4">Bộ lọc</h3>
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
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 sticky top-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Bộ lọc</h3>
        {((filters.priceRange.min !== minPrice || filters.priceRange.max !== maxPrice) || filters.categories.length > 0) && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-red-600 hover:text-red-700"
          >
            Xóa tất cả
          </button>
        )}
      </div>
      
      <div className="space-y-6">
        {/* Category Filter */}
        {categories.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Danh mục</h4>
            <div className="space-y-2">
              {categories.map((category) => (
                <label key={category.id} className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.categories.includes(category.id)}
                      onChange={() => handleCategoryChange(category.id)}
                      className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">{category.title}</span>
                  </div>
                  <span className="text-xs text-gray-500">({category.product_count})</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Price Range Filter */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Khoảng giá</h4>
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
  );
};

export default BrandFilter;
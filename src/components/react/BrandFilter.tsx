import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

interface Category {
  id: string;
  title: string;
  slug: string;
  product_count: number;
}

interface PriceRange {
  value: string;
  label: string;
  min: number;
  max: number | null;
  count: number;
}

interface BrandFilterProps {
  onFilterChange: (filters: FilterState) => void;
  initialFilters?: FilterState;
  brandId: string;
}

export interface FilterState {
  priceRange: string[];
  categories: string[];
}

const BrandFilter: React.FC<BrandFilterProps> = ({ onFilterChange, initialFilters, brandId }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [priceRanges, setPriceRanges] = useState<PriceRange[]>([
    { value: 'under_500k', label: 'Dưới 500.000₫', min: 0, max: 500000, count: 0 },
    { value: '500k_1m', label: '500.000₫ - 1.000.000₫', min: 500000, max: 1000000, count: 0 },
    { value: '1m_2m', label: '1.000.000₫ - 2.000.000₫', min: 1000000, max: 2000000, count: 0 },
    { value: 'over_2m', label: 'Trên 2.000.000₫', min: 2000000, max: null, count: 0 }
  ]);
  const [filters, setFilters] = useState<FilterState>({
    priceRange: initialFilters?.priceRange || [],
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
        // Calculate price range counts
        const updatedPriceRanges = priceRanges.map(range => ({
          ...range,
          count: products.filter(product => {
            const price = product.price;
            if (range.max === null) {
              return price >= range.min;
            }
            return price >= range.min && price < range.max;
          }).length
        }));
        setPriceRanges(updatedPriceRanges);

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

  const handlePriceRangeChange = (value: string) => {
    setFilters(prev => ({
      ...prev,
      priceRange: prev.priceRange.includes(value)
        ? prev.priceRange.filter(v => v !== value)
        : [...prev.priceRange, value]
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
      priceRange: [],
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
        {(filters.priceRange.length > 0 || filters.categories.length > 0) && (
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
          <div className="space-y-2">
            {priceRanges.filter(range => range.count > 0).map((range) => (
              <label key={range.value} className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.priceRange.includes(range.value)}
                    onChange={() => handlePriceRangeChange(range.value)}
                    className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">{range.label}</span>
                </div>
                <span className="text-xs text-gray-500">({range.count})</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandFilter;
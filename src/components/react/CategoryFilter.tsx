import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import DualRangeSlider from './DualRangeSlider';

interface Brand {
  id: string;
  title: string;
  slug: string;
  product_count: number;
}

interface CategoryFilterProps {
  onFilterChange: (filters: FilterState) => void;
  initialFilters?: FilterState;
  categoryId: string;
}

export interface FilterState {
  priceRange: {
    min: number;
    max: number;
  };
  brands: string[];
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ onFilterChange, initialFilters, categoryId }) => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(5000000);
  const [filters, setFilters] = useState<FilterState>({
    priceRange: initialFilters?.priceRange || { min: 0, max: 5000000 },
    brands: initialFilters?.brands || []
  });

  useEffect(() => {
    fetchFilterData();
  }, [categoryId]);

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

      // Fetch products in this category to calculate price range counts
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('price, brand_id')
        .eq('pd_cat_id', categoryId);

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

        // Get unique brand IDs from products in this category
        const brandIds = [...new Set(products.map(p => p.brand_id).filter(Boolean))];

        if (brandIds.length > 0) {
          // Fetch brands that have products in this category
          const { data: brandsData, error: brandsError } = await supabase
            .from('brands')
            .select('id, title, slug')
            .in('id', brandIds)
            .order('title');

          if (brandsError) {
            console.error('Error fetching brands:', brandsError);
          } else {
            // Count products for each brand in this category
            const brandsWithCount = (brandsData || [])
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
    setFilters(prev => ({
      ...prev,
      brands: prev.brands.includes(brandId)
        ? prev.brands.filter(id => id !== brandId)
        : [...prev.brands, brandId]
    }));
  };



  const clearAllFilters = () => {
    setFilters({
      priceRange: { min: minPrice, max: maxPrice },
      brands: []
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
        {((filters.priceRange.min !== minPrice || filters.priceRange.max !== maxPrice) || filters.brands.length > 0) && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-red-600 hover:text-red-700"
          >
            Xóa tất cả
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Brand Filter */}
        {brands.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Thương hiệu</h4>
            <div className="space-y-2">
              {brands.map((brand) => (
                <label key={brand.id} className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.brands.includes(brand.id)}
                      onChange={() => handleBrandChange(brand.id)}
                      className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">{brand.title}</span>
                  </div>
                  <span className="text-xs text-gray-500">({brand.product_count})</span>
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

export default CategoryFilter;
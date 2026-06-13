import React, { useState, useEffect } from 'react';
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
  availableBrands?: Array<{
    id: string;
    title: string;
    slug: string;
  }>;
  initialProducts?: Array<{
    price: number;
    brand_id?: string | null;
  }>;
}

export interface FilterState {
  priceRange: {
    min: number;
    max: number;
  };
  brands: string[];
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ 
  onFilterChange, 
  initialFilters, 
  categoryId, 
  availableBrands = [],
  initialProducts = [],
}) => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(false);

  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(5000000);
  const [filters, setFilters] = useState<FilterState>({
    priceRange: initialFilters?.priceRange || { min: 0, max: 5000000 },
    brands: initialFilters?.brands || []
  });

  useEffect(() => {
    // Compute price range and brand counts from initialProducts (local, no network)
    const products = initialProducts.length > 0 ? initialProducts : [];
    const prices = products.map(p => p.price).filter(Boolean);

    let computedMin = 0;
    let computedMax = 5000000;
    if (prices.length > 0) {
      computedMin = Math.min(...prices);
      computedMax = Math.max(...prices);
    }
    setMinPrice(computedMin);
    setMaxPrice(computedMax);

    if (filters.priceRange.min === 0 && filters.priceRange.max === 5000000) {
      setFilters(prev => ({
        ...prev,
        priceRange: { min: computedMin, max: computedMax }
      }));
    }

    if (availableBrands.length > 0) {
      const brandsWithCount = availableBrands
        .map(brand => ({
          id: brand.id,
          title: brand.title,
          slug: brand.slug,
          product_count: products.filter(p => p.brand_id === brand.id).length
        }))
        .filter(b => b.product_count > 0);
      setBrands(brandsWithCount);
    }
  }, [categoryId, initialProducts.length, availableBrands.length]);

  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const handlePriceRangeChange = (min: number, max: number) => {
    console.log('CategoryFilter: Price range changed:', { min, max });
    setFilters(prev => ({
      ...prev,
      priceRange: { min, max }
    }));
  };

  const handleBrandChange = (brandId: string) => {
    console.log('CategoryFilter: Brand changed:', brandId);
    setFilters(prev => {
      const newBrands = prev.brands.includes(brandId)
        ? prev.brands.filter(id => id !== brandId)
        : [...prev.brands, brandId];
      console.log('CategoryFilter: New brands:', newBrands);
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
            className="text-sm text-red-600 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50 transition-colors"
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
            <div className="space-y-3">
              {brands.map((brand) => (
                <label key={brand.id} className="flex items-center justify-between cursor-pointer p-2 rounded hover:bg-gray-50 transition-colors">
                  <div className="flex items-center min-w-0 flex-1">
                    <input
                      type="checkbox"
                      checked={filters.brands.includes(brand.id)}
                      onChange={() => handleBrandChange(brand.id)}
                      className="rounded border-gray-300 text-red-600 focus:ring-red-500 w-4 h-4 flex-shrink-0"
                    />
                    <span className="ml-3 text-sm text-gray-700 truncate">{brand.title}</span>
                  </div>
                  <span className="text-xs text-gray-500 ml-2 flex-shrink-0">({brand.product_count})</span>
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
    </div>
  );
};

export default CategoryFilter;
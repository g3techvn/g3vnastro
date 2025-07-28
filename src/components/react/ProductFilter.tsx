import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import DualRangeSlider from './DualRangeSlider';

interface Brand {
  id: string;
  title: string;
  slug: string;
  product_count: number;
}

interface Category {
  id: string;
  title: string;
  slug: string;
  product_count: number;
}

interface ProductFilterProps {
  onFilterChange: (filters: FilterState) => void;
  initialFilters?: FilterState;
}

export interface FilterState {
  priceRange: {
    min: number;
    max: number;
  };
  brands: string[];
  categories: string[];
}

const ProductFilter: React.FC<ProductFilterProps> = ({ onFilterChange, initialFilters }) => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(5000000);
  const [filters, setFilters] = useState<FilterState>({
    priceRange: initialFilters?.priceRange || { min: 0, max: 5000000 },
    brands: initialFilters?.brands || [],
    categories: initialFilters?.categories || []
  });

  useEffect(() => {
    fetchFilterData();
  }, []);

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

      // Fetch all products to calculate min and max prices
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('price');

      if (productsError) {
        console.error('Error fetching products:', productsError);
      } else {
        // Calculate min and max prices from all products
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
      }

      // Fetch brands with product count
      const { data: brandsData, error: brandsError } = await supabase
        .from('brands')
        .select(`
          id,
          title,
          slug,
          products!inner(id)
        `)
        .order('title');

      if (brandsError) {
        console.error('Error fetching brands:', brandsError);
      } else {
        // Process brands to get product count and filter out empty ones
        const brandsWithCount = (brandsData || [])
          .map(brand => ({
            id: brand.id,
            title: brand.title,
            slug: brand.slug,
            product_count: brand.products?.length || 0
          }))
          .filter(brand => brand.product_count > 0);
        
        setBrands(brandsWithCount);
      }

      // Fetch categories with product count
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('product_cats')
        .select(`
          id,
          title,
          slug,
          products!inner(id)
        `)
        .order('title');

      if (categoriesError) {
        console.error('Error fetching categories:', categoriesError);
      } else {
        // Process categories to get product count and filter out empty ones
        const categoriesWithCount = (categoriesData || [])
          .map(category => ({
            id: category.id,
            title: category.title,
            slug: category.slug,
            product_count: category.products?.length || 0
          }))
          .filter(category => category.product_count > 0);
        
        setCategories(categoriesWithCount);
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
      brands: [],
      categories: []
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Bộ lọc</h3>
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
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Bộ lọc</h3>
        {((filters.priceRange.min !== minPrice || filters.priceRange.max !== maxPrice) || filters.brands.length > 0 || filters.categories.length > 0) && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-red-600 hover:text-red-700"
          >
            Xóa tất cả
          </button>
        )}
      </div>
      
      <div className="space-y-4">
        {/* Brand Filter */}
        {brands.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Thương hiệu</h4>
            <div className="space-y-2">
              {brands.map((brand) => (
                <label key={brand.id} className="flex items-center justify-between">
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

        {/* Category Filter */}
        {categories.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Danh mục</h4>
            <div className="space-y-2">
              {categories.map((category) => (
                <label key={category.id} className="flex items-center justify-between">
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

export default ProductFilter; 
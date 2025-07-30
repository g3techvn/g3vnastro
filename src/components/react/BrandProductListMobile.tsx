import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import type { FilterState } from '../mobile/MobileBrandFilter';
import ModalBuyNowForm from './ModalBuyNowForm';

// Component riêng cho mỗi category section
const CategorySection: React.FC<{
  categoryId: string;
  categoryTitle: string;
  categorySlug?: string;
  categoryProducts: any[];
  onProductClick: (product: any) => void;
}> = ({ categoryId, categoryTitle, categorySlug, categoryProducts, onProductClick }) => {
  const columns = Math.ceil(categoryProducts.length / 3);
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Handle scroll event to update active dot
  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollLeft = scrollRef.current.scrollLeft;
      const itemWidth = scrollRef.current.clientWidth;
      const scrollWidth = scrollRef.current.scrollWidth;
      
      // Check if scrolled to the end
      if (scrollLeft + itemWidth >= scrollWidth - 10) {
        // If near the end, set to last slide
        setCurrentSlide(columns - 1);
      } else {
        // Calculate current slide based on scroll position
        const currentIndex = Math.round(scrollLeft / itemWidth);
        setCurrentSlide(Math.min(currentIndex, columns - 1));
      }
    }
  };

  // Click on dot to scroll to specific slide
  const scrollToSlide = (index: number) => {
    if (scrollRef.current) {
      const itemWidth = scrollRef.current.clientWidth;
      scrollRef.current.scrollTo({
        left: index * itemWidth,
        behavior: 'smooth'
      });
      setCurrentSlide(index);
    }
  };

  return (
    <div className="space-y-3">
      {/* Category Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">{categoryTitle}</h3>
        <span className="text-sm text-gray-500">{categoryProducts.length} sản phẩm</span>
      </div>

      {/* Products Grid */}
      <div 
        ref={scrollRef}
        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-4 pb-2"
        onScroll={handleScroll}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {Array.from({ length: columns }).map((_, columnIndex) => (
          <div key={columnIndex} className="flex-none w-full snap-start">
            <div className="grid grid-cols-2 gap-3">
              {categoryProducts
                .slice(columnIndex * 3, (columnIndex + 1) * 3)
                .map((product) => (
                  <a key={product.id} href={`/san-pham/${product.slug}`} className="block">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col h-full overflow-hidden">
                      <div className="aspect-square w-full relative group">
                        {/* Badge giảm giá */}
                        {product.original_price && product.original_price > product.price && (
                          <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-lg z-10">
                            -{Math.round(((product.original_price - product.price) / product.original_price) * 100)}%
                          </div>
                        )}
                        <img 
                          src={product.image_square_url || product.image_url || '/images/placeholder-product.jpg'} 
                          alt={product.name} 
                          className="object-contain w-full h-full"
                        />
                      </div>
                      <div className="flex-1 flex flex-col px-2 pt-2 pb-1">
                        <div className="h-10 font-medium text-sm text-gray-900 line-clamp-2 mb-1">
                          {product.name}
                        </div>
                        <div className="flex items-end gap-2 mb-1 mt-auto">
                          <span className="text-red-600 font-bold text-base">
                            {product.price.toLocaleString('vi-VN')}₫
                          </span>
                          {product.original_price && (
                            <span className="text-xs text-gray-400 line-through">
                              {product.original_price.toLocaleString('vi-VN')}₫
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between gap-2 text-xs text-gray-500 mb-1">
                          <div className="flex items-center gap-2">
                            <span className="flex items-center gap-0.5">
                              <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                <polygon points="9.9,1.1 7.6,6.6 1.6,7.3 6.1,11.2 4.8,17.1 9.9,14.1 15,17.1 13.7,11.2 18.2,7.3 12.2,6.6"/>
                              </svg>
                              {(product.rating || 4.9).toFixed(1)}
                            </span>
                            <span>•</span>
                            <span>Đã bán {product.sold_count || 0}</span>
                          </div>
                          <button 
                            className="p-1.5 bg-red-600 text-white rounded-full shadow hover:bg-red-700 transition-colors duration-200"
                            onClick={e => {
                              e.preventDefault();
                              onProductClick(product);
                            }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </a>
                ))}
            </div>
          </div>
        ))}
      </div>

      {/* Dots indicator */}
      {columns > 1 && (
        <div className="flex justify-center space-x-2 pt-2">
          {Array.from({ length: columns }).map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToSlide(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentSlide ? 'bg-red-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

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

interface BrandProductListMobileProps {
  filters: FilterState;
  sortBy: string;
  brandId: string;
  onFilteredCountChange: (count: number) => void;
  initialProducts?: Product[];
}

const BrandProductListMobile: React.FC<BrandProductListMobileProps> = ({
  filters,
  sortBy,
  brandId,
  onFilteredCountChange,
  initialProducts = [],
}) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState<Array<{ id: string; title: string; slug: string }>>([]);
  const [loading, setLoading] = useState(initialProducts.length === 0);
  const [modalProduct, setModalProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      // Only fetch if we don't have initial products
      if (initialProducts.length > 0) {
        // Extract categories from initial products
        const uniqueCategories = Array.from(
          new Map(
            initialProducts
              .filter(p => p.product_cats)
              .map(p => [p.product_cats!.slug, { 
                id: p.pd_cat_id!, 
                title: p.product_cats!.title, 
                slug: p.product_cats!.slug 
              }])
          ).values()
        );
        setCategories(uniqueCategories);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const supabase = createClient(
          import.meta.env.PUBLIC_SUPABASE_URL,
          import.meta.env.PUBLIC_SUPABASE_ANON_KEY
        );

        // Fetch products and categories
        const [productsResult, categoriesResult] = await Promise.all([
          supabase
            .from('products')
            .select(`
              *,
              brands(title, slug),
              product_cats(title, slug)
            `)
            .eq('brand_id', brandId)
            .order('name', { ascending: true }),
          
          supabase
            .from('product_cats')
            .select('id, title, slug')
            .order('title', { ascending: true })
        ]);

        if (productsResult.error) {
          console.error('Error fetching products:', productsResult.error);
        } else {
          setProducts(productsResult.data || []);
        }

        if (categoriesResult.error) {
          console.error('Error fetching categories:', categoriesResult.error);
        } else {
          setCategories(categoriesResult.data || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [brandId, initialProducts.length]);

  // Apply filters and sorting
  const filteredAndSortedProducts = React.useMemo(() => {
    let filtered = [...products];

    // Apply price range filters
    filtered = filtered.filter(product => {
      return product.price >= filters.priceRange.min && product.price <= filters.priceRange.max;
    });

    // Apply category filters
    if (filters.categories.length > 0) {
      filtered = filtered.filter(product => 
        product.pd_cat_id && filters.categories.includes(product.pd_cat_id)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price_asc':
          return a.price - b.price;
        case 'price_desc':
          return b.price - a.price;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [products, filters, sortBy]);

  // Group products by category
  const productsByCategory = React.useMemo(() => {
    const grouped: { [key: string]: Product[] } = {};
    
    filteredAndSortedProducts.forEach(product => {
      const categoryId = product.pd_cat_id || 'uncategorized';
      if (!grouped[categoryId]) {
        grouped[categoryId] = [];
      }
      grouped[categoryId].push(product);
    });

    return grouped;
  }, [filteredAndSortedProducts]);

  useEffect(() => {
    onFilteredCountChange(filteredAndSortedProducts.length);
  }, [filteredAndSortedProducts.length, onFilteredCountChange]);

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="space-y-3">
            <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3, 4].map(j => (
                <div key={j} className="bg-white rounded-xl border border-gray-200 shadow-sm animate-pulse">
                  <div className="aspect-square w-full bg-gray-200 rounded-t-xl"></div>
                  <div className="p-2">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (filteredAndSortedProducts.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <p className="text-lg text-gray-600">Không tìm thấy sản phẩm nào.</p>
        <p className="mt-2 text-sm text-gray-500">Vui lòng thử lại với bộ lọc khác.</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-8">
        {Object.entries(productsByCategory).map(([categoryId, categoryProducts]) => {
          const category = categories.find(c => c.id === categoryId);
          return (
            <CategorySection
              key={categoryId}
              categoryId={categoryId}
              categoryTitle={category?.title || 'Khác'}
              categorySlug={category?.slug}
              categoryProducts={categoryProducts}
              onProductClick={setModalProduct}
            />
          );
        })}
      </div>
      
      {/* Modal mua hàng nhanh */}
      {modalProduct && (
        <ModalBuyNowForm
          open={!!modalProduct}
          onClose={() => setModalProduct(null)}
          product={modalProduct}
        />
      )}
    </>
  );
};

export default BrandProductListMobile;
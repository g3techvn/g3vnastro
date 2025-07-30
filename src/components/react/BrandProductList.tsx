import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import type { FilterState } from './BrandFilter';
import { EyeIcon } from '@heroicons/react/24/outline';
import ModalBuyNowForm from './ModalBuyNowForm';

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

interface BrandProductListProps {
  filters: FilterState;
  sortBy?: string;
  gridView?: string;
  brandId: string;
  onFilteredCountChange: (count: number) => void;
  initialProducts?: Product[];
}

// Simple in-memory cache for products
const productCache = new Map<string, { data: Product[]; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const BrandProductList: React.FC<BrandProductListProps> = ({ 
  filters, 
  sortBy = 'name', 
  gridView = 'grid', 
  brandId,
  onFilteredCountChange,
  initialProducts = []
}) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(initialProducts.length === 0);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<{ x: number; y: number; image: string } | null>(null);
  const [modalProduct, setModalProduct] = useState<Product | null>(null);

  useEffect(() => {
    // Only fetch if we don't have initial products
    if (initialProducts.length === 0) {
      fetchProducts();
    }
  }, [brandId, initialProducts.length]);

  useEffect(() => {
    applyFilters();
  }, [products, filters, sortBy]);

  useEffect(() => {
    onFilteredCountChange(filteredProducts.length);
  }, [filteredProducts, onFilteredCountChange]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      // Check cache first
      const cached = productCache.get(brandId);
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        setProducts(cached.data);
        setLoading(false);
        return;
      }

      const supabase = createClient(
        import.meta.env.PUBLIC_SUPABASE_URL,
        import.meta.env.PUBLIC_SUPABASE_ANON_KEY
      );

      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          brands(title, slug),
          product_cats(title, slug)
        `)
        .eq('brand_id', brandId)
        .order('name', { ascending: true });

      if (error) {
        setError(error.message);
      } else {
        const products = data || [];
        setProducts(products);
        
        // Cache the results
        productCache.set(brandId, {
          data: products,
          timestamp: Date.now()
        });
      }
    } catch (err) {
      setError('Có lỗi xảy ra khi tải sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
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

    setFilteredProducts(filtered);
  };

  if (loading) {
    return (
      <div className={gridView === 'grid' 
        ? `grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5`
        : 'space-y-4'
      }>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm animate-pulse">
            <div className="aspect-square w-full bg-gray-200 rounded-t-xl"></div>
            <div className="p-2">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-6 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
        <p className="text-lg text-red-600">Đã xảy ra lỗi: {error}</p>
        <p className="mt-2 text-sm text-gray-500">Vui lòng thử lại sau.</p>
      </div>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <div className="col-span-full bg-white rounded-lg border border-gray-200 p-8 text-center">
        <p className="text-lg text-gray-600">Không tìm thấy sản phẩm nào của thương hiệu này.</p>
        <p className="mt-2 text-sm text-gray-500">Vui lòng thử lại với bộ lọc khác.</p>
      </div>
    );
  }

  return (
    <>
      <div className={gridView === 'grid' 
        ? `grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5`
        : 'space-y-4'
      }>
        {/* Preview popup */}
        {preview && (
          <div
            style={{
              position: 'fixed',
              left: Math.min(preview.x + 24, window.innerWidth - 400),
              top: Math.max(preview.y - 200, 16),
              zIndex: 9999,
              pointerEvents: 'none',
            }}
            className="shadow-2xl rounded-xl border border-gray-200 bg-white p-2 animate-fade-in"
          >
            <img
              src={preview.image}
              alt="Preview"
              className="w-96 h-96 object-contain rounded-xl"
            />
          </div>
        )}
        
        {filteredProducts.map(product => (
          <a key={product.id} href={`/san-pham/${product.slug}`} className="block">
            <div className={gridView === 'grid' 
              ? 'bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col h-full overflow-hidden'
              : 'bg-white rounded-lg border border-gray-200 shadow-sm flex p-4'
            }>
              <div className={gridView === 'grid' ? 'aspect-square w-full relative group' : 'w-24 h-24 flex-shrink-0 relative group'}>
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
                {/* Quick view icon */}
                <button
                  type="button"
                  aria-label="Xem nhanh"
                  className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/10 rounded transition-all duration-200 opacity-0 group-hover:opacity-100 z-10"
                  tabIndex={-1}
                  onMouseEnter={e => {
                    setPreview({
                      x: e.clientX,
                      y: e.clientY,
                      image: product.image_url || '/images/placeholder-product.jpg',
                    });
                  }}
                  onMouseMove={e => {
                    setPreview(prev => prev ? { ...prev, x: e.clientX, y: e.clientY } : null);
                  }}
                  onMouseLeave={() => setPreview(null)}
                  onClick={e => e.preventDefault()}
                >
                  <span className="bg-white/90 text-gray-700 rounded-full p-2 shadow hover:bg-red-600 hover:text-white transition-colors duration-200">
                    <EyeIcon className="h-5 w-5" />
                  </span>
                </button>
              </div>
              <div className={gridView === 'grid' 
                ? 'flex-1 flex flex-col px-2 pt-2 pb-1'
                : 'flex-1 ml-4 flex flex-col justify-between'
              }>
                <div className={gridView === 'grid' ? 'h-10 font-medium text-sm text-gray-900 line-clamp-2 mb-1' : 'font-medium text-gray-900 mb-2'}>
                  {product.name}
                </div>
                <div className={gridView === 'grid' ? 'flex items-end gap-2 mb-1 mt-auto' : 'flex items-end gap-2 mb-2'}>
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
                      setModalProduct(product);
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

export default BrandProductList;
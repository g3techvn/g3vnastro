import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import type { FilterState } from './ProductFilter';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  original_price?: number;
  image_url?: string;
  rating?: number;
  sold_count?: number;
  brand_id?: string;
  pd_cat_id?: string;
  brands?: { title: string; slug: string };
  product_cats?: { title: string; slug: string };
}

interface ProductListProps {
  filters: FilterState;
  sortBy?: string;
  gridView?: string;
}

const ProductList: React.FC<ProductListProps> = ({ filters, sortBy = 'price_desc', gridView = 'grid' }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [products, filters, sortBy]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
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
        .order('created_at', { ascending: false });

      if (error) {
        setError(error.message);
      } else {
        setProducts(data || []);
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
    if (filters.priceRange.length > 0) {
      filtered = filtered.filter(product => {
        return filters.priceRange.some(range => {
          switch (range) {
            case 'under_500k':
              return product.price < 500000;
            case '500k_1m':
              return product.price >= 500000 && product.price < 1000000;
            case '1m_2m':
              return product.price >= 1000000 && product.price < 2000000;
            case 'over_2m':
              return product.price >= 2000000;
            default:
              return true;
          }
        });
      });
    }

    // Apply brand filters
    if (filters.brands.length > 0) {
      filtered = filtered.filter(product => 
        product.brand_id && filters.brands.includes(product.brand_id)
      );
    }

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
        case 'name_asc':
          return a.name.localeCompare(b.name);
        case 'name_desc':
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  };

  const addToCart = (event: React.MouseEvent, product: Product) => {
    event.preventDefault();
    
    // Get existing cart from localStorage
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Check if product already exists in cart
    const existingItemIndex = existingCart.findIndex((item: any) => item.id === product.id);
    
    if (existingItemIndex > -1) {
      // Increment quantity if product already exists
      existingCart[existingItemIndex].quantity += 1;
    } else {
      // Add new product to cart
      existingCart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image_url: product.image_url,
        slug: product.slug,
        quantity: 1,
        image: product.image_url || ''
      });
    }
    
    // Save back to localStorage
    localStorage.setItem('cart', JSON.stringify(existingCart));
    
    // Show success message
    alert('Đã thêm sản phẩm vào giỏ hàng!');
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
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
        <p className="text-lg text-gray-600">Không tìm thấy sản phẩm nào.</p>
        <p className="mt-2 text-sm text-gray-500">Vui lòng thử lại với bộ lọc khác.</p>
      </div>
    );
  }

  return (
    <div className={gridView === 'grid' 
      ? `grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5`
      : 'space-y-4'
    }>
      {filteredProducts.map(product => (
        <a key={product.id} href={`/san-pham/${product.slug}`} className="block">
          <div className={gridView === 'grid' 
            ? 'bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col h-full overflow-hidden'
            : 'bg-white rounded-lg border border-gray-200 shadow-sm flex p-4'
          }>
            <div className={gridView === 'grid' ? 'aspect-square w-full' : 'w-24 h-24 flex-shrink-0'}>
              <img 
                src={product.image_url || '/images/placeholder-product.jpg'} 
                alt={product.name} 
                className="object-contain w-full h-full"
              />
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
                  onClick={(e) => addToCart(e, product)}
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
  );
};

export default ProductList; 
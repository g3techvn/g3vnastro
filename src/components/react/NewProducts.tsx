import React, { useState, useEffect } from 'react';
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
  brand?: string;
}

interface NewProductsProps {
  products?: Product[];
}

export default function NewProducts({ products: initialProducts = [] }: NewProductsProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState(!initialProducts.length);
  const [error, setError] = useState<string | null>(null);
  const [modalProduct, setModalProduct] = useState<Product | null>(null);

  // Fetch products from API if not provided
  useEffect(() => {
    if (initialProducts.length > 0) {
      setProducts(initialProducts);
      return;
    }

    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/new-products');
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.error || 'Lỗi khi tải sản phẩm mới');
        }
        
        if (!data.products || !Array.isArray(data.products)) {
          throw new Error('Dữ liệu sản phẩm không hợp lệ');
        }
        
        setProducts(data.products);
      } catch (err: unknown) {
        console.error('Error fetching new products:', err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Lỗi không xác định khi tải sản phẩm mới');
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [initialProducts.length]);

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
        ...product,
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
      <section className="mx-10 py-8 bg-gray-100">
        <div className="">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold border-b-2 border-gray-300 pb-2 uppercase">
              Mới lên kệ
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-lg mb-3"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-6 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mx-10 py-8 bg-gray-100">
        <div className="">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold border-b-2 border-gray-300 pb-2 uppercase">
              Mới lên kệ
            </h2>
          </div>
          <div className="text-center py-8">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="mx-10 py-8 bg-gray-100">
      <div className="">
        <div className="mb-6">
          <h2 className="text-xl font-bold border-b-2 border-gray-300 pb-2 uppercase">
            Mới lên kệ
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {products.map((product) => (
              <a key={product.id} href={`/san-pham/${product.slug}`} className="block">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col h-full overflow-hidden">
                  <div className="aspect-square w-full relative">
                    <img
                      src={product.image_square_url || product.image_url || '/images/placeholder-product.jpg'}
                      alt={product.name}
                      className="object-contain w-full h-full"
                    />
                    {/* New badge */}
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                      Mới
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col px-2 pt-2 pb-1">
                    <div className="h-10 font-medium text-sm text-gray-900 line-clamp-2 mb-1">{product.name}</div>
                    <div className="flex items-end gap-2 mb-1 mt-auto">
                      <span className="text-red-600 font-bold text-base">{product.price.toLocaleString('vi-VN')}₫</span>
                      {product.original_price && (
                        <span className="text-xs text-gray-400 line-through">{product.original_price.toLocaleString('vi-VN')}₫</span>
                      )}
                    </div>
                    {/* Đánh giá, đã bán và nút thêm giỏ hàng */}
                    <div className="flex items-center justify-between gap-2 text-xs text-gray-500 mb-1">
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-0.5">
                          <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><polygon points="9.9,1.1 7.6,6.6 1.6,7.3 6.1,11.2 4.8,17.1 9.9,14.1 15,17.1 13.7,11.2 18.2,7.3 12.2,6.6 "/></svg>
                          {(product.rating || 4.9).toFixed(1)}
                        </span>
                        <span>•</span>
                        <span>Đã bán {product.sold_count || 0}</span>
                      </div>
                      <button 
                        className="p-1.5 bg-red-600 text-white rounded-full shadow hover:bg-red-700 transition-colors duration-200"
                        aria-label="Thêm vào giỏ hàng"
                        onClick={e => {
                          e.preventDefault();
                          setModalProduct(product);
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
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
      </div>
    </section>
  );
}

// CSS for line-clamp
const styles = `
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = styles;
  document.head.appendChild(styleElement);
} 
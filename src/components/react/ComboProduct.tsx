import React, { useState, useEffect } from 'react';
import ModalBuyNowForm from './ModalBuyNowForm';

interface Product {
  id: string;
  name: string;
  price: number;
  original_price?: number;
  image_url: string;
  slug?: string;
  brand_id?: string;
  category_id?: string;
  rating?: number;
  sold_count?: number;
}

interface ComboProductProps {
  products?: Product[];
}

const ProductCard: React.FC<{ product: Product; onBuyNow: (product: Product) => void }> = ({ product, onBuyNow }) => {
  const discountPercentage = product.original_price && product.original_price > product.price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col h-full overflow-hidden">
      <div className="aspect-square w-full relative group">
        {discountPercentage > 0 && (
          <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-lg z-10">
            -{discountPercentage}%
          </div>
        )}
        <a href={`/san-pham/${product.slug || product.id}`}>
          <img
            src={product.image_url}
            alt={product.name}
            className="object-contain w-full h-full cursor-pointer"
          />
        </a>
      </div>
      <a href={`/san-pham/${product.slug || product.id}`} className="block">
        <div className="flex-1 flex flex-col px-2 pt-2 pb-1">
          <div className="h-10 font-medium text-sm text-gray-900 line-clamp-2 mb-1">{product.name}</div>
          <div className="flex items-end gap-2 mb-1 mt-auto">
            <span className="text-red-600 font-bold text-base">{product.price.toLocaleString()}₫</span>
            {product.original_price && (
              <span className="text-xs text-gray-400 line-through">{product.original_price.toLocaleString()}₫</span>
            )}
          </div>
          <div className="flex items-center justify-between gap-2 text-xs text-gray-500 mb-1">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-0.5">
                <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <polygon points="9.9,1.1 7.6,6.6 1.6,7.3 6.1,11.2 4.8,17.1 9.9,14.1 15,17.1 13.7,11.2 18.2,7.3 12.2,6.6" />
                </svg>
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
                onBuyNow(product);
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </button>
          </div>
        </div>
      </a>
    </div>
  );
};

const ComboProduct: React.FC<ComboProductProps> = ({ products: initialProducts = [] }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState(!initialProducts.length);
  const [error, setError] = useState<string | null>(null);
  const [modalProduct, setModalProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (initialProducts.length === 0) {
      fetchComboProducts();
    }
  }, [initialProducts.length]);

  const fetchComboProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/combo-products');
      const data = await response.json();

      if (response.ok) {
        setProducts(data.products || []);
      } else {
        setError(data.error || 'Failed to fetch products');
      }
    } catch (err) {
      setError('Failed to fetch products');
      console.error('Error fetching combo products:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="mx-10 py-8 bg-gray-100">
        <div className="">
          <h2 className="text-xl font-bold border-b-2 border-gray-300 pb-2 mb-6 uppercase">
            Combo sản phẩm
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm h-64 animate-pulse">
                <div className="bg-gray-200 h-32 rounded-t-xl"></div>
                <div className="p-2">
                  <div className="bg-gray-200 h-4 rounded mb-2"></div>
                  <div className="bg-gray-200 h-6 rounded mb-2"></div>
                  <div className="bg-gray-200 h-3 rounded"></div>
                </div>
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
          <h2 className="text-xl font-bold border-b-2 border-gray-300 pb-2 mb-6 uppercase">
            Combo sản phẩm
          </h2>
          <div className="text-center py-8">
            <p className="text-gray-500">Không thể tải sản phẩm. Vui lòng thử lại sau.</p>
            <button
              onClick={fetchComboProducts}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
            >
              Thử lại
            </button>
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
        <h2 className="text-xl font-bold border-b-2 border-gray-300 pb-2 mb-6 uppercase">
          Sản phẩm ghế công thái học
        </h2>

        {/* Layout with banner (4 cols) left and 2 products right */}
        <div className="grid grid-cols-6 gap-4 mb-4">
          {/* Banner - takes 4 columns */}
          <div className="col-span-6 lg:col-span-4 relative h-[250px] lg:h-[400px] rounded-lg overflow-hidden">
            <img
              src="/images/header-img.jpg"
              alt="Combo Sản Phẩm"
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent flex flex-col justify-center pl-6 md:pl-12">
              <h3 className="text-white text-lg md:text-2xl font-bold mb-1">Nội Thất Văn Phòng</h3>
              <p className="text-white/90 text-xs md:text-sm max-w-md lg:max-w-lg">
                Nâng tầm không gian làm việc với bộ sưu tập nội thất văn phòng cao cấp, thiết kế hiện đại và tiện nghi
              </p>
              <a href="#" className="mt-3 inline-block bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors max-w-fit">
                Khám phá ngay
              </a>
            </div>
          </div>

          {/* First 2 products - takes 1 column each */}
          {products.slice(0, 2).map((product) => (
            <div key={product.id} className="col-span-3 lg:col-span-1">
              <ProductCard product={product} onBuyNow={setModalProduct} />
            </div>
          ))}
        </div>

        {/* Row 2 with remaining products */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {products.slice(2).map((product) => (
            <div key={product.id}>
              <ProductCard product={product} onBuyNow={setModalProduct} />
            </div>
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
};

export default ComboProduct; 
import React, { useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface Product {
  id: number;
  name: string;
  slug: string;
  brand: string;
  brand_slug: string;
  price: number;
  original_price?: number;
  image_url: string;
  rating: number;
  sold_count: number;
  gallery_array: string[];
  badge?: string;
}

const ProductSlider: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const itemsPerSlide = 4;
  const totalSlides = Math.ceil(products.length / itemsPerSlide);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/enterprise-products');
        
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }

        const data = await response.json();
        setProducts(data.products || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (isAutoPlaying && totalSlides > 1) {
      const interval = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % totalSlides);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isAutoPlaying, totalSlides]);

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % totalSlides);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + totalSlides) % totalSlides);
    setIsAutoPlaying(false);
  };

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'Bán chạy':
        return 'bg-red-500 text-white';
      case 'Nổi bật':
        return 'bg-purple-500 text-white';
      case 'Phổ biến':
        return 'bg-orange-500 text-white';
      case 'Giá tốt':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const getProductImage = (product: Product) => {
    if (product.image_url) return product.image_url;
    if (product.gallery_array && product.gallery_array.length > 0) {
      return product.gallery_array[0];
    }
    return '/images/placeholder-product.jpg';
  };

  if (loading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-gray-500 bg-white">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Đang tải sản phẩm...
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="text-red-800">
                <strong>Lỗi:</strong> {error}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <div className="text-yellow-800">
                Không có sản phẩm nào phù hợp với tiêu chí tìm kiếm.
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Sản phẩm 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-500">
              nổi bật
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Tuyển chọn các sản phẩm ghế công thái học chất lượng cao, phù hợp cho doanh nghiệp với mức giá từ 1-3 triệu đồng
          </p>
        </div>

        {/* Product Slider */}
        <div className="relative">
          <div className="overflow-hidden rounded-2xl">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {Array.from({ length: totalSlides }, (_, slideIndex) => (
                <div key={slideIndex} className="w-full flex-shrink-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
                    {products
                      .slice(slideIndex * itemsPerSlide, (slideIndex + 1) * itemsPerSlide)
                      .map((product) => (
                        <div key={product.id} className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                          <div className="relative overflow-hidden rounded-t-xl">
                            <img 
                              src={getProductImage(product)} 
                              alt={product.name}
                              className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            {/* Badge */}
                            {product.badge && (
                              <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold ${getBadgeColor(product.badge)}`}>
                                {product.badge}
                              </div>
                            )}
                            {/* Brand */}
                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                              <span className="text-xs font-medium text-gray-700">{product.brand}</span>
                            </div>
                          </div>
                          
                          <div className="p-6">
                                                         <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
                              {product.name}
                            </h3>
                            
                            {/* Rating */}
                            <div className="flex items-center mb-3">
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <svg
                                    key={i}
                                    className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                              </div>
                              <span className="text-sm text-gray-500 ml-2">({product.rating})</span>
                            </div>
                            
                            {/* Price */}
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center space-x-2">
                                <span className="text-xl font-bold text-red-600">
                                  {formatPrice(product.price)}
                                </span>
                                {product.original_price && product.original_price > product.price && (
                                  <span className="text-sm text-gray-500 line-through">
                                    {formatPrice(product.original_price)}
                                  </span>
                                )}
                              </div>
                              {product.original_price && product.original_price > product.price && (
                                <span className="text-sm bg-red-100 text-red-800 px-2 py-1 rounded">
                                  -{Math.round(((product.original_price - product.price) / product.original_price) * 100)}%
                                </span>
                              )}
                            </div>
                            
                            {/* Sold count */}
                            <div className="text-sm text-gray-500 mb-4">
                              Đã bán: {product.sold_count}
                            </div>
                            
                            {/* CTA Button */}
                                                         <a
                              href={`/san-pham/${product.slug}`}
                              className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-4 rounded-lg font-semibold text-center hover:from-red-700 hover:to-red-800 transition-all duration-300 transform hover:scale-105 inline-block"
                            >
                              Xem chi tiết
                            </a>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Navigation buttons */}
          {totalSlides > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-white transition-all duration-300 z-10"
              >
                <ChevronLeftIcon className="h-6 w-6 text-gray-600" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-white transition-all duration-300 z-10"
              >
                <ChevronRightIcon className="h-6 w-6 text-gray-600" />
              </button>
            </>
          )}
        </div>
        
        {/* Slide indicators */}
        {totalSlides > 1 && (
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: totalSlides }, (_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                                 className={`w-3 h-3 rounded-full transition-all duration-300 ${
                   index === currentSlide ? 'bg-red-600' : 'bg-gray-300'
                 }`}
              />
            ))}
          </div>
        )}
        
        {/* View all products button */}
        <div className="text-center mt-12">
                     <a
             href="/san-pham"
             className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 transform hover:scale-105"
           >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
            Xem tất cả sản phẩm
          </a>
        </div>
      </div>
    </section>
  );
};

export default ProductSlider; 
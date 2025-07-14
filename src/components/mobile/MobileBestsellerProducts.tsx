import React, { useEffect, useState, useRef } from "react";
import type { Product } from "../../types";
import ModalBuyNowForm from '../react/ModalBuyNowForm';

const bannerImages = [
  "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&auto=format",
  "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200&auto=format",
  "https://images.unsplash.com/photo-1449247709967-d4461a6a6103?w=1200&auto=format",
  "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200&auto=format",
  "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=1200&auto=format",
  "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&auto=format",
];

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  }).format(amount);
}

function getRandomBanner(idx: number): string {
  return bannerImages[idx % bannerImages.length];
}

const MobileBestsellerProductsIsland: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalProduct, setModalProduct] = useState<Product | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/new-products")
      .then((res) => res.json())
      .then((data) => {
        const items = data.products || data;
        setProducts(Array.isArray(items) ? items.slice(0, 5) : []); // chỉ lấy 5 item
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Handle scroll event to update active dot
  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollLeft = scrollRef.current.scrollLeft;
      const itemWidth = scrollRef.current.clientWidth;
      const scrollWidth = scrollRef.current.scrollWidth;
      const totalSlides = products.length;
      
      // Check if scrolled to the end
      if (scrollLeft + itemWidth >= scrollWidth - 10) {
        // If near the end, set to last slide
        setCurrentSlide(totalSlides - 1);
      } else {
        // Calculate current slide based on scroll position
        const currentIndex = Math.round(scrollLeft / itemWidth);
        setCurrentSlide(Math.min(currentIndex, totalSlides - 1));
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

  if (loading) return <div>Đang tải...</div>;

  return (
    <section className="pt-4">
      <div className="flex items-center justify-between px-4 mb-2">
        <h2 className="text-lg font-semibold text-red-700">Sản phẩm bán chạy</h2>
        <div className="flex gap-1">
          {products.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide ? "bg-red-500 w-4" : "bg-gray-300 w-2"
              }`}
            />
          ))}
        </div>
      </div>
      <div className="relative">
        <div 
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto flex-nowrap snap-x snap-mandatory px-4 pb-8 scrollbar-hide"
          onScroll={handleScroll}
        >
          {products.map((product, idx) => (
            <div key={product.id} className="w-[95%] min-w-[320px] mx-auto space-y-3 snap-center">
              <div className="relative w-full aspect-video">
                <img
                  src={getRandomBanner(idx)}
                  alt={`Banner ${product.name}`}
                  className="object-cover rounded-lg w-full h-full"
                  loading="lazy"
                />
              </div>
              <a href={`/san-pham/${product.slug || product.id}`} className="bg-white rounded-lg shadow overflow-hidden block">
                <div className="flex items-center p-2">
                  <div className="relative w-20 h-20">
                    <img
                      src={product.image_url || "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=200&auto=format"}
                      alt={product.name}
                      className="rounded-lg object-cover w-full h-full"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex-1 min-w-0 ml-2">
                    <div className="font-medium text-sm line-clamp-2">{product.name}</div>
                    <div className="flex items-center justify-between mt-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-red-500 font-semibold">{formatCurrency(product.price)}</span>
                        {product.sale_price && product.sale_price > product.price && (
                          <span className="text-xs text-gray-500 line-through">{formatCurrency(product.sale_price)}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-0.5">
                          <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <polygon points="9.9,1.1 7.6,6.6 1.6,7.3 6.1,11.2 4.8,17.1 9.9,14.1 15,17.1 13.7,11.2 18.2,7.3 12.2,6.6 " />
                          </svg>
                          {4.9.toFixed(1)}
                        </span>
                        <span>•</span>
                        <span>Đã bán {product.sold_count || 0}</span>
                      </div>
                      <button
                        className="p-1.5 bg-red-600 text-white rounded-full shadow hover:bg-red-700 transition-colors duration-200"
                        aria-label="Thêm vào giỏ hàng"
                        onClick={(e) => {
                          e.preventDefault();
                          setModalProduct(product);
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
      {/* Modal mua hàng nhanh */}
      {modalProduct && (
        <ModalBuyNowForm
          open={!!modalProduct}
          onClose={() => setModalProduct(null)}
          product={{
            name: modalProduct.name,
            price: modalProduct.price,
            image_url: modalProduct.image_url,
            original_price: modalProduct.original_price,
          }}
        />
      )}
    </section>
  );
};

export default MobileBestsellerProductsIsland; 
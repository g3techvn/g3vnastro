import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import type { FilterState } from './CategoryFilter';
import ModalBuyNowForm from './ModalBuyNowForm';

// Component riêng cho mỗi brand section
const BrandSection: React.FC<{
  brandId: string;
  brandTitle: string;
  brandSlug?: string;
  brandProducts: any[];
  onProductClick: (product: any) => void;
}> = ({ brandId, brandTitle, brandSlug, brandProducts, onProductClick }) => {
  const columns = Math.ceil(brandProducts.length / 3);
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
      <div className="flex items-center justify-between px-4">
        <a href={brandSlug ? `/brands/${brandSlug}` : '#'} className="group">
          <h2 className="text-lg font-semibold text-red-700 group-hover:underline">
            Thương hiệu {brandTitle}
          </h2>
        </a>
        {brandProducts.length > 3 && (
          <div className="flex gap-1">
            {Array.from({ length: columns }).map((_, index) => (
              <button
                key={index}
                onClick={() => scrollToSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide ? 'bg-red-500 w-4' : 'bg-gray-300 w-2'
                }`}
              />
            ))}
          </div>
        )}
      </div>
      <div 
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto flex-nowrap snap-x snap-mandatory px-4 pb-4 scrollbar-hide"
        onScroll={handleScroll}
      >
        {Array.from({ length: columns }).map((_, colIdx) => (
          <div className="w-[95%] min-w-[320px] mx-auto space-y-3 snap-center" key={colIdx}>
            {brandProducts.slice(colIdx * 3, colIdx * 3 + 3).map((product) => (
              <a
                href={`/san-pham/${product.slug || product.id}`}
                className="bg-white rounded-lg shadow overflow-hidden block"
                key={product.id}
              >
                <div className="flex items-center p-2">
                  <div className="relative w-20 h-20">
                    <img
                      src={product.image_square_url || product.image_url || '/images/placeholder-product.jpg'}
                      alt={product.name}
                      className="rounded-lg object-contain w-full h-full"
                    />
                  </div>
                  <div className="flex-1 min-w-0 ml-2">
                    <div className="font-medium text-sm line-clamp-2">
                      {product.name}
                    </div>
                    <div className="flex items-center justify-between mt-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-red-500 font-semibold">
                          {product.price.toLocaleString('vi-VN')}₫
                        </span>
                        {product.original_price && product.original_price > product.price && (
                          <span className="text-xs text-gray-500 line-through">
                            {product.original_price.toLocaleString('vi-VN')}₫
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
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
                        aria-label={`Thêm vào giỏ hàng`}
                        onClick={(e) => {
                          e.preventDefault();
                          onProductClick(product);
                        }}
                        type="button"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        ))}
      </div>
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

interface CategoryProductListMobileProps {
  filters: FilterState;
  sortBy: string;
  categoryId: string;
  onFilteredCountChange: (count: number) => void;
  initialProducts?: Product[];
}

const CategoryProductListMobile: React.FC<CategoryProductListMobileProps> = ({
  filters,
  sortBy,
  categoryId,
  onFilteredCountChange,
  initialProducts = [],
}) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [brands, setBrands] = useState<Array<{ id: string; title: string; slug: string }>>([]);
  const [loading, setLoading] = useState(initialProducts.length === 0);
  const [modalProduct, setModalProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      // Only fetch if we don't have initial products
      if (initialProducts.length > 0) {
        // Extract brands from initial products
        const uniqueBrands = Array.from(
          new Map(
            initialProducts
              .filter(p => p.brands)
              .map(p => [p.brands!.slug, { 
                id: p.brand_id!, 
                title: p.brands!.title, 
                slug: p.brands!.slug 
              }])
          ).values()
        );
        setBrands(uniqueBrands);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const supabase = createClient(
          import.meta.env.PUBLIC_SUPABASE_URL,
          import.meta.env.PUBLIC_SUPABASE_ANON_KEY
        );

        // Fetch products and brands
        const [productsResult, brandsResult] = await Promise.all([
          supabase
            .from('products')
            .select(`
              *,
              brands(title, slug),
              product_cats(title, slug)
            `)
            .eq('pd_cat_id', categoryId)
            .order('name', { ascending: true }),
          supabase
            .from('brands')
            .select('id, title, slug')
            .order('title', { ascending: true })
        ]);

        if (productsResult.error) {
          console.error('Error fetching products:', productsResult.error);
          setProducts([]);
        } else {
          console.log('Raw products data:', productsResult.data);
          console.log('Category ID:', categoryId);
          
          // Apply filters and sorting
          let filtered = productsResult.data || [];
          
          // Apply price range filters
          filtered = filtered.filter(product => {
            return product.price >= filters.priceRange.min && product.price <= filters.priceRange.max;
          });

          // Apply brand filters
          if (filters.brands.length > 0) {
            filtered = filtered.filter(product => 
              product.brand_id && filters.brands.includes(product.brand_id)
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

          console.log('Filtered products:', filtered);
          setProducts(filtered);
          onFilteredCountChange(filtered.length);
        }

        if (brandsResult.error) {
          console.error('Error fetching brands:', brandsResult.error);
          setBrands([]);
        } else {
          setBrands(brandsResult.data || []);
        }
      } catch (error) {
        console.error('Error:', error);
        setProducts([]);
        onFilteredCountChange(0);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters, sortBy, categoryId, onFilteredCountChange]);

  // Group products by brand_id
  const productsByBrand: Record<string, typeof products> = {};
  for (const product of products) {
    const brandId = product.brand_id || 'unknown';
    if (!productsByBrand[brandId]) productsByBrand[brandId] = [];
    productsByBrand[brandId].push(product);
  }
  // Sort products by price within each brand
  for (const brandId in productsByBrand) {
    productsByBrand[brandId].sort((a, b) => a.price - b.price);
  }

  // Map for brand info
  const brandsMap: Record<string, { id: string; title: string; slug: string }> = {};
  for (const brand of brands) {
    brandsMap[brand.id] = brand;
  }

  // Sort brand entries alphabetically
  const sortedBrandEntries: [string, typeof products][] = Object.entries(productsByBrand).sort(([brandIdA], [brandIdB]) => {
    const brandA = brandsMap[brandIdA]?.title || '';
    const brandB = brandsMap[brandIdB]?.title || '';
    return brandA.toLowerCase().localeCompare(brandB.toLowerCase());
  });

  if (loading) {
    return <div className="p-4 text-center text-gray-500">Đang tải sản phẩm và thương hiệu...</div>;
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 mb-2">Không tìm thấy sản phẩm nào</div>
        <div className="text-sm text-gray-400">Thử điều chỉnh bộ lọc để xem thêm sản phẩm</div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {sortedBrandEntries.map(([brandId, brandProducts]) => {
          const brandTitle = brandsMap[brandId]?.title || 'Không xác định';
          const brandSlug = brandsMap[brandId]?.slug;
          
          return (
            <BrandSection
              key={brandId}
              brandId={brandId}
              brandTitle={brandTitle}
              brandSlug={brandSlug}
              brandProducts={brandProducts}
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

export default CategoryProductListMobile;
import React, { useEffect, useState } from 'react';

function formatCurrency(value: number) {
  return value?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) || '';
}

const MobileFeatureProduct: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [brands, setBrands] = useState<Array<{ id: string; title: string; slug: string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch('/api/mobile-feature-products')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products || []);
        setBrands(data.brands || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

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

  return (
    <section className="pt-4 pb-20">
      <div className="space-y-6">
        {sortedBrandEntries.map(([brandId, brandProducts]) => {
          const brandTitle = brandsMap[brandId]?.title || 'Không xác định';
          const brandSlug = brandsMap[brandId]?.slug;
          const columns = Math.ceil(brandProducts.length / 3);
          return (
            <div className="space-y-3" key={brandId}>
              <div className="flex items-center justify-between px-4">
                <a href={brandSlug ? `/brands/${brandSlug}` : '#'} className="group">
                  <h2 className="text-lg font-semibold text-red-700 group-hover:underline">
                    Thương hiệu {brandTitle}
                  </h2>
                </a>
                {brandProducts.length > 3 && (
                  <div className="flex gap-1">
                    {Array.from({ length: columns }).map((_, index) => (
                      <div
                        className="h-2 rounded-full bg-gray-300 w-2"
                        key={index}
                      />
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-4 overflow-x-auto flex-nowrap snap-x snap-mandatory px-4 pb-4 scrollbar-hide">
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
                              src={product.image_url || 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=200&auto=format'}
                              alt={product.name}
                              className="rounded-lg object-cover w-full h-full"
                            />
                          </div>
                          <div className="flex-1 min-w-0 ml-2">
                            <div className="font-medium text-sm line-clamp-2">
                              {product.name}
                            </div>
                            <div className="flex items-center justify-between mt-0.5">
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-red-500 font-semibold">
                                  {formatCurrency(product.price)}
                                </span>
                                {product.original_price && product.original_price > product.price && (
                                  <span className="text-xs text-gray-500 line-through">
                                    {formatCurrency(product.original_price)}
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
                                onClick={() => alert(`Thêm ${product.name} vào giỏ hàng (mock)`)}
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
        })}
      </div>
    </section>
  );
};

export default MobileFeatureProduct; 
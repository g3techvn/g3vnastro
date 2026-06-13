import type { APIRoute } from 'astro';
import { getAllProducts } from '../../lib/collections';

export const GET: APIRoute = async () => {
  try {
    const allProducts = await getAllProducts();

    // Filter products with price between 1M and 3M VND
    const filtered = allProducts
      .filter(p => p.price >= 1000000 && p.price <= 3000000)
      .sort((a, b) => (b.sold_count ?? 0) - (a.sold_count ?? 0))
      .slice(0, 16);

    const transformedProducts = filtered.map(product => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      original_price: product.original_price ?? null,
      image_url: product.image_url ?? null,
      rating: product.rating ?? 0,
      sold_count: product.sold_count ?? 0,
      gallery_array: product.gallery_array || [],
      brand: product.brands?.title || '',
      brand_slug: product.brands?.slug || '',
      badge: product.price <= 1500000 ? 'Giá tốt' :
             product.price <= 2000000 ? 'Phổ biến' :
             (product.sold_count ?? 0) > 100 ? 'Bán chạy' : 'Nổi bật'
    }));

    return new Response(JSON.stringify({ products: transformedProducts }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
};

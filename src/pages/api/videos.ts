import type { APIRoute } from 'astro';
import { getAllProducts, getAllBrands } from '../../lib/collections';

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');

    const offset = (page - 1) * limit;

    const allProducts = await getAllProducts();
    const brands = await getAllBrands();
    const brandMap: Record<number, string> = {};
    brands.forEach(b => { brandMap[b.id] = b.title; });

    // Only products with video_url
    const withVideo = allProducts.filter(p => p.video_url);
    const products = withVideo.slice(offset, offset + limit);

    const transformedProducts = products.map(product => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description || '',
      price: product.price,
      original_price: product.original_price || null,
      image_url: product.image_url || null,
      video_url: product.video_url || null,
      rating: product.rating || null,
      brand_id: product.brand_id || null,
      brand: product.brand_id ? brandMap[product.brand_id] : null,
      sold_count: product.sold_count || 0,
      gallery_url: product.slug
    }));

    return new Response(
      JSON.stringify({ 
        products: transformedProducts,
        total: transformedProducts.length,
        page,
        limit,
        hasMore: transformedProducts.length === limit
      }),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error in videos API:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};

import type { APIRoute } from 'astro';
import { getAllProducts } from '../../lib/collections';

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const videoOnly = url.searchParams.get('video_only') === 'true';

    const offset = (page - 1) * limit;

    const allProducts = await getAllProducts();
    let filtered = videoOnly
      ? allProducts.filter(p => p.video_url)
      : allProducts;
    const products = filtered.slice(offset, offset + limit);

    const transformedProducts = products.map(product => {
      // Get optimized image if available
      const optimizedImages = (product as any)._optimized_image || [];
      const thumbnailImage = optimizedImages.length > 0 
        ? optimizedImages.find((img: any) => img.width === 200) || optimizedImages[0]
        : null;

      return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description || '',
        price: product.price,
        original_price: product.original_price || null,
        image_url: product.image_url || null,
        optimized_image_url: thumbnailImage?.path || null,
        video_url: product.video_url || null,
        rating: product.rating || null,
        brand_id: product.brand_id || null,
        brand: product.brands?.title || null,
        sold_count: product.sold_count || 0,
        gallery_url: product.slug
      };
    });

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
    console.error('Error in products API:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};
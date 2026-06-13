import type { APIRoute } from 'astro';
import { getFeaturedProductsByIds } from '../../lib/collections';

export const GET: APIRoute = async () => {
  try {
    // New arrivals - newest products (IDs 10-14 are the new Gami products)
    const featuredProductIds = [10, 11, 12, 13, 14, 1];

    const products = await getFeaturedProductsByIds(featuredProductIds);

    const orderedProducts = featuredProductIds
      .map(id => products.find(p => p.id === id))
      .filter(p => p !== undefined);

    const transformedProducts = orderedProducts.map(product => {
      // Get optimized image if available
      const optimizedImages = (product as any)._optimized_image || [];
      const thumbnailImage = optimizedImages.length > 0 
        ? optimizedImages.find((img: any) => img.width === 200) || optimizedImages[0]
        : null;

      return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        original_price: product.original_price,
        image_url: product.image_url,
        image_square_url: product.image_url, // fallback
        optimized_image_url: thumbnailImage?.path || null,
        rating: product.rating,
        sold_count: product.sold_count,
        brand: product.brands?.title || ''
      };
    });

    return new Response(JSON.stringify({ products: transformedProducts }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

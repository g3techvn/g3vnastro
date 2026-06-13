import type { APIRoute } from 'astro';
import { getFeaturedProductsByIds } from '../../lib/collections';

export const GET: APIRoute = async () => {
  try {
    // Featured product IDs for combo section - all Gami chairs
    const featuredProductIds = [1, 2, 3, 4, 5, 6, 7, 8];

    const products = await getFeaturedProductsByIds(featuredProductIds);

    // Sort by specified order
    const orderedProducts = featuredProductIds
      .map(id => products.find(p => p.id === id))
      .filter(p => p !== undefined);

    return new Response(JSON.stringify({ products: orderedProducts }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error in combo-products API:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

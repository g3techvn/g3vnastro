import type { APIRoute } from 'astro';
import { getCategoriesWithProductCount } from '../../lib/collections';

export const GET: APIRoute = async () => {
  try {
    const categoriesWithCount = await getCategoriesWithProductCount();

    const result = categoriesWithCount.map(cat => ({
      id: cat.id,
      title: cat.title,
      slug: cat.slug,
      image_url: cat.image_url || null,
      image_square_url: cat.image_square_url || null,
      product_count: cat.product_count,
    }));

    return new Response(JSON.stringify({ product_cats: result }), {
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

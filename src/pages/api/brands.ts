import type { APIRoute } from 'astro';
import { getAllBrands } from '../../lib/collections';

export const GET: APIRoute = async () => {
  try {
    const brands = await getAllBrands();

    const transformedBrands = brands.map(brand => ({
      id: brand.id,
      title: brand.title,
      slug: brand.slug,
      image_url: brand.image_url || null
    }));

    return new Response(
      JSON.stringify({ 
        brands: transformedBrands,
        total: transformedBrands.length
      }),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error in brands API:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};

import type { APIRoute } from 'astro';
import { productAPI } from '../../lib/supabase';

export const GET: APIRoute = async ({ request }) => {
  try {
    const brands = await productAPI.getBrands();

    // Transform data để match với format mong đợi
    const transformedBrands = brands.map(brand => ({
      id: brand.id,
      title: brand.slug, // Dùng slug làm title tạm thời
      slug: brand.slug,
      image_url: null
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
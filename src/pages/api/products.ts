import type { APIRoute } from 'astro';
import { productAPI } from '../../lib/supabase';

export const GET: APIRoute = async ({ request, url }) => {
  try {
    const searchParams = new URL(request.url).searchParams;
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const products = await productAPI.getProducts(limit, offset);
    
    return new Response(JSON.stringify({ 
      success: true, 
      products 
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Failed to fetch products' 
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
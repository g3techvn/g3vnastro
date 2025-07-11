import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase';

export const GET: APIRoute = async ({ url }) => {
  const category = url.searchParams.get('category');
  const brand = url.searchParams.get('brand');

  try {
    let query = supabase
      .from('products')
      .select(`
        *,
        brands(title, slug),
        product_cats(title, slug)
      `)
      .order('name', { ascending: true });

    // Filter by category slug
    if (category) {
      query = query.eq('product_cats.slug', category);
    }

    // Filter by brand slug
    if (brand) {
      query = query.eq('brands.slug', brand);
    }

    const { data, error } = await query;

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    return new Response(JSON.stringify({ products: (data || []).map(product => ({
      ...product,
      gallery_array: product.gallery_array || []
    })) }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}; 
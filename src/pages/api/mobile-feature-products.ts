import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase';

export const GET: APIRoute = async () => {
  try {
    // Lấy danh sách sản phẩm
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name, slug, price, original_price, image_url, rating, sold_count, brand_id')
      .order('created_at', { ascending: false })
      .limit(100);

    if (productsError) {
      return new Response(JSON.stringify({ error: productsError.message }), { status: 500 });
    }

    // Lấy danh sách thương hiệu
    const { data: brands, error: brandsError } = await supabase
      .from('brands')
      .select('id, title, slug')
      .order('title', { ascending: true });

    if (brandsError) {
      return new Response(JSON.stringify({ error: brandsError.message }), { status: 500 });
    }

    return new Response(
      JSON.stringify({ products: products || [], brands: brands || [] }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
};

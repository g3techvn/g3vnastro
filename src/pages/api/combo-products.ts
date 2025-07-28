import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../../types/supabase';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient<Database>(supabaseUrl, supabaseKey);

export const GET: APIRoute = async () => {
  try {
    console.log('Fetching combo products from Supabase...');
    
    // Danh sách ID sản phẩm cụ thể cho phần "Sản phẩm ghế công thái học Gami"
    const featuredProductIds = [6, 7, 3, 49, 43, 29, 26, 33];
    
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .in('id', featuredProductIds);

    console.log('Supabase response:', { products, error });

    if (error) {
      console.error('Error fetching combo products:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // Sắp xếp sản phẩm theo thứ tự ID đã chỉ định
    const orderedProducts = featuredProductIds
      .map(id => products?.find(product => product.id === id))
      .filter(product => product !== undefined);

    return new Response(JSON.stringify({ products: orderedProducts || [] }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error in combo-products API:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}; 
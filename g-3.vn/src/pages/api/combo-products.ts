import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../../types/supabase';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient<Database>(supabaseUrl, supabaseKey);

export const GET: APIRoute = async () => {
  try {
    console.log('Fetching combo products from Supabase...');
    
    // Lấy 6 sản phẩm ngẫu nhiên cho combo
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .limit(8)
      .order('created_at', { ascending: false });

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

    return new Response(JSON.stringify({ products: products || [] }), {
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
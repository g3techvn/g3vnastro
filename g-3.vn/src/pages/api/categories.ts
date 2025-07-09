import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../../types/supabase';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient<Database>(supabaseUrl, supabaseKey);

export const GET: APIRoute = async () => {
  try {
    // Lấy categories từ Supabase
    const { data: categories, error } = await supabase
      .from('product_cats')
      .select('id, title, slug, image_url, image_square_url')
      .order('created_at', { ascending: false });

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // Lấy số lượng sản phẩm cho mỗi category
    const categoriesWithProductCount = await Promise.all(
      (categories || []).map(async (category) => {
        const { count, error: countError } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true })
          .eq('pd_cat_id', category.id);

        if (countError) {
          console.error(`Error counting products for category ${category.id}:`, countError);
          return { ...category, product_count: 0 };
        }

        return { ...category, product_count: count || 0 };
      })
    );

    return new Response(JSON.stringify({ product_cats: categoriesWithProductCount }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}; 
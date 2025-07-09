import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase';

export const GET: APIRoute = async () => {
  try {
    // Lấy sản phẩm mới từ Supabase (sản phẩm được tạo trong 30 ngày gần đây)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const { data: products, error } = await supabase
      .from('products')
      .select(`
        id,
        name,
        slug,
        price,
        original_price,
        image_url,
        rating,
        sold_count,
        brands(title)
      `)
      .gte('created_at', thirtyDaysAgo.toISOString()) // Sản phẩm tạo trong 30 ngày gần đây
      .order('created_at', { ascending: false })
      .limit(12); // Giới hạn 12 sản phẩm

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // Nếu không có sản phẩm mới trong 30 ngày, lấy 12 sản phẩm mới nhất
    let finalProducts = products;
    if (!products || products.length === 0) {
      const { data: latestProducts, error: latestError } = await supabase
        .from('products')
        .select(`
          id,
          name,
          slug,
          price,
          original_price,
          image_url,
          rating,
          sold_count,
          brands(title)
        `)
        .order('created_at', { ascending: false })
        .limit(12);

      if (latestError) {
        return new Response(JSON.stringify({ error: latestError.message }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json'
          }
        });
      }

      finalProducts = latestProducts;
    }

    // Transform data để match với frontend expectations
    const transformedProducts = (finalProducts || []).map(product => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      original_price: product.original_price,
      image_url: product.image_url,
      image_square_url: product.image_url, // Sử dụng image_url thay thế
      rating: product.rating,
      sold_count: product.sold_count,
      brand: ''
    }));

    return new Response(JSON.stringify({ products: transformedProducts }), {
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
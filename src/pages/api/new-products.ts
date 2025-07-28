import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase';

export const GET: APIRoute = async () => {
  try {
    // Danh sách ID sản phẩm cụ thể cho phần "mới lên kệ"
    const featuredProductIds = [17, 1, 5, 30, 28, 16];
    
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
      .in('id', featuredProductIds);

    if (error) {
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

    let finalProducts = orderedProducts;

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
      brand: product.brands?.title || ''
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
import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase';

export const GET: APIRoute = async () => {
  try {
    // Lấy tất cả sản phẩm có giá từ 1-3 triệu
    const { data: products, error: productsError } = await supabase
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
        gallery_array,
        brand_id,
        brands(title, slug)
      `)
      .gte('price', 1000000) // >= 1 triệu
      .lte('price', 3000000) // <= 3 triệu
      .order('sold_count', { ascending: false })
      .limit(16);

    if (productsError) {
      return new Response(JSON.stringify({ error: productsError.message }), { status: 500 });
    }

    // Transform data để match với frontend expectations
    const transformedProducts = (products || []).map(product => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      original_price: product.original_price,
      image_url: product.image_url,
      rating: product.rating || 0,
      sold_count: product.sold_count || 0,
      gallery_array: product.gallery_array || [],
      brand: (product.brands as any)?.title || '',
      brand_slug: (product.brands as any)?.slug || '',
      // Xác định badge dựa trên giá và thương hiệu
      badge: product.price <= 1500000 ? 'Giá tốt' : 
             product.price <= 2000000 ? 'Phổ biến' : 
             product.sold_count > 100 ? 'Bán chạy' : 'Nổi bật'
    }));

    return new Response(JSON.stringify({ products: transformedProducts }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}; 
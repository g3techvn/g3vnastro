import type { APIRoute } from 'astro';
import { productAPI } from '../../lib/supabase';

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');

    const offset = (page - 1) * limit;

    // Lấy chỉ sản phẩm có video từ database
    const products = await productAPI.getProductsWithVideo(limit, offset);
    
    // Lấy brands để map brand_id thành tên
    const brands = await productAPI.getBrands();
    const brandMap = brands.reduce((acc, brand) => {
      acc[brand.id] = brand.slug; // Dùng slug làm tên
      return acc;
    }, {} as Record<string, string>);

    // Transform data để match với format mong đợi
    const transformedProducts = products.map(product => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: (product as any).description || '',
      price: product.price,
      original_price: product.original_price || null,
      image_url: product.image_url || null,
      video_url: (product as any).video_url || null,
      rating: product.rating || null,
      brand_id: product.brand_id || null,
      brand: product.brand_id ? brandMap[product.brand_id] : null,
      sold_count: product.sold_count || 0,
      gallery_url: product.slug
    }));

    return new Response(
      JSON.stringify({ 
        products: transformedProducts,
        total: transformedProducts.length,
        page,
        limit,
        hasMore: transformedProducts.length === limit
      }),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error in videos API:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}; 
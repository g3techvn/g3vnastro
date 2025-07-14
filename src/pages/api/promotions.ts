import type { APIRoute } from 'astro';
import { promotionAPI } from '../../lib/supabase';

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');

    const offset = (page - 1) * limit;

    // Lấy promotions có video từ database
    const promotions = await promotionAPI.getPromotions(limit, offset);
    
    // Transform data để match với format mong đợi của VideoList
    const transformedPromotions = promotions.map(promotion => ({
      id: promotion.id,
      name: promotion.title,
      slug: promotion.slug,
      description: promotion.description || '',
      price: 0, // Promotion không có giá, set về 0
      original_price: null,
      image_url: promotion.image || null,
      video_url: promotion.youtube_url || null,
      rating: 5, // Default rating cho promotion
      brand_id: null,
      brand: 'G3 Promotion',
      sold_count: 0,
      gallery_url: promotion.slug,
      gallery_array: promotion.image ? [promotion.image] : [],
      // Thêm thông tin promotion
      discount_type: promotion.discount_type,
      discount_value: promotion.discount_value,
      start_date: promotion.start_date,
      end_date: promotion.end_date,
      created_at: promotion.created_at,
      updated_at: promotion.updated_at,
      is_promotion: true
    }));

    return new Response(
      JSON.stringify({ 
        promotions: transformedPromotions,
        total: transformedPromotions.length,
        page,
        limit,
        hasMore: transformedPromotions.length === limit
      }),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('API Error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Internal server error',
        promotions: [],
        total: 0
      }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}; 
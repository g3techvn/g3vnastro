import type { APIRoute } from 'astro';

// Mock data for vouchers
const MOCK_VOUCHERS = [
  {
    id: 'mock-newuser-2025',
    code: 'NEWUSER',
    title: 'Khách hàng mới',
    description: 'Giảm 15% cho khách hàng mới (tối đa 250K) cho đơn từ 2 triệu',
    discount_type: 'percentage',
    discount_value: 15,
    min_order_value: 2000000,
    max_discount: 250000,
    usage_limit: 1000,
    used_count: 0,
    valid_from: new Date().toISOString(),
    valid_to: '2025-12-31',
    is_active: true
  },
  {
    id: 'mock-freeship-2025',
    code: 'FREESHIP1M',
    title: 'Freeship Toàn Quốc',
    description: 'Miễn phí vận chuyển toàn quốc cho đơn hàng từ 1 triệu',
    discount_type: 'shipping',
    min_order_value: 1000000,
    usage_limit: 1000,
    used_count: 0,
    valid_from: new Date().toISOString(),
    valid_to: '2025-12-31',
    is_freeship: true,
    is_active: true
  },
  {
    id: 'mock-lapdat-2025',
    code: 'LAPDAT',
    title: 'Miễn phí lắp đặt',
    description: 'Miễn phí lắp đặt tại Hà Nội và HCM',
    discount_type: 'service',
    min_order_value: 0,
    usage_limit: 2000,
    used_count: 0,
    valid_from: new Date().toISOString(),
    valid_to: '2025-12-31',
    is_installation: true,
    location_provinces: [1, 79], // 1 = Hà Nội, 79 = HCM
    is_active: true
  }
];

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const user_id = url.searchParams.get('user_id');
    const code = url.searchParams.get('code');

    // If looking for a specific voucher by code
    if (code) {
      const voucher = MOCK_VOUCHERS.find(v => v.code === code && v.is_active);
      
      if (!voucher) {
        return new Response(
          JSON.stringify({ error: 'Voucher not found or expired' }),
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ voucher }),
        { 
          status: 200, 
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Get all active vouchers
    const activeVouchers = MOCK_VOUCHERS.filter(voucher => {
      // Check if voucher is active
      if (!voucher.is_active) return false;
      
      // Check if voucher has reached usage limit
      if (voucher.usage_limit && voucher.used_count >= voucher.usage_limit) {
        return false;
      }
      
      // Check if voucher is expired
      if (voucher.valid_to && new Date(voucher.valid_to) < new Date()) {
        return false;
      }
      
      // Check if voucher is not yet valid
      if (voucher.valid_from && new Date(voucher.valid_from) > new Date()) {
        return false;
      }
      
      return true;
    });

    return new Response(
      JSON.stringify({ vouchers: activeVouchers }),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error in vouchers API:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}; 
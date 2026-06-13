/**
 * Client-side order service — calls /api/orders endpoint.
 * Replaces the Supabase orderAPI used in React components.
 */

export interface OrderItem {
  product_id: string | number;
  product_name: string;
  variant_id?: string | number;
  variant_name?: string;
  variant_options?: unknown;
  quantity: number;
  price: number;
  original_price?: number;
  image_url?: string;
}

export interface OrderPayload {
  salutation: string;
  full_name: string;
  phone: string;
  email?: string;
  address: string;
  order_note?: string;
  voucher_code?: string;
  payment_method: string;
  total_amount: number;
  shipping_fee: number;
  products: OrderItem[];
}

export const orderService = {
  async createOrder(orderData: OrderPayload): Promise<{ success: boolean; order?: unknown; message?: string; error?: string }> {
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Order creation failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Có lỗi xảy ra khi tạo đơn hàng',
      };
    }
  },
};

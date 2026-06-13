import type { APIRoute } from 'astro';
import { sendOrderNotificationEmail, sendCustomerOrderConfirmation, formatOrderDataForEmail } from '../../lib/emailService';

// In-memory order store (resets on server restart).
// For persistent orders, replace with a database or external service.
let orderIdCounter = 1000;

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

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json() as OrderPayload;

    // Validate required fields
    if (!body.full_name || !body.phone || !body.address || !body.products?.length) {
      return new Response(
        JSON.stringify({ success: false, error: 'Thiếu thông tin đơn hàng bắt buộc' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate product items
    const validItems = body.products
      .map((p, i) => {
        const productId = typeof p.product_id === 'number'
          ? p.product_id
          : parseInt(String(p.product_id));
        if (isNaN(productId)) {
          console.warn(`Invalid product_id at index ${i}: ${p.product_id}`);
          return null;
        }
        return { ...p, product_id: productId };
      })
      .filter(Boolean) as (OrderItem & { product_id: number })[];

    if (validItems.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: 'Không có sản phẩm hợp lệ trong đơn hàng' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Build order object
    const orderId = `G3-${Date.now()}-${++orderIdCounter}`;
    const now = new Date().toISOString();

    const order = {
      id: orderId,
      salutation: body.salutation,
      full_name: body.full_name,
      phone: body.phone,
      email: body.email || null,
      address: body.address,
      order_note: body.order_note || null,
      voucher_code: body.voucher_code || null,
      payment_method: body.payment_method,
      total_amount: Math.round(body.total_amount),
      shipping_fee: Math.round(body.shipping_fee),
      status: 'pending',
      processing_status: 'new',
      payment_status: 'pending',
      shipping_status: 'pending',
      created_at: now,
      updated_at: now,
      order_items: validItems.map((p, i) => ({
        id: `${orderId}-item-${i}`,
        order_id: orderId,
        product_id: p.product_id,
        product_name: p.product_name,
        variant_id: p.variant_id || null,
        variant_name: p.variant_name || null,
        variant_options: p.variant_options || null,
        quantity: Math.round(p.quantity),
        price: Math.round(p.price),
        original_price: p.original_price ? Math.round(p.original_price) : null,
        image_url: p.image_url || null,
      })),
    };

    // Send email notifications asynchronously (don't block response)
    try {
      const emailData = formatOrderDataForEmail(order);
      sendOrderNotificationEmail(emailData);
      if (body.email) {
        sendCustomerOrderConfirmation(emailData);
      }
    } catch (emailErr) {
      console.error('Email notification failed (non-blocking):', emailErr);
    }

    return new Response(
      JSON.stringify({ success: true, order, message: 'Đơn hàng đã được tạo thành công!' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error creating order:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Có lỗi xảy ra khi tạo đơn hàng' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

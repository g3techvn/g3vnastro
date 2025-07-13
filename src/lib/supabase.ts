import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// API functions for products
export const productAPI = {
  async getProducts(limit = 20, offset = 0) {
    const { data, error } = await supabase
      .from('products')
      .select('id, name, slug, price, original_price, image_url, brand_id, rating, sold_count')
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getProductsByCategory(categorySlug: string, limit = 20, offset = 0) {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories!inner(name, slug),
        brands(name, slug)
      `)
      .eq('categories.slug', categorySlug)
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getProductsByBrand(brandSlug: string, limit = 20, offset = 0) {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories(name, slug),
        brands!inner(name, slug)
      `)
      .eq('brands.slug', brandSlug)
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data;
  },

  async getBrands() {
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data;
  }
};

// API functions for orders
export const orderAPI = {
  async createOrder(orderData: {
    salutation: string;
    full_name: string;
    phone: string;
    address: string;
    order_note?: string;
    voucher_code?: string;
    payment_method: string;
    total_amount: number;
    shipping_fee: number;
    products: Array<{
      product_id: string | number;
      product_name: string;
      variant_id?: string | number;
      variant_name?: string;
      variant_options?: any;
      quantity: number;
      price: number;
      original_price?: number;
      image_url?: string;
    }>;
  }) {
    try {
      // 1. Tạo đơn hàng chính
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          salutation: orderData.salutation,
          full_name: orderData.full_name,
          phone: orderData.phone,
          address: orderData.address,
          order_note: orderData.order_note || null,
          voucher_code: orderData.voucher_code || null,
          payment_method: orderData.payment_method,
          total_amount: Math.round(orderData.total_amount), // Đảm bảo là integer
          shipping_fee: Math.round(orderData.shipping_fee),   // Đảm bảo là integer
          status: 'pending',
          processing_status: 'new',
          payment_status: 'pending',
          shipping_status: 'pending'
        })
        .select()
        .single();

      if (orderError) {
        console.error('Error creating order:', orderError);
        throw new Error(`Không thể tạo đơn hàng: ${orderError.message}`);
      }

      // 2. Tạo các item trong đơn hàng - với data validation
      const orderItems = orderData.products.map((product, index) => {
        // Validate và convert product_id
        let productId: number | null = null;
        if (typeof product.product_id === 'number') {
          productId = product.product_id;
        } else if (typeof product.product_id === 'string') {
          // Nếu là string và có thể parse thành number
          const parsed = parseInt(product.product_id);
          if (!isNaN(parsed)) {
            productId = parsed;
          } else {
            // Nếu không parse được, bỏ qua item này và log warning
            console.warn(`Invalid product_id for item ${index}: ${product.product_id}`);
            return null;
          }
        }

        // Validate và convert variant_id
        let variantId: number | null = null;
        if (product.variant_id) {
          if (typeof product.variant_id === 'number') {
            variantId = product.variant_id;
          } else if (typeof product.variant_id === 'string') {
            const parsed = parseInt(product.variant_id);
            if (!isNaN(parsed)) {
              variantId = parsed;
            }
          }
        }

        return {
          order_id: order.id,
          product_id: productId,
          product_name: product.product_name,
          variant_id: variantId,
          variant_name: product.variant_name || null,
          variant_options: product.variant_options || null,
          quantity: Math.round(product.quantity), // Đảm bảo là integer
          price: Math.round(product.price),       // Đảm bảo là integer
          original_price: product.original_price ? Math.round(product.original_price) : null,
          image_url: product.image_url || null
        };
      }).filter(Boolean); // Loại bỏ các item null

      // Kiểm tra xem có item nào hợp lệ không
      if (orderItems.length === 0) {
        // Rollback: xóa order đã tạo
        await supabase.from('orders').delete().eq('id', order.id);
        throw new Error('Không có sản phẩm hợp lệ trong đơn hàng');
      }

      console.log('Inserting order items:', orderItems); // Debug log

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        console.error('Error creating order items:', itemsError);
        // Rollback: xóa order đã tạo
        await supabase.from('orders').delete().eq('id', order.id);
        throw new Error(`Không thể tạo chi tiết đơn hàng: ${itemsError.message}`);
      }

      return { success: true, order, message: 'Đơn hàng đã được tạo thành công!' };
    } catch (error) {
      console.error('Order creation failed:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Có lỗi xảy ra khi tạo đơn hàng' 
      };
    }
  },

  async getOrder(orderId: string) {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .eq('id', orderId)
      .single();

    if (error) throw error;
    return data;
  }
};
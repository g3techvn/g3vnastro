import emailjs from '@emailjs/browser';

// EmailJS configuration
const EMAILJS_SERVICE_ID = import.meta.env.PUBLIC_EMAILJS_SERVICE_ID || 'your_service_id';
const EMAILJS_TEMPLATE_ID = import.meta.env.PUBLIC_EMAILJS_TEMPLATE_ID || 'your_template_id';
const EMAILJS_PUBLIC_KEY = import.meta.env.PUBLIC_EMAILJS_PUBLIC_KEY || 'your_public_key';

// Initialize EmailJS
export const initEmailJS = () => {
  emailjs.init(EMAILJS_PUBLIC_KEY);
};

// Email template data interface
interface OrderEmailData {
  orderId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  products: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  paymentMethod: string;
  orderNote?: string;
  orderDate: string;
}

// Send order notification email
export const sendOrderNotificationEmail = async (orderData: OrderEmailData): Promise<{
  success: boolean;
  error?: string;
}> => {
  try {
    // Initialize EmailJS if not already done
    initEmailJS();

    // Prepare email template parameters
    const templateParams = {
      to_email: 'thanhtrang16490@gmail.com',
      to_name: 'G3Tech Team',
      from_name: 'G3Tech Website',
      
      // Order information
      order_id: orderData.orderId,
      order_date: orderData.orderDate,
      
      // Customer information
      customer_name: orderData.customerName,
      customer_phone: orderData.customerPhone,
      customer_address: orderData.customerAddress,
      
      // Order details
      products_list: orderData.products.map(product => 
        `${product.name} - SL: ${product.quantity} - Giá: ${product.price.toLocaleString('vi-VN')}₫`
      ).join('\n'),
      total_amount: orderData.totalAmount.toLocaleString('vi-VN'),
      payment_method: orderData.paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng' : 'Chuyển khoản ngân hàng',
      order_note: orderData.orderNote || 'Không có ghi chú',
      
      // Additional information
      products_count: orderData.products.length,
      total_quantity: orderData.products.reduce((sum, product) => sum + product.quantity, 0),
    };

    console.log('Sending email with params:', templateParams);

    // Send email
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams
    );

    console.log('Email sent successfully:', response);
    return { success: true };

  } catch (error) {
    console.error('Failed to send email:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

// Utility function to format order data for email
export const formatOrderDataForEmail = (orderResult: any): OrderEmailData => {
  return {
    orderId: orderResult.id.toString(),
    customerName: orderResult.full_name,
    customerPhone: orderResult.phone,
    customerAddress: orderResult.address,
    products: orderResult.order_items?.map((item: any) => ({
      name: item.product_name,
      quantity: item.quantity,
      price: item.price
    })) || [],
    totalAmount: orderResult.total_amount,
    paymentMethod: orderResult.payment_method,
    orderNote: orderResult.order_note,
    orderDate: new Date().toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit', 
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  };
}; 
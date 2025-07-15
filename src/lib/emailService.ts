import emailjs from '@emailjs/browser';

// EmailJS configuration
const EMAILJS_SERVICE_ID = import.meta.env.PUBLIC_EMAILJS_SERVICE_ID || 'your_service_id';
const EMAILJS_TEMPLATE_ID = import.meta.env.PUBLIC_EMAILJS_TEMPLATE_ID || 'your_template_id';
const EMAILJS_PUBLIC_KEY = import.meta.env.PUBLIC_EMAILJS_PUBLIC_KEY || 'your_public_key';

// Configuration constants

// Initialize EmailJS
export const initEmailJS = () => {
  emailjs.init(EMAILJS_PUBLIC_KEY);
};

// Email template data interface
interface OrderEmailData {
  orderId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
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
    // Check configuration first
    if (EMAILJS_SERVICE_ID === 'your_service_id') {
      const error = 'EmailJS Service ID not configured. Please set PUBLIC_EMAILJS_SERVICE_ID environment variable.';
      return { success: false, error };
    }
    
    if (EMAILJS_TEMPLATE_ID === 'your_template_id') {
      const error = 'EmailJS Template ID not configured. Please set PUBLIC_EMAILJS_TEMPLATE_ID environment variable.';
      return { success: false, error };
    }
    
    if (EMAILJS_PUBLIC_KEY === 'your_public_key') {
      const error = 'EmailJS Public Key not configured. Please set PUBLIC_EMAILJS_PUBLIC_KEY environment variable.';
      return { success: false, error };
    }

    // Initialize EmailJS if not already done
    initEmailJS();

    // Prepare email template parameters
    const templateParams = {
      // Multiple email field formats to ensure compatibility
      to_email: 'thanhtrang16490@gmail.com',
      email: 'thanhtrang16490@gmail.com',
      recipient_email: 'thanhtrang16490@gmail.com',
      user_email: 'thanhtrang16490@gmail.com',
      
      to_name: 'G3Tech Team',
      from_name: 'G3Tech Website',
      reply_to: 'thanhtrang16490@gmail.com',
      
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

    // Send email
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams,
      EMAILJS_PUBLIC_KEY // Add public key explicitly
    );

    return { success: true };

    } catch (error) {
    // Try alternative method with different parameter format
    try {
      const alternativeParams = {
        service_id: EMAILJS_SERVICE_ID,
        template_id: EMAILJS_TEMPLATE_ID,
        user_id: EMAILJS_PUBLIC_KEY,
        template_params: {
          // Recreate template params for alternative method
          to_email: 'thanhtrang16490@gmail.com',
          email: 'thanhtrang16490@gmail.com',
          recipient_email: 'thanhtrang16490@gmail.com',
          user_email: 'thanhtrang16490@gmail.com',
          to: 'thanhtrang16490@gmail.com',
          recipient: 'thanhtrang16490@gmail.com',
          
          to_name: 'G3Tech Team',
          from_name: 'G3Tech Website',
          reply_to: 'thanhtrang16490@gmail.com',
          
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
          total_quantity: orderData.products.reduce((sum, product) => sum + product.quantity, 0)
        }
      };
      
      const alternativeResponse = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(alternativeParams)
      });
      
      if (alternativeResponse.ok) {
        return { success: true };
      }
    } catch (altError) {
      // Alternative method also failed
    }
    
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
};

// Utility function to format order data for email


export const formatOrderDataForEmail = (orderResult: any): OrderEmailData => {
  // Debug: Log order data để kiểm tra
  console.log('Formatting order data for email:', {
    orderId: orderResult.id,
    hasOrderItems: !!orderResult.order_items,
    orderItemsLength: orderResult.order_items?.length || 0,
    orderItems: orderResult.order_items
  });

  const products = orderResult.order_items?.map((item: any) => ({
    name: item.product_name,
    quantity: item.quantity,
    price: item.price
  })) || [];

  console.log('Formatted products for email:', products);

  return {
    orderId: orderResult.id.toString(),
    customerName: orderResult.full_name,
    customerPhone: orderResult.phone,
    customerEmail: orderResult.email,
    customerAddress: orderResult.address,
    products,
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

// Send order confirmation email to customer
export const sendCustomerOrderConfirmation = async (orderData: OrderEmailData): Promise<{
  success: boolean;
  error?: string;
}> => {
  try {
    // Skip if no customer email provided
    if (!orderData.customerEmail) {
      return { success: true }; // Not an error, just no email to send
    }

    // Check configuration first
    if (EMAILJS_SERVICE_ID === 'your_service_id') {
      const error = 'EmailJS Service ID not configured. Please set PUBLIC_EMAILJS_SERVICE_ID environment variable.';
      return { success: false, error };
    }

    // Initialize EmailJS
    initEmailJS();

    // Format products list
    const productsListText = orderData.products.length > 0 
      ? orderData.products.map(product => 
          `- ${product.name} x${product.quantity}: ${product.price.toLocaleString('vi-VN')}₫`
        ).join('\n')
      : 'Không có sản phẩm trong đơn hàng';

    console.log('Products list for customer email:', {
      productsCount: orderData.products.length,
      products: orderData.products,
      productsListText
    });

    // Prepare customer email template parameters
    const customerTemplateParams = {
      to_email: orderData.customerEmail,
      to_name: orderData.customerName,
      subject: `Xác nhận đơn hàng #${orderData.orderId} - G3Tech`,
      order_id: orderData.orderId,
      customer_name: orderData.customerName,
      customer_phone: orderData.customerPhone,
      customer_address: orderData.customerAddress,
      order_note: orderData.orderNote || 'Không có ghi chú',
      payment_method: orderData.paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng' : 'Chuyển khoản ngân hàng',
      total_amount: orderData.totalAmount.toLocaleString('vi-VN'),
      order_date: orderData.orderDate,
      products_list: productsListText,
      message: `Cảm ơn bạn đã đặt hàng tại G3Tech! 
      
Đơn hàng của bạn đã được tiếp nhận và sẽ được xử lý trong thời gian sớm nhất.
Chúng tôi sẽ liên hệ với bạn để xác nhận thông tin giao hàng.

Thông tin đơn hàng:
- Mã đơn hàng: #${orderData.orderId}
- Ngày đặt: ${orderData.orderDate}
- Tổng tiền: ${orderData.totalAmount.toLocaleString('vi-VN')}₫

Danh sách sản phẩm:
${productsListText}

Nếu có bất kỳ thắc mắc nào, vui lòng liên hệ hotline: 1900 xxx xxx

Trân trọng,
Đội ngũ G3Tech`
    };

    console.log('Customer email template params:', customerTemplateParams);

    // Send customer confirmation email
    const customerResponse = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID, // You might want to use a different template for customer confirmation
      customerTemplateParams
    );

    if (customerResponse.status === 200) {
      console.log('Customer confirmation email sent successfully');
      return { success: true };
    } else {
      throw new Error(`EmailJS returned status: ${customerResponse.status}`);
    }
  } catch (error) {
    console.error('Failed to send customer confirmation email:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
}; 
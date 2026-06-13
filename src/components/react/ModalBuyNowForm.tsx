import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

// Thêm import jsPDF từ CDN nếu chưa có
// @ts-ignore
import { jsPDF } from "jspdf";
// Heroicons
import { PrinterIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/20/solid';
import { z } from 'zod';
import { orderService } from '../../lib/orderService';
import { COMPANY_INFO } from '../../constants';
import { sendOrderNotificationEmail, sendCustomerOrderConfirmation, formatOrderDataForEmail } from '../../lib/emailService';

interface ModalBuyNowFormProps {
  open: boolean;
  onClose: () => void;
  product: {
    name: string;
    price: number;
    image_url?: string;
    original_price?: number;
  };
}

interface Product {
  id: string | number;
  name: string;
  price: number;
  image_url?: string;
  original_price?: number;
  // ... các trường khác nếu có
}

const ModalBuyNowForm: React.FC<ModalBuyNowFormProps> = ({ open, onClose, product }) => {
  // State cho nhiều sản phẩm
  const [productsInCart, setProductsInCart] = useState<{ product: Product; quantity: number }[]>(() => {
    // Tạo ID hợp lệ cho product ban đầu
    let productId: number;
    const rawId = (product as any).id;
    
    if (typeof rawId === 'number') {
      productId = rawId;
    } else if (typeof rawId === 'string' && !isNaN(parseInt(rawId))) {
      productId = parseInt(rawId);
    } else {
      // Tạo ID tạm thời từ hash của tên sản phẩm
      productId = Math.abs(product.name.split('').reduce((hash, char) => {
        const chr = char.charCodeAt(0);
        hash = ((hash << 5) - hash) + chr;
        return hash & hash;
      }, 0));
    }
    
    return [{ product: { id: productId, ...product }, quantity: 1 }];
  });
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [buyerInfo, setBuyerInfo] = useState({
    salutation: 'Anh',
    fullName: '',
    phone: '',
    email: '',
  });
  const [shippingInfo, setShippingInfo] = useState({
    address: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [voucher, setVoucher] = useState('');
  const [productsFromApi, setProductsFromApi] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [errorProducts, setErrorProducts] = useState<string | null>(null);
  const [orderNote, setOrderNote] = useState('');
  const [searchProduct, setSearchProduct] = useState('');
  
  // States for order submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);
  const [showThankYouModal, setShowThankYouModal] = useState(false);
  
  // Anti-spam states
  const [lastSubmitTime, setLastSubmitTime] = useState<number>(0);
  const [submitCount, setSubmitCount] = useState<number>(0);
  const [totalSubmitCount, setTotalSubmitCount] = useState<number>(0); // Tổng số đơn đã gửi trong session
  const [cooldownEnd, setCooldownEnd] = useState<number>(0);
  const [isInCooldown, setIsInCooldown] = useState(false);

  // Zod schema cho validate
  const formSchema = z.object({
    salutation: z.enum(['Anh', 'Chị']),
    fullName: z.string()
      .min(2, 'Vui lòng nhập họ tên hợp lệ (tối thiểu 2 ký tự)')
      .refine(val => !/\d/.test(val), { message: 'Họ tên không được chứa số' }),
    phone: z.string()
      .regex(/^0\d{9,10}$/, 'Số điện thoại phải gồm 10 hoặc 11 số, bắt đầu bằng 0'),
    email: z.string()
      .email('Vui lòng nhập email hợp lệ')
      .optional()
      .or(z.literal('')),
    address: z.string()
      .min(6, 'Vui lòng nhập địa chỉ chi tiết (tối thiểu 6 ký tự)'),
  });

  const [errors, setErrors] = useState<{ fullName?: string; phone?: string; email?: string; address?: string }>({});
  const [isAnimating, setIsAnimating] = useState(false);
  const [touchStartY, setTouchStartY] = useState(0);
  const [touchCurrentY, setTouchCurrentY] = useState(0);

  function validateForm() {
    const result = formSchema.safeParse({
      salutation: buyerInfo.salutation,
      fullName: buyerInfo.fullName,
      phone: buyerInfo.phone,
      email: buyerInfo.email,
      address: shippingInfo.address,
    });
    if (!result.success) {
      const fieldErrors: { fullName?: string; phone?: string; email?: string; address?: string } = {};
      result.error.issues.forEach((err) => {
        const field = String(err.path[0]);
        if (field) fieldErrors[field as keyof typeof fieldErrors] = err.message;
      });
      setErrors(fieldErrors);
      return false;
    }
    setErrors({});
    return true;
  }

  // Khóa cuộn body khi modal mở và handle animations
  useEffect(() => {
    if (open) {
      document.body.classList.add('overflow-hidden');
      setIsAnimating(true);
      // Reset states when modal opens
      setSubmitError(null);
      setSubmitSuccess(false);
      setIsSubmitting(false);
      setOrderData(null);
      setShowThankYouModal(false);
      // Reset anti-spam states
      setSubmitCount(0);
      setLastSubmitTime(0);
      setTotalSubmitCount(0);
      setCooldownEnd(0);
      setIsInCooldown(false);
      // Trigger animation after mount
      setTimeout(() => setIsAnimating(false), 50);
    } else {
      document.body.classList.remove('overflow-hidden');
      setIsAnimating(true);
      // Wait for animation to finish before unmounting
      setTimeout(() => setIsAnimating(false), 300);
    }
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [open]);

  // Cooldown timer effect
  useEffect(() => {
    if (cooldownEnd > 0) {
      const interval = setInterval(() => {
        const now = Date.now();
        if (now >= cooldownEnd) {
          setIsInCooldown(false);
          setCooldownEnd(0);
          clearInterval(interval);
        } else {
          setIsInCooldown(true);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [cooldownEnd]);



  // Fetch sản phẩm khi mở modal chọn sản phẩm
  useEffect(() => {
    if (showAddProduct) {
      setLoadingProducts(true);
      setErrorProducts(null);
      fetch('/api/products')
        .then(res => res.json())
        .then(data => {
          setProductsFromApi(data.products || []);
        })
        .catch(err => {
          setErrorProducts('Không thể tải danh sách sản phẩm');
        })
        .finally(() => setLoadingProducts(false));
    }
  }, [showAddProduct]);

  const isBuyerInfoValid = buyerInfo.fullName && buyerInfo.phone;
  const isShippingInfoValid = shippingInfo.address;
  const isPaymentValid = paymentMethod;
  const isFormValid = isBuyerInfoValid && isShippingInfoValid && isPaymentValid;

  // Anti-spam configuration
  const BASE_COOLDOWN = 60000; // 1 minute for first 3 orders
  const MEDIUM_COOLDOWN = 600000; // 10 minutes for orders 4-10
  const LONG_COOLDOWN = 1800000; // 30 minutes for orders 11+
  const MAX_SUBMIT_PER_MINUTE = 3; // Maximum 3 submissions per minute
  const RATE_LIMIT_WINDOW = 60000; // 1 minute window

  // Calculate cooldown time based on total orders submitted
  const getCooldownTime = (orderCount: number): number => {
    if (orderCount <= 3) return BASE_COOLDOWN; // 1 minute
    if (orderCount <= 10) return MEDIUM_COOLDOWN; // 10 minutes
    return LONG_COOLDOWN; // 30 minutes
  };

  // Get cooldown message based on time
  const getCooldownMessage = (cooldownMs: number): string => {
    const minutes = Math.floor(cooldownMs / 60000);
    if (minutes >= 30) return 'Vui lòng chờ 30 phút trước khi gửi lại';
    if (minutes >= 10) return 'Vui lòng chờ 10 phút trước khi gửi lại';
    return 'Vui lòng chờ 1 phút trước khi gửi lại';
  };

  // Check if can submit (anti-spam)
  const canSubmit = () => {
    const now = Date.now();
    const currentCooldown = getCooldownTime(totalSubmitCount + 1); // +1 for next order
    
    // Check if in cooldown
    if (isInCooldown || now < cooldownEnd) {
      return { canSubmit: false, reason: 'Vui lòng chờ một chút trước khi gửi lại' };
    }
    
    // Check rate limiting with dynamic cooldown
    if (lastSubmitTime > 0 && (now - lastSubmitTime) < currentCooldown) {
      return { canSubmit: false, reason: getCooldownMessage(currentCooldown) };
    }
    
    // Check submission count in the last minute
    if (submitCount >= MAX_SUBMIT_PER_MINUTE) {
      const cooldownTime = RATE_LIMIT_WINDOW - (now - lastSubmitTime);
      if (cooldownTime > 0) {
        return { canSubmit: false, reason: 'Bạn đã gửi quá nhiều yêu cầu. Vui lòng chờ 1 phút' };
      }
    }
    
    return { canSubmit: true, reason: null };
  };
  
  // Overall submit state
  const submitCheck = canSubmit();
  const canSubmitNow = isFormValid && submitCheck.canSubmit && !isSubmitting && !submitSuccess && !isInCooldown;

  // Cooldown display helper
  const getCooldownText = () => {
    if (isInCooldown && cooldownEnd > 0) {
      const remainingMs = cooldownEnd - Date.now();
      if (remainingMs > 0) {
        const remainingMinutes = Math.floor(remainingMs / 60000);
        const remainingSeconds = Math.ceil((remainingMs % 60000) / 1000);
        
        if (remainingMinutes > 0) {
          return `Vui lòng chờ ${remainingMinutes}:${remainingSeconds.toString().padStart(2, '0')}`;
        } else {
          return `Vui lòng chờ ${remainingSeconds} giây`;
        }
      }
    }
    return null;
  };

  // Debounce validation to avoid excessive calls
  const [validationTimeout, setValidationTimeout] = useState<NodeJS.Timeout | null>(null);
  const debouncedValidateForm = () => {
    if (validationTimeout) {
      clearTimeout(validationTimeout);
    }
    const timeout = setTimeout(validateForm, 500);
    setValidationTimeout(timeout);
  };

  // Cleanup validation timeout
  useEffect(() => {
    return () => {
      if (validationTimeout) {
        clearTimeout(validationTimeout);
      }
    };
  }, [validationTimeout]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    // Anti-spam check
    const submitCheck = canSubmit();
    if (!submitCheck.canSubmit) {
      setSubmitError(submitCheck.reason || 'Không thể gửi yêu cầu');
      return;
    }
    
    if (!validateForm()) return;
    
    // Prevent double submission
    if (isSubmitting || submitSuccess) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError(null);
    
    // Update anti-spam tracking
    const now = Date.now();
    setLastSubmitTime(now);
    setSubmitCount(prev => {
      // Reset count if more than 1 minute has passed
      if (now - lastSubmitTime > RATE_LIMIT_WINDOW) {
        return 1;
      }
      return prev + 1;
    });
    setTotalSubmitCount(prev => prev + 1); // Track total orders in session
    
    try {
      // Chuẩn bị dữ liệu đơn hàng
      // Tổng tiền đơn hàng = thành tiền + phí ship  
      const orderTotal = finalTotal + shippingFee;
      
      const orderData = {
        salutation: buyerInfo.salutation,
        full_name: buyerInfo.fullName,
        phone: buyerInfo.phone,
        email: buyerInfo.email || undefined,
        address: shippingInfo.address,
        order_note: orderNote || undefined,
        voucher_code: voucher || undefined,
        payment_method: paymentMethod,
        total_amount: orderTotal,
        shipping_fee: shippingFee,
        products: productsInCart.map(({ product, quantity }) => {
          // Đảm bảo product_id là số hợp lệ
          let productId: number;
          const rawId = (product as any).id;
          
          if (typeof rawId === 'number') {
            productId = rawId;
          } else if (typeof rawId === 'string' && !isNaN(parseInt(rawId))) {
            productId = parseInt(rawId);
          } else {
            // Nếu không có ID hợp lệ, tạo một ID tạm thời dựa trên hash của tên sản phẩm
            productId = Math.abs(product.name.split('').reduce((hash, char) => {
              const chr = char.charCodeAt(0);
              hash = ((hash << 5) - hash) + chr;
              return hash & hash; // Convert to 32bit integer
            }, 0));
    
          }

          return {
            product_id: productId,
            product_name: product.name,
            quantity,
            price: product.price,
            original_price: product.original_price,
            image_url: product.image_url
          };
        })
      };

      
      const result = await orderService.createOrder(orderData);
      
      
      if (result.success) {
        setSubmitSuccess(true);
        setOrderData(result.order);
        // Set một cooldown nhẹ sau khi thành công
        setCooldownEnd(Date.now() + 2000);
        
        // Send email notifications (async, don't wait for completion)
        const emailData = formatOrderDataForEmail(result.order);
        
        // Send notification to admin
        sendOrderNotificationEmail(emailData);
        
        // Send confirmation to customer if email provided
        if (buyerInfo.email) {
          sendCustomerOrderConfirmation(emailData);
        }
        
        // Show thank you modal (overlay on top)
        setShowThankYouModal(true);
      } else {
        console.error('Order creation failed:', result.error);
        setSubmitError(result.error || 'Có lỗi xảy ra khi tạo đơn hàng');
        
        // Set cooldown longer after error (to prevent rapid retry)
        const errorCooldown = getCooldownTime(totalSubmitCount + 1);
        setCooldownEnd(Date.now() + errorCooldown);
      }
    } catch (error) {
      console.error('Submit error:', error);
      setSubmitError('Có lỗi xảy ra khi gửi đơn hàng. Vui lòng thử lại.');
      
      // Set cooldown after error
      const errorCooldown = getCooldownTime(totalSubmitCount + 1);
      setCooldownEnd(Date.now() + errorCooldown);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Touch handlers for drag-to-close
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchCurrentY(e.touches[0].clientY);
  };

  const handleTouchEnd = () => {
    const deltaY = touchCurrentY - touchStartY;
    if (deltaY > 100) { // Drag down > 100px to close
      onClose();
    }
    setTouchStartY(0);
    setTouchCurrentY(0);
  };

  if (!open) return null;

  // Tính tổng tiền, giảm giá cho toàn bộ sản phẩm
  const voucherCodes = voucher.split(/\s+/).map(c => c.trim().toUpperCase()).filter(Boolean);
  let total = 0;
  let totalOriginal = 0;
  let totalAmountSaved = 0;
  let totalVoucherDiscount = 0;
  productsInCart.forEach(({ product, quantity }) => {
    const { price, original_price = 0 } = product;
    total += price * quantity;
    totalOriginal += original_price * quantity;
    if (original_price > price) {
      totalAmountSaved += (original_price - price) * quantity;
    }
    if (voucherCodes.includes('G3TECH200')) {
      totalVoucherDiscount += 200000 * quantity;
    }
  });
  const totalDiscount = totalAmountSaved + totalVoucherDiscount;
  
  // Tính phí ship - mặc định 200.000đ, chỉ miễn phí khi có mã FREESHIP
  const voucherCodesLower = voucherCodes.map(code => code.toLowerCase());
  const shippingFee = voucherCodesLower.includes('freeship') ? 0 : 200000;
  
  // Tính thành tiền cuối cùng (chỉ trừ giảm giá từ mã, không cộng phí ship)
  const finalTotal = total - totalVoucherDiscount;

  const modalContent = (
    <div
      className="fixed inset-0 z-[10000002] bg-black/30 backdrop-blur-sm flex md:items-center md:justify-center items-end overflow-auto py-0 md:py-8"
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className={`relative mx-auto bg-white w-full max-w-6xl transition-all duration-300 ease-out
          ${open ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}
          md:translate-y-0 md:opacity-100 md:rounded-2xl 
          rounded-t-2xl md:rounded-b-2xl
          max-h-[90vh] md:max-h-[calc(100vh-4rem)]
          flex flex-col
        `}
      >
        {/* Mobile Close Button */}
        <div 
          className="md:hidden sticky top-0 z-40 bg-white px-4 py-3 border-b border-gray-200 rounded-t-2xl cursor-pointer"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto"></div>
            <button
              onClick={onClose}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row overflow-hidden shadow-2xl flex-1 overflow-y-auto md:rounded-2xl md:rounded-b-2xl pb-20 md:pb-0">
          {/* Form nhập thông tin bên trái */}
          <section
            aria-labelledby="payment-and-shipping-heading"
            className="py-4 md:py-8 px-4 lg:px-8 bg-white flex-1 lg:h-full lg:min-h-full lg:w-1/2 lg:pb-16 order-2 lg:order-none"
          >
            <h2 id="payment-and-shipping-heading" className="sr-only">
              Payment and shipping details
            </h2>
            
            {/* Desktop Close Button */}
            <div className="hidden md:block absolute top-4 right-4 z-30">
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mx-auto max-w-2xl lg:max-w-none">
              <h3 className="md:hidden text-lg font-semibold text-gray-900 mb-3">Thông tin giao hàng</h3>
              {Object.keys(errors).length > 0 && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm font-medium">
                  Vui lòng kiểm tra lại các trường thông tin bên dưới.
                </div>
              )}
              
              {submitError && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm font-medium">
                  <div className="font-semibold mb-1">Lỗi khi tạo đơn hàng:</div>
                  <div>{submitError}</div>
                  <div className="mt-2 text-xs text-red-600">
                    Vui lòng kiểm tra console để xem chi tiết lỗi hoặc liên hệ hỗ trợ.
                  </div>
                </div>
              )}
              
              {!submitCheck.canSubmit && submitCheck.reason && !submitError && (
                <div className="mb-4 p-3 bg-orange-100 text-orange-700 rounded text-sm font-medium">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {submitCheck.reason}
                  </div>
                </div>
              )}
              
              
              <div>
                <h3 className="text-base md:text-lg font-medium text-gray-900">Thông tin liên hệ & giao hàng</h3>
                <div className="mt-4 md:mt-6 grid grid-cols-1 gap-y-4 md:gap-y-6">
                  <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                    <div className="relative w-full sm:w-2/3">
                      <label className="absolute -top-2 left-2 inline-block rounded-lg bg-white px-1 text-xs font-medium text-gray-900">Họ tên*</label>
                      <div className="flex">
                        <select
                          id="salutation"
                          className="rounded-l-md border border-gray-300 bg-white px-2 md:px-3 py-2 md:py-1.5 text-sm md:text-base text-gray-900 focus:outline-2 focus:outline-indigo-600 border-r-0"
                          style={{ minWidth: 80 }}
                          value={buyerInfo.salutation}
                          onChange={e => setBuyerInfo({ ...buyerInfo, salutation: e.target.value })}
                        >
                          <option value="Anh">Anh</option>
                          <option value="Chị">Chị</option>
                        </select>
                        <input
                          id="fullName"
                          type="text"
                          placeholder="Nguyễn Văn A"
                          className={`block w-full rounded-r-md bg-white px-2 md:px-3 py-2 md:py-1.5 text-sm md:text-base text-gray-900 border ${errors.fullName ? 'border-red-400' : 'border-gray-300'} border-l-0 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600`}
                          value={buyerInfo.fullName}
                          onChange={e => {
                            setBuyerInfo({ ...buyerInfo, fullName: e.target.value });
                            debouncedValidateForm();
                          }}
                          onBlur={validateForm}
                          required
                        />
                      </div>
                      {errors.fullName && <div className="text-red-500 text-xs mt-1">{errors.fullName}</div>}
                    </div>
                    <div className="relative w-full sm:w-1/2">
                      <label
                        htmlFor="phone"
                        className="absolute -top-2 left-2 inline-block rounded-lg bg-white px-1 text-xs font-medium text-gray-900"
                      >
                        Số điện thoại*
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        placeholder="0987654321"
                        className={`block w-full rounded-md bg-white px-2 md:px-3 py-2 md:py-1.5 text-sm md:text-base text-gray-900 border ${errors.phone ? 'border-red-400' : 'border-gray-300'} placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600`}
                        value={buyerInfo.phone}
                        onChange={e => {
                          setBuyerInfo({ ...buyerInfo, phone: e.target.value });
                          debouncedValidateForm();
                        }}
                        onBlur={validateForm}
                        required
                      />
                      {errors.phone && <div className="text-red-500 text-xs mt-1">{errors.phone}</div>}
                    </div>
                  </div>
                  <div className="relative">
                    <label
                      htmlFor="email"
                      className="absolute -top-2 left-2 inline-block rounded-lg bg-white px-1 text-xs font-medium text-gray-900"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="example@gmail.com"
                      className={`block w-full rounded-md bg-white px-2 md:px-3 py-2 md:py-1.5 text-sm md:text-base text-gray-900 border ${errors.email ? 'border-red-400' : 'border-gray-300'} placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600`}
                      value={buyerInfo.email}
                      onChange={e => {
                        setBuyerInfo({ ...buyerInfo, email: e.target.value });
                        debouncedValidateForm();
                      }}
                      onBlur={validateForm}
                    />
                    {errors.email && <div className="text-red-500 text-xs mt-1">{errors.email}</div>}
                  </div>
                  <div className="relative">
                    <label
                      htmlFor="address"
                      className="absolute -top-2 left-2 inline-block rounded-lg bg-white px-1 text-xs font-medium text-gray-900"
                    >
                      Địa chỉ*
                    </label>
                    <input
                      id="address"
                      type="text"
                      placeholder="123 Đường ABC, Quận 1, TP.HCM"
                      className={`block w-full rounded-md bg-white px-2 md:px-3 py-2 md:py-1.5 text-sm md:text-base text-gray-900 border ${errors.address ? 'border-red-400' : 'border-gray-300'} placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600`}
                      value={shippingInfo.address}
                      onChange={e => {
                        setShippingInfo({ ...shippingInfo, address: e.target.value });
                        debouncedValidateForm();
                      }}
                      onBlur={validateForm}
                      required
                    />
                    {errors.address && <div className="text-red-500 text-xs mt-1">{errors.address}</div>}
                  </div>
                  <div className="relative">
                    <label
                      htmlFor="orderNote"
                      className="absolute -top-2 left-2 inline-block rounded-lg bg-white px-1 text-xs font-medium text-gray-900"
                    >
                      Ghi chú cho đơn hàng
                    </label>
                    <textarea
                      id="orderNote"
                      placeholder="Ghi chú thêm cho đơn hàng (nếu có)"
                      className="block w-full rounded-md bg-white px-2 md:px-3 py-2 md:py-1.5 text-sm md:text-base text-gray-900 border border-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 min-h-[44px] md:min-h-[48px] resize-none"
                      value={orderNote}
                      onChange={e => setOrderNote(e.target.value)}
                      rows={2}
                    />
                  </div>
                </div>
              </div>
              <div className="mt-6 md:mt-10">
                <h3 className="text-base md:text-lg font-medium text-gray-900">Thanh toán & Ưu đãi</h3>
                <fieldset>
                  <legend className="text-sm font-semibold text-gray-900 mb-2">Chọn phương thức thanh toán</legend>
                  <div className="mt-3 md:mt-4 grid grid-cols-1 gap-y-3 md:gap-y-4 sm:grid-cols-2 sm:gap-x-4">
                    {[
                      { id: 'cod', title: 'Thanh toán khi nhận hàng', description: 'Trả tiền mặt khi nhận hàng tại nhà.' },
                      { id: 'bank', title: 'Chuyển khoản ngân hàng', description: 'Chuyển khoản qua ngân hàng, ví điện tử.' },
                    ].map((method) => (
                      <label
                        key={method.id}
                        aria-label={method.title}
                        className={`group relative flex rounded-lg border bg-white p-3 md:p-4 cursor-pointer transition-all duration-150 ${paymentMethod === method.id ? 'border-red-600 ring-2 ring-red-500' : 'border-gray-300'}`}
                      >
                        <input
                          type="radio"
                          name="payment-method"
                          value={method.id}
                          checked={paymentMethod === method.id}
                          onChange={() => setPaymentMethod(method.id)}
                          className="absolute inset-0 appearance-none focus:outline-none cursor-pointer"
                        />
                        <div className="flex-1">
                          <span className="block text-sm font-medium text-gray-900">{method.title}</span>
                          <span className="mt-0.5 md:mt-1 block text-xs md:text-sm text-gray-500">{method.description}</span>
                        </div>
                        <CheckCircleIcon
                          aria-hidden="true"
                          className={`ml-3 md:ml-4 size-4 md:size-5 ${paymentMethod === method.id ? 'text-red-600 visible' : 'invisible'}`}
                        />
                      </label>
                    ))}
                  </div>
                </fieldset>
                  <div className="pt-3 md:pt-4">
                    <label className="block text-sm font-medium text-gray-700">Mã giảm giá</label>
                    <input
                      type="text"
                      className="mt-1 block w-full rounded-md bg-white px-2 md:px-3 py-2 text-sm md:text-base text-gray-900 border border-gray-300 focus:outline-2 focus:outline-indigo-600"
                      value={voucher}
                      onChange={e => setVoucher(e.target.value)}
                      placeholder="Nhập mã giảm giá"
                    />
                    {voucher && (
                      <div className="mt-2 flex flex-wrap gap-1.5 md:gap-2">
                        {voucher.split(/\s+/).map((code, idx, arr) => code && (
                          <div key={code+idx} className="inline-flex items-center px-2 md:px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs md:text-sm font-medium border border-green-300">
                            <span>{code}</span>
                            <button
                              type="button"
                              className="ml-1 md:ml-2 text-green-600 hover:text-red-500 focus:outline-none text-sm"
                              onClick={() => {
                                const codes = voucher.split(/\s+/).filter(c => c && c !== code);
                                setVoucher(codes.join(' '));
                              }}
                              aria-label={`Xóa mã ${code}`}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              {/* Desktop Submit Button */}
              <div className="hidden md:flex justify-end mt-8">
                <button
                  type="button"
                  className="rounded-md border border-transparent bg-red-600 px-6 py-3 text-base font-medium text-white shadow-xs hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-50 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed"
                  disabled={!canSubmitNow}
                  onClick={handleSubmit}
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Đang xử lý...
                    </div>
                  ) : submitSuccess ? (
                    '✅ Cảm ơn bạn!'
                  ) : isInCooldown ? (
                    getCooldownText() || 'Vui lòng chờ...'
                  ) : !isFormValid ? (
                    'Vui lòng điền đầy đủ thông tin'
                  ) : !submitCheck.canSubmit ? (
                    submitCheck.reason || 'Không thể gửi'
                  ) : (
                    'Xác nhận đơn hàng'
                  )}
                </button>
              </div>


            </form>
          </section>
          {/* Tổng kết đơn hàng bên phải */}
          <section
            aria-labelledby="summary-heading"
            className="bg-indigo-900 py-4 md:py-8 text-indigo-300 px-4 lg:px-8 flex-1 lg:h-full lg:min-h-full lg:w-1/2 lg:bg-indigo-900 lg:pb-16 flex flex-col lg:justify-between order-1 lg:order-none md:border-b-0 border-b border-gray-200"
          >
            <div className="w-full bg-indigo-900">
              <h2 id="summary-heading" className="sr-only">
                Order summary
              </h2>
              <h3 className="md:hidden text-lg font-semibold text-white mb-3">Thông tin đơn hàng</h3>
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <span className="text-sm font-medium">Đơn hàng</span>
                <div className="flex flex-col items-end">
                  {totalOriginal > total && (
                    <span className="text-sm md:text-base font-medium text-white/60 line-through">
                      {totalOriginal.toLocaleString('vi-VN')}₫
                    </span>
                  )}
                  <span className="text-xl md:text-3xl font-bold tracking-tight text-white">{total.toLocaleString('vi-VN')}₫</span>
                  {(totalVoucherDiscount > 0 || totalAmountSaved > 0) && (
                    <span className="text-xs md:text-sm font-medium text-green-300">Tiết kiệm: {(totalVoucherDiscount + totalAmountSaved).toLocaleString('vi-VN')}₫</span>
                  )}
                </div>
              </div>
              <ul role="list" className="divide-y divide-white/10 text-sm font-medium bg-indigo-900">
                {productsInCart.map(({ product, quantity }, idx) => {
                  const { name, image_url, price, original_price = 0 } = product;
                  const hasDiscount = original_price > price;
                  // Sử dụng product.id nếu có, nếu không dùng index
                  const key = (product && 'id' in product && product.id) ? product.id : name + idx;
                  return (
                    <li key={key} className="flex items-start space-x-3 py-4 md:py-6 bg-indigo-900">
                      <img
                        alt={name}
                        src={image_url || '/placeholder.png'}
                        className="size-12 md:size-20 flex-none rounded-md object-cover"
                      />
                      <div className="flex-auto space-y-1">
                        <h3 className="text-white text-sm md:text-base line-clamp-2">{name}</h3>
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col space-y-1">
                            {hasDiscount && (
                              <span className="text-xs text-white/60 line-through">{original_price.toLocaleString('vi-VN')}₫</span>
                            )}
                            <p className="text-sm md:text-base font-medium text-white">{price.toLocaleString('vi-VN')}₫</p>
                          </div>
                          <div className="flex items-center gap-1 md:gap-2">
                            <button type="button" className="w-6 h-6 md:w-8 md:h-8 flex items-center justify-center border rounded bg-white/10 text-white hover:bg-white/20 text-sm" onClick={() => setProductsInCart(list => list.map((item, i) => i === idx ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item))}>-</button>
                            <span className="w-8 md:w-12 text-center text-sm md:text-base text-white font-medium">{quantity}</span>
                            <button type="button" className="w-6 h-6 md:w-8 md:h-8 flex items-center justify-center border rounded bg-white/10 text-white hover:bg-white/20 text-sm" onClick={() => setProductsInCart(list => list.map((item, i) => i === idx ? { ...item, quantity: item.quantity + 1 } : item))}>+</button>
                            {productsInCart.length > 1 && (
                              <button type="button" className="ml-1 w-6 h-6 flex items-center justify-center text-red-400 hover:text-red-600 text-lg" onClick={() => setProductsInCart(list => list.filter((_, i) => i !== idx))} title="Xóa sản phẩm">×</button>
                            )}
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
              {/* Nút thêm sản phẩm */}
              <div className="mt-2 md:mt-4 flex justify-end">
                <button type="button" className="bg-green-600 text-white px-3 md:px-4 py-1.5 md:py-2 rounded text-sm md:text-base hover:bg-green-700" onClick={() => setShowAddProduct(true)}>
                  + Thêm SP
                </button>
              </div>
              {/* Modal chọn sản phẩm */}
              {showAddProduct && (
                <div className="fixed inset-0 z-[10000003] bg-black/40 flex items-center justify-center p-4">
                  <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[80vh] flex flex-col">
                    {/* Header */}
                    <div className="p-6 border-b border-gray-200">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-900">Chọn sản phẩm để thêm</h3>
                        <button 
                          type="button" 
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                          onClick={() => {
                            setShowAddProduct(false);
                            setSearchProduct('');
                          }}
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      {/* Tìm kiếm */}
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Tìm kiếm sản phẩm..."
                          className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                          value={searchProduct}
                          onChange={e => setSearchProduct(e.target.value)}
                        />
                        <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 overflow-hidden">
                      {loadingProducts && <div className="p-6 text-gray-500 text-center">Đang tải sản phẩm...</div>}
                      {errorProducts && <div className="p-6 text-red-500 text-center">{errorProducts}</div>}
                    {!loadingProducts && !errorProducts && (
                        <ul className="divide-y divide-gray-200 overflow-y-auto h-full">
                          {productsFromApi
                            .filter(mp => !productsInCart.some(item => item.product && 'id' in item.product && item.product.id === mp.id))
                            .filter(mp => searchProduct === '' || mp.name.toLowerCase().includes(searchProduct.toLowerCase()))
                            .map(mp => (
                            <li key={mp.id} className="p-4 hover:bg-gray-50 transition-colors">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                  <img src={mp.image_url} alt={mp.name} className="w-12 h-12 object-cover rounded-lg border border-gray-200 flex-shrink-0" />
                                  <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-medium text-gray-900 truncate">{mp.name}</h4>
                                    <div className="flex items-center gap-2 mt-1">
                                      {mp.original_price && mp.original_price > mp.price && (
                                        <span className="text-xs text-gray-500 line-through">{mp.original_price.toLocaleString('vi-VN')}₫</span>
                                      )}
                                      <span className="text-sm font-semibold text-red-600">{mp.price.toLocaleString('vi-VN')}₫</span>
                            </div>
                                  </div>
                                </div>
                                <button 
                                  type="button" 
                                  className="ml-3 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium text-sm flex-shrink-0"
                                  onClick={() => {
                              setProductsInCart(list => [...list, { product: mp, quantity: 1 }]);
                              setShowAddProduct(false);
                                    setSearchProduct('');
                                  }}
                                >
                              Thêm
                            </button>
                              </div>
                          </li>
                        ))}
                          {productsFromApi
                            .filter(mp => !productsInCart.some(item => item.product && 'id' in item.product && item.product.id === mp.id))
                            .filter(mp => searchProduct === '' || mp.name.toLowerCase().includes(searchProduct.toLowerCase()))
                            .length === 0 && (
                            <li className="p-6 text-gray-500 text-center">
                              {searchProduct ? 'Không tìm thấy sản phẩm phù hợp' : 'Không còn sản phẩm nào để thêm'}
                            </li>
                        )}
                      </ul>
                    )}
                    </div>
                    
                    {/* Footer */}
                    <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                      <button 
                        type="button" 
                        className="w-full px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors font-medium"
                        onClick={() => {
                          setShowAddProduct(false);
                          setSearchProduct('');
                        }}
                      >
                        Đóng
                      </button>
                    </div>
                  </div>
                </div>
              )}
              <dl className="space-y-2 md:space-y-4 border-t border-white/10 pt-3 md:pt-6 text-xs md:text-sm font-medium mt-3 md:mt-6">
                <div className="flex items-center justify-between">
                  <dt>Tạm tính</dt>
                  <dd>
                    {totalOriginal > total && (
                      <span className="line-through text-white/60 mr-2">{(totalOriginal).toLocaleString('vi-VN')}₫</span>
                    )}
                    {(total).toLocaleString('vi-VN')}₫
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt>Phí ship</dt>
                  <dd className="text-xs md:text-sm">
                    {voucherCodesLower.includes('freeship')
                      ? 'Miễn phí'
                      : '200.000₫'}
                  </dd>
                </div>
                {/* Block giảm giá riêng - chỉ hiển thị khi có giảm giá */}
                {(totalVoucherDiscount > 0 || totalAmountSaved > 0) && (
                  <div className="border-t border-white/20 pt-2 md:pt-4 mt-2 md:mt-4 rounded">
                    <div className="text-xs font-semibold text-white/80 mb-1 md:mb-2">Giảm giá</div>
                    {totalAmountSaved > 0 && (
                      <div className="flex items-center justify-between mb-1 text-xs md:text-sm">
                        <span>Giảm giá sản phẩm</span>
                        <span className="text-red-300">- {totalAmountSaved.toLocaleString('vi-VN')}₫</span>
                      </div>
                    )}
                    {totalVoucherDiscount > 0 && (
                      <div className="flex items-center justify-between mb-1 text-xs md:text-sm">
                        <span>Mã giảm giá</span>
                        <span className="text-red-300">- {totalVoucherDiscount.toLocaleString('vi-VN')}₫</span>
                      </div>
                    )}
                  </div>
                )}
                <div className="flex items-center justify-between border-t border-white/10 pt-3 md:pt-6 text-white">
                  <dt className="text-sm md:text-base font-semibold">Thành tiền</dt>
                  <dd className="text-lg md:text-xl font-bold">{(finalTotal + shippingFee).toLocaleString('vi-VN')}₫</dd>
                </div>
              </dl>
            </div>
          </section>
        </div>

        {/* Mobile Sticky Submit Button */}
        <div className="md:hidden bg-white border-t border-gray-200 px-3 py-3 z-50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Tổng cộng:</span>
            <span className="text-lg font-bold text-red-600">{(finalTotal + shippingFee).toLocaleString('vi-VN')}₫</span>
          </div>
          <button
            type="button"
            className="w-full rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
            disabled={!canSubmitNow}
            onClick={handleSubmit}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang xử lý...
              </div>
            ) : submitSuccess ? (
              '✅ Cảm ơn bạn!'
            ) : isInCooldown ? (
              getCooldownText() || 'Vui lòng chờ...'
            ) : !isFormValid ? (
              'Vui lòng điền đầy đủ thông tin'
            ) : !submitCheck.canSubmit ? (
              submitCheck.reason || 'Không thể gửi'
            ) : (
              'Xác nhận đơn hàng'
            )}
          </button>
        </div>
      </div>
    </div>
  );

  // Thank You Modal Component
  const thankYouModalContent = (
    <div className="fixed inset-0 z-[10000003] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-auto animate-fade-in">
        {/* Header */}
        <div className="text-center p-8 pb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircleIcon className="w-12 h-12 text-green-600 animate-bounce-gentle" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Cảm ơn quý khách!
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Cảm ơn quý khách đã đặt hàng, nhân viên G3Tech sẽ liên hệ xác nhận đơn hàng tới quý khách.
          </p>
        </div>

        {/* Order Info */}
        {orderData && (
          <div className="px-8 pb-6">
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                <span className="text-sm font-medium text-gray-600">Mã đơn hàng:</span>
                <span className="text-sm font-semibold text-gray-900">#{orderData.id}</span>
              </div>
              
              {/* Thông tin khách hàng */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-gray-800">Thông tin khách hàng</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>📞 {orderData.phone}</div>
                  <div>📍 {orderData.address}</div>
                  {orderData.email && <div>✉️ {orderData.email}</div>}
                </div>
              </div>

              {/* Sản phẩm đặt mua */}
              {orderData.products && orderData.products.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-gray-800">Sản phẩm đã đặt</h4>
                  <div className="space-y-2">
                    {orderData.products.map((item: any, index: number) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <div className="flex-1 min-w-0">
                          <div className="text-gray-900 truncate">{item.product_name}</div>
                          <div className="text-gray-500">Số lượng: {item.quantity}</div>
                        </div>
                        <div className="text-right ml-2">
                          <div className="font-medium text-gray-900">
                            {(item.price * item.quantity).toLocaleString('vi-VN')}₫
                          </div>
                          {item.original_price && item.original_price > item.price && (
                            <div className="text-xs text-gray-500 line-through">
                              {(item.original_price * item.quantity).toLocaleString('vi-VN')}₫
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Thanh toán */}
              <div className="space-y-2 pt-2 border-t border-gray-200">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Phương thức:</span>
                  <span className="text-gray-900">
                    {orderData.payment_method === 'cod' ? 'Thanh toán khi nhận hàng' : 'Chuyển khoản'}
                  </span>
                </div>
                {orderData.shipping_fee > 0 && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Phí vận chuyển:</span>
                    <span className="text-gray-900">{orderData.shipping_fee.toLocaleString('vi-VN')}₫</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-base font-semibold pt-2 border-t border-gray-300">
                  <span className="text-gray-800">Tổng tiền:</span>
                  <span className="text-red-600">
                  {orderData.total_amount?.toLocaleString('vi-VN')}₫
                </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Email Notice */}
        <div className="px-8 pb-6">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-amber-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-semibold text-amber-800">Lưu ý quan trọng</h4>
                <div className="mt-1 text-sm text-amber-700 space-y-1">
                  <p>• Vui lòng kiểm tra email để xem thông tin đơn hàng chi tiết</p>
                  <p>• G3Tech sẽ không thể liên lạc nếu thông tin liên lạc không chính xác</p>
                  <p>• Đảm bảo số điện thoại và địa chỉ đã nhập đúng để giao hàng thành công</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hotline Support */}
        <div className="px-8 pb-6">
          <div className="border-t border-gray-100 pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-3">Hotline hỗ trợ đơn hàng:</p>
              <div className="space-y-3">
                <a 
                  href={`tel:${COMPANY_INFO.hotline}`} 
                  className="flex items-center justify-center bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {COMPANY_INFO.hotline}
                </a>
                <p className="text-xs text-gray-500 text-center">
                  Thời gian hỗ trợ: {COMPANY_INFO.workingHours}
                </p>
              </div>
            </div>
          </div>
        </div>

                 {/* Footer Button */}
         <div className="bg-gray-50 px-8 py-6 rounded-b-2xl">
           <button
             onClick={() => {
               setShowThankYouModal(false);
               onClose();
             }}
             className="w-full bg-gray-800 text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
           >
             Quay lại sản phẩm
           </button>
         </div>
      </div>
    </div>
  );

  return typeof window !== 'undefined' && document.body
    ? createPortal(
        <>
          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(10px); }
              to { opacity: 1; transform: translateY(0); }
            }
            .animate-fade-in {
              animation: fadeIn 0.5s ease-out;
            }
            @keyframes bounce-gentle {
              0%, 20%, 53%, 80%, 100% { transform: translateY(0); }
              40%, 43% { transform: translateY(-5px); }
              70% { transform: translateY(-3px); }
              90% { transform: translateY(-1px); }
            }
            .animate-bounce-gentle {
              animation: bounce-gentle 1s ease-in-out;
            }
          `}</style>
          {open && !showThankYouModal && modalContent}
          {showThankYouModal && thankYouModalContent}
        </>
      , document.body)
    : null;
};

export default ModalBuyNowForm; 
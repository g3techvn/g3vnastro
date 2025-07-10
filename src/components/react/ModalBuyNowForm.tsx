import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

// Thêm import jsPDF từ CDN nếu chưa có
// @ts-ignore
import { jsPDF } from "jspdf";
// Heroicons
import { PrinterIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/20/solid';
import { z } from 'zod';

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
  const [productsInCart, setProductsInCart] = useState<{ product: Product; quantity: number }[]>([
    { product: { id: (product as any).id ?? 'main', ...product }, quantity: 1 },
  ]);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [buyerInfo, setBuyerInfo] = useState({
    salutation: 'Anh',
    fullName: '',
    phone: '',
  });
  const [shippingInfo, setShippingInfo] = useState({
    address: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [voucher, setVoucher] = useState('FREESHIP G3TECH200');
  const [productsFromApi, setProductsFromApi] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [errorProducts, setErrorProducts] = useState<string | null>(null);
  const [orderNote, setOrderNote] = useState('');

  // Zod schema cho validate
  const formSchema = z.object({
    salutation: z.enum(['Anh', 'Chị']),
    fullName: z.string()
      .min(2, 'Vui lòng nhập họ tên hợp lệ (tối thiểu 2 ký tự)')
      .refine(val => !/\d/.test(val), { message: 'Họ tên không được chứa số' }),
    phone: z.string()
      .regex(/^0\d{9,10}$/, 'Số điện thoại phải gồm 10 hoặc 11 số, bắt đầu bằng 0'),
    address: z.string()
      .min(6, 'Vui lòng nhập địa chỉ chi tiết (tối thiểu 6 ký tự)'),
  });

  const [errors, setErrors] = useState<{ fullName?: string; phone?: string; address?: string }>({});

  function validateForm() {
    const result = formSchema.safeParse({
      salutation: buyerInfo.salutation,
      fullName: buyerInfo.fullName,
      phone: buyerInfo.phone,
      address: shippingInfo.address,
    });
    if (!result.success) {
      const fieldErrors: { fullName?: string; phone?: string; address?: string } = {};
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

  // Khóa cuộn body khi modal mở
  useEffect(() => {
    if (open) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [open]);

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

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!validateForm()) return;
    console.log({
      productsInCart,
      buyerInfo,
      shippingInfo,
      paymentMethod,
      voucher,
      orderNote,
    });
    alert('Đã xác nhận đơn hàng!');
    onClose();
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

  const modalContent = (
    <div
      className="fixed inset-0 z-[10000002] bg-black/30 backdrop-blur-sm flex items-center justify-center overflow-auto py-8 md:py-12"
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative mx-auto bg-white rounded-2xl w-full max-w-6xl" style={{ maxHeight: 'calc(100vh - 4rem)' }}>
        <div className="flex flex-col lg:flex-row rounded-2xl overflow-hidden shadow-2xl min-h-full max-h-screen overflow-y-auto">
          {/* Form nhập thông tin bên trái */}
          <section
            aria-labelledby="payment-and-shipping-heading"
            className="py-8 pt-8 px-4 lg:px-8 bg-white flex-1 h-full min-h-full lg:w-1/2 lg:pb-16"
          >
            <h2 id="payment-and-shipping-heading" className="sr-only">
              Payment and shipping details
            </h2>
            <form onSubmit={handleSubmit} className="mx-auto max-w-2xl lg:max-w-none">
              {Object.keys(errors).length > 0 && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm font-medium">
                  Vui lòng kiểm tra lại các trường thông tin bên dưới.
                </div>
              )}
              <div>
                <h3 className="text-lg font-medium text-gray-900">Thông tin liên hệ & giao hàng</h3>
                <div className="mt-6 grid grid-cols-1 gap-y-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative w-full sm:w-2/3">
                      <label className="absolute -top-2 left-2 inline-block rounded-lg bg-white px-1 text-xs font-medium text-gray-900">Họ tên*</label>
                      <div className="flex">
                        <select
                          id="salutation"
                          className="rounded-l-md border border-gray-300 bg-white px-3 py-1.5 text-base text-gray-900 focus:outline-2 focus:outline-indigo-600 sm:text-sm/6 border-r-0"
                          style={{ minWidth: 70 }}
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
                          className={`block w-full rounded-r-md bg-white px-3 py-1.5 text-base text-gray-900 border ${errors.fullName ? 'border-red-400' : 'border-gray-300'} border-l-0 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6`}
                          value={buyerInfo.fullName}
                          onChange={e => setBuyerInfo({ ...buyerInfo, fullName: e.target.value })}
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
                        className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border ${errors.phone ? 'border-red-400' : 'border-gray-300'} placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6`}
                        value={buyerInfo.phone}
                        onChange={e => setBuyerInfo({ ...buyerInfo, phone: e.target.value })}
                        onBlur={validateForm}
                        required
                      />
                      {errors.phone && <div className="text-red-500 text-xs mt-1">{errors.phone}</div>}
                    </div>
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
                      className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border ${errors.address ? 'border-red-400' : 'border-gray-300'} placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6`}
                      value={shippingInfo.address}
                      onChange={e => setShippingInfo({ ...shippingInfo, address: e.target.value })}
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
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 min-h-[48px]"
                      value={orderNote}
                      onChange={e => setOrderNote(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="mt-10">
                <h3 className="text-lg font-medium text-gray-900">Thanh toán & Ưu đãi</h3>
                <fieldset>
                  <legend className="text-sm/6 font-semibold text-gray-900 mb-2">Chọn phương thức thanh toán</legend>
                  <div className="mt-4 grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-4">
                    {[
                      { id: 'cod', title: 'Thanh toán khi nhận hàng', description: 'Trả tiền mặt khi nhận hàng tại nhà.' },
                      { id: 'bank', title: 'Chuyển khoản ngân hàng', description: 'Chuyển khoản qua ngân hàng, ví điện tử.' },
                    ].map((method) => (
                      <label
                        key={method.id}
                        aria-label={method.title}
                        className={`group relative flex rounded-lg border bg-white p-4 cursor-pointer transition-all duration-150 ${paymentMethod === method.id ? 'border-red-600 ring-2 ring-red-500' : 'border-gray-300'}`}
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
                          <span className="mt-1 block text-sm text-gray-500">{method.description}</span>
                        </div>
                        <CheckCircleIcon
                          aria-hidden="true"
                          className={`ml-4 size-5 ${paymentMethod === method.id ? 'text-red-600 visible' : 'invisible'}`}
                        />
                      </label>
                    ))}
                  </div>
                </fieldset>
                  <div className="pt-4">
                    <label className="block text-sm font-medium text-gray-700">Mã giảm giá</label>
                    <input
                      type="text"
                      className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 border border-gray-300 focus:outline-2 focus:outline-indigo-600"
                      value={voucher}
                      onChange={e => setVoucher(e.target.value)}
                    />
                    {voucher && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {voucher.split(/\s+/).map((code, idx, arr) => code && (
                          <div key={code+idx} className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium border border-green-300">
                            <span>{code}</span>
                            <button
                              type="button"
                              className="ml-2 text-green-600 hover:text-red-500 focus:outline-none"
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
              <div className="flex justify-end mt-8">
                <button
                  type="button"
                  className="rounded-md border border-transparent bg-red-600 px-6 py-3 text-base font-medium text-white shadow-xs hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-50 focus:outline-none disabled:opacity-60"
                  disabled={!isFormValid}
                  onClick={handleSubmit}
                >
                  Xác nhận đơn hàng
                </button>
              </div>
            </form>
          </section>
          {/* Tổng kết đơn hàng bên phải */}
          <section
            aria-labelledby="summary-heading"
            className="bg-indigo-900 py-8 pt-8 text-indigo-300 px-4 lg:px-8 flex-1 h-full min-h-full lg:w-1/2 lg:bg-indigo-900 lg:pb-16 flex flex-col justify-between"
          >
            <div className="px-4 lg:px-8 w-full bg-indigo-900">
              <h2 id="summary-heading" className="sr-only">
                Order summary
              </h2>
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm font-medium">Tổng cộng</span>
                <div className="flex flex-col items-end">
                  {totalOriginal > total && (
                    <span className="text-base font-medium text-white/60 line-through">
                      {totalOriginal.toLocaleString('vi-VN')}₫
                    </span>
                  )}
                  <span className="text-3xl font-bold tracking-tight text-white">{total.toLocaleString('vi-VN')}₫</span>
                  {totalDiscount > 0 && (
                    <span className="text-sm font-medium text-green-300">Tiết kiệm: {totalDiscount.toLocaleString('vi-VN')}₫</span>
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
                    <li key={key} className="flex items-start space-x-4 py-6 bg-indigo-900">
                      <img
                        alt={name}
                        src={image_url || '/placeholder.png'}
                        className="size-20 flex-none rounded-md object-cover"
                      />
                      <div className="flex-auto space-y-1">
                        <h3 className="text-white flex items-center gap-2">{name}</h3>
                        {hasDiscount && (
                          <span className="text-sm text-white/60 line-through">{original_price.toLocaleString('vi-VN')}₫</span>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <span className="font-medium text-white">Số lượng:</span>
                          <button type="button" className="px-2 py-1 border rounded-md bg-white/10 text-white hover:bg-white/20" onClick={() => setProductsInCart(list => list.map((item, i) => i === idx ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item))}>-</button>
                          <input type="number" min={1} value={quantity} onChange={e => setProductsInCart(list => list.map((item, i) => i === idx ? { ...item, quantity: Math.max(1, Number(e.target.value)) } : item))} className="w-16 text-center border rounded-md bg-white/10 text-white" />
                          <button type="button" className="px-2 py-1 border rounded-md bg-white/10 text-white hover:bg-white/20" onClick={() => setProductsInCart(list => list.map((item, i) => i === idx ? { ...item, quantity: item.quantity + 1 } : item))}>+</button>
                          {productsInCart.length > 1 && (
                            <button type="button" className="ml-2 text-red-400 hover:text-red-600" onClick={() => setProductsInCart(list => list.filter((_, i) => i !== idx))} title="Xóa sản phẩm">×</button>
                          )}
                        </div>
                      </div>
                      <p className="flex-none text-base font-medium text-white">{price.toLocaleString('vi-VN')}₫</p>
                    </li>
                  );
                })}
              </ul>
              {/* Nút thêm sản phẩm */}
              <div className="mt-4 flex justify-end">
                <button type="button" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700" onClick={() => setShowAddProduct(true)}>
                  Thêm sản phẩm
                </button>
              </div>
              {/* Modal chọn sản phẩm */}
              {showAddProduct && (
                <div className="fixed inset-0 z-[10000003] bg-black/40 flex items-center justify-center">
                  <div className="bg-white rounded-lg p-6 max-w-md w-full">
                    <h3 className="text-lg font-bold mb-4">Chọn sản phẩm để thêm</h3>
                    {loadingProducts && <div className="text-gray-500">Đang tải sản phẩm...</div>}
                    {errorProducts && <div className="text-red-500">{errorProducts}</div>}
                    {!loadingProducts && !errorProducts && (
                      <ul className="divide-y divide-gray-200 max-h-80 overflow-y-auto">
                        {productsFromApi.filter(mp => !productsInCart.some(item => item.product && 'id' in item.product && item.product.id === mp.id)).map(mp => (
                          <li key={mp.id} className="py-2 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <img src={mp.image_url} alt={mp.name} className="w-10 h-10 object-cover rounded" />
                              <span>{mp.name}</span>
                            </div>
                            <button type="button" className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700" onClick={() => {
                              setProductsInCart(list => [...list, { product: mp, quantity: 1 }]);
                              setShowAddProduct(false);
                            }}>
                              Thêm
                            </button>
                          </li>
                        ))}
                        {productsFromApi.filter(mp => !productsInCart.some(item => item.product && 'id' in item.product && item.product.id === mp.id)).length === 0 && (
                          <li className="py-2 text-gray-500 text-center">Không còn sản phẩm nào để thêm</li>
                        )}
                      </ul>
                    )}
                    <button type="button" className="mt-4 text-gray-500 hover:text-gray-800" onClick={() => setShowAddProduct(false)}>Đóng</button>
                  </div>
                </div>
              )}
              <dl className="space-y-4 border-t border-white/10 pt-6 text-sm font-medium mt-6">
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
                  <dd>
                    {voucher.toLowerCase().includes('freeship')
                      ? 'Miễn phí giao hàng'
                      : '200.000₫'}
                  </dd>
                </div>
                {/* Block giảm giá riêng */}
                <div className="border-t border-white/20 pt-4 mt-4 rounded">
                  <div className="text-xs font-semibold text-white/80 mb-2">Giảm giá</div>
                  {totalAmountSaved > 0 && (
                    <div className="flex items-center justify-between mb-1">
                      <span>Giá gốc</span>
                      <span className="text-red-300">- {totalAmountSaved.toLocaleString('vi-VN')}₫</span>
                    </div>
                  )}
                  {totalVoucherDiscount > 0 && (
                    <div className="flex items-center justify-between mb-1">
                      <span>Mã G3TECH200</span>
                      <span className="text-red-300">- {totalVoucherDiscount.toLocaleString('vi-VN')}₫</span>
                    </div>
                  )}
                  {!totalAmountSaved && !totalVoucherDiscount && (
                    <div className="flex items-center justify-between mb-1">
                      <span>Khác</span>
                      <span className="text-red-300">{voucher ? '- ...₫' : '0₫'}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between border-t border-white/10 pt-6 text-white">
                  <dt className="text-base">Thành tiền</dt>
                  <dd className="text-base">{(total - totalDiscount).toLocaleString('vi-VN')}₫</dd>
                </div>
              </dl>
            </div>
          </section>
        </div>
      </div>
    </div>
  );

  return typeof window !== 'undefined' && document.body
    ? createPortal(modalContent, document.body)
    : null;
};

export default ModalBuyNowForm; 
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

// Thêm import jsPDF từ CDN nếu chưa có
// @ts-ignore
import { jsPDF } from "jspdf";

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
    fullName: '',
    phone: '',
    email: '',
  });
  const [shippingInfo, setShippingInfo] = useState({
    address: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [voucher, setVoucher] = useState('FREESHIP G3200k');
  const [productsFromApi, setProductsFromApi] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [errorProducts, setErrorProducts] = useState<string | null>(null);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
      alert('Vui lòng nhập đầy đủ thông tin!');
      return;
    }
    console.log({
      productsInCart,
      buyerInfo,
      shippingInfo,
      paymentMethod,
      voucher,
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
    if (voucherCodes.includes('G3200K')) {
      totalVoucherDiscount += 200000 * quantity;
    }
  });
  const totalDiscount = totalAmountSaved + totalVoucherDiscount;

  const modalContent = (
    <div className="fixed inset-0 z-[10000002] bg-black/30 backdrop-blur-sm flex items-center justify-center overflow-auto py-8 md:py-12">
      <div className="relative mx-auto bg-white rounded-2xl w-full max-w-6xl" style={{ maxHeight: 'calc(100vh - 4rem)' }}>
        {/* Header modal */}
        <div className="relative border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 text-left">Đặt hàng nhanh</h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="inline-flex items-center gap-1 px-3 py-1 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onClick={() => window.print()}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 9V4a2 2 0 012-2h8a2 2 0 012 2v5" />
                <rect width="16" height="10" x="4" y="9" rx="2" ry="2" stroke="currentColor" strokeWidth="2" fill="none" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18h12" />
              </svg>
              In
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-1 px-3 py-1 rounded bg-gray-100 text-red-700 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500"
              onClick={() => {
                const doc = new jsPDF({ format: 'a4', unit: 'mm' });
                const modal = document.querySelector('.max-w-6xl');
                if (modal && modal instanceof HTMLElement) {
                  // Thêm style font-family cho modal khi xuất PDF
                  const prevFont = modal.style.fontFamily;
                  modal.style.fontFamily = 'Arial, Roboto, sans-serif';
                  doc.html(modal, {
                    callback: function (pdf: any) {
                      pdf.save('order.pdf');
                      modal.style.fontFamily = prevFont;
                    },
                    x: 10,
                    y: 10,
                    width: 190, // fit A4 width (210mm - 2*10mm margin)
                    windowWidth: 1200
                  });
                }
              }}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                <rect width="16" height="20" x="4" y="2" rx="2" ry="2" stroke="currentColor" strokeWidth="2" fill="none" />
              </svg>
              Tải PDF
            </button>
            <button
              type="button"
              className="ml-2 rounded-full p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-md"
              onClick={onClose}
            >
              <span className="sr-only">Đóng</span>
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
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
              <div>
                <h3 className="text-lg font-medium text-gray-900">Thông tin liên hệ</h3>
                <div className="mt-6 grid grid-cols-1 gap-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Họ và tên*</label>
                    <input
                      type="text"
                      className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 border border-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600"
                      value={buyerInfo.fullName}
                      onChange={e => setBuyerInfo({ ...buyerInfo, fullName: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Số điện thoại*</label>
                    <input
                      type="tel"
                      className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 border border-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600"
                      value={buyerInfo.phone}
                      onChange={e => setBuyerInfo({ ...buyerInfo, phone: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 border border-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600"
                      value={buyerInfo.email}
                      onChange={e => setBuyerInfo({ ...buyerInfo, email: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <div className="mt-10">
                <h3 className="text-lg font-medium text-gray-900">Địa chỉ giao hàng</h3>
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700">Địa chỉ*</label>
                  <input
                    type="text"
                    className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 border border-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600"
                    value={shippingInfo.address}
                    onChange={e => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="mt-10">
                <h3 className="text-lg font-medium text-gray-900">Thanh toán & Ưu đãi</h3>
                <div className="mt-6 grid grid-cols-1 gap-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phương thức thanh toán</label>
                    <select
                      className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 border border-gray-300 focus:outline-2 focus:outline-indigo-600"
                      value={paymentMethod}
                      onChange={e => setPaymentMethod(e.target.value)}
                    >
                      <option value="cod">Thanh toán khi nhận hàng</option>
                      <option value="bank">Chuyển khoản ngân hàng</option>
                    </select>
                  </div>
                  <div>
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
              </div>
              <div className="mt-10 flex justify-end border-t border-gray-200 pt-6">
                <button
                  type="submit"
                  className="rounded-md border border-transparent bg-red-600 px-6 py-3 text-base font-medium text-white shadow-xs hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-50 focus:outline-none disabled:opacity-60"
                  disabled={!isFormValid}
                >
                  Xác nhận đặt hàng
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
                        <h3 className="text-white flex items-center gap-2">{name}
                          <span className="inline-block bg-indigo-200 text-indigo-900 text-xs font-semibold px-2 py-0.5 rounded ml-1">x{quantity}</span>
                        </h3>
                        {hasDiscount && (
                          <span className="text-sm text-white/60 line-through">{original_price.toLocaleString('vi-VN')}₫</span>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <span className="font-medium text-white">Số lượng:</span>
                          <button type="button" className="px-2 py-1 border rounded-md bg-white/10 text-white hover:bg-white/20" onClick={() => setProductsInCart(list => list.map((item, i) => i === idx ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item))}>-</button>
                          <input type="number" min={1} value={quantity} onChange={e => setProductsInCart(list => list.map((item, i) => i === idx ? { ...item, quantity: Math.max(1, Number(e.target.value)) } : item))} className="w-16 text-center border rounded-md bg-white/10 text-white" />
                          <button type="button" className="px-2 py-1 border rounded-md bg-white/10 text-white hover:bg-white/20" onClick={() => setProductsInCart(list => list.map((item, i) => i === idx ? { ...item, quantity: item.quantity + 1 } : item))}>+</button>
                          <button type="button" className="ml-2 text-red-400 hover:text-red-600" onClick={() => setProductsInCart(list => list.filter((_, i) => i !== idx))} title="Xóa sản phẩm">×</button>
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
                  <dd>0₫</dd>
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
                      <span>Mã G3200k</span>
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
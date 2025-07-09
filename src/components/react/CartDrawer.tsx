import React from 'react';
import { useCart } from '../../context/CartContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { cartItems, updateQuantity, removeFromCart, totalPrice } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200]">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-lg flex flex-col z-[201] animate-slideIn">
        <div className="flex items-center justify-between p-4 border-b">
          <span className="font-semibold text-lg">Giỏ hàng của bạn</span>
          <button onClick={onClose} className="text-gray-500 hover:text-red-600 text-2xl">×</button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              Giỏ hàng trống
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map(item => (
                <div key={item.id} className="flex gap-3 border-b pb-3">
                  <img src={item.image_url || '/images/placeholder-product.jpg'} alt={item.name} className="w-16 h-16 object-cover rounded" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{item.name}</div>
                    <div className="text-red-600 font-semibold">{item.price.toLocaleString()}₫</div>
                    {item.original_price && item.original_price > item.price && (
                      <div className="text-xs text-gray-400 line-through">{item.original_price.toLocaleString()}₫</div>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} className="px-2 py-1 border rounded">-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 py-1 border rounded">+</button>
                      <button onClick={() => removeFromCart(item.id)} className="ml-2 text-gray-400 hover:text-red-600">Xóa</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="p-4 border-t">
          <div className="flex justify-between font-semibold mb-4">
            <span>Tổng tiền:</span>
            <span>{totalPrice.toLocaleString()}₫</span>
          </div>
          <a href="/gio-hang" className="block w-full text-center bg-red-600 text-white py-2 rounded hover:bg-red-700 transition">Thanh toán</a>
        </div>
      </div>
      <style>{`.animate-slideIn{animation:slideInRight .3s cubic-bezier(.4,0,.2,1)}`}</style>
      <style>{`@keyframes slideInRight{from{transform:translateX(100%);}to{transform:translateX(0);}}`}</style>
    </div>
  );
};

export default CartDrawer;

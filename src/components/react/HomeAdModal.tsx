'use client';

import { useEffect, useState, useCallback } from 'react';

interface AdModalProps {
  storageKey?: string;
  expirationHours?: number;
  children: React.ReactNode;
}

function AdModal({
  storageKey = 'ad-modal-shown',
  expirationHours = 24,
  children
}: AdModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const checkIfShouldShow = () => {
      const lastShown = localStorage.getItem(storageKey);
      if (!lastShown) {
        setIsOpen(true);
        return;
      }

      const lastShownDate = new Date(lastShown);
      const now = new Date();
      const hoursDiff = (now.getTime() - lastShownDate.getTime()) / (1000 * 60 * 60);

      if (hoursDiff >= expirationHours) {
        setIsOpen(true);
      }
    };

    // Slight delay to ensure page is loaded
    const timer = setTimeout(checkIfShouldShow, 1000);
    return () => clearTimeout(timer);
  }, [storageKey, expirationHours]);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    localStorage.setItem(storageKey, new Date().toISOString());
  }, [storageKey]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeModal();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeModal]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999]">
      <div 
        className="fixed inset-0 bg-black/30 backdrop-blur-md cursor-pointer" 
        onClick={closeModal}
      />
      
      <div className="fixed inset-0 overflow-y-auto pointer-events-none">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <div className="w-full max-w-6xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all pointer-events-auto relative">
            {/* Close button - positioned absolutely on top */}
            <button
              type="button"
              className="absolute right-4 top-4 z-10 rounded-full p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-md"
              onClick={closeModal}
            >
              <span className="sr-only">Đóng</span>
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="relative">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomeAdModal() {
  const [isPC, setIsPC] = useState(true);

  useEffect(() => {
    const checkIsPC = () => {
      setIsPC(window.innerWidth >= 1024);
    };

    checkIsPC();
    window.addEventListener('resize', checkIsPC);
    return () => window.removeEventListener('resize', checkIsPC);
  }, []);

  // Chỉ hiển thị trên PC
  if (!isPC) {
    return null;
  }

  return (
    <AdModal expirationHours={12}>
      <div className="relative w-full">
        {/* Content with aspect ratio */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16"></div>
            <div className="absolute top-20 right-10 w-20 h-20 bg-white rounded-full"></div>
            <div className="absolute bottom-10 left-20 w-24 h-24 bg-white rounded-full"></div>
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-white rounded-full translate-x-20 translate-y-20"></div>
          </div>
          
          {/* Main content */}
          <div className="relative p-12 h-full flex flex-col justify-center items-center text-center text-white">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-yellow-400 text-black text-sm font-bold rounded-full mb-6 shadow-lg">
              <span className="mr-2">⚡</span>
              ƯU ĐÃI GIỚI HẠN
            </div>
            
            {/* Main heading */}
            <h1 className="text-5xl font-black mb-4 leading-tight">
              VOUCHER
              <span className="block text-6xl text-yellow-300 drop-shadow-lg">
                200.000₫
              </span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl font-medium mb-8 opacity-90 max-w-2xl leading-relaxed">
              Áp dụng cho đơn hàng từ <span className="font-bold text-yellow-300">500.000₫</span><br/>
              Số lượng có hạn - Nhanh tay đặt hàng!
            </p>
            
            {/* Voucher code section */}
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 mb-8 border border-white/30">
              <p className="text-sm font-medium mb-2 opacity-80">Mã voucher:</p>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-mono font-bold tracking-wider bg-white text-indigo-600 px-4 py-2 rounded-lg">
                  G3VIP200
                </span>
                <button 
                  className="text-yellow-300 hover:text-yellow-200 transition-colors"
                  onClick={() => {
                    navigator.clipboard.writeText('G3VIP200');
                    alert('Đã copy mã voucher!');
                  }}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex gap-4">
              <a
                href="/uu-dai"
                className="inline-flex items-center bg-yellow-400 text-black px-8 py-4 rounded-xl text-lg font-bold hover:bg-yellow-300 transition-all duration-300 hover:shadow-2xl hover:scale-105"
              >
                <span className="mr-2">🎁</span>
                Nhận voucher ngay
              </a>
              <a
                href="/san-pham"
                className="inline-flex items-center bg-white/20 text-white border-2 border-white/50 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white/30 transition-all duration-300 backdrop-blur-sm"
              >
                Mua sắm ngay
              </a>
            </div>
            
            {/* Timer or expiry info */}
            <div className="mt-6 flex items-center text-sm opacity-75">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Ưu đãi có hiệu lực đến hết tháng này
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-4 right-4">
            <div className="w-16 h-16 border-4 border-yellow-400 rounded-full flex items-center justify-center">
              <span className="text-2xl">💎</span>
            </div>
          </div>
        </div>
      </div>
    </AdModal>
  );
} 
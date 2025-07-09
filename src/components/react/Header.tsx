import React, { useState, useEffect, useRef } from 'react';

// Constants
const COMPANY_INFO = {
  name: 'Công Ty Cổ phần Công nghệ G3 Việt Nam',
  hotline: '0979983355',
  email: 'info@g-3.vn',
  address: 'Tầng 7, Tòa nhà Charmvit, số 117 Trần Duy Hưng, Q. Cầu Giấy, TP. Hà Nội.',
  website: 'https://g-3.vn',
  workingHours: '8:00 - 17:30 (Thứ 2 - Thứ 6)',
  zalo: 'https://zalo.me/0979983355',
};

const SOCIAL_LINKS = [
  { name: 'Shopee', href: 'https://shopee.vn/g3tech' },
  { name: 'Facebook', href: 'https://www.facebook.com/g3.vntech/' },
  { name: 'Tiktok', href: 'https://www.tiktok.com/@g3tech.vn' },
  { name: 'Youtube', href: 'https://www.youtube.com/@g3-tech' },
];

// Helper function to format phone number
const formatPhoneNumber = (phone: string) => {
  return phone.replace(/(\d{4})(\d{3})(\d{3})/, '$1.$2.$3');
};

interface HeaderProps {
  totalItems?: number;
}

const Header: React.FC<HeaderProps> = ({ totalItems = 0 }) => {
  const [isSticky, setIsSticky] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Handle scroll behavior for sticky header
  useEffect(() => {
    const controlHeader = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > 0) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', controlHeader);
    return () => {
      window.removeEventListener('scroll', controlHeader);
    };
  }, [lastScrollY]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setShowResults(false);
      return;
    }
    setShowResults(true);
  };

  const handleProductClick = (productId: string) => {
    setShowResults(false);
    setSearchQuery('');
    window.location.href = `/san-pham/${productId}`;
  };

  const openCart = () => {
    window.location.href = '/gio-hang';
  };



  const handleCategoriesClick = () => {
    const event = new CustomEvent('toggleStickyNav', { detail: { open: true } });
    document.dispatchEvent(event);
  };

  return (
    <header className="bg-gray-100 py-2">
      {/* Top Header Section */}
      <div 
        className={`container mx-auto bg-white px-4 py-3 rounded-lg 
          ${isSticky ? 'fixed top-2 left-0 translate-x-16 right-16 z-50 shadow-md px-4 md:mx-auto mx-0' : ''}`}>
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex-shrink-0">
            <img
              src="/images/logo-g3.svg"
              alt="G3 Logo"
              className="h-12 w-auto"
            />
          </a>
          
          {/* Search Bar - Desktop Only */}
          <div className="hidden md:block flex-grow max-w-3xl mx-8">
            <div ref={searchRef} className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Nhập từ khóa tìm sản phẩm..."
                className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {/* Search Results Dropdown */}
              {showResults && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg max-h-[60vh] overflow-y-auto z-50">
                  <div className="p-4 text-center text-gray-500">
                    Tính năng tìm kiếm đang được phát triển
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Hotline - Desktop Only */}
          <div className="hidden md:flex items-center">
            <a href={`tel:${COMPANY_INFO.hotline}`} className="flex items-center hover:text-red-600">
              <div className="mr-2">
                <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">HOTLINE:</div>
                <div className="text-lg font-bold text-black">{formatPhoneNumber(COMPANY_INFO.hotline)}</div>
              </div>
            </a>
          </div>
          
          {/* Shopping Cart */}
          <div className="flex items-center">
            <button onClick={openCart} className="text-gray-700 hover:text-red-600 relative">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Spacer for sticky header */}
      {isSticky && <div className="h-20"></div>}
      
      {/* Main Navigation Section */}
      <div className="bg-gray-100 border-gray-200 hidden md:block">
        <div className="container bg-white my-2 mx-auto px-4 rounded-lg">
          <div className="flex items-center justify-between">
            {/* Categories Menu Button */}
            <div className="relative py-3 text-sm">
              <button 
                onClick={handleCategoriesClick}
                className="flex items-center space-x-2 text-gray-800 font-medium cursor-pointer hover:text-red-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <span>DANH MỤC SẢN PHẨM</span>
              </button>
            </div>
            
            {/* Main Navigation Links - Desktop Only */}
            <nav className="hidden md:flex">
              <ul className="flex items-center space-x-1">
                {/* Home */}
                <li>
                  <a href="/" className="flex items-center px-3 py-3 text-red-600 text-sm font-medium">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    TRANG CHỦ
                  </a>
                </li>

                {/* Store */}
                <li>
                  <a href="/san-pham" className="flex items-center px-3 py-3 text-gray-700 hover:text-red-600 text-sm font-medium">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    CỬA HÀNG
                  </a>
                </li>

                {/* Guide */}
                <li>
                  <a href="#" className="flex items-center px-3 py-3 text-gray-700 hover:text-red-600 text-sm font-medium">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    HƯỚNG DẪN
                  </a>
                </li>

                {/* Policy */}
                <li className="relative group">
                  <button className="flex items-center px-3 py-3 text-gray-700 hover:text-red-600 text-sm font-medium">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    CHÍNH SÁCH
                  </button>
                  <div className="absolute left-0 top-full mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <a href="/noi-dung/chinh-sach-bao-hanh-g3" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Chính sách bảo hành
                    </a>
                    <a href="/noi-dung/chinh-sach-doi-tra-g3" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Chính sách đổi trả
                    </a>
                    <a href="/noi-dung/chinh-sach-bao-mat-g3" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Chính sách bảo mật
                    </a>
                    <a href="/noi-dung/chinh-sach-thanh-toan-g3" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Chính sách thanh toán
                    </a>
                    <a href="/noi-dung/chinh-sach-kiem-hang-g3" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Chính sách kiểm hàng
                    </a>
                    <a href="/noi-dung/chinh-sach-van-chuyen-g3" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Chính sách vận chuyển
                    </a>
                  </div>
                </li>

                {/* Contact */}
                <li>
                  <a href="/lien-he" className="flex items-center px-3 py-3 text-gray-700 hover:text-red-600 text-sm font-medium">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    LIÊN HỆ
                  </a>
                </li>

                {/* About */}
                <li>
                  <a href="/about" className="flex items-center px-3 py-3 text-gray-700 hover:text-red-600 text-sm font-medium">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    GIỚI THIỆU
                  </a>
                </li>
              </ul>
            </nav>
            
            {/* Social Media Links - Desktop Only */}
            <div className="hidden md:flex items-center space-x-2">
              <a href={SOCIAL_LINKS[1].href} aria-label="Facebook" className="text-gray-600 hover:text-red-600" target="_blank" rel="noopener noreferrer">
                <img src="/images/icon/facebook-round-color-icon.svg" alt="Facebook" className="h-5 w-5" />
              </a>
            
              <a href={SOCIAL_LINKS[2].href} aria-label="Tiktok" className="text-gray-600 hover:text-red-600" target="_blank" rel="noopener noreferrer">
                <img src="/images/icon/tiktok-circle.svg" alt="Tiktok" className="h-6 w-6" />   
              </a>
             
              <a href={SOCIAL_LINKS[3].href} aria-label="Youtube" className="text-gray-600 hover:text-red-600" target="_blank" rel="noopener noreferrer">
                <img src="/images/icon/youtube-music-icon.svg" alt="Youtube" className="h-5 w-5" />   
              </a>

              <a href={SOCIAL_LINKS[0].href} aria-label="Shopee" className="text-gray-600 hover:text-red-600" target="_blank" rel="noopener noreferrer">
                <img src="/images/icon/shopee-icon.svg" alt="Shopee" className="h-5 w-5" />
              </a>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button className="text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 
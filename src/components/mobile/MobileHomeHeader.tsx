import React, { useState, useRef, useEffect } from 'react';

// Thay thế Image của Next.js bằng thẻ img thường
// Nếu muốn tối ưu hơn, có thể dùng một component Image riêng cho Astro/React

interface Product {
  id: string | number;
  name: string;
  slug?: string;
  image_url?: string;
  price: number;
  original_price?: number;
}

const mockProducts: Product[] = [
  { id: 1, name: 'Ghế Công Thái Học', slug: 'ghe-cong-thai-hoc', image_url: '/images/placeholder-product.jpg', price: 2990000, original_price: 3990000 },
  { id: 2, name: 'Bàn Nâng Hạ', slug: 'ban-nang-ha', image_url: '/images/placeholder-product.jpg', price: 4990000 },
];

const MobileHomeHeader: React.FC = () => {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [showResults, setShowResults] = useState(false);
  const [searchResults, setSearchResults] = useState<Product[]>([]);

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
    if (!isSearchVisible && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchVisible(false);
        setShowResults(false);
      }
    };
    if (isSearchVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSearchVisible]);

  const handleSearch = (query: string) => {
    setSearchText(query);
    if (!query.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }
    const searchTerm = query.toLowerCase();
    const filtered = mockProducts.filter(product => 
      product.name.toLowerCase().includes(searchTerm)
    );
    setSearchResults(filtered);
    setShowResults(true);
  };

  const handleProductClick = (product: Product) => {
    setShowResults(false);
    setSearchText('');
    setIsSearchVisible(false);
    window.location.href = `/san-pham/${product.slug || product.id}`;
  };

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-white sticky top-0 z-30 transition-transform duration-200 md:hidden">
      {/* Logo */}
      <div className={`flex items-center gap-2 transition-all duration-300 ${isSearchVisible ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
        <button onClick={() => window.location.href = '/'} className="focus:outline-none">
          <img
            src="/images/logo-g3.svg"
            alt="G3 Logo"
            width={100}
            height={28}
            className="h-7 w-auto object-contain"
          />
        </button>
      </div>
      {/* Search bar */}
      <div 
        ref={searchRef}
        className={`flex-1 mx-2 transition-all duration-300 ${isSearchVisible ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}
      >
        <form onSubmit={(e) => { e.preventDefault(); handleSearch(searchText); }} className="relative bg-gray-100 rounded-full px-4 py-2 flex items-center">
          <svg 
            width="20" 
            height="20" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            viewBox="0 0 24 24"
            className="text-gray-500 mr-2 flex-shrink-0"
          >
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Tìm kiếm sản phẩm"
            className="bg-transparent w-full text-sm text-gray-500 focus:outline-none"
          />
          {/* Search Results Dropdown */}
          {showResults && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-lg shadow-lg max-h-[60vh] overflow-y-auto z-50">
              {searchResults.length > 0 ? (
                <div className="p-2">
                  {searchResults.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => handleProductClick(product)}
                      className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                    >
                      <div className="w-12 h-12 relative flex-shrink-0">
                        <img
                          src={product.image_url || '/placeholder-product.jpg'}
                          alt={product.name}
                          className="object-cover rounded-md w-12 h-12"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {product.name}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-sm text-red-600 font-semibold">
                            {product.price.toLocaleString()}₫
                          </div>
                          {product.original_price && product.original_price > product.price && (
                            <div className="text-xs text-gray-400 line-through">
                              {product.original_price.toLocaleString()}₫
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500">
                  Không tìm thấy sản phẩm nào
                </div>
              )}
            </div>
          )}
        </form>
      </div>
      {/* Icons */}
      <div className="flex items-center gap-3">
        <button 
          className={`text-gray-600 transition-all duration-300 ${isSearchVisible ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}
          onClick={toggleSearch}
        >
          <svg 
            width="24" 
            height="24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            viewBox="0 0 24 24"
          >
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
        <button className="text-gray-600">
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 7.165 6 9.388 6 12v2.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
        </button>
      </div>
    </div>
  );
};

export default MobileHomeHeader;

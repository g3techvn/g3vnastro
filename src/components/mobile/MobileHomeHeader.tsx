import React, { useState, useRef, useEffect } from 'react';

// Thay thế Image của Next.js bằng thẻ img thường
// Nếu muốn tối ưu hơn, có thể dùng một component Image riêng cho Astro/React

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  original_price?: number;
  image_url?: string;
}

interface MenuItem {
  name: string;
  href: string;
  current: boolean;
}

const navigation: MenuItem[] = [
  { name: 'Cửa hàng', href: '/san-pham', current: false },
  { name: 'Hướng dẫn', href: '/huong-dan-mua-hang', current: false },
  { name: 'Chính sách', href: '/chinh-sach', current: false },
  { name: 'Liên hệ', href: '/lien-he', current: false },
  { name: 'Giới thiệu', href: '/about', current: false },
];

const MobileHomeHeader: React.FC = () => {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [showResults, setShowResults] = useState(false);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
    if (!isSearchVisible && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      setLoadingProducts(true);
      try {
        const res = await fetch('/api/products?limit=100');
        const json = await res.json();
        const data = json.products || [];
        setProducts(data || []);
      } catch (err) {
        setProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, []);

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

  // Handle drawer close when clicking outside
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeDrawer();
      }
    };

    if (isDrawerOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'auto';
    };
  }, [isDrawerOpen]);

  const handleSearch = (query: string) => {
    setSearchText(query);
    if (!query.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }
    const searchTerm = query.toLowerCase();
    const filtered = products.filter((product: Product) => 
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
              {loadingProducts ? (
                <div className="p-4 text-center text-gray-500">
                  Đang tải...
                </div>
              ) : searchResults.length > 0 ? (
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
        <button 
          className="text-gray-600"
          onClick={toggleDrawer}
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Drawer Overlay */}
      {isDrawerOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeDrawer}
        />
      )}

      {/* Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-50 transform transition-transform duration-300 ${
          isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Drawer Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
            <button 
              onClick={closeDrawer}
              className="p-2 text-gray-500 hover:text-gray-700"
            >
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto p-4">
            <nav className="space-y-2">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={closeDrawer}
                >
                  {item.name}
                </a>
              ))}
            </nav>

            {/* Doanh nghiệp button */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <a
                href="/doanh-nghiep"
                className="block w-full px-4 py-3 text-center bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors"
                onClick={closeDrawer}
              >
                Doanh nghiệp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileHomeHeader;

import React, { useState, useEffect, useRef } from 'react';
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Cửa hàng', href: '/san-pham', current: false },
  { name: 'Dự án', href: '/du-an', current: false },
  { name: 'Hướng dẫn', href: '/huong-dan-mua-hang', current: false },
  { name: 'Chính sách', href: '/chinh-sach', current: false },
  { name: 'Liên hệ', href: '/lien-he', current: false },
  { name: 'Giới thiệu', href: '/about', current: false },
];

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  original_price?: number;
  image_url?: string;
}

const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoadingProducts(true);
      try {
        const res = await fetch('/api/products?limit=100');
        const json = await res.json();
        setProducts(json.products || []);
      } catch (err) {
        setProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  // Close modal on ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleCloseSearch();
    };
    if (showSearchModal) {
      document.addEventListener('keydown', handleEsc);
      return () => document.removeEventListener('keydown', handleEsc);
    }
  }, [showSearchModal]);

  // Focus input when modal opens
  useEffect(() => {
    if (showSearchModal && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showSearchModal]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }
    const searchTerm = query.toLowerCase();
    const filtered = products.filter(product => 
      product.name.toLowerCase().includes(searchTerm)
    );
    setSearchResults(filtered);
    setShowResults(true);
  };

  const handleProductClick = (product: Product) => {
    setShowResults(false);
    setSearchQuery('');
    setShowSearchModal(false);
    window.location.href = `/san-pham/${product.slug || product.id}`;
  };

  const handleOpenSearch = () => setShowSearchModal(true);
  const handleCloseSearch = () => {
    setShowSearchModal(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <Disclosure as="nav" className="fixed top-0 left-0 w-full z-50 bg-white/30 backdrop-blur-xl border-b border-white/30 shadow-sm">
      <div className="mx-auto container px-2 sm:px-4 lg:px-8">
        <div className="flex h-12 items-center justify-between">
          {/* Left: Logo */}
          <div className="flex flex-[3] items-center">
            <a href="/">
              <img
                alt="G3 Logo"
                src="/images/logo-g3.svg"
                className="h-8 w-auto"
              />
            </a>
          </div>
          {/* Center: Menu */}
          <div className="hidden lg:flex flex-[6] justify-center items-stretch h-12">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`inline-flex items-center h-full border-b-2 px-4 text-sm text-gray-900 text-shadow-md font-medium ${item.current ? 'border-red-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}`}
              >
                {item.name}
              </a>
            ))}
          </div>
          {/* Right: Actions */}
          <div className="flex flex-[3] items-center justify-end gap-2 ">
            {/* Doanh nghiệp button */}
            <a
              href="/doanh-nghiep"
              className="inline-flex items-center px-4 py-2 rounded-full bg-red-500 text-white text-sm font-semibold shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition"
            >
              Doanh nghiệp
            </a>
            {/* Search Icon */}
            <button onClick={handleOpenSearch} className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500">
              <MagnifyingGlassIcon className="size-6 text-gray-500" />
              <span className="sr-only">Tìm kiếm sản phẩm</span>
            </button>
            {/* Profile dropdown */}
            
          </div>
        </div>
      </div>
      {/* Search Modal */}
      {showSearchModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-start justify-center pt-24" onClick={handleCloseSearch}>
          <div
            className="bg-white/30 backdrop-blur-lg border border-white/30 rounded-lg shadow-lg w-full max-w-lg mx-auto p-4 relative"
            onClick={e => e.stopPropagation()}
          >
            <input
              ref={inputRef}
              name="search"
              type="search"
              value={searchQuery}
              onChange={e => handleSearch(e.target.value)}
              placeholder="Tìm kiếm sản phẩm"
              className="block w-full rounded-md border border-gray-300 py-2 pr-3 pl-10 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 mb-2"
              autoFocus
            />
            <MagnifyingGlassIcon
              aria-hidden="true"
              className="absolute left-4 top-7 size-5 text-gray-400 pointer-events-none"
            />
            {/* Search Results Dropdown */}
            <div className="max-h-[60vh] overflow-y-auto">
              {loadingProducts ? (
                <div className="p-4 text-center text-gray-500">Đang tải sản phẩm...</div>
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
                          src={product.image_url || '/images/placeholder-product.jpg'}
                          alt={product.name}
                          className="object-cover rounded-md w-full h-full"
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
                <div className="p-4 text-center text-gray-500">Không tìm thấy sản phẩm nào</div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Mobile menu panel (optional, not implemented for now) */}
    </Disclosure>
  );
};

export default Header; 
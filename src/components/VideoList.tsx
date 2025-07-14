'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { VideoPlayer } from './video/VideoPlayer';
import { VideoActions } from './video/VideoActions';
import { VideoInfo } from './video/VideoInfo';
import { VideoDrawer } from './video/VideoDrawer';

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  original_price?: number;
  image_url?: string;
  video_url?: string;
  rating?: number;
  brand?: string;
  brand_id?: string;
  gallery_url?: string;
  thong_so_ky_thuat?: any;
}

interface Brand {
  id: string;
  title: string;
  slug: string;
  image_url?: string;
}

export default function VideoList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeVideoIndex, setActiveVideoIndex] = useState<number | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const videoRefs = useRef<(HTMLDivElement | null)[]>([]);
  const videoObserver = useRef<IntersectionObserver | null>(null);

  // Fetch products with pagination
  const fetchProducts = useCallback(async (pageNumber = 1) => {
    try {
      if (pageNumber === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      
      const response = await fetch(`/api/videos?page=${pageNumber}&limit=10`);
      
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.products || !Array.isArray(data.products)) {
        throw new Error('Invalid response format');
      }

      // API đã filter products có video_url rồi, không cần filter thêm
      const productsWithVideo = data.products;
      
      if (pageNumber === 1) {
        setProducts(productsWithVideo);
      } else {
        setProducts(prev => [...prev, ...productsWithVideo]);
      }
      
      setHasMore(productsWithVideo.length === 10);
      
    } catch (error) {
      console.error('Error fetching products:', error);
      setError(error instanceof Error ? error.message : 'Đã xảy ra lỗi khi tải sản phẩm');
    } finally {
      if (pageNumber === 1) {
        setLoading(false);
      } else {
        setLoadingMore(false);
      }
    }
  }, []);

  // Fetch brands
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await fetch('/api/brands');
        if (!response.ok) throw new Error('Lỗi khi tải thương hiệu');
        const data = await response.json();
        setBrands(data.brands || []);
      } catch (err) {
        console.error('Error fetching brands:', err);
      }
    };
    fetchBrands();
  }, []);

  // Initial data load
  useEffect(() => {
    fetchProducts(1);
  }, [fetchProducts]);

  // Setup intersection observer for videos
  useEffect(() => {
    if (videoObserver.current) {
      videoObserver.current.disconnect();
    }

    videoObserver.current = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          const videoIndex = parseInt(entry.target.getAttribute('data-index') || '0', 10);
          
          if (entry.isIntersecting) {
            setActiveVideoIndex(videoIndex);
          } else if (activeVideoIndex === videoIndex) {
            setActiveVideoIndex(null);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
      }
    );

    videoRefs.current.forEach(ref => {
      if (ref) {
        videoObserver.current?.observe(ref);
      }
    });

    return () => {
      if (videoObserver.current) {
        videoObserver.current.disconnect();
      }
    };
  }, [products, activeVideoIndex]);

  // Implement infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        !loadingMore && 
        hasMore && 
        window.innerHeight + window.scrollY >= document.body.scrollHeight - 500
      ) {
        setPage(prevPage => prevPage + 1);
        fetchProducts(page + 1);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [fetchProducts, hasMore, loadingMore, page]);

  // Toggle mute state
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  // Helper để lấy tên brand từ brand_id
  const getBrandName = (product: Product) => {
    if (typeof product.brand === 'string') return product.brand;
    if (product.brand_id && brands.length > 0) {
      const found = brands.find(b => String(b.id) === String(product.brand_id));
      return found ? found.title : '';
    }
    return '';
  };

  const openDrawer = (product: Product) => {
    setSelectedProduct(product);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setSelectedProduct(null);
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center bg-black">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-white"></div>
      </div>
    );
  }

  if (error || products.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-4 text-center bg-black">
        <h2 className="mb-4 text-xl font-bold text-white">Không thể tải sản phẩm</h2>
        <p className="mb-6 text-gray-300">{error || 'Không tìm thấy sản phẩm nào'}</p>
        <button 
          onClick={() => window.location.href = '/'}
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Quay lại Trang chủ
        </button>
      </div>
    );
  }
  
  return (
    <div className="h-full overflow-hidden">
      <div className="h-full overflow-y-auto snap-y snap-mandatory pb-[70px]">
        {products.map((product, index) => (
          <div 
            key={`${product.id}-${index}`}
            ref={el => { videoRefs.current[index] = el }}
            data-index={index}
            className="relative w-full h-[calc(100vh-70px)] snap-start bg-black flex items-center justify-center overflow-hidden"
          >
            <VideoPlayer
              videoUrl={product.video_url || ''}
              isActive={activeVideoIndex === index}
              isMuted={isMuted}
              onToggleMute={toggleMute}
            />

            <VideoInfo
              product={product}
              brandName={getBrandName(product)}
              onOpenDrawer={() => openDrawer(product)}
            />

            <VideoActions onOpenDrawer={() => openDrawer(product)} />
          </div>
        ))}
        
        {loadingMore && (
          <div className="py-4 flex justify-center bg-black">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-white"></div>
          </div>
        )}
      </div>

      {selectedProduct && (
        <VideoDrawer
          open={drawerOpen}
          onClose={closeDrawer}
          product={selectedProduct}
          brandName={getBrandName(selectedProduct)}
        />
      )}
    </div>
  );
} 
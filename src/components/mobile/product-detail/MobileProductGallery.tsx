import React, { useState, useEffect } from 'react';
import type { Product } from '../../../types';
import { getThumbPath } from '../../../utils/imageUtils';

// Gallery item types
type GalleryVideo = {
  type: 'video';
  url: string;
  embed: string;
  thumbnail: string;
  title: string;
};

type GalleryImage = {
  type: 'image';
  src: string;
  alt: string;
};

type GalleryItem = GalleryVideo | GalleryImage;

interface MobileProductGalleryProps {
  product: Product;
  isLoading?: boolean;
}

export default function MobileProductGallery({ product, isLoading = false }: MobileProductGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);

  useEffect(() => {
    const items: GalleryItem[] = [];

    // Add main image
    if (product.image_url) {
      items.push({
        type: 'image',
        src: product.image_url,
        alt: product.name || 'Sản phẩm'
      });
    }

    // Add gallery images if available
    if (product.gallery_array && Array.isArray(product.gallery_array)) {
      product.gallery_array.forEach((imageUrl: string, index: number) => {
        if (imageUrl && imageUrl !== product.image_url) {
          items.push({
            type: 'image',
            src: imageUrl,
            alt: `${product.name} - ${index + 2}`
          });
        }
      });
    }

    // Add video at position 2 (after main image) if available
    if (product.video_url) {
      // Extract video ID from YouTube URL
      const videoId = product.video_url.split('v=')[1]?.split('&')[0] || 
                     product.video_url.split('/embed/')[1]?.split('?')[0] ||
                     product.video_url.split('youtu.be/')[1]?.split('?')[0];
      
      if (videoId) {
        const videoItem = {
          type: 'video' as const,
          url: product.video_url,
          embed: `https://www.youtube.com/embed/${videoId}`,
          thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
          title: `Video: ${product.name}`
        };
        
        // Chèn video vào vị trí thứ 2 (index 1) sau ảnh chính
        if (items.length > 1) {
          items.splice(1, 0, videoItem); // Chèn vào vị trí 1
        } else {
          items.push(videoItem); // Nếu chỉ có ảnh chính thì push vào cuối
        }
      }
    }

    setGalleryItems(items);
  }, [product]);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % galleryItems.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + galleryItems.length) % galleryItems.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (isLoading) {
    return (
      <div className="w-full aspect-square max-w-full overflow-hidden bg-gray-50 mb-2 md:hidden">
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="w-8 h-8 border-3 border-t-3 border-red-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="mt-4 text-sm text-gray-600">Đang tải ảnh sản phẩm...</span>
        </div>
      </div>
    );
  }

  if (galleryItems.length === 0) {
    return (
      <div className="w-full aspect-square max-w-full overflow-hidden bg-gray-50 mb-2 md:hidden flex items-center justify-center">
        <div className="text-center text-gray-500">
          <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-sm">Không có hình ảnh</p>
        </div>
      </div>
    );
  }

  const currentItem = galleryItems[currentIndex];

  return (
    <div className="w-full bg-white mb-2 md:hidden">
      {/* Main Gallery Display */}
      <div className="relative w-full aspect-square overflow-hidden bg-gray-50">
        {currentItem.type === 'video' ? (
          <iframe
            src={`${currentItem.embed}?autoplay=1&mute=0&enablejsapi=1`}
            title={currentItem.title}
            allow="autoplay"
            allowFullScreen
            className="absolute inset-0 w-full h-full object-contain"
          />
        ) : (
          <img
            src={currentItem.src}
            alt={currentItem.alt}
            className="absolute inset-0 w-full h-full object-contain"
            loading={currentIndex === 0 ? 'eager' : 'lazy'}
          />
        )}

        {/* Navigation Arrows - only show if more than 1 item */}
        {galleryItems.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/20 hover:bg-black/40 rounded-full p-2 text-white transition-all"
              aria-label="Ảnh trước"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/20 hover:bg-black/40 rounded-full p-2 text-white transition-all"
              aria-label="Ảnh tiếp theo"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Item Counter */}
        {galleryItems.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-xs">
            {currentIndex + 1}/{galleryItems.length}
          </div>
        )}

        {/* Video Play Icon Overlay */}
        {currentItem.type === 'video' && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-black/30 rounded-full p-4">
              <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Thumbnail Navigation - only show if more than 1 item */}
      {galleryItems.length > 1 && (
        <div className="flex gap-2 p-3 overflow-x-auto scrollbar-hide">
          {galleryItems.map((item, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`relative flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden ${
                currentIndex === index 
                  ? 'border-red-500' 
                  : 'border-gray-200'
              }`}
            >
              {item.type === 'video' ? (
                <>
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </>
              ) : (
                <img
                  src={getThumbPath(item.src)}
                  alt={item.alt}
                  className="w-full h-full object-cover"
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
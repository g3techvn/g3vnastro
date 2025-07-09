import React, { useState, useEffect } from 'react';

interface GalleryItem {
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
  videoUrl?: string;
  title?: string;
}

interface ProductGalleryProps {
  productName: string;
  galleryUrl?: string;
  mainImageUrl?: string;
  videoInfo?: {
    videoUrl: string;
    thumbnail: string;
  };
  className?: string;
}

// Function to convert YouTube ID to embed URL
function getYouTubeEmbedUrl(videoId: string): string {
  // Remove any URL parts and extract just the ID
  const cleanId = videoId.replace(/^.*(?:youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#\&\?]*).*/, '$1');
  return `https://www.youtube.com/embed/${cleanId}`;
}

// Function to get YouTube thumbnail URL
function getYouTubeThumbnailUrl(videoId: string): string {
  // Remove any URL parts and extract just the ID
  const cleanId = videoId.replace(/^.*(?:youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#\&\?]*).*/, '$1');
  return `https://img.youtube.com/vi/${cleanId}/maxresdefault.jpg`;
}

export default function ProductGallery({ 
  productName, 
  galleryUrl, 
  mainImageUrl,
  videoInfo,
  className = "" 
}: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [isLoadingGallery, setIsLoadingGallery] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Fetch gallery images from Supabase
  useEffect(() => {
    const fetchGalleryImages = async () => {
      if (!galleryUrl) {
        // If no gallery URL, create basic gallery from main image
        const items: GalleryItem[] = [];
        
        if (mainImageUrl) {
          items.push({ type: 'image', url: mainImageUrl });
        }
        
        if (videoInfo?.videoUrl) {
          items.push({ 
            type: 'video', 
            url: '', 
            videoUrl: getYouTubeEmbedUrl(videoInfo.videoUrl), 
            thumbnail: videoInfo.thumbnail || getYouTubeThumbnailUrl(videoInfo.videoUrl)
          });
        }
        
        setGalleryItems(items);
        return;
      }

      try {
        setIsLoadingGallery(true);
        const response = await fetch(`/api/images?folder=${encodeURIComponent(galleryUrl)}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.images && Array.isArray(data.images) && data.images.length > 0) {
          const items: GalleryItem[] = [];
          
          // Add main image first if it exists and is different from gallery images
          if (mainImageUrl) {
            items.push({ type: 'image', url: mainImageUrl });
          }
          
          // Add video if exists
          if (videoInfo?.videoUrl) {
            items.push({ 
              type: 'video', 
              url: '', 
              videoUrl: getYouTubeEmbedUrl(videoInfo.videoUrl), 
              thumbnail: videoInfo.thumbnail || getYouTubeThumbnailUrl(videoInfo.videoUrl)
            });
          }
          
          // Add gallery images
          const imageUrls = data.images.map((img: any) => img.url);
          imageUrls.forEach((url: string) => {
            if (url !== mainImageUrl) {
              items.push({ type: 'image', url });
            }
          });
          
          setGalleryItems(items);
        } else {
          // Fallback to basic gallery
          const items: GalleryItem[] = [];
          if (mainImageUrl) {
            items.push({ type: 'image', url: mainImageUrl });
          }
          if (videoInfo?.videoUrl) {
            items.push({ 
              type: 'video', 
              url: '', 
              videoUrl: getYouTubeEmbedUrl(videoInfo.videoUrl), 
              thumbnail: videoInfo.thumbnail || getYouTubeThumbnailUrl(videoInfo.videoUrl)
            });
          }
          setGalleryItems(items);
        }
      } catch (error) {
        console.error('Error fetching gallery images:', error);
        // Fallback to basic gallery
        const items: GalleryItem[] = [];
        if (mainImageUrl) {
          items.push({ type: 'image', url: mainImageUrl });
        }
        if (videoInfo?.videoUrl) {
          items.push({ 
            type: 'video', 
            url: '', 
            videoUrl: getYouTubeEmbedUrl(videoInfo.videoUrl), 
            thumbnail: videoInfo.thumbnail || getYouTubeThumbnailUrl(videoInfo.videoUrl)
          });
        }
        setGalleryItems(items);
      } finally {
        setIsLoadingGallery(false);
      }
    };

    fetchGalleryImages();
  }, [galleryUrl, mainImageUrl, videoInfo]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (galleryItems[selectedIndex]?.type === 'video') return;
    
    const target = e.currentTarget as HTMLElement;
    const { left, top, width, height } = target.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;
    
    setMousePosition({ x, y });
  };

  if (galleryItems.length === 0 && !isLoadingGallery) {
    return (
      <div className={`bg-white border-2 border-gray-200 rounded-lg overflow-hidden ${className}`}>
        <div className="aspect-[16/9] flex items-center justify-center">
          <span className="text-gray-400">Không có ảnh sản phẩm</span>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Main Gallery */}
      <div 
        className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden relative"
        style={{ aspectRatio: '16/9' }}
        onMouseEnter={() => galleryItems[selectedIndex]?.type === 'image' && setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        {/* Left arrow button */}
        {selectedIndex > 0 && (
          <button
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow transition-all duration-200"
            onClick={() => setSelectedIndex(selectedIndex - 1)}
            aria-label="Previous image"
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Main content */}
        {isLoadingGallery ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-t-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-2 text-sm text-gray-600">Đang tải ảnh...</span>
          </div>
        ) : galleryItems[selectedIndex]?.type === 'video' ? (
          <iframe
            src={`${galleryItems[selectedIndex].videoUrl}?autoplay=0&mute=0&enablejsapi=1&rel=0&modestbranding=1`}
            title={galleryItems[selectedIndex].title || 'Product video'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full absolute inset-0 bg-black"
          />
        ) : (
          <div className="relative w-full h-full">
            <img
              src={galleryItems[selectedIndex]?.url}
              alt={`${productName} - ${selectedIndex + 1}`}
              className={`w-full h-full object-contain transition-transform duration-200 ${
                isZoomed ? 'scale-110' : ''
              }`}
              style={
                isZoomed 
                  ? { 
                      transformOrigin: `${mousePosition.x * 100}% ${mousePosition.y * 100}%` 
                    } 
                  : undefined
              }
            />
          </div>
        )}

        {/* Right arrow button */}
        {selectedIndex < galleryItems.length - 1 && (
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow transition-all duration-200"
            onClick={() => setSelectedIndex(selectedIndex + 1)}
            aria-label="Next image"
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>

      {/* Thumbnails Gallery */}
      <div className="mt-4 flex overflow-x-auto gap-2 pb-2">
        {isLoadingGallery ? (
          <div className="flex items-center justify-center w-full py-4">
            <div className="w-5 h-5 border-2 border-t-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-2 text-sm text-gray-600">Đang tải ảnh...</span>
          </div>
        ) : (
          galleryItems.map((item, index) => (
            <div
              key={`${item.type}-${index}`}
              className={`relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden border-2 cursor-pointer transition-all duration-200 hover:scale-105 ${
                selectedIndex === index ? 'border-red-500' : 'border-gray-200'
              }`}
              onClick={() => setSelectedIndex(index)}
            >
              {item.type === 'video' ? (
                <>
                  <img
                    src={item.thumbnail || ''}
                    alt="Video thumbnail"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="20" cy="20" r="20" fill="rgba(0,0,0,0.5)" />
                      <polygon points="16,12 30,20 16,28" fill="white" />
                    </svg>
                  </div>
                </>
              ) : (
                <img
                  src={item.url}
                  alt={`${productName} - ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
} 
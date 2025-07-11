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
  galleryArray?: string[];
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
  galleryArray,
  videoInfo,
  className = "" 
}: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [isLoadingGallery, setIsLoadingGallery] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  const openModal = (index: number) => {
    if (galleryItems[index]?.type === 'image') {
      setModalIndex(index);
      setIsModalOpen(true);
    }
  };
  const closeModal = () => setIsModalOpen(false);
  const showPrev = () => setModalIndex((prev) => (prev > 0 ? prev - 1 : prev));
  const showNext = () => setModalIndex((prev) => (prev < galleryItems.length - 1 ? prev + 1 : prev));

  // Fetch gallery images from Supabase
  useEffect(() => {
    const fetchGalleryImages = async () => {
      if (galleryArray && Array.isArray(galleryArray) && galleryArray.length > 0) {
        // Ưu tiên dùng galleryArray nếu có
        const items: GalleryItem[] = galleryArray.map(url => {
          let newUrl = url;
          if (url.startsWith('/g3tech/') && /\.(jpg|jpeg|png|webp)$/i.test(url)) {
            newUrl = url.replace(/\.(jpg|jpeg|png|webp)$/i, '.avif');
          }
          return { type: 'image', url: newUrl };
        });
        if (mainImageUrl && !galleryArray.includes(mainImageUrl)) {
          items.unshift({ type: 'image', url: mainImageUrl });
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
        setIsLoadingGallery(false);
        return;
      }

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
  }, [galleryUrl, mainImageUrl, videoInfo, galleryArray]);

  // Autoplay & fade effect for modal
  useEffect(() => {
    if (!isModalOpen || galleryItems.length <= 1 || !isPlaying) return;
    setFade(true);
    setProgress(0);
    
    // Progress animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 0;
        return prev + (100 / 50); // 50 steps trong 5 giây
      });
    }, 100);
    
    // Main autoplay interval
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setModalIndex((prev) => (prev < galleryItems.length - 1 ? prev + 1 : 0));
        setFade(true);
        setProgress(0);
      }, 300);
    }, 5000);
    
    return () => {
      clearInterval(interval);
      clearInterval(progressInterval);
    };
  }, [isModalOpen, galleryItems.length, isPlaying]);

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
              style={{
                cursor: 'zoom-in',
                ...(isZoomed ? { pointerEvents: 'auto', transformOrigin: `${mousePosition.x * 100}% ${mousePosition.y * 100}%` } : {})
              }}
              onClick={() => openModal(selectedIndex)}
              tabIndex={0}
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
              onClick={() => {
                setSelectedIndex(index);
              }}
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

      {/* Modal Gallery */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-300"
          onClick={closeModal}
        >
          {/* Header với nút đóng và thông tin */}
          <div className="absolute top-0 left-0 right-0 z-[10001] bg-gradient-to-b from-black/60 to-transparent p-4 flex justify-between items-center">
            <div className="text-white/80 text-sm font-medium">
              {modalIndex + 1} / {galleryItems.length}
            </div>
            <div className="flex items-center gap-3">
              {/* Progress indicator - Vòng tròn đếm ngược bên trái nút thoát */}
              {isPlaying && galleryItems.length > 1 && (
                <button
                  onClick={e => { e.stopPropagation(); setIsPlaying(p => !p); }}
                  className="relative w-8 h-8 hover:scale-110 transition-transform duration-200"
                  aria-label={isPlaying ? 'Tạm dừng' : 'Tiếp tục'}
                  tabIndex={0}
                >
                  <svg className="w-8 h-8 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-white/30"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-white drop-shadow-lg"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                      strokeDasharray={`${progress}, 100`}
                      strokeLinecap="round"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      style={{
                        transition: 'stroke-dasharray 0.1s ease-out'
                      }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    {isPlaying ? (
                      <svg className="w-3 h-3 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                      </svg>
                    ) : (
                      <svg className="w-3 h-3 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    )}
                  </div>
                </button>
              )}
              {/* Hiển thị vòng tròn tĩnh khi không autoplay */}
              {!isPlaying && galleryItems.length > 1 && (
                <button
                  onClick={e => { e.stopPropagation(); setIsPlaying(p => !p); }}
                  className="relative w-8 h-8 hover:scale-110 transition-transform duration-200"
                  aria-label="Tiếp tục"
                  tabIndex={0}
                >
                  <svg className="w-8 h-8 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-white/30"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-3 h-3 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </button>
              )}
            <button
              className="text-white/90 hover:text-white text-2xl w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-200 border border-white/20"
              onClick={closeModal}
              aria-label="Đóng"
              tabIndex={0}
              onClickCapture={e => { e.stopPropagation(); closeModal(); }}
            >×</button>
            </div>
          </div>

          {/* Nút điều hướng trái/phải - Hiện đại hơn */}
          <button
            disabled={modalIndex === 0}
            onClick={e => { e.stopPropagation(); showPrev(); setFade(false); setTimeout(() => setFade(true), 10); }}
            className="absolute left-6 top-1/2 -translate-y-1/2 text-white hover:text-white w-14 h-14 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed border-2 border-white/30 shadow-2xl hover:scale-110 hover:shadow-white/20 z-[10002]"
            aria-label="Trước"
            tabIndex={0}
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          {/* Container ảnh với shadow đẹp hơn */}
          <div className="relative max-w-[90vw] max-h-[80vh] rounded-2xl overflow-hidden shadow-2xl">
            <img
              src={galleryItems[modalIndex]?.type === 'image' ? galleryItems[modalIndex].url : galleryItems[modalIndex].thumbnail}
              alt=""
              className={`max-h-[80vh] max-w-[90vw] object-contain transition-all duration-500 ${fade ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
              onClick={e => e.stopPropagation()}
              tabIndex={0}
            />
          </div>
          
          <button
            disabled={modalIndex === galleryItems.length - 1}
            onClick={e => { e.stopPropagation(); showNext(); setFade(false); setTimeout(() => setFade(true), 10); }}
            className="absolute right-6 top-1/2 -translate-y-1/2 text-white hover:text-white w-14 h-14 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed border-2 border-white/30 shadow-2xl hover:scale-110 hover:shadow-white/20 z-[10002]"
            aria-label="Sau"
            tabIndex={0}
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
            </svg>
          </button>
         
         {/* Thumbnail indicator - Hiển thị các ảnh thumb */}
         {galleryItems.length > 1 && (
           <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-[10001] max-w-[90vw] overflow-x-auto pb-2 bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/20 shadow-2xl">
             {galleryItems.map((item, index) => (
               <button
                 key={`modal-thumb-${index}`}
                 onClick={e => { 
                   e.stopPropagation(); 
                   setModalIndex(index); 
                   setFade(false); 
                   setTimeout(() => setFade(true), 10); 
                 }}
                 className={`relative w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all duration-200 hover:scale-110 ${
                   modalIndex === index ? 'border-white shadow-lg shadow-white/30' : 'border-white/30 hover:border-white/60'
                 }`}
                 aria-label={`Xem ảnh ${index + 1}`}
                 tabIndex={0}
               >
                 {item.type === 'video' ? (
                   <>
                     <img
                       src={item.thumbnail || ''}
                       alt={`Thumbnail ${index + 1}`}
                       className="w-full h-full object-cover"
                     />
                     <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                       <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                         <polygon points="8,5 19,12 8,19" fill="white" />
                       </svg>
                     </div>
                   </>
                 ) : (
                   <img
                     src={item.url}
                     alt={`Thumbnail ${index + 1}`}
                     className="w-full h-full object-cover"
                   />
                 )}
               </button>
             ))}
           </div>
         )}

        </div>
      )}
    </div>
  );
} 
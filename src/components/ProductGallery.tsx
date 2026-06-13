import React, { useState, useEffect } from 'react';
import { getThumbPath } from '../utils/imageUtils';

interface GalleryItem {
  type: 'image' | 'video';
  url: string;
  optimizedImages?: Array<{ path: string; width: number; size: number }>;
  thumbnail?: string;
  videoUrl?: string;
  title?: string;
}

interface ProductGalleryProps {
  productName: string;
  galleryUrl?: string;
  mainImageUrl?: string;
  galleryArray?: string[];
  optimizedGallery?: Array<{ path: string; width: number; size: number }>[];
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
  optimizedGallery,
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
  const [videoDuration, setVideoDuration] = useState<number | null>(null);
  const [videoCurrentTime, setVideoCurrentTime] = useState(0);
  const [isGalleryPlaying, setIsGalleryPlaying] = useState(true);
  const [galleryProgress, setGalleryProgress] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const openModal = (index: number) => {
    if (galleryItems[index]?.type === 'image') {
      setModalIndex(index);
      setIsModalOpen(true);
    }
  };
  const closeModal = () => setIsModalOpen(false);
  const showPrev = () => setModalIndex((prev) => (prev > 0 ? prev - 1 : prev));
  const showNext = () => setModalIndex((prev) => (prev < galleryItems.length - 1 ? prev + 1 : prev));

  // Touch/Swipe handlers for main gallery
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && selectedIndex < galleryItems.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    }
    if (isRightSwipe && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }
  };

  // Touch/Swipe handlers for modal
  const handleModalTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleModalTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleModalTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && modalIndex < galleryItems.length - 1) {
      setFade(false);
      setTimeout(() => {
        setModalIndex(modalIndex + 1);
        setFade(true);
      }, 10);
    }
    if (isRightSwipe && modalIndex > 0) {
      setFade(false);
      setTimeout(() => {
        setModalIndex(modalIndex - 1);
        setFade(true);
      }, 10);
    }
  };

  // Fetch gallery images from Supabase
  useEffect(() => {
    const fetchGalleryImages = async () => {
      //优先使用 optimizedGallery (from content collections)
      if (optimizedGallery && Array.isArray(optimizedGallery) && optimizedGallery.length > 0) {
        const items: GalleryItem[] = optimizedGallery.map(optImages => {
          // Use largest available size for main display
          const largest = optImages.reduce((prev, current) => 
            current.width > prev.width ? current : prev
          );
          return { 
            type: 'image', 
            url: largest.path,
            optimizedImages: optImages  // Store all sizes for thumbnail
          };
        });

        // Chèn video vào vị trí thứ 2 (index 1) sau ảnh đầu tiên
        if (videoInfo?.videoUrl) {
          const videoItem = {
            type: 'video' as const,
            url: '',
            videoUrl: getYouTubeEmbedUrl(videoInfo.videoUrl),
            thumbnail: videoInfo.thumbnail || getYouTubeThumbnailUrl(videoInfo.videoUrl)
          };
          if (items.length > 1) {
            items.splice(1, 0, videoItem);
          } else {
            items.push(videoItem);
          }
        }
        setGalleryItems(items);
        setIsLoadingGallery(false);
        return;
      }

      if (galleryArray && Array.isArray(galleryArray) && galleryArray.length > 0) {
        // Chỉ sử dụng galleryArray, không thêm mainImageUrl
        const items: GalleryItem[] = galleryArray.map(url => {
          // Keep original URL - browser will load it
          // No conversion needed as URLs are already correct
          return { type: 'image', url };
        });

        // Chèn video vào vị trí thứ 2 (index 1) sau ảnh đầu tiên
        if (videoInfo?.videoUrl) {
          const videoItem = {
            type: 'video' as const,
            url: '',
            videoUrl: getYouTubeEmbedUrl(videoInfo.videoUrl),
            thumbnail: videoInfo.thumbnail || getYouTubeThumbnailUrl(videoInfo.videoUrl)
          };
          if (items.length > 1) {
            items.splice(1, 0, videoItem); // Chèn vào vị trí 1
          } else {
            items.push(videoItem); // Nếu chỉ có 1 ảnh thì push vào cuối
          }
        }
        setGalleryItems(items);
        setIsLoadingGallery(false);
        return;
      }

      if (!galleryUrl) {
        // If no gallery URL, only show video if available
        const items: GalleryItem[] = [];

        // Chỉ thêm video nếu có, không sử dụng mainImageUrl
        if (videoInfo?.videoUrl) {
          const videoItem = {
            type: 'video' as const,
            url: '',
            videoUrl: getYouTubeEmbedUrl(videoInfo.videoUrl),
            thumbnail: videoInfo.thumbnail || getYouTubeThumbnailUrl(videoInfo.videoUrl)
          };
          items.push(videoItem);
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

          // Add gallery images first, không sử dụng mainImageUrl
          const imageUrls = data.images.map((img: any) => img.url);
          imageUrls.forEach((url: string) => {
            items.push({ type: 'image', url });
          });

          // Add video at position 2 (after first image) if exists
          if (videoInfo?.videoUrl) {
            const videoItem = {
              type: 'video' as const,
              url: '',
              videoUrl: getYouTubeEmbedUrl(videoInfo.videoUrl),
              thumbnail: videoInfo.thumbnail || getYouTubeThumbnailUrl(videoInfo.videoUrl)
            };
            if (items.length > 1) {
              items.splice(1, 0, videoItem); // Chèn vào vị trí 1
            } else {
              items.push(videoItem); // Nếu chỉ có 1 ảnh thì push vào cuối
            }
          }

          setGalleryItems(items);
        } else {
          // Fallback - chỉ hiển thị video nếu có
          const items: GalleryItem[] = [];
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
        // Fallback - chỉ hiển thị video nếu có, không sử dụng mainImageUrl
        const items: GalleryItem[] = [];
        if (videoInfo?.videoUrl) {
          const videoItem = {
            type: 'video' as const,
            url: '',
            videoUrl: getYouTubeEmbedUrl(videoInfo.videoUrl),
            thumbnail: videoInfo.thumbnail || getYouTubeThumbnailUrl(videoInfo.videoUrl)
          };
          items.push(videoItem);
        }
        setGalleryItems(items);
      } finally {
        setIsLoadingGallery(false);
      }
    };

    fetchGalleryImages();
  }, [galleryUrl, mainImageUrl, videoInfo, galleryArray, optimizedGallery]);

  // Helper function to insert video at position 1
  const insertVideoAtPosition = (items: GalleryItem[], videoItem: GalleryItem): GalleryItem[] => {
    if (videoInfo?.videoUrl) {
      if (items.length > 1) {
        items.splice(1, 0, videoItem);
      } else {
        items.push(videoItem);
      }
    }
    return items;
  };

  // Autoplay & fade effect for modal
  useEffect(() => {
    if (!isModalOpen || galleryItems.length <= 1 || !isPlaying) return;
    setFade(true);
    setProgress(0);

    const currentItem = galleryItems[modalIndex];
    const isCurrentVideo = currentItem?.type === 'video';

    // Nếu là video, chờ video chạy hết mới chuyển
    if (isCurrentVideo) {
      // Reset video states
      setVideoDuration(null);
      setVideoCurrentTime(0);

      // Không tự động chuyển cho video, sẽ được handle bởi video events
      return;
    }

    // Chỉ áp dụng autoplay cho images (5 giây)
    const imageDisplayTime = 5000;

    // Progress animation cho images
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 0;
        return prev + (100 / (imageDisplayTime / 100)); // Chia đều trong thời gian hiển thị
      });
    }, 100);

    // Main autoplay interval cho images
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setModalIndex((prev) => (prev < galleryItems.length - 1 ? prev + 1 : 0));
        setFade(true);
        setProgress(0);
      }, 300);
    }, imageDisplayTime);

    return () => {
      clearInterval(interval);
      clearInterval(progressInterval);
    };
  }, [isModalOpen, galleryItems.length, isPlaying, modalIndex]);

  // Handle YouTube video events for auto-advance
  useEffect(() => {
    if (!isModalOpen || !isPlaying) return;

    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== 'https://www.youtube.com') return;

      try {
        const data = JSON.parse(event.data);
        console.log('Modal YouTube Event:', data); // Debug log

        if (data.event === 'video-progress') {
          if (data.info) {
            setVideoCurrentTime(data.info.currentTime);
            setVideoDuration(data.info.duration);

            // Calculate progress for video
            if (data.info.duration > 0) {
              const videoProgress = (data.info.currentTime / data.info.duration) * 100;
              setProgress(videoProgress);
            }
          }
        } else if (data.event === 'onStateChange') {
          console.log('Modal State Change:', data.info); // Debug log
          // YouTube player states: -1 (unstarted), 0 (ended), 1 (playing), 2 (paused), 3 (buffering), 5 (cued)
          if (data.info === 0) { // Video ended
            console.log('Modal Video Ended - Advancing to next item'); // Debug log
            // Auto advance to next item
            setTimeout(() => {
              setFade(false);
              setTimeout(() => {
                setModalIndex((prev) => {
                  const nextIndex = prev < galleryItems.length - 1 ? prev + 1 : 0;
                  console.log('Modal Advancing from', prev, 'to', nextIndex); // Debug log
                  return nextIndex;
                });
                setFade(true);
                setProgress(0);
              }, 300);
            }, 500); // Small delay before advancing
          }
        }
      } catch (e) {
        console.error('Error parsing YouTube message for modal:', e); // Debug log
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [isModalOpen, isPlaying, galleryItems.length]);

  // Auto-advance for main gallery
  useEffect(() => {
    if (galleryItems.length <= 1 || !isGalleryPlaying || isModalOpen) return;

    setGalleryProgress(0);

    const currentItem = galleryItems[selectedIndex];
    const isCurrentVideo = currentItem?.type === 'video';

    // Nếu là video, chờ video chạy hết mới chuyển
    if (isCurrentVideo) {
      // Không tự động chuyển cho video, sẽ được handle bởi video events
      return;
    }

    // Chỉ áp dụng autoplay cho images (5 giây)
    const imageDisplayTime = 5000;

    // Progress animation for main gallery images
    const progressInterval = setInterval(() => {
      setGalleryProgress(prev => {
        if (prev >= 100) return 0;
        return prev + (100 / (imageDisplayTime / 100)); // Chia đều trong thời gian hiển thị
      });
    }, 100);

    // Main gallery autoplay interval cho images
    const interval = setInterval(() => {
      setSelectedIndex((prev) => (prev < galleryItems.length - 1 ? prev + 1 : 0));
      setGalleryProgress(0);
    }, imageDisplayTime);

    return () => {
      clearInterval(interval);
      clearInterval(progressInterval);
    };
  }, [selectedIndex, galleryItems.length, isGalleryPlaying, isModalOpen]);

  // Handle YouTube video events for main gallery auto-advance
  useEffect(() => {
    if (!isGalleryPlaying || isModalOpen) return;

    const handleMainGalleryMessage = (event: MessageEvent) => {
      if (event.origin !== 'https://www.youtube.com') return;

      try {
        const data = JSON.parse(event.data);
        console.log('Main Gallery YouTube Event:', data); // Debug log

        if (data.event === 'video-progress') {
          // Calculate progress for main gallery video
          if (data.info && data.info.duration > 0) {
            const videoProgress = (data.info.currentTime / data.info.duration) * 100;
            setGalleryProgress(videoProgress);
          }
        } else if (data.event === 'onStateChange') {
          console.log('Main Gallery State Change:', data.info); // Debug log
          // YouTube player states: -1 (unstarted), 0 (ended), 1 (playing), 2 (paused), 3 (buffering), 5 (cued)
          if (data.info === 0) { // Video ended
            console.log('Main Gallery Video Ended - Advancing to next item'); // Debug log
            // Auto advance to next item in main gallery
            setTimeout(() => {
              setSelectedIndex((prev) => {
                const nextIndex = prev < galleryItems.length - 1 ? prev + 1 : 0;
                console.log('Main Gallery Advancing from', prev, 'to', nextIndex); // Debug log
                return nextIndex;
              });
              setGalleryProgress(0);
            }, 500); // Small delay before advancing
          }
        }
      } catch (e) {
        console.error('Error parsing YouTube message for main gallery:', e); // Debug log
      }
    };

    window.addEventListener('message', handleMainGalleryMessage);
    return () => window.removeEventListener('message', handleMainGalleryMessage);
  }, [isGalleryPlaying, galleryItems.length, isModalOpen]);

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
        className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden relative touch-pan-y select-none"
        style={{ aspectRatio: '16/9', touchAction: 'pan-y' }}
        onMouseEnter={() => galleryItems[selectedIndex]?.type === 'image' && setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
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
            key={`main-video-${selectedIndex}-${isModalOpen ? 'paused' : 'playing'}`}
            src={`${galleryItems[selectedIndex].videoUrl}?autoplay=${isModalOpen ? 0 : 1}&mute=1&enablejsapi=1&rel=0&modestbranding=1&origin=${window.location.origin}&controls=1`}
            title={galleryItems[selectedIndex].title || 'Product video'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className={`w-full h-full absolute inset-0 bg-black ${isModalOpen ? 'opacity-50' : ''}`}
            onLoad={() => {
              console.log('Main gallery video iframe loaded'); // Debug log
              // Fallback: Set a timeout as backup if YouTube API doesn't work
              const videoElement = document.querySelector(`iframe[src*="${galleryItems[selectedIndex].videoUrl}"]`) as HTMLIFrameElement;
              if (videoElement && isGalleryPlaying) {
                // Estimate video duration and set fallback timeout (most YouTube videos are 1-5 minutes)
                const fallbackTimeout = setTimeout(() => {
                  console.log('Fallback timeout triggered for main gallery video'); // Debug log
                  if (isGalleryPlaying) {
                    setSelectedIndex((prev) => (prev < galleryItems.length - 1 ? prev + 1 : 0));
                    setGalleryProgress(0);
                  }
                }, 180000); // 3 minutes fallback

                // Store timeout to clear it if needed
                (videoElement as any).fallbackTimeout = fallbackTimeout;
              }
            }}
          />
        ) : (
          <div className="relative w-full h-full">
            <img
              src={galleryItems[selectedIndex]?.url}
              alt={`${productName} - ${selectedIndex + 1}`}
              className={`w-full h-full object-contain transition-transform duration-200 ${isZoomed ? 'scale-110' : ''
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

        {/* Play/Pause và Progress indicator cho main gallery */}
        {galleryItems.length > 1 && (
          <div className="absolute top-2 right-2 flex items-center gap-2">
            <button
              onClick={e => { e.stopPropagation(); if (!isModalOpen) setIsGalleryPlaying(p => !p); }}
              className={`relative w-8 h-8 hover:scale-110 transition-transform duration-200 bg-white/80 hover:bg-white rounded-full p-1 shadow ${isModalOpen ? 'opacity-50 cursor-not-allowed' : ''}`}
              aria-label={isModalOpen ? 'Modal đang mở' : (isGalleryPlaying ? 'Tạm dừng' : 'Tiếp tục')}
              tabIndex={0}
              disabled={isModalOpen}
            >
              <svg className="w-6 h-6 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-gray-300"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-red-600"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray={`${galleryProgress}, 100`}
                  strokeLinecap="round"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  style={{
                    transition: 'stroke-dasharray 0.1s ease-out'
                  }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                {isModalOpen ? (
                  <svg className="w-3 h-3 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                  </svg>
                ) : isGalleryPlaying ? (
                  <svg className="w-3 h-3 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                  </svg>
                ) : (
                  <svg className="w-3 h-3 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </div>
            </button>
          </div>
        )}

        {/* Swipe indicators for mobile */}
        {galleryItems.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 md:hidden">
            {galleryItems.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${selectedIndex === index ? 'bg-white' : 'bg-white/40'
                  }`}
              />
            ))}
          </div>
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
              className={`relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden border-2 cursor-pointer transition-all duration-200 hover:scale-105 ${selectedIndex === index ? 'border-red-500' : 'border-gray-200'
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
                  src={getThumbPath(item.url)}
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
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-300 touch-pan-y select-none"
          style={{ touchAction: 'pan-y' }}
          onClick={closeModal}
          onTouchStart={handleModalTouchStart}
          onTouchMove={handleModalTouchMove}
          onTouchEnd={handleModalTouchEnd}
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
                        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                      </svg>
                    ) : (
                      <svg className="w-3 h-3 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
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
                      <path d="M8 5v14l11-7z" />
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

          {/* Container ảnh/video với shadow đẹp hơn */}
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            {galleryItems[modalIndex]?.type === 'video' ? (
              <div
                className="w-[90vw] max-w-[1200px] bg-black rounded-2xl overflow-hidden"
                style={{ aspectRatio: '16/9' }}
              >
                <iframe
                  key={`modal-video-${modalIndex}`}
                  src={`${galleryItems[modalIndex].videoUrl}?autoplay=1&mute=1&enablejsapi=1&rel=0&modestbranding=1&origin=${window.location.origin}&controls=1`}
                  title={galleryItems[modalIndex].title || 'Product video'}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className={`w-full h-full bg-black transition-all duration-500 ${fade ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                  onClick={e => e.stopPropagation()}
                />
              </div>
            ) : (
              <img
                src={galleryItems[modalIndex]?.url}
                alt=""
                className={`max-h-[80vh] max-w-[90vw] object-contain transition-all duration-500 ${fade ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                onClick={e => e.stopPropagation()}
                tabIndex={0}
              />
            )}
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
                  className={`relative w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all duration-200 hover:scale-110 ${modalIndex === index ? 'border-white shadow-lg shadow-white/30' : 'border-white/30 hover:border-white/60'
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
                      src={getThumbPath(item.url)}
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
'use client';

import { useState, useEffect } from 'react';
import ModalBuyNowForm from '../react/ModalBuyNowForm';
import { COMPANY_INFO } from '../../constants';
import { getThumbPath } from '../../utils/imageUtils';

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
  gallery_array?: string[];
  thong_so_ky_thuat?: any;
  sold_count?: number;
}

interface VideoDrawerProps {
  open: boolean;
  onClose: () => void;
  product: Product;
  brandName?: string;
}

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

export function VideoDrawer({ open, onClose, product, brandName }: VideoDrawerProps) {
  const [showBuyNowModal, setShowBuyNowModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [showReviews, setShowReviews] = useState(false);
  const [showSpecs, setShowSpecs] = useState(false);

  // Build gallery items
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

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Đã sao chép link vào clipboard!');
    }
  };

  // Format currency
  const formatCurrency = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  // Calculate discount percentage
  const discountPercentage = product.original_price 
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  const handleBuyNow = () => {
    setShowBuyNowModal(true);
  };

  const handleContactSeller = () => {
    window.open(COMPANY_INFO.zalo, '_blank');
  };

  // Gallery navigation functions
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % galleryItems.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + galleryItems.length) % galleryItems.length);
  };

  const goToSlide = (index: number) => {
    setCurrentImageIndex(index);
  };

  // Sample reviews data
  const sampleReviews = [
    {
      id: '1',
      user: { name: 'Nguyễn Văn An' },
      rating: 5,
      content: 'Ghế rất tốt, ngồi thoải mái cả ngày không bị đau lưng. Chất lượng xứng đáng với giá tiền. Giao hàng nhanh, đóng gói cẩn thận.',
      date: '2 ngày trước',
      likes: 12,
      avatar: 'N'
    },
    {
      id: '2',
      user: { name: 'Trần Thị Bình' },
      rating: 5,
      content: 'Sản phẩm đúng như mô tả, giao hàng nhanh. Shop tư vấn nhiệt tình. Ghế thiết kế đẹp, phù hợp với văn phòng.',
      date: '1 tuần trước',
      likes: 8,
      avatar: 'T'
    },
    {
      id: '3',
      user: { name: 'Lê Minh Cường' },
      rating: 4,
      content: 'Ghế ổn, hỗ trợ lưng tốt. Lắp ráp dễ dàng theo hướng dẫn. Giá hợp lý so với chất lượng.',
      date: '2 tuần trước',
      likes: 15,
      avatar: 'L'
    }
  ];

  // Rating summary
  const ratingSummary = {
    average: 4.8,
    total: 127,
    stars: [
      { star: 5, count: 98 },
      { star: 4, count: 24 },
      { star: 3, count: 3 },
      { star: 2, count: 1 },
      { star: 1, count: 1 }
    ]
  };

  // Helper functions for reviews
  const getRandomColor = (name: string) => {
    const colors = [
      'bg-red-500',
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
    ];
    const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[index % colors.length];
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  if (!open) return null;

  const currentItem = galleryItems[currentImageIndex];

  return (
    <>
    <div className="fixed inset-0 z-[100]">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[90vh] overflow-y-auto w-full">
        {/* Header */}
          <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10">
            <h3 className="font-semibold text-lg truncate flex-1 mr-2">Chi tiết sản phẩm</h3>
            <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Chia sẻ"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
            </button>
            <button
              onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Đóng"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

          {/* Product Gallery */}
          <div className="relative">
            {galleryItems.length > 0 ? (
              <>
                {/* Main Image/Video Display */}
                <div className="relative w-full aspect-square overflow-hidden bg-gray-50">
                  {currentItem?.type === 'video' ? (
                    <iframe
                      src={`${currentItem.embed}?autoplay=0&mute=1&enablejsapi=1`}
                      title={currentItem.title}
                      allow="autoplay"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full object-contain"
                    />
                  ) : (
              <img 
                      src={currentItem?.src || product.image_url}
                      alt={currentItem?.alt || product.name}
                      className="absolute inset-0 w-full h-full object-contain"
                      loading={currentImageIndex === 0 ? 'eager' : 'lazy'}
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
                      {currentImageIndex + 1}/{galleryItems.length}
            </div>
          )}

                  {/* Video Play Icon Overlay */}
                  {currentItem?.type === 'video' && (
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
                          currentImageIndex === index 
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
              </>
            ) : (
              <div className="w-full aspect-square flex items-center justify-center bg-gray-50">
                <div className="text-center text-gray-500">
                  <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm">Không có hình ảnh</p>
                </div>
              </div>
            )}
          </div>

          {/* Product Content */}
          <div className="p-4">
            {/* Product Name */}
            <h1 className="text-lg font-bold text-gray-900 mb-3 leading-tight">
              {product.name}
            </h1>

            {/* Promotional Info */}
            <div className="mb-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-green-600">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span>Miễn phí giao hàng toàn quốc</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-blue-600">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span>Bảo hành chính hãng 2 năm</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-orange-600">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
                <span>Giao hàng nhanh trong 24h</span>
              </div>
            </div>

            {/* Product Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">Công thái học</span>
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Văn phòng</span>
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Sức khỏe</span>
            </div>

            {/* Price Section */}
            <div className="mb-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl font-bold text-red-600">
                  {formatCurrency(product.price)}
                </span>
                {product.original_price && product.original_price > product.price && (
                  <>
                    <span className="text-lg text-gray-400 line-through">
                      {formatCurrency(product.original_price)}
                    </span>
                    <span className="bg-red-500 text-white text-sm px-2 py-1 rounded">
                      -{discountPercentage}%
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Rating and Sold Count */}
            <div className="flex items-center gap-4 mb-6 text-sm">
              <div className="flex items-center gap-1">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg 
                      key={i} 
                      className={`w-4 h-4 ${i < (product.rating || 5) ? 'text-yellow-400' : 'text-gray-300'}`} 
                      fill="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-gray-600">({product.rating || 5})</span>
              </div>
              <div className="h-4 w-px bg-gray-300"></div>
              <span className="text-sm text-gray-600">
                Đã bán {product.sold_count || 0}
              </span>
            </div>

            {/* Technical Specifications */}
            <div className="mb-6">
              <div className="border-t pt-4">
              <button
                  onClick={() => setShowSpecs(!showSpecs)}
                  className="flex items-center justify-between w-full p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="font-medium">Thông số kỹ thuật</span>
                  </div>
                  <svg 
                    className={`w-5 h-5 transition-transform ${showSpecs ? 'rotate-180' : ''}`} 
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
              </button>
                
                {showSpecs && (
                  <div className="mt-3 space-y-2">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-600">Chất liệu khung</span>
                      <span className="text-sm font-medium">Thép phủ sơn tĩnh điện</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-600">Chất liệu lưng</span>
                      <span className="text-sm font-medium">Lưới cao cấp</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-600">Kích thước</span>
                      <span className="text-sm font-medium">66 x 66 x 110-120cm</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-600">Trọng lượng tối đa</span>
                      <span className="text-sm font-medium">120kg</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-sm text-gray-600">Bảo hành</span>
                      <span className="text-sm font-medium text-green-600">2 năm chính hãng</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Reviews and Comments Section */}
            <div className="mb-6">
              <button
                onClick={() => setShowReviews(!showReviews)}
                className="flex items-center justify-between w-full p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  <span className="font-medium">Đánh giá và bình luận</span>
                  <span className="text-sm text-gray-500">({ratingSummary.total} đánh giá)</span>
                </div>
                <svg 
                  className={`w-5 h-5 transition-transform ${showReviews ? 'rotate-180' : ''}`} 
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {showReviews && (
                <div className="mt-3">
                  {/* Rating Summary */}
                  <div className="flex items-center gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex flex-col items-center min-w-[50px]">
                      <span className="text-2xl font-bold text-gray-900 leading-none">
                        {ratingSummary.average.toFixed(1)}
                      </span>
                      <div className="flex items-center mt-1">
                        {[...Array(5)].map((_, i) => (
                          <svg 
                            key={i} 
                            className={`w-3 h-3 ${i < Math.round(ratingSummary.average) ? 'text-yellow-400' : 'text-gray-300'}`} 
                            fill="currentColor" 
                            viewBox="0 0 20 20"
                          >
                            <polygon points="9.9,1.1 7.6,6.6 1.6,7.3 6.1,11.2 4.8,17.1 9.9,14.1 15,17.1 13.7,11.2 18.2,7.3 12.2,6.6" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-xs text-gray-500 mt-1">{ratingSummary.total}</span>
                    </div>
                    
                    {/* Star Distribution */}
                    <div className="flex-1 flex flex-col gap-1">
                      {ratingSummary.stars.map((starItem) => {
                        const percent = (starItem.count / ratingSummary.total) * 100;
                        return (
                          <div key={starItem.star} className="flex items-center gap-2">
                            <span className="text-xs w-2 text-gray-700">{starItem.star}</span>
                            <div className="relative flex-1 h-1.5 overflow-hidden rounded bg-gray-200">
                              <div
                                className="h-full bg-yellow-400 rounded transition-all duration-1000"
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-500 w-6">{starItem.count}</span>
                          </div>
                        );
                      })}
            </div>
          </div>

                  {/* Reviews List */}
                  <div className="space-y-3">
                    {sampleReviews.map((review) => (
                      <div key={review.id} className="p-3 bg-white border rounded-lg">
                        <div className="flex items-start gap-3">
                          <div 
                            className={`w-8 h-8 rounded-full ${getRandomColor(review.user.name)} flex items-center justify-center text-white font-medium text-sm flex-shrink-0`}
                          >
                            {getInitials(review.user.name)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium text-sm text-gray-900">{review.user.name}</span>
                              <span className="text-xs text-gray-500">{review.date}</span>
                            </div>
                            <div className="flex items-center mb-2">
                              {[...Array(5)].map((_, i) => (
                                <svg 
                                  key={i} 
                                  className={`w-3 h-3 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                                  fill="currentColor" 
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                </svg>
                              ))}
                            </div>
                            <p className="text-sm text-gray-600 mb-2 leading-relaxed">
                              {review.content}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <button className="flex items-center gap-1 hover:text-gray-700">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                                </svg>
                                <span>Hữu ích ({review.likes})</span>
            </button>
          </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
              </div>
              )}
              </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleContactSeller}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.893 3.749z"/>
                </svg>
                Chat Zalo
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Mua ngay
              </button>
            </div>
          </div>
        </div>
      </div>

             {/* Buy Now Modal */}
       {showBuyNowModal && (
         <ModalBuyNowForm
           open={showBuyNowModal}
           onClose={() => setShowBuyNowModal(false)}
           product={product}
         />
       )}
    </>
  );
} 
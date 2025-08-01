import React, { useState, useEffect } from 'react';
import ReviewsSkeleton from '../skeletons/ReviewsSkeleton';

interface MobileEnhancedReviewsProps {
  disableLoading?: boolean;
}

const MobileEnhancedReviews: React.FC<MobileEnhancedReviewsProps> = ({ disableLoading = true }) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'photo' | 'video' | '5star'>('all');
  const [isLoading, setIsLoading] = useState(!disableLoading);

  // Quick loading simulation (only if loading not disabled)
  useEffect(() => {
    if (!disableLoading) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [disableLoading]);

  if (isLoading && !disableLoading) {
    return <ReviewsSkeleton />;
  }

  const reviewsData = [
    {
      id: '1',
      user: { name: 'Tám Phạm', avatar: '👨‍💼' },
      rating: 5,
      content: 'Ghế công thái học này thực sự rất thoải mái, ngồi làm việc lâu không bị đau lưng. Chất liệu tốt, lắp ráp dễ dàng. Rất đáng tiền!',
      date: '26/4/2025',
      likes: 156,
      verified: true,
      hasPhoto: true,
      photos: ['/images/review-1.jpg', '/images/review-2.jpg'],
      publisherReply: {
        name: 'G3-TECH',
        date: '26/4/2025',
        content: 'Cảm ơn bạn đã tin tưởng và lựa chọn ghế công thái học của G3-TECH. Chúng tôi rất vui khi sản phẩm giúp bạn làm việc thoải mái hơn!'
      }
    },
    {
      id: '2',
      user: { name: 'Anh Trương', avatar: '👨‍🔧' },
      rating: 4,
      content: 'Ghế ngồi êm, tựa lưng tốt nhưng phần kê tay hơi thấp so với mình. Mong shop có thêm phụ kiện nâng kê tay.',
      date: '11/5/2025',
      likes: 23,
      verified: true,
      hasVideo: true,
      videoThumbnail: '/images/video-thumb-1.jpg'
    },
    {
      id: '3',
      user: { name: 'Minh Hằng', avatar: '👩‍💻' },
      rating: 5,
      content: 'Mình rất thích thiết kế của ghế, hiện đại và chắc chắn. Giao hàng nhanh, đóng gói cẩn thận. Sẽ giới thiệu cho bạn bè!',
      date: '2/6/2025',
      likes: 41,
      verified: true,
      hasPhoto: true,
      photos: ['/images/review-3.jpg']
    },
    {
      id: '4',
      user: { name: 'Dr. Nguyễn Văn A', avatar: '👨‍⚕️' },
      rating: 5,
      content: 'Là bác sĩ chuyên khoa cột sống, tôi khuyên dùng ghế này cho bệnh nhân. Thiết kế ergonomic rất tốt, giúp giảm áp lực lên đốt sống thắt lưng.',
      date: '15/5/2025',
      likes: 89,
      verified: true,
      isExpert: true
    }
  ];

  const ratingSummary = {
    average: 4.8,
    total: 2847,
    stars: [
      { star: 5, count: 2200, percent: 77 },
      { star: 4, count: 450, percent: 16 },
      { star: 3, count: 142, percent: 5 },
      { star: 2, count: 35, percent: 1 },
      { star: 1, count: 20, percent: 1 },
    ]
  };

  const filterOptions = [
    { key: 'all', label: 'Tất cả', count: reviewsData.length },
    { key: 'photo', label: 'Có hình ảnh', count: reviewsData.filter(r => r.hasPhoto).length },
    { key: 'video', label: 'Có video', count: reviewsData.filter(r => r.hasVideo).length },
    { key: '5star', label: '5 sao', count: reviewsData.filter(r => r.rating === 5).length }
  ];

  const filteredReviews = reviewsData.filter(review => {
    switch (activeFilter) {
      case 'photo': return review.hasPhoto;
      case 'video': return review.hasVideo;
      case '5star': return review.rating === 5;
      default: return true;
    }
  });

  return (
    <div className="bg-white mb-2">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Đánh giá từ khách hàng
          </h3>
          <div className="flex items-center text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            <svg className="w-4 h-4 mr-1 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            {ratingSummary.average} ({ratingSummary.total.toLocaleString()} đánh giá)
          </div>
        </div>

        {/* Rating Summary */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 mb-4 border border-yellow-200">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-1">{ratingSummary.average}</div>
              <div className="flex items-center justify-center mb-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                ))}
              </div>
              <div className="text-xs text-gray-600">{ratingSummary.total} đánh giá</div>
            </div>
            <div className="flex-1 space-y-1">
              {ratingSummary.stars.map((starItem) => (
                <div key={starItem.star} className="flex items-center gap-2">
                  <span className="text-xs text-gray-600 w-4">{starItem.star}</span>
                  <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400 rounded-full transition-all duration-500"
                      style={{ width: `${starItem.percent}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-600 w-8">{starItem.percent}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {filterOptions.map((option) => (
            <button
              key={option.key}
              onClick={() => setActiveFilter(option.key as any)}
              className={`flex-shrink-0 px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                activeFilter === option.key
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {option.label} ({option.count})
            </button>
          ))}
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <div key={review.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="flex items-start gap-3">
                {/* Avatar */}
                <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white text-lg">
                  {review.user.avatar}
                </div>
                
                {/* Review Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900">{review.user.name}</span>
                    {review.verified && (
                      <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">✓ Đã mua</span>
                    )}
                    {review.isExpert && (
                      <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">👨‍⚕️ Chuyên gia</span>
                    )}
                  </div>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    ))}
                    <span className="text-sm text-gray-500 ml-1">{review.date}</span>
                  </div>
                  
                  {/* Comment */}
                  <p className="text-sm text-gray-700 leading-relaxed mb-3">{review.content}</p>
                  
                  {/* Photos */}
                  {review.hasPhoto && review.photos && (
                    <div className="flex gap-2 mb-3">
                      {review.photos.map((photo, idx) => (
                        <div key={idx} className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                          <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-gray-600 text-xs">
                            📷
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Video */}
                  {review.hasVideo && (
                    <div className="mb-3">
                      <div className="w-32 h-20 bg-gray-200 rounded-lg overflow-hidden relative">
                        <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-gray-600">
                          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-8 h-8 bg-white/80 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z"/>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Likes */}
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                    <span>{review.likes} người thấy bài đánh giá này hữu ích</span>
                    <button className="text-red-600 hover:text-red-700 font-medium">Hữu ích</button>
                  </div>
                  
                  {/* Publisher Reply */}
                  {review.publisherReply && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-xs text-blue-700">{review.publisherReply.name}</span>
                        <span className="text-xs text-blue-400">{review.publisherReply.date}</span>
                      </div>
                      <div className="text-blue-700 text-sm">{review.publisherReply.content}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View More Reviews Button */}
        <button className="w-full mt-4 py-3 text-red-600 text-sm font-medium flex items-center justify-center gap-2 hover:bg-red-50 rounded-lg transition-colors border border-red-200">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          Xem tất cả {ratingSummary.total} đánh giá
        </button>
      </div>
    </div>
  );
};

export default MobileEnhancedReviews;
import React, { useState, useMemo } from 'react';
import { allReviews, overallRatingSummary, type Review } from '../../data/reviews';

const MobileReviewsPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'photo' | 'video' | '5star' | '4star' | 'expert'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest' | 'lowest' | 'helpful'>('newest');

  const filteredAndSortedReviews = useMemo(() => {
    let filtered = allReviews;

    // Apply filters
    switch (activeFilter) {
      case 'photo':
        filtered = filtered.filter(review => review.hasPhoto);
        break;
      case 'video':
        filtered = filtered.filter(review => review.hasVideo);
        break;
      case '5star':
        filtered = filtered.filter(review => review.rating === 5);
        break;
      case '4star':
        filtered = filtered.filter(review => review.rating === 4);
        break;
      case 'expert':
        filtered = filtered.filter(review => review.isExpert);
        break;
      default:
        break;
    }

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(review =>
        review.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.productName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'oldest':
        filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
      case 'highest':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'lowest':
        filtered.sort((a, b) => a.rating - b.rating);
        break;
      case 'helpful':
        filtered.sort((a, b) => b.likes - a.likes);
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
    }

    return filtered;
  }, [activeFilter, searchTerm, sortBy]);

  const filterOptions = [
    { key: 'all', label: 'Tất cả', count: allReviews.length },
    { key: '5star', label: '5 sao', count: allReviews.filter(r => r.rating === 5).length },
    { key: '4star', label: '4 sao', count: allReviews.filter(r => r.rating === 4).length },
    { key: 'photo', label: 'Có hình ảnh', count: allReviews.filter(r => r.hasPhoto).length },
    { key: 'video', label: 'Có video', count: allReviews.filter(r => r.hasVideo).length },
    { key: 'expert', label: 'Chuyên gia', count: allReviews.filter(r => r.isExpert).length }
  ];

  const sortOptions = [
    { key: 'newest', label: 'Mới nhất' },
    { key: 'oldest', label: 'Cũ nhất' },
    { key: 'highest', label: 'Điểm cao nhất' },
    { key: 'lowest', label: 'Điểm thấp nhất' },
    { key: 'helpful', label: 'Hữu ích nhất' }
  ];

  return (
    <div className="reviews-page">
      {/* Header */}
      <div className="reviews-header">
        <div className="px-4 py-3">
          <h1 className="reviews-title">Đánh giá khách hàng</h1>
          <p className="reviews-subtitle">
            Xem đánh giá thật từ {overallRatingSummary.total} khách hàng đã mua sản phẩm
          </p>
        </div>
      </div>

      {/* Overall Rating Summary */}
      <div className="rating-summary-card">
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 mb-1">{overallRatingSummary.average}</div>
            <div className="flex items-center justify-center mb-1">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              ))}
            </div>
            <div className="text-xs text-gray-600">{overallRatingSummary.total} đánh giá</div>
          </div>
          <div className="flex-1 space-y-1">
            {overallRatingSummary.stars.map((starItem) => (
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

      {/* Search */}
      <div className="px-4 mt-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm đánh giá..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
          />
          <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-4 mt-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {filterOptions.map((option) => (
            <button
              key={option.key}
              onClick={() => setActiveFilter(option.key as any)}
              className={`flex-shrink-0 px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                activeFilter === option.key
                  ? 'bg-red-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {option.label} ({option.count})
            </button>
          ))}
        </div>
      </div>

      {/* Sort Options */}
      <div className="px-4 mt-3">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Sắp xếp:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-sm border border-gray-300 rounded-md px-2 py-1 bg-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            {sortOptions.map((option) => (
              <option key={option.key} value={option.key}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="px-4 mt-3 mb-4">
        <p className="text-sm text-gray-600">
          Hiển thị {filteredAndSortedReviews.length} đánh giá
          {filteredAndSortedReviews.length !== allReviews.length && ` (từ tổng ${allReviews.length} đánh giá)`}
        </p>
      </div>

      {/* Reviews List */}
      <div className="px-4 space-y-4 pb-20">
        {filteredAndSortedReviews.length > 0 ? (
          filteredAndSortedReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Không tìm thấy đánh giá nào
            </h3>
            <p className="text-gray-500">
              Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

interface ReviewCardProps {
  review: Review;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
      {/* Product Info */}
      <div className="flex items-center gap-3 mb-3 pb-3 border-b border-gray-100">
        <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
          <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-gray-600 text-xs">
            📦
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 text-sm truncate">{review.productName}</h3>
          <p className="text-xs text-gray-500">Sản phẩm đã mua</p>
        </div>
      </div>

      {/* Review Content */}
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white text-lg flex-shrink-0">
          {review.user.avatar}
        </div>
        
        {/* Review Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-gray-900 text-sm">{review.user.name}</span>
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
  );
};

export default MobileReviewsPage;
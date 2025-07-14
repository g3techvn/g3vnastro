import React, { useState, useEffect } from 'react';

interface Promotion {
  id: number;
  created_at: string;
  title: string;
  description: string;
  image: string;
  youtube_url?: string;
  slug: string;
  start_date?: string;
  end_date?: string;
  discount_type?: string;
  discount_value?: number;
  updated_at?: string;
}

function getTimeAgo(dateString: string) {
  const now = new Date();
  const created = new Date(dateString);
  const diffMs = now.getTime() - created.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  if (diffMins < 60) return `${diffMins} phút trước`;
  if (diffHours < 24) return `${diffHours} giờ trước`;
  return `${diffDays} ngày trước`;
}

interface MobileFeedProps {
  promotions?: Promotion[];
  isLoading?: boolean;
  error?: string | null;
  expandedDescriptions?: Record<number, boolean>;
  toggleDescription?: (id: number) => void;
}

export default function MobileFeed({
  promotions = [],
  isLoading = false,
  error = null,
  expandedDescriptions = {},
  toggleDescription = () => {},
}: MobileFeedProps) {
  const [localPromotions, setLocalPromotions] = useState<Promotion[]>(promotions);
  const [localIsLoading, setLocalIsLoading] = useState(isLoading);
  const [localError, setLocalError] = useState<string | null>(error);
  const [localExpandedDescriptions, setLocalExpandedDescriptions] = useState<Record<number, boolean>>(expandedDescriptions);
  const [hasInitialized, setHasInitialized] = useState(false);

  const handleToggleDescription = (id: number) => {
    // Always use local state for expansion in feed page
    setLocalExpandedDescriptions(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  useEffect(() => {
    // Load data from API if no promotions provided and haven't initialized yet
    if (promotions.length === 0 && !isLoading && !hasInitialized) {
      setHasInitialized(true); // Mark as initialized to prevent re-running
      
      const fetchPromotions = async () => {
        setLocalIsLoading(true);
        setLocalError(null);
        
        try {
          const response = await fetch('/api/promotions?page=1&limit=20');
          
          if (!response.ok) {
            throw new Error(`HTTP error ${response.status}`);
          }
          
          const data = await response.json();
          
          if (!data.promotions || !Array.isArray(data.promotions)) {
            throw new Error('Invalid response format');
          }

          // Transform data to match expected format
          const transformedPromotions: Promotion[] = data.promotions.map((promo: any) => ({
            id: promo.id,
            created_at: promo.created_at || new Date().toISOString(),
            title: promo.name, // API trả về 'name' nhưng component expect 'title'
            description: promo.description || '',
            image: promo.image_url || '',
            youtube_url: promo.video_url, // API trả về video_url (mapped từ youtube_url)
            slug: promo.slug,
            start_date: promo.start_date,
            end_date: promo.end_date,
            discount_type: promo.discount_type,
            discount_value: promo.discount_value,
            updated_at: promo.updated_at
          }));
          
          setLocalPromotions(transformedPromotions);
        } catch (error) {
          console.error('Error fetching promotions:', error);
          setLocalError(error instanceof Error ? error.message : 'Đã xảy ra lỗi khi tải promotions');
        } finally {
          setLocalIsLoading(false);
        }
      };

      fetchPromotions();
    }
  }, []); // Remove dependencies to prevent infinite loop

  const currentPromotions = promotions.length > 0 ? promotions : localPromotions;
  const currentIsLoading = promotions.length > 0 ? isLoading : localIsLoading;
  const currentError = promotions.length > 0 ? error : localError;
  const currentExpandedDescriptions = Object.keys(expandedDescriptions).length > 0 ? expandedDescriptions : localExpandedDescriptions;

  return (
    <div className="-mb-20">
      {currentIsLoading && <p className="text-center p-8">Đang tải feed...</p>}
      {currentError && <p className="text-red-500 text-center p-8">Lỗi: {currentError}</p>}
      {!currentIsLoading && !currentError && currentPromotions.length === 0 && <p className="text-center p-8">Không có bài viết nào.</p>}
      {!currentIsLoading && !currentError && currentPromotions.length > 0 && (
        <div className="flex flex-col bg-gray-200 min-h-screen w-full">
          {currentPromotions.map((promo) => (
            <div key={promo.id} className="w-full bg-white flex flex-col overflow-hidden border-b border-gray-300">
              {/* Facebook-style Header */}
              <div className="flex items-center justify-between w-full p-4 pb-2">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold border-2 border-gray-200">
                    G3
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">G3 - Công Thái Học</div>
                    <div className="text-xs text-gray-500">{getTimeAgo(promo.created_at)} · <span className="inline-block align-middle">🌐</span></div>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600 text-xl rotate-90">⋯</button>
              </div>

              {/* Description Section */}
              <div className="w-full px-4 pb-2">
                <p className="text-left text-gray-800 text-[15px] leading-snug whitespace-pre-line">
                  {currentExpandedDescriptions[promo.id] ? promo.description : `${promo.description.substring(0, 100)}${promo.description.length > 100 ? '...' : ''}`}
                  {promo.description.length > 100 && (
                    <button 
                      onClick={() => handleToggleDescription(promo.id)} 
                      className="text-blue-600 hover:underline ml-1 font-medium text-sm"
                    >
                      {currentExpandedDescriptions[promo.id] ? 'Ẩn bớt' : 'Xem thêm'}
                    </button>
                  )}
                </p>
              </div>

              {/* Image/Video Section */}
              <div className="relative w-full flex justify-center items-center min-h-[300px]">
                {promo.image && (
                  <>
                    {/* Blurred background image */}
                    <div
                      className="absolute inset-0 w-full h-full z-0"
                      style={{
                        backgroundImage: `url(${promo.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        filter: 'blur(8px)',
                      }}
                    >
                      <div className="absolute inset-0 bg-white/30"></div>
                    </div>
                    {/* Main image */}
                    <img
                      src={promo.image}
                      alt={promo.title}
                      className="relative z-10 w-full h-auto object-contain max-h-[600px]"
                      onError={(e) => {
                        // Fallback to placeholder if image fails to load
                        e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkjDrG5oIMSR4bqhaSBkaeG7h248L3RleHQ+PC9zdmc+';
                      }}
                    />
                  </>
                )}
                {promo.youtube_url && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <iframe
                      width="100%"
                      height="300"
                      src={promo.youtube_url.replace('watch?v=', 'embed/')}
                      title={promo.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="rounded"
                    ></iframe>
                  </div>
                )}
              </div>

              {/* Interaction Info */}
              <div className="w-full px-4 pt-2 pb-1 flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center space-x-2">
                  <span className="text-blue-600">👍</span>
                  <span>{Math.floor(Math.random() * 10000) + 1000}</span>
                </div>
                <div>
                  <span>{Math.floor(Math.random() * 5000) + 100} bình luận</span> · <span>{Math.floor(Math.random() * 1000) + 50} lượt chia sẻ</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="w-full border-t border-gray-100 flex justify-around py-1">
                <button className="flex items-center space-x-2 py-2 px-4 rounded hover:bg-gray-100 w-1/3 justify-center">
                  <span className="text-lg">👍</span>
                  <span className="text-sm font-medium">Thích</span>
                </button>
                <button className="flex items-center space-x-2 py-2 px-4 rounded hover:bg-gray-100 w-1/3 justify-center">
                  <span className="text-lg">💬</span>
                  <span className="text-sm font-medium">Bình luận</span>
                </button>
                <button className="flex items-center space-x-2 py-2 px-4 rounded hover:bg-gray-100 w-1/3 justify-center">
                  <span className="text-lg">↗️</span>
                  <span className="text-sm font-medium">Chia sẻ</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
import React, { useState } from 'react';

interface Comment {
  id: string;
  user: {
    name: string;
  };
  rating: number;
  content: string;
  date: string;
  likes: number;
  publisherReply?: {
    name: string;
    date: string;
    content: string;
  };
}

interface RatingSummary {
  average: number;
  total: number;
  stars: {
    star: number;
    count: number;
  }[];
}

interface ReviewsSectionProps {
  comments: Comment[];
  ratingSummary: RatingSummary;
}

export function ReviewsSection({ comments, ratingSummary }: ReviewsSectionProps) {
  const [likedComments, setLikedComments] = useState<Record<string, boolean>>({});

  // Helper function to get random color from name for avatar
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

  // Helper function to get initials
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-4">Đánh giá & Nhận xét</h2>
      
      {/* Rating Summary */}
      <div className="flex items-center gap-6 mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex flex-col items-center min-w-[70px]">
          <span className="text-4xl font-bold text-gray-900 leading-none">
            {ratingSummary.average.toFixed(1)}
          </span>
          <div className="flex items-center mt-1">
            {[...Array(5)].map((_, i) => (
              <svg 
                key={i} 
                className={`w-5 h-5 ${i < Math.round(ratingSummary.average) ? 'text-yellow-400' : 'text-gray-300'}`} 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <polygon points="9.9,1.1 7.6,6.6 1.6,7.3 6.1,11.2 4.8,17.1 9.9,14.1 15,17.1 13.7,11.2 18.2,7.3 12.2,6.6" />
              </svg>
            ))}
          </div>
          <span className="text-xs text-gray-500 mt-1">{ratingSummary.total.toLocaleString()}</span>
        </div>
        
        {/* Star Distribution */}
        <div className="flex-1 flex flex-col gap-1">
          {ratingSummary.stars.map((starItem) => {
            const percent = (starItem.count / ratingSummary.total) * 100;
            return (
              <div key={starItem.star} className="flex items-center gap-2">
                <span className="text-xs w-3 text-gray-700">{starItem.star}</span>
                <div className="relative flex-1 h-2 overflow-hidden rounded bg-gray-200">
                  <div
                    className="h-full bg-blue-500 rounded transition-all duration-1000"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Comments List */}
      <div className="space-y-8">
        {comments.map((comment) => (
          <div 
            key={comment.id}
            className="rounded-lg p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center">
                <div 
                  className={`w-10 h-10 rounded-full ${getRandomColor(comment.user.name)} flex items-center justify-center text-white font-medium text-lg`}
                >
                  {getInitials(comment.user.name)}
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">{comment.user.name}</span>
                  <span className="text-xs text-gray-500">{comment.date}</span>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <svg 
                      key={i} 
                      className={`w-4 h-4 ${i < comment.rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <polygon points="9.9,1.1 7.6,6.6 1.6,7.3 6.1,11.2 4.8,17.1 9.9,14.1 15,17.1 13.7,11.2 18.2,7.3 12.2,6.6" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-800 text-sm mt-2">
                  {comment.content}
                </p>
                <div className="mt-2 text-xs text-gray-500">
                  {likedComments[comment.id] ? comment.likes + 1 : comment.likes} người thấy bài đánh giá này hữu ích
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-sm text-gray-700">Bài đánh giá này có hữu ích không?</span>
                  <button 
                    className={`px-3 py-1 border rounded-lg text-sm ${
                      likedComments[comment.id] 
                        ? 'border-blue-400 bg-blue-50 text-blue-600' 
                        : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                    } flex items-center gap-1 transition-colors`}
                    onClick={() => {
                      setLikedComments(prev => ({
                        ...prev,
                        [comment.id]: !prev[comment.id]
                      }));
                    }}
                  >
                    {likedComments[comment.id] ? (
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M7.493 18.75c-.425 0-.82-.236-.975-.632A7.48 7.48 0 016 15.375c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75 2.25 2.25 0 012.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558-.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23h-.777zM2.331 10.977a11.969 11.969 0 00-.831 4.398 12 12 0 00.52 3.507c.26.85 1.084 1.368 1.973 1.368H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 01-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227z" />
                      </svg>
                    ) : (
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                      </svg>
                    )}
                    Có
                  </button>
                  <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                    Không
                  </button>
                </div>
                
                {comment.publisherReply && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mt-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-xs text-gray-700">{comment.publisherReply.name}</span>
                      <span className="text-xs text-gray-400">{comment.publisherReply.date}</span>
                    </div>
                    <div className="text-gray-700 text-sm whitespace-pre-line">{comment.publisherReply.content}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 
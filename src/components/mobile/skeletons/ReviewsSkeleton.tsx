import React from 'react';

const ReviewsSkeleton: React.FC = () => {
  return (
    <div className="bg-white mb-2 animate-pulse">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-gray-300 rounded"></div>
            <div className="h-5 bg-gray-300 rounded w-32"></div>
          </div>
          <div className="h-6 bg-gray-300 rounded-full w-24"></div>
        </div>

        {/* Rating Summary */}
        <div className="bg-gray-100 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-300 rounded mb-2 mx-auto"></div>
              <div className="flex gap-1 mb-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="w-4 h-4 bg-gray-300 rounded"></div>
                ))}
              </div>
              <div className="h-3 bg-gray-300 rounded w-16"></div>
            </div>
            <div className="flex-1 space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-300 rounded"></div>
                  <div className="w-3 h-3 bg-gray-300 rounded"></div>
                  <div className="flex-1 h-2 bg-gray-300 rounded"></div>
                  <div className="w-8 h-3 bg-gray-300 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-8 bg-gray-300 rounded-full w-20"></div>
          ))}
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-4 bg-gray-300 rounded w-20"></div>
                    <div className="h-4 bg-gray-300 rounded-full w-16"></div>
                  </div>
                  <div className="flex gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <div key={star} className="w-4 h-4 bg-gray-300 rounded"></div>
                    ))}
                  </div>
                  <div className="space-y-2 mb-3">
                    <div className="h-4 bg-gray-300 rounded w-full"></div>
                    <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  </div>
                  <div className="h-3 bg-gray-300 rounded w-32"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View More Button */}
        <div className="h-10 bg-gray-300 rounded-lg mt-4"></div>
      </div>
    </div>
  );
};

export default ReviewsSkeleton;
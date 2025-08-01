import React from 'react';

const MobileProductSkeleton: React.FC = () => {
  return (
    <div className="bg-gray-50 min-h-screen animate-pulse">
      {/* Header Skeleton */}
      <div className="bg-white h-14 flex items-center px-4 border-b border-gray-200">
        <div className="w-6 h-6 bg-gray-300 rounded"></div>
        <div className="flex-1 mx-4">
          <div className="h-4 bg-gray-300 rounded w-32"></div>
        </div>
        <div className="w-6 h-6 bg-gray-300 rounded"></div>
      </div>

      {/* Gallery Skeleton */}
      <div className="bg-white">
        <div className="aspect-square bg-gray-300"></div>
        <div className="flex gap-2 p-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-16 h-16 bg-gray-300 rounded-lg"></div>
          ))}
        </div>
      </div>

      {/* Hero Section Skeleton */}
      <div className="bg-gradient-to-br from-gray-400 to-gray-500 p-4">
        <div className="flex gap-2 mb-4">
          <div className="h-6 bg-white/30 rounded-full w-20"></div>
          <div className="h-6 bg-white/30 rounded-full w-16"></div>
          <div className="h-6 bg-white/30 rounded-full w-24"></div>
        </div>
        <div className="h-6 bg-white/30 rounded w-3/4 mb-2"></div>
        <div className="h-8 bg-white/30 rounded w-1/2 mb-3"></div>
        <div className="space-y-2">
          <div className="h-4 bg-white/30 rounded w-full"></div>
          <div className="h-4 bg-white/30 rounded w-5/6"></div>
          <div className="h-4 bg-white/30 rounded w-4/5"></div>
        </div>
      </div>

      {/* Trust Signals Skeleton */}
      <div className="bg-white p-4">
        <div className="text-center mb-4">
          <div className="h-4 bg-gray-300 rounded w-48 mx-auto"></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-3 bg-gray-100 rounded-lg p-3">
              <div className="w-8 h-8 bg-gray-300 rounded"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-300 rounded w-20 mb-1"></div>
                <div className="h-3 bg-gray-300 rounded w-16"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Content Sections Skeleton */}
      {[1, 2, 3].map((section) => (
        <div key={section} className="bg-white mb-2 p-4">
          <div className="h-6 bg-gray-300 rounded w-1/2 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-300 rounded w-full"></div>
            <div className="h-4 bg-gray-300 rounded w-5/6"></div>
            <div className="h-4 bg-gray-300 rounded w-4/5"></div>
          </div>
        </div>
      ))}

      {/* CTA Skeleton */}
      <div className="bg-white mb-2 p-4">
        <div className="h-12 bg-gray-300 rounded-lg mb-3"></div>
        <div className="h-10 bg-gray-300 rounded-lg"></div>
      </div>

      {/* Bottom spacing */}
      <div className="h-20"></div>
    </div>
  );
};

export default MobileProductSkeleton;
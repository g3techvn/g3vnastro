import React from 'react';

interface CTASkeletonProps {
  variant?: 'primary' | 'secondary' | 'final';
}

const CTASkeleton: React.FC<CTASkeletonProps> = ({ variant = 'primary' }) => {
  const colors = {
    primary: 'from-red-200 to-red-300',
    secondary: 'from-green-200 to-green-300', 
    final: 'from-orange-200 to-red-300'
  };

  return (
    <div className="bg-white mb-2 border-2 border-gray-200 rounded-lg overflow-hidden animate-pulse">
      {/* Header */}
      <div className={`bg-gradient-to-r ${colors[variant]} p-4`}>
        <div className="h-5 bg-white/50 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-white/50 rounded w-1/2"></div>
      </div>

      <div className="p-4">
        {/* Price Display */}
        <div className="bg-gray-100 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="h-4 bg-gray-300 rounded w-20"></div>
            <div className="h-6 bg-gray-300 rounded-full w-16"></div>
          </div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-8 bg-gray-300 rounded w-32"></div>
            <div className="h-6 bg-gray-300 rounded w-24"></div>
          </div>
          <div className="h-4 bg-gray-300 rounded w-28"></div>
        </div>

        {/* Benefits */}
        <div className="space-y-2 mb-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-4 bg-gray-300 rounded w-full"></div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="space-y-3">
          <div className="h-12 bg-gray-300 rounded-lg"></div>
          {variant !== 'final' && (
            <div className="h-10 bg-gray-300 rounded-lg"></div>
          )}
        </div>

        {/* Trust Signals */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-gray-300 rounded"></div>
              <div className="h-3 bg-gray-300 rounded w-20"></div>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-gray-300 rounded"></div>
              <div className="h-3 bg-gray-300 rounded w-24"></div>
            </div>
          </div>
        </div>

        {/* Urgency Message for final variant */}
        {variant === 'final' && (
          <div className="mt-4 bg-gray-100 border border-gray-200 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-gray-300 rounded"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-1"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CTASkeleton;
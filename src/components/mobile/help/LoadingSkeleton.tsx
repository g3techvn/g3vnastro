import React from 'react';

export const ContactMethodSkeleton: React.FC = () => (
  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
      <div className="flex-1">
        <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
        <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4 mb-1"></div>
        <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
      </div>
      <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
    </div>
  </div>
);

export const FAQSkeleton: React.FC = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
    <div className="flex items-center justify-between">
      <div className="flex-1 pr-4">
        <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
        <div className="h-4 bg-gray-200 rounded animate-pulse w-4/5"></div>
      </div>
      <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
    </div>
  </div>
);

export const QuickActionSkeleton: React.FC = () => (
  <div className="bg-gray-200 p-4 rounded-xl shadow-sm animate-pulse">
    <div className="flex items-center gap-4">
      <div className="w-8 h-8 bg-gray-300 rounded"></div>
      <div className="flex-1">
        <div className="h-4 bg-gray-300 rounded mb-2"></div>
        <div className="h-3 bg-gray-300 rounded w-3/4"></div>
      </div>
      <div className="w-5 h-5 bg-gray-300 rounded"></div>
    </div>
  </div>
);

export const ResourceCardSkeleton: React.FC = () => (
  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
      <div className="flex-1">
        <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
        <div className="h-3 bg-gray-200 rounded animate-pulse w-4/5"></div>
      </div>
    </div>
  </div>
);

interface LoadingSkeletonProps {
  type: 'contact' | 'faq' | 'quickAction' | 'resource';
  count?: number;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ type, count = 3 }) => {
  const SkeletonComponent = {
    contact: ContactMethodSkeleton,
    faq: FAQSkeleton,
    quickAction: QuickActionSkeleton,
    resource: ResourceCardSkeleton
  }[type];

  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonComponent key={index} />
      ))}
    </div>
  );
};

export default LoadingSkeleton;
import React, { useState, useEffect } from 'react';
import MobileProductSkeleton from './skeletons/MobileProductSkeleton';

interface MobileProductLoaderProps {
  children: React.ReactNode;
  loadingTime?: number;
  disabled?: boolean;
}

const MobileProductLoader: React.FC<MobileProductLoaderProps> = ({ 
  children, 
  loadingTime = 1000,
  disabled = false
}) => {
  // If disabled, show content immediately
  if (disabled) {
    return <>{children}</>;
  }
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Quick progressive loading
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 20;
      });
    }, 50);

    // Complete loading quickly
    const loadingTimer = setTimeout(() => {
      setProgress(100);
      setTimeout(() => {
        setIsLoading(false);
      }, 100);
    }, loadingTime);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(loadingTimer);
    };
  }, [loadingTime]);

  if (isLoading) {
    return (
      <div className="relative">
        {/* Progress Bar */}
        <div className="fixed top-0 left-0 right-0 z-50">
          <div className="h-1 bg-gray-200">
            <div 
              className="h-full bg-gradient-to-r from-red-500 to-orange-500 transition-all duration-300 ease-out"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>
        
        {/* Skeleton */}
        <MobileProductSkeleton />
      </div>
    );
  }

  return <>{children}</>;
};

export default MobileProductLoader;
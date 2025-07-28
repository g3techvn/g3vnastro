import React from 'react';

interface MobileHeaderProps {
  title?: string;
  showBack?: boolean;
  showShare?: boolean;
  onBack?: () => void;
  onShare?: () => void;
  className?: string;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({
  title = '',
  showBack = true,
  showShare = true,
  onBack,
  onShare,
  className = ''
}) => {
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      // Default back behavior
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.location.href = '/san-pham';
      }
    }
  };



  const handleShare = () => {
    if (onShare) {
      onShare();
    } else {
      // Default share behavior
      if (navigator.share) {
        navigator.share({
          title: title || document.title,
          url: window.location.href
        }).catch(console.error);
      } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(window.location.href).then(() => {
          // Show toast notification
          const toast = document.createElement('div');
          toast.className = 'fixed top-20 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-2 rounded-lg text-sm z-50';
          toast.textContent = 'Đã sao chép link sản phẩm';
          document.body.appendChild(toast);
          setTimeout(() => {
            document.body.removeChild(toast);
          }, 2000);
        }).catch(console.error);
      }
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-40 ${className}`}>
      <div className="flex items-center justify-between h-14 px-4">
        {/* Left: Back Button */}
        <div className="flex items-center">
          {showBack && (
            <button
              onClick={handleBack}
              className="p-2 -ml-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Quay lại"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
        </div>

        {/* Center: Title */}
        <div className="flex-1 px-4">
          <h1 className="text-lg font-semibold text-gray-900 text-center truncate">
            {title || 'Chi tiết sản phẩm'}
          </h1>
        </div>

        {/* Right: Action Buttons */}
        <div className="flex items-center">
          {showShare && (
            <button
              onClick={handleShare}
              className="p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Chia sẻ"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default MobileHeader;
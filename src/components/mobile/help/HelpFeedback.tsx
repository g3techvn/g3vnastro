import React, { useState } from 'react';

const HelpFeedback: React.FC = () => {
  const [isHelpful, setIsHelpful] = useState<boolean | null>(null);
  const [showThanks, setShowThanks] = useState(false);

  const handleFeedback = (helpful: boolean) => {
    setIsHelpful(helpful);
    setShowThanks(true);
    
    // Hide thanks message after 3 seconds
    setTimeout(() => {
      setShowThanks(false);
    }, 3000);
  };

  if (showThanks) {
    return (
      <div className="px-4 mb-8">
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
          <div className="text-green-600 text-2xl mb-2">✅</div>
          <h3 className="font-semibold text-green-800">Cảm ơn phản hồi của bạn!</h3>
          <p className="text-green-600 text-sm mt-1">
            Chúng tôi sẽ tiếp tục cải thiện dịch vụ hỗ trợ
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 mb-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <h3 className="font-semibold text-gray-900 text-center mb-3">
          Trang trợ giúp này có hữu ích không?
        </h3>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => handleFeedback(true)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              isHelpful === true
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-green-100'
            }`}
          >
            <span>👍</span>
            Có hữu ích
          </button>
          <button
            onClick={() => handleFeedback(false)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              isHelpful === false
                ? 'bg-red-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-red-100'
            }`}
          >
            <span>👎</span>
            Chưa hữu ích
          </button>
        </div>
        {isHelpful === false && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-gray-600 text-sm text-center mb-2">
              Hãy cho chúng tôi biết cách cải thiện:
            </p>
            <button className="w-full bg-blue-500 text-white py-2 rounded-lg text-sm font-medium">
              Gửi góp ý
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HelpFeedback;
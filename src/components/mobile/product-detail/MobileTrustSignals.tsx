import React from 'react';

const MobileTrustSignals: React.FC = () => {
  const trustSignals = [
    {
      icon: '🛡️',
      title: 'Bảo hành 12 tháng',
      subtitle: 'Chính hãng'
    },
    {
      icon: '🚚',
      title: 'Miễn phí vận chuyển',
      subtitle: 'Toàn quốc'
    },
    {
      icon: '🔧',
      title: 'Miễn phí lắp đặt',
      subtitle: 'HN & HCM'
    },
    {
      icon: '↩️',
      title: 'Đổi trả 7 ngày',
      subtitle: 'Không lý do'
    }
  ];

  return (
    <div className="bg-white border-b border-gray-100">
      <div className="px-4 py-3">
        {/* Customer Trust Counter */}
        <div className="text-center mb-4">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            <div className="flex -space-x-1">
              {[1,2,3,4,5].map((i) => (
                <div key={i} className="w-6 h-6 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold">
                  {String.fromCharCode(65 + i - 1)}
                </div>
              ))}
            </div>
            <span className="font-medium text-gray-900">50,000+</span>
            <span>khách hàng tin tưởng</span>
          </div>
        </div>

        {/* Trust Signals Grid */}
        <div className="grid grid-cols-2 gap-3">
          {trustSignals.map((signal, index) => (
            <div 
              key={index} 
              className={`flex items-center gap-3 bg-gray-50 rounded-lg p-3 hover-lift fade-in-on-scroll animate-stagger-${index + 1} transition-all duration-300 hover:bg-gray-100`}
            >
              <div className="text-2xl animate-bounce-in animate-stagger-${index + 1}">{signal.icon}</div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-gray-900">{signal.title}</div>
                <div className="text-xs text-gray-600">{signal.subtitle}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Security Badges */}
        <div className="mt-4 flex items-center justify-center gap-4 py-2">
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
            </svg>
            <span>Thanh toán an toàn</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <span>Chứng nhận chất lượng</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileTrustSignals;
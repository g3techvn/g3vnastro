import React, { useState, useEffect } from 'react';

const MobileSocialProof: React.FC = () => {
  const [currentViewers, setCurrentViewers] = useState(23);
  const [recentPurchase, setRecentPurchase] = useState({
    name: 'Nguyễn V.A',
    timeAgo: 5,
    location: 'Hà Nội'
  });

  // Simulate real-time data updates
  useEffect(() => {
    const viewerInterval = setInterval(() => {
      setCurrentViewers(prev => {
        const change = Math.floor(Math.random() * 6) - 3; // -3 to +3
        const newValue = prev + change;
        return Math.max(15, Math.min(45, newValue)); // Keep between 15-45
      });
    }, 8000);

    const purchaseInterval = setInterval(() => {
      const names = ['Nguyễn V.A', 'Trần T.B', 'Lê H.C', 'Phạm M.D', 'Hoàng N.E'];
      const locations = ['Hà Nội', 'TP.HCM', 'Đà Nẵng', 'Cần Thơ', 'Hải Phòng'];
      
      setRecentPurchase({
        name: names[Math.floor(Math.random() * names.length)],
        timeAgo: Math.floor(Math.random() * 30) + 1,
        location: locations[Math.floor(Math.random() * locations.length)]
      });
    }, 12000);

    return () => {
      clearInterval(viewerInterval);
      clearInterval(purchaseInterval);
    };
  }, []);

  return (
    <div className="bg-white border-b border-gray-100">
      <div className="px-4 py-3 space-y-3">
        {/* Current Viewers */}
        <div className="flex items-center gap-2 text-sm">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
          <span className="text-gray-700">
            <span className="font-semibold text-red-600">{currentViewers}</span> người đang xem sản phẩm này
          </span>
        </div>

        {/* Recent Purchase */}
        <div className="flex items-center gap-2 text-sm bg-green-50 border border-green-200 rounded-lg p-2">
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
            {recentPurchase.name.charAt(0)}
          </div>
          <div className="flex-1">
            <span className="text-gray-700">
              <span className="font-semibold">{recentPurchase.name}</span> ({recentPurchase.location}) vừa mua sản phẩm này 
              <span className="font-semibold text-green-600"> {recentPurchase.timeAgo} phút trước</span>
            </span>
          </div>
        </div>

        {/* Sales Stats */}
        <div className="flex items-center justify-between text-sm bg-blue-50 border border-blue-200 rounded-lg p-2">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20C20.55 4 21 4.45 21 5S20.55 6 20 6H19V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V6H4C3.45 6 3 5.55 3 5S3.45 4 4 4H7ZM9 3V4H15V3H9ZM7 6V19H17V6H7Z"/>
            </svg>
            <span className="text-gray-700">Đã bán <span className="font-bold text-blue-600">1,247</span> sản phẩm trong tháng</span>
          </div>
        </div>

        {/* Stock Alert */}
        <div className="flex items-center gap-2 text-sm text-orange-700 bg-orange-50 border border-orange-200 rounded-lg p-2">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
          </svg>
          <span>
            ⚠️ Chỉ còn <span className="font-bold">8 sản phẩm</span> trong kho
          </span>
        </div>
      </div>
    </div>
  );
};

export default MobileSocialProof;
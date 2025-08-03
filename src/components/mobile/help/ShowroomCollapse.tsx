import React from 'react';
import { COMPANY_INFO } from '../../../constants';
import '../../../styles/help-animations.css';

interface ShowroomCollapseProps {
  isOpen: boolean;
  onToggle: () => void;
}

const ShowroomCollapse: React.FC<ShowroomCollapseProps> = ({ isOpen, onToggle }) => {
  const handleCallStore = (phone: string = COMPANY_INFO.hotline) => {
    window.location.href = `tel:${phone}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden showroom-collapse">
      {/* Header - Always visible */}
      <button
        onClick={onToggle}
        className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="text-3xl flex-shrink-0">📍</div>
          <div className="flex-1">
            <h3 className="font-medium text-gray-900">Showroom</h3>
            <p className="text-blue-600 font-medium text-sm">3 cửa hàng</p>
            <p className="text-gray-500 text-xs mt-1">HN & HCM - Xem địa chỉ</p>
          </div>
        </div>
        <svg
          className={`w-5 h-5 text-gray-400 collapse-arrow ${
            isOpen ? 'rotated' : ''
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Collapsible Content */}
      <div className={`collapse-content ${
        isOpen ? 'expanded' : 'collapsed'
      }`}>
        <div className="px-4 pb-4 border-t border-gray-100">
          {/* Store Locations */}
          <div className="space-y-4 mt-4">
            {COMPANY_INFO.storeLocations.map((store, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4 showroom-store-card">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">{store.name}</h4>
                    <p className="text-gray-600 text-sm mb-3 leading-relaxed">{store.address}</p>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleCallStore()}
                        className="flex items-center gap-2 px-3 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        Gọi ngay
                      </button>
                      
                      <button
                        onClick={() => {
                          const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.address)}`;
                          window.open(googleMapsUrl, '_blank');
                        }}
                        className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Chỉ đường
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Info */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Thông tin liên hệ</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>Hotline: {COMPANY_INFO.hotline}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Giờ mở cửa: {COMPANY_INFO.workingHours}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowroomCollapse;
import React from 'react';
import { COMPANY_INFO } from '../../../constants';

interface QuickAction {
  icon: string;
  title: string;
  description: string;
  action: () => void;
  bgColor: string;
}

const QuickActions: React.FC = () => {
  const quickActions: QuickAction[] = [
    {
      icon: '🔍',
      title: 'Tìm ghế phù hợp',
      description: 'Dùng bộ lọc thông minh',
      bgColor: 'bg-gradient-to-r from-blue-500 to-blue-600',
      action: () => window.location.href = '/categories'
    },
    {
      icon: '📞',
      title: 'Gọi tư vấn',
      description: COMPANY_INFO.supportHours,
      bgColor: 'bg-gradient-to-r from-green-500 to-green-600',
      action: () => window.location.href = `tel:${COMPANY_INFO.hotline}`
    },
    {
      icon: '📍',
      title: 'Tìm showroom',
      description: 'Trải nghiệm trực tiếp',
      bgColor: 'bg-gradient-to-r from-purple-500 to-purple-600',
      action: () => console.log('Opening showroom locator')
    }
  ];

  return (
    <div className="px-4 mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-3">
        Hành động nhanh
      </h2>
      <div className="grid grid-cols-1 gap-3">
        {quickActions.map((action, index) => (
          <button
            key={index}
            onClick={action.action}
            className={`${action.bgColor} text-white p-4 rounded-xl shadow-sm flex items-center gap-4 hover:shadow-md smooth-transition smooth-scale pulse-hover`}
          >
            <div className="text-2xl">{action.icon}</div>
            <div className="text-left">
              <h3 className="font-semibold">{action.title}</h3>
              <p className="text-white/80 text-sm">{action.description}</p>
            </div>
            <svg
              className="w-5 h-5 ml-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
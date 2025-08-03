import React from 'react';
import { CHAIR_SELECTION_GUIDE, COMPANY_INFO } from '../../../constants';
import Breadcrumb from '../help/Breadcrumb';
import '../../../styles/help-animations.css';

const MobileGuideChairSelection: React.FC = () => {
  const steps = CHAIR_SELECTION_GUIDE.steps;

  const breadcrumbItems = [
    { label: 'Trang chủ', href: '/' },
    { label: 'Trợ giúp', href: '/help' },
    { label: 'Hướng dẫn chọn ghế', isActive: true }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="px-4 py-4">
          <button 
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-gray-600 mb-2 hover:text-gray-800 smooth-transition"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Quay lại
          </button>
          <h1 className="text-xl font-bold text-gray-900 fade-in-up">
            Hướng dẫn chọn ghế
          </h1>
          <p className="text-sm text-gray-600 mt-1 fade-in-up" style={{animationDelay: '0.1s'}}>
            4 bước đơn giản để chọn ghế phù hợp
          </p>
        </div>
      </div>

      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />

      {/* Introduction */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 m-4 rounded-xl fade-in-up" style={{animationDelay: '0.2s'}}>
        <h2 className="font-semibold text-lg mb-2">Tại sao cần chọn ghế đúng cách?</h2>
        <p className="text-blue-100 text-sm leading-relaxed">
          Ghế công thái học phù hợp giúp bảo vệ cột sống, giảm đau lưng và tăng hiệu quả làm việc. 
          Hãy làm theo 4 bước dưới đây để tìm được chiếc ghế hoàn hảo.
        </p>
      </div>

      {/* Steps */}
      <div className="px-4">
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div key={index} className={`bg-white rounded-xl shadow-sm border border-gray-100 p-4 stagger-item smooth-transition hover:shadow-md`}>
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-bold text-sm">{index + 1}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">{step.icon}</span>
                    <h3 className="font-semibold text-gray-900">{step.title}</h3>
                  </div>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </div>
              </div>
              
              <div className="ml-13 space-y-2">
                {step.details.map((detail, detailIndex) => (
                  <div key={detailIndex} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-700 text-sm">{detail}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="px-4 mt-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
          <h3 className="font-semibold text-gray-900 mb-2">Sẵn sàng tìm ghế phù hợp?</h3>
          <p className="text-gray-600 text-sm mb-4">
            Sử dụng bộ lọc thông minh để tìm ghế theo tiêu chí của bạn
          </p>
          <button 
            onClick={() => window.location.href = '/categories'}
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium"
          >
            Tìm ghế ngay
          </button>
        </div>
      </div>

      {/* Tips */}
      <div className="px-4 mt-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <span className="text-yellow-600 text-xl">💡</span>
            <div>
              <h4 className="font-semibold text-yellow-800 mb-1">Mẹo hay</h4>
              <p className="text-yellow-700 text-sm">
                Nếu vẫn phân vân, hãy gọi hotline {COMPANY_INFO.hotline} để được tư vấn miễn phí từ chuyên gia. 
                Chúng tôi sẽ giúp bạn chọn ghế phù hợp nhất dựa trên nhu cầu cụ thể.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileGuideChairSelection;
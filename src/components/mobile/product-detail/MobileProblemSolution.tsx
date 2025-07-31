import React, { useState } from 'react';

const MobileProblemSolution: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'problems' | 'solutions'>('problems');

  const problems = [
    {
      icon: '😰',
      title: 'Đau lưng, mỏi vai gáy',
      description: 'Ngồi lâu với tư thế không đúng gây đau nhức khó chịu'
    },
    {
      icon: '😴',
      title: 'Mệt mỏi, giảm năng suất',
      description: 'Ghế không thoải mái làm giảm tập trung và hiệu quả làm việc'
    },
    {
      icon: '🏥',
      title: 'Vấn đề sức khỏe lâu dài',
      description: 'Tư thế ngồi sai có thể dẫn đến các bệnh về cột sống'
    },
    {
      icon: '💸',
      title: 'Chi phí y tế tăng cao',
      description: 'Phải tốn tiền điều trị các vấn đề về xương khớp'
    }
  ];

  const solutions = [
    {
      icon: '✨',
      title: 'Thiết kế công thái học',
      description: 'Hỗ trợ tư thế ngồi đúng, giảm áp lực lên cột sống'
    },
    {
      icon: '🎯',
      title: 'Tăng năng suất làm việc',
      description: 'Ngồi thoải mái giúp tập trung tốt hơn, làm việc hiệu quả'
    },
    {
      icon: '💪',
      title: 'Bảo vệ sức khỏe lâu dài',
      description: 'Phòng ngừa các vấn đề về cột sống và xương khớp'
    },
    {
      icon: '💰',
      title: 'Tiết kiệm chi phí y tế',
      description: 'Đầu tư một lần, bảo vệ sức khỏe suốt đời'
    }
  ];

  return (
    <div className="bg-white mb-2">
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">
          Bạn có đang gặp những vấn đề này?
        </h3>

        {/* Tab Navigation */}
        <div className="flex bg-gray-100 rounded-lg p-1 mb-4">
          <button
            onClick={() => setActiveTab('problems')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'problems'
                ? 'bg-red-500 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            😟 Vấn đề hiện tại
          </button>
          <button
            onClick={() => setActiveTab('solutions')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'solutions'
                ? 'bg-green-500 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            ✅ Giải pháp của chúng tôi
          </button>
        </div>

        {/* Content */}
        <div className="space-y-3">
          {(activeTab === 'problems' ? problems : solutions).map((item, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 p-3 rounded-lg border-2 ${
                activeTab === 'problems'
                  ? 'bg-red-50 border-red-200'
                  : 'bg-green-50 border-green-200'
              }`}
            >
              <div className="text-2xl">{item.icon}</div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Before/After Comparison */}
        <div className="mt-6 bg-gradient-to-r from-red-50 to-green-50 rounded-lg p-4 border border-gray-200">
          <h4 className="font-bold text-center mb-3 text-gray-900">Sự khác biệt rõ rệt</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-3xl mb-2">😫</div>
              <div className="text-sm font-medium text-red-600 mb-1">TRƯỚC KHI DÙNG</div>
              <div className="text-xs text-gray-600">Đau lưng, mệt mỏi, giảm năng suất</div>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">😊</div>
              <div className="text-sm font-medium text-green-600 mb-1">SAU KHI DÙNG</div>
              <div className="text-xs text-gray-600">Thoải mái, khỏe mạnh, làm việc hiệu quả</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileProblemSolution;
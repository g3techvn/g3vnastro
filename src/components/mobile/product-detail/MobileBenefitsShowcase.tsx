import React from 'react';

const MobileBenefitsShowcase: React.FC = () => {
  const benefits = [
    {
      icon: '🏥',
      title: 'Được bác sĩ khuyên dùng',
      description: 'Thiết kế ergonomic chuẩn y khoa, giảm 90% đau lưng',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: '⚡',
      title: 'Tăng năng suất 40%',
      description: 'Ngồi thoải mái giúp tập trung tốt hơn, làm việc hiệu quả',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: '💰',
      title: 'Tiết kiệm 15 triệu/năm',
      description: 'Giảm chi phí y tế, massage, điều trị đau lưng',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: '🛡️',
      title: 'Bảo vệ sức khỏe lâu dài',
      description: 'Phòng ngừa các bệnh về cột sống, xương khớp',
      color: 'from-purple-500 to-purple-600'
    }
  ];

  const healthStats = [
    { label: 'Giảm đau lưng', value: '90%', icon: '🎯' },
    { label: 'Cải thiện tư thế', value: '85%', icon: '📏' },
    { label: 'Tăng năng suất', value: '40%', icon: '📈' },
    { label: 'Hài lòng', value: '98%', icon: '😊' }
  ];

  return (
    <div className="bg-white mb-2">
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">
          🌟 Lợi ích vượt trội khi sử dụng
        </h3>

        {/* Main Benefits */}
        <div className="space-y-4 mb-6">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className={`bg-gradient-to-r ${benefit.color} rounded-lg p-4 text-white relative overflow-hidden`}
            >
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
              
              <div className="flex items-start gap-3 relative z-10">
                <div className="text-3xl">{benefit.icon}</div>
                <div className="flex-1">
                  <h4 className="font-bold text-lg mb-1">{benefit.title}</h4>
                  <p className="text-white/90 text-sm leading-relaxed">{benefit.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Health Statistics */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <h4 className="font-bold text-center mb-3 text-gray-900">
            📊 Kết quả khảo sát từ 10,000+ khách hàng
          </h4>
          <div className="grid grid-cols-2 gap-3">
            {healthStats.map((stat, index) => (
              <div key={index} className="bg-white rounded-lg p-3 text-center border border-gray-200">
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div className="text-2xl font-bold text-red-600 mb-1">{stat.value}</div>
                <div className="text-xs text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Lifestyle Benefits */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-200">
          <h4 className="font-bold text-center mb-3 text-gray-900">
            🎯 Phù hợp cho mọi đối tượng
          </h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-lg">👨‍💼</span>
              <span className="text-gray-700">Dân văn phòng</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">👩‍💻</span>
              <span className="text-gray-700">Freelancer</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">🎮</span>
              <span className="text-gray-700">Game thủ</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">👨‍🎓</span>
              <span className="text-gray-700">Học sinh, SV</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">👩‍⚕️</span>
              <span className="text-gray-700">Y tá, bác sĩ</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">👨‍🏫</span>
              <span className="text-gray-700">Giáo viên</span>
            </div>
          </div>
        </div>

        {/* ROI Calculator */}
        <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-bold text-center mb-2 text-green-800">
            💡 Tính toán lợi ích kinh tế
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Chi phí massage/tháng:</span>
              <span className="font-semibold text-red-600">1,200,000₫</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Chi phí điều trị đau lưng/năm:</span>
              <span className="font-semibold text-red-600">5,000,000₫</span>
            </div>
            <div className="border-t border-green-300 pt-2 flex justify-between">
              <span className="font-semibold text-green-800">Tiết kiệm được/năm:</span>
              <span className="font-bold text-green-600 text-lg">19,400,000₫</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileBenefitsShowcase;
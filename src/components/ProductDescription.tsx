import React, { useState } from 'react';

interface ProductDescriptionProps {
  overview?: string;
  content?: string;
  keyFeatures?: string[];
  benefits?: string[];
  instructions?: string[];
}

export function ProductDescription({
  overview = '',
  content = '',
  keyFeatures = [],
  benefits = [],
  instructions = [],
}: ProductDescriptionProps) {
  // Tabs logic
  const hasOverview = Boolean(overview || content);
  const hasFeatures = keyFeatures.length > 0;
  const hasBenefits = benefits.length > 0;
  const hasInstructions = instructions.length > 0;

  const availableTabs = [
    { id: 'overview', label: 'Tổng quan', hasContent: hasOverview },
    { id: 'features', label: 'Tính năng nổi bật', hasContent: hasFeatures },
    { id: 'benefits', label: 'Lợi ích sử dụng', hasContent: hasBenefits },
    { id: 'guide', label: 'Hướng dẫn sử dụng', hasContent: hasInstructions },
  ].filter(tab => tab.hasContent);

  const defaultTab = availableTabs.length > 0 ? availableTabs[0].id : 'overview';
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (availableTabs.length === 0) return null;

  return (
    <div className="prose max-w-none">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Thông tin chi tiết</h2>
      <div className="border-b mb-4 flex space-x-4">
        {availableTabs.map(tab => (
          <button
            key={tab.id}
            className={`px-4 py-2 text-base font-medium border-b-2 transition-colors ${activeTab === tab.id ? 'text-red-600 border-red-600' : 'text-gray-700 border-transparent hover:text-red-600'}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="min-h-[120px]">
        {activeTab === 'overview' && hasOverview && (
          <div>
            {content ? (
              <div>
                <div
                  className="prose max-w-none line-clamp-3 overflow-hidden"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
                <div className="flex justify-center">
                  <button
                    className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 font-semibold shadow"
                    onClick={() => setIsModalOpen(true)}
                  >
                    Xem thêm
                  </button>
                </div>
                {isModalOpen && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-[1200px] max-w-full relative max-h-[90vh] overflow-y-auto">
                      <h3 className="text-xl font-bold mb-4 text-center">Thông tin chi tiết</h3>
                      <div
                        className="prose max-w-none mx-auto"
                        dangerouslySetInnerHTML={{ __html: content }}
                      />
                      <button
                        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
                        onClick={() => setIsModalOpen(false)}
                        aria-label="Đóng"
                      >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-600">{overview}</p>
            )}
          </div>
        )}
        {activeTab === 'features' && hasFeatures && (
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            {keyFeatures.map((feature, idx) => (
              <li key={idx}>{feature}</li>
            ))}
          </ul>
        )}
        {activeTab === 'benefits' && hasBenefits && (
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            {benefits.map((benefit, idx) => (
              <li key={idx}>{benefit}</li>
            ))}
          </ul>
        )}
        {activeTab === 'guide' && hasInstructions && (
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            {instructions.map((instruction, idx) => (
              <li key={idx}>{instruction}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
} 
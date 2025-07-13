import React, { useState } from 'react';
import type { Product } from '../../../types/Product';

interface MobileProductDescriptionProps {
  product: Product;
  keyFeatures?: string[];
  benefits?: string[];
  instructions?: string[];
  overview?: string;
}

export default function MobileProductDescription({ 
  product, 
  keyFeatures = [], 
  benefits = [], 
  instructions = [], 
  overview = '' 
}: MobileProductDescriptionProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'benefits' | 'instructions'>('overview');
  const [isExpanded, setIsExpanded] = useState(false);

  // Check which tabs have content
  const hasOverview = Boolean(overview || product.description || product.content);
  const hasFeatures = keyFeatures.length > 0;
  const hasBenefits = benefits.length > 0;
  const hasInstructions = instructions.length > 0;

  // Available tabs
  const availableTabs = [
    { id: 'overview' as const, label: 'Tổng quan', hasContent: hasOverview },
    { id: 'features' as const, label: 'Tính năng', hasContent: hasFeatures },
    { id: 'benefits' as const, label: 'Lợi ích', hasContent: hasBenefits },
    { id: 'instructions' as const, label: 'Hướng dẫn', hasContent: hasInstructions }
  ].filter(tab => tab.hasContent);

  // If no content, don't render
  if (availableTabs.length === 0) {
    return null;
  }

  // Set default tab
  if (!availableTabs.find(tab => tab.id === activeTab)) {
    setActiveTab(availableTabs[0].id);
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        const content = product.content || overview || product.description || '';
        return (
          <div className="space-y-3">
            {content && (
              <div 
                className={`text-sm text-gray-700 leading-relaxed ${!isExpanded ? 'line-clamp-4' : ''}`}
                dangerouslySetInnerHTML={{ __html: content }}
              />
            )}
            {content.length > 200 && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-red-600 text-sm font-medium flex items-center gap-1"
              >
                {isExpanded ? 'Thu gọn' : 'Xem thêm'}
                <svg 
                  className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            )}
          </div>
        );

      case 'features':
        return (
          <div className="space-y-2">
            {keyFeatures.map((feature, index) => (
              <div key={index} className="flex items-start gap-2">
                <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span className="text-sm text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        );

      case 'benefits':
        return (
          <div className="space-y-2">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-2">
                <svg className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                <span className="text-sm text-gray-700">{benefit}</span>
              </div>
            ))}
          </div>
        );

      case 'instructions':
        return (
          <div className="space-y-2">
            {instructions.map((instruction, index) => (
              <div key={index} className="flex items-start gap-2">
                <span className="w-5 h-5 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">
                  {index + 1}
                </span>
                <span className="text-sm text-gray-700">{instruction}</span>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white mb-2 md:hidden">
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin chi tiết</h3>
        
        {/* Tab Navigation */}
        {availableTabs.length > 1 && (
          <div className="flex border-b border-gray-200 mb-4 overflow-x-auto scrollbar-hide">
            {availableTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-red-600 border-red-600'
                    : 'text-gray-600 border-transparent hover:text-red-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* Tab Content */}
        <div className="min-h-[100px]">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}
import React, { useState } from 'react';

interface TechnicalSpec {
  title: string;
  value: string;
}

interface MobileTechnicalSpecsProps {
  specifications: TechnicalSpec[];
}

export default function MobileTechnicalSpecs({ specifications = [] }: MobileTechnicalSpecsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Don't render if no specifications
  if (!specifications || specifications.length === 0) {
    return null;
  }

  // Show first 4 specs initially, rest when expanded
  const visibleSpecs = isExpanded ? specifications : specifications.slice(0, 4);
  const hasMoreSpecs = specifications.length > 4;

  return (
    <div className="bg-white mb-2 md:hidden">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Thông số kỹ thuật</h3>
          <div className="flex items-center text-sm text-gray-500">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {specifications.length} thông số
          </div>
        </div>

        <div className="space-y-3">
          {visibleSpecs.map((spec, index) => (
            <div key={index} className="flex justify-between items-start gap-4 py-2 border-b border-gray-100 last:border-b-0">
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-700">{spec.title}</span>
              </div>
              <div className="flex-1 text-right">
                <span className="text-sm text-gray-900">{spec.value}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Expand/Collapse Button */}
        {hasMoreSpecs && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full mt-4 py-2 text-red-600 text-sm font-medium flex items-center justify-center gap-1 hover:bg-red-50 rounded-lg transition-colors"
          >
            {isExpanded ? (
              <>
                Thu gọn
                <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </>
            ) : (
              <>
                Xem thêm {specifications.length - 4} thông số
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </>
            )}
          </button>
        )}

        {/* Verification Notice */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg flex items-start gap-2">
          <svg className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
          </svg>
          <div>
            <p className="text-xs text-blue-700 font-medium">Thông số được xác thực</p>
            <p className="text-xs text-blue-600 mt-1">Tất cả thông số kỹ thuật đã được kiểm tra và xác nhận bởi nhà sản xuất.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
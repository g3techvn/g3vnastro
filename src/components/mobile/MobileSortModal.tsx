import React from 'react';

interface SortOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface MobileSortModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSort: string;
  onSortChange: (sortBy: string) => void;
}

const MobileSortModal: React.FC<MobileSortModalProps> = ({
  isOpen,
  onClose,
  currentSort,
  onSortChange,
}) => {
  const sortOptions: SortOption[] = [
    { 
      value: 'name', 
      label: 'Tên A-Z',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
        </svg>
      )
    },
    { 
      value: 'price_asc', 
      label: 'Giá thấp đến cao',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 11l5-5m0 0l5 5m-5-5v12" />
        </svg>
      )
    },
    { 
      value: 'price_desc', 
      label: 'Giá cao đến thấp',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 13l-5 5m0 0l-5-5m5 5V6" />
        </svg>
      )
    }
  ];

  const handleSortSelect = (sortValue: string) => {
    onSortChange(sortValue);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-xl overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between rounded-t-xl">
          <h3 className="text-lg font-semibold text-gray-900">Sắp xếp theo</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Sort Options */}
        <div className="p-4">
          <div className="space-y-2">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSortSelect(option.value)}
                className={`w-full flex items-center justify-between p-4 rounded-lg border transition-colors ${
                  currentSort === option.value
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div className="flex items-center">
                  <div className={`mr-3 ${currentSort === option.value ? 'text-red-600' : 'text-gray-400'}`}>
                    {option.icon}
                  </div>
                  <span className="text-base font-medium">{option.label}</span>
                </div>
                {currentSort === option.value && (
                  <div className="text-red-600">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileSortModal;
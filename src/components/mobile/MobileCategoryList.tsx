import React, { useState } from 'react';

interface Category {
  id: number | string;
  title: string;
  description?: string | null;
  slug: string;
  image_url?: string | null;
  image_square_url?: string | null;
}

interface Brand {
  id: number | string;
  title: string;
  description?: string | null;
  slug: string;
  image_url?: string | null;
  image_square_url?: string | null;
}

interface MobileCategoryListProps {
  categories: Category[];
  brands: Brand[];
}



const MobileCategoryList: React.FC<MobileCategoryListProps> = ({ categories, brands }) => {
  const [activeTab, setActiveTab] = useState<'categories' | 'brands'>('categories');

  if (categories.length === 0 && brands.length === 0) {
    return (
      <div className="bg-gray-50 min-h-screen p-4">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 text-center">
          <div className="mb-4">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Chưa có dữ liệu
          </h3>
          <p className="text-base text-gray-600">
            Danh mục và thương hiệu sẽ được cập nhật sớm nhất.
          </p>
        </div>
      </div>
    );
  }

  const renderList = (items: (Category | Brand)[], type: 'categories' | 'brands') => (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      {items.map((item, index) => (
        <a
          key={item.id}
          href={`/${type}/${item.slug}`}
          className={`flex items-center px-4 py-4 hover:bg-gray-50 active:bg-gray-100 transition-colors duration-150 ${
            index < items.length - 1 ? 'border-b border-gray-200' : ''
          }`}
        >
          <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center text-gray-600">
            {item.image_square_url || item.image_url ? (
              <img
                src={
                  (item.image_square_url || item.image_url || '').startsWith('http')
                    ? `/g3cdn?url=${encodeURIComponent(item.image_square_url || item.image_url || '')}`
                    : (item.image_square_url || item.image_url || undefined)
                }
                alt={item.title}
                className="w-8 h-8 object-contain rounded"
                loading="lazy"
              />
            ) : (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12,2L13.09,8.26L22,9L13.09,9.74L12,16L10.91,9.74L2,9L10.91,8.26L12,2Z" />
              </svg>
            )}
          </div>
          <div className="ml-4 flex-1">
            <h3 className="text-base font-medium text-gray-900">
              {item.title}
            </h3>
            {item.description && (
              <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">
                {item.description}
              </p>
            )}
          </div>
          <div className="flex-shrink-0 ml-2">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </a>
      ))}
    </div>
  );

  const renderEmptyState = (title: string, description: string) => (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 text-center">
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {title}
      </h3>
      <p className="text-base text-gray-600">
        {description}
      </p>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header with tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-3">
          <h1 className="text-lg font-semibold text-gray-900 mb-3">Danh mục & Thương hiệu</h1>
          <div className="relative bg-gray-100 rounded-lg p-1">
            {/* Sliding indicator */}
            <div 
              className={`absolute top-1 bottom-1 bg-white rounded-md shadow-sm transition-all duration-300 ease-out ${
                activeTab === 'categories' 
                  ? 'left-1 right-1/2 mr-0.5' 
                  : 'left-1/2 right-1 ml-0.5'
              }`}
            />
            
            {/* Tab buttons */}
            <div className="relative flex">
              <button
                onClick={() => setActiveTab('categories')}
                className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors duration-200 relative z-10 ${
                  activeTab === 'categories'
                    ? 'text-red-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Danh mục ({categories.length})
              </button>
              <button
                onClick={() => setActiveTab('brands')}
                className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors duration-200 relative z-10 ${
                  activeTab === 'brands'
                    ? 'text-red-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Thương hiệu ({brands.length})
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {activeTab === 'categories' && (
          <div className="animate-fade-in">
            {categories.length > 0 
              ? renderList(categories, 'categories')
              : renderEmptyState(
                  'Chưa có danh mục nào',
                  'Các danh mục sản phẩm sẽ được cập nhật sớm nhất.'
                )
            }
          </div>
        )}
        
        {activeTab === 'brands' && (
          <div className="animate-fade-in">
            {brands.length > 0 
              ? renderList(brands, 'brands')
              : renderEmptyState(
                  'Chưa có thương hiệu nào',
                  'Các thương hiệu sẽ được cập nhật sớm nhất.'
                )
            }
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileCategoryList;
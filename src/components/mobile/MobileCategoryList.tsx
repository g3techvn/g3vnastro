import React from 'react';

interface Category {
  id: number | string;
  title: string;
  description?: string;
  slug: string;
  image_url?: string;
  image_square_url?: string;
}

interface MobileCategoryListProps {
  categories: Category[];
}



const MobileCategoryList: React.FC<MobileCategoryListProps> = ({ categories }) => {
  if (categories.length === 0) {
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
            Chưa có danh mục nào
          </h3>
          <p className="text-base text-gray-600">
            Các danh mục sản phẩm sẽ được cập nhật sớm nhất.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-4">
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        {categories.map((category, index) => (
          <a
            key={category.id}
            href={`/categories/${category.slug}`}
            className={`flex items-center px-4 py-4 hover:bg-gray-50 active:bg-gray-100 transition-colors duration-150 ${index < categories.length - 1 ? 'border-b border-gray-200' : ''
              }`}
          >
            <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center text-gray-600">
              {category.image_square_url || category.image_url ? (
                <img
                  src={category.image_square_url || category.image_url}
                  alt={category.title}
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
                {category.title}
              </h3>
              {category.description && (
                <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">
                  {category.description}
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
    </div>
  );
};

export default MobileCategoryList;
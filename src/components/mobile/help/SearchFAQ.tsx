import React, { useState, useEffect } from 'react';

interface SearchFAQProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

const SearchFAQ: React.FC<SearchFAQProps> = ({
  onSearch,
  placeholder = "Tìm kiếm câu hỏi..."
}) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      onSearch(query);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query, onSearch]);

  return (
    <div className="relative mb-4">
      <div className={`relative transition-all duration-300 ${isFocused ? 'transform scale-102' : ''}`}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={`
            w-full px-4 py-3 pl-12 pr-4 
            bg-white border border-gray-200 rounded-xl
            text-gray-900 placeholder-gray-500
            search-input smooth-transition
            focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100
            ${isFocused ? 'shadow-lg' : 'shadow-sm'}
          `}
        />
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
          <svg
            className={`w-5 h-5 transition-colors duration-200 ${isFocused ? 'text-blue-500' : 'text-gray-400'
              }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Search suggestions */}
      {isFocused && !query && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 z-10 fade-in-up">
          <div className="p-3">
            <p className="text-sm text-gray-500 mb-2">Gợi ý tìm kiếm:</p>
            <div className="flex flex-wrap gap-2">
              {['bảo hành', 'giao hàng', 'chọn ghế', 'trả góp'].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setQuery(suggestion)}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-blue-100 hover:text-blue-700 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFAQ;
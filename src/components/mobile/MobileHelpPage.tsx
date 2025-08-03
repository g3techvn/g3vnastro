import React, { useState, useEffect, useMemo } from 'react';
import HelpContactCard from './help/HelpContactCard';
import FAQAccordion from './help/FAQAccordion';
import HelpResourceCard from './help/HelpResourceCard';
import QuickActions from './help/QuickActions';
import HelpFeedback from './help/HelpFeedback';
import SearchFAQ from './help/SearchFAQ';
import LoadingSkeleton from './help/LoadingSkeleton';
import Breadcrumb from './help/Breadcrumb';
import ShowroomCollapse from './help/ShowroomCollapse';
import { HELP_CONTACT_METHODS, FAQ_CATEGORIES, FAQ_DATA, HELP_RESOURCES } from '../../constants';
import '../../styles/help-animations.css';

type FAQItem = {
  id: number;
  question: string;
  answer: string;
  category: string;
};

const MobileHelpPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showroomOpen, setShowroomOpen] = useState(false);

  const categories = FAQ_CATEGORIES;
  const faqData = FAQ_DATA as readonly FAQItem[];
  const helpResources = HELP_RESOURCES;
  // Filter out showroom from contact methods since we'll show it separately
  const contactMethods = HELP_CONTACT_METHODS.filter(method => method.type !== 'location');

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Filter FAQs based on category and search
  const filteredFAQs = useMemo(() => {
    let filtered = activeCategory === 'all'
      ? faqData
      : faqData.filter(faq => faq.category === activeCategory);

    if (searchQuery) {
      filtered = filtered.filter(faq =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [activeCategory, searchQuery, faqData]);

  const breadcrumbItems = [
    { label: 'Trang chủ', href: '/' },
    { label: 'Trợ giúp', isActive: true }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="px-4 py-4">
          <h1 className="text-xl font-bold text-gray-900 text-center fade-in-up">
            Trợ giúp & Hỗ trợ
          </h1>
          <p className="text-sm text-gray-600 text-center mt-1 fade-in-up" style={{ animationDelay: '0.1s' }}>
            Chúng tôi luôn sẵn sàng hỗ trợ bạn
          </p>
        </div>
      </div>

      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />

      {/* Quick Actions */}
      <div className="fade-in-up" style={{ animationDelay: '0.2s' }}>
        <QuickActions />
      </div>

      {/* Contact Methods */}
      <div className="px-4 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3 fade-in-up">
          Các cách liên hệ
        </h2>
        {isLoading ? (
          <LoadingSkeleton type="contact" count={3} />
        ) : (
          <div className="space-y-3">
            {contactMethods.map((method, index) => (
              <div key={index} className={`stagger-item smooth-transition contact-card`}>
                <HelpContactCard method={method} />
              </div>
            ))}
            {/* Showroom Collapse */}
            <div className="stagger-item smooth-transition">
              <ShowroomCollapse
                isOpen={showroomOpen}
                onToggle={() => setShowroomOpen(!showroomOpen)}
              />
            </div>
          </div>
        )}
      </div>

      {/* FAQ Section */}
      <div className="px-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-3 fade-in-up">
          Câu hỏi thường gặp
        </h2>

        {/* Search FAQ */}
        <SearchFAQ onSearch={setSearchQuery} />

        {/* Category Filter */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap smooth-transition ${activeCategory === category.id
                ? 'bg-blue-500 text-white category-active'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300'
                }`}
            >
              <span>{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>

        {/* FAQ List */}
        {isLoading ? (
          <LoadingSkeleton type="faq" count={5} />
        ) : filteredFAQs.length > 0 ? (
          <FAQAccordion faqs={filteredFAQs as FAQItem[]} />
        ) : (
          <div className="text-center py-8 fade-in-up">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy kết quả</h3>
            <p className="text-gray-600 text-sm">
              Thử tìm kiếm với từ khóa khác hoặc liên hệ với chúng tôi để được hỗ trợ
            </p>
          </div>
        )}
      </div>

      {/* Help Resources */}
      <div className="px-4 mt-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-3 fade-in-up">
          Tài liệu hữu ích
        </h2>
        {isLoading ? (
          <LoadingSkeleton type="resource" count={4} />
        ) : (
          <div className="space-y-3">
            {helpResources.map((resource, index) => (
              <div key={index} className={`stagger-item smooth-transition`} style={{ animationDelay: `${0.1 * (index + 1)}s` }}>
                <HelpResourceCard resource={resource} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Help Feedback */}
      <HelpFeedback />

      {/* Bottom Spacing */}
      <div className="h-8"></div>
    </div>
  );
};

export default MobileHelpPage;
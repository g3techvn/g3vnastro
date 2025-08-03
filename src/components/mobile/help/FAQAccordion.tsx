import React, { useState } from 'react';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
}

interface FAQAccordionProps {
  faqs: FAQItem[];
}

const FAQAccordion: React.FC<FAQAccordionProps> = ({ faqs }) => {
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {faqs.map((faq) => (
        <div key={faq.id} className="bg-white rounded-xl shadow-sm border border-gray-100 smooth-transition hover:shadow-md">
          <button
            onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
            className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50 smooth-transition"
          >
            <span className="font-medium text-gray-900 pr-4">{faq.question}</span>
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform ${
                expandedFAQ === faq.id ? 'rotate-180' : ''
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div className={`faq-content ${expandedFAQ === faq.id ? 'expanded' : ''}`}>
            {expandedFAQ === faq.id && (
              <div className="px-4 pb-4 fade-in-up">
                <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FAQAccordion;
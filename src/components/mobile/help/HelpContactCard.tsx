import React from 'react';

interface ContactMethod {
  icon: string;
  title: string;
  value: string;
  description: string;
  type: string;
  action?: () => void;
}

interface HelpContactCardProps {
  method: ContactMethod;
}

const HelpContactCard: React.FC<HelpContactCardProps> = ({ method }) => {
  const handleClick = () => {
    if (method.action) {
      method.action();
    } else {
      // Default actions based on contact type
      switch (method.type) {
        case 'phone':
          window.location.href = `tel:${method.value}`;
          break;
        case 'email':
          window.location.href = `mailto:${method.value}`;
          break;
      }
    }
  };

  return (
    <button
      onClick={handleClick}
      className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 w-full text-left hover:shadow-md smooth-transition smooth-scale smooth-shadow"
    >
      <div className="flex items-center gap-4">
        <div className="text-3xl flex-shrink-0">{method.icon}</div>
        <div className="flex-1">
          <h3 className="font-medium text-gray-900">{method.title}</h3>
          <p className="text-blue-600 font-medium text-sm">{method.value}</p>
          <p className="text-gray-500 text-xs mt-1">{method.description}</p>
        </div>
        <svg
          className="w-5 h-5 text-gray-400 flex-shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </button>
  );
};

export default HelpContactCard;
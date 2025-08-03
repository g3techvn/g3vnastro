import React from 'react';

interface HelpResource {
  icon: string;
  title: string;
  description: string;
  link?: string;
  bgColor: string;
  iconColor: string;
}

interface HelpResourceCardProps {
  resource: HelpResource;
}

const HelpResourceCard: React.FC<HelpResourceCardProps> = ({ resource }) => {
  const handleClick = () => {
    if (resource.link) {
      window.open(resource.link, '_blank');
    }
  };

  return (
    <button
      onClick={handleClick}
      className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 w-full text-left hover:shadow-md smooth-transition smooth-scale smooth-shadow"
    >
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 ${resource.bgColor} rounded-lg flex items-center justify-center`}>
          <span className={resource.iconColor}>{resource.icon}</span>
        </div>
        <div>
          <h3 className="font-medium text-gray-900">{resource.title}</h3>
          <p className="text-gray-500 text-sm">{resource.description}</p>
        </div>
      </div>
    </button>
  );
};

export default HelpResourceCard;
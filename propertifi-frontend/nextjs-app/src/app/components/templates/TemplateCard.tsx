
import React from 'react';

interface TemplateCardProps {
  template: {
    id: string;
    name: string;
    description: string;
    category: string;
  };
}

const TemplateCard: React.FC<TemplateCardProps> = ({ template }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h3 className="text-lg font-semibold">{template.name}</h3>
      <p className="text-gray-500">{template.description}</p>
      <div className="mt-4 flex justify-between items-center">
        <span className="text-sm text-gray-400">{template.category}</span>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">Download</button>
      </div>
    </div>
  );
};

export default TemplateCard;

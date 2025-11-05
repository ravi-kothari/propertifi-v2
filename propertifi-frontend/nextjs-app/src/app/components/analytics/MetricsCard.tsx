
import React from 'react';

interface MetricsCardProps {
  title: string;
  value: string | number;
  previousValue?: string | number;
}

const MetricsCard: React.FC<MetricsCardProps> = ({ title, value, previousValue }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h4 className="text-gray-500 text-lg font-medium">{title}</h4>
      <p className="text-4xl font-bold text-gray-800">{value}</p>
      {previousValue && (
        <p className="text-sm text-gray-500 mt-2">
          vs. {previousValue} previous period
        </p>
      )}
    </div>
  );
};

export default MetricsCard;

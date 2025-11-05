
import React from 'react';

interface ConversionFunnelProps {
  data: {
    stage: string;
    count: number;
  }[];
}

const ConversionFunnel: React.FC<ConversionFunnelProps> = ({ data }) => {
  const maxCount = Math.max(...data.map((d) => d.count), 0);

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-4">Conversion Funnel</h3>
      <div className="space-y-2">
        {data.map((item) => (
          <div key={item.stage} className="flex items-center">
            <div className="w-1/3 text-gray-600">{item.stage}</div>
            <div className="w-2/3 bg-gray-200 rounded-full h-6">
              <div
                className="bg-blue-500 h-6 rounded-full text-white text-center text-sm leading-6"
                style={{ width: `${(item.count / maxCount) * 100}%` }}
              >
                {item.count}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConversionFunnel;


'use client';

import React from 'react';
import { Line } from 'react-chartjs-2';

interface CashFlowChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
    }[];
  };
}

const CashFlowChart: React.FC<CashFlowChartProps> = ({ data }) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Cash Flow Over Time',
      },
    },
  };

  return <Line options={options} data={data} />;
};

export default CashFlowChart;

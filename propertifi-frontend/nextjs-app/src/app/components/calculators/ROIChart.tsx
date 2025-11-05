
'use client';

import React from 'react';
import { Bar } from 'react-chartjs-2';

interface ROIChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string[];
    }[];
  };
}

const ROIChart: React.FC<ROIChartProps> = ({ data }) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'ROI Breakdown',
      },
    },
  };

  return <Bar options={options} data={data} />;
};

export default ROIChart;

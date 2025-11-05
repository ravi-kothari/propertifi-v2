
"use client";

import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export function ROIChart({ results }: { results: any }) {
  if (!results) return null;

  const data = {
    labels: ['Year 1', 'Year 5', 'Year 10', 'Year 20', 'Year 30'],
    datasets: [
      {
        label: 'Return on Investment',
        data: [results.annualROI, results.annualROI * 5, results.annualROI * 10, results.annualROI * 20, results.annualROI * 30].map(d => d * 100),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'ROI Over Time',
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: ${context.formattedValue}%`;
          }
        }
      }
    },
    scales: {
      y: {
        ticks: {
          callback: function(value: any) {
            return `${value}%`;
          }
        }
      }
    }
  };

  return <Line data={data} options={options} />;
}

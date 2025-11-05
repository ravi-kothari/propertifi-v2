
"use client";

import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export function CashFlowChart({ results }: { results: any }) {
  if (!results) return null;

  const data = {
    labels: ['Monthly', 'Annual'],
    datasets: [
      {
        label: 'Cash Flow',
        data: [results.monthlyCashFlow, results.annualCashFlow],
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
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
        text: 'Cash Flow',
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        ticks: {
          callback: function(value: any) {
            return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
          }
        }
      }
    }
  };

  return <Bar data={data} options={options} />;
}

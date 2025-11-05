'use client';

import { useMemo } from 'react';

interface DonutChartData {
  label: string;
  value: number;
  percentage: number;
  color?: string;
}

interface DonutChartProps {
  data: DonutChartData[];
  title: string;
  size?: number;
}

const defaultColors = [
  '#4F46E5', // indigo
  '#10B981', // green
  '#F59E0B', // amber
  '#8B5CF6', // purple
  '#EF4444', // red
  '#6B7280', // gray
  '#06B6D4', // cyan
  '#EC4899', // pink
];

export default function DonutChart({
  data,
  title,
  size = 300,
}: DonutChartProps) {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return null;

    const total = data.reduce((sum, item) => sum + item.value, 0);
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 2 - 20;
    const innerRadius = radius * 0.6;

    let currentAngle = -90; // Start at top

    const segments = data.map((item, index) => {
      const angle = (item.value / total) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;

      // Calculate path for donut segment
      const startRad = (startAngle * Math.PI) / 180;
      const endRad = (endAngle * Math.PI) / 180;

      const x1 = centerX + radius * Math.cos(startRad);
      const y1 = centerY + radius * Math.sin(startRad);
      const x2 = centerX + radius * Math.cos(endRad);
      const y2 = centerY + radius * Math.sin(endRad);

      const x3 = centerX + innerRadius * Math.cos(endRad);
      const y3 = centerY + innerRadius * Math.sin(endRad);
      const x4 = centerX + innerRadius * Math.cos(startRad);
      const y4 = centerY + innerRadius * Math.sin(startRad);

      const largeArc = angle > 180 ? 1 : 0;

      const pathData = [
        `M ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
        `L ${x3} ${y3}`,
        `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4}`,
        'Z',
      ].join(' ');

      currentAngle = endAngle;

      return {
        ...item,
        pathData,
        color: item.color || defaultColors[index % defaultColors.length],
        midAngle: (startAngle + endAngle) / 2,
      };
    });

    return {
      segments,
      total,
      centerX,
      centerY,
    };
  }, [data, size]);

  if (!chartData) {
    return (
      <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          No data available
        </div>
      </div>
    );
  }

  const { segments, total, centerX, centerY } = chartData;

  return (
    <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>

      <div className="flex items-center gap-8">
        {/* Chart */}
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="flex-shrink-0"
        >
          {/* Segments */}
          {segments.map((segment, index) => (
            <g key={index}>
              <path
                d={segment.pathData}
                fill={segment.color}
                className="transition-opacity hover:opacity-80 cursor-pointer"
              >
                <title>{`${segment.label}: ${segment.value} (${segment.percentage.toFixed(1)}%)`}</title>
              </path>
            </g>
          ))}

          {/* Center text */}
          <text
            x={centerX}
            y={centerY - 10}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-3xl font-bold fill-gray-900"
          >
            {total}
          </text>
          <text
            x={centerX}
            y={centerY + 15}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-sm fill-gray-500"
          >
            Total
          </text>
        </svg>

        {/* Legend */}
        <div className="flex-1 space-y-2">
          {segments.map((segment, index) => (
            <div key={index} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: segment.color }}
                ></div>
                <span className="text-sm text-gray-700 truncate">{segment.label}</span>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="text-sm font-semibold text-gray-900">{segment.value}</span>
                <span className="text-sm text-gray-500 min-w-[45px] text-right">
                  {segment.percentage.toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function DonutChartSkeleton({ size = 300 }: { size?: number }) {
  return (
    <div className="bg-white rounded-lg shadow p-6 border border-gray-200 animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
      <div className="flex items-center gap-8">
        <div className="rounded-full bg-gray-100" style={{ width: size, height: size }}></div>
        <div className="flex-1 space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center justify-between gap-4">
              <div className="h-4 bg-gray-200 rounded flex-1"></div>
              <div className="h-4 bg-gray-200 rounded w-16"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

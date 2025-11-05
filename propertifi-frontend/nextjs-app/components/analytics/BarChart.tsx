'use client';

import { useMemo } from 'react';

interface BarChartData {
  label: string;
  value: number;
  color?: string;
}

interface BarChartProps {
  data: BarChartData[];
  title: string;
  height?: number;
  showValues?: boolean;
}

const defaultColors = [
  '#4F46E5', // indigo
  '#10B981', // green
  '#F59E0B', // amber
  '#8B5CF6', // purple
  '#EF4444', // red
  '#6B7280', // gray
];

export default function BarChart({
  data,
  title,
  height = 300,
  showValues = true,
}: BarChartProps) {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return null;

    const maxValue = Math.max(...data.map((d) => d.value));
    const padding = { top: 20, right: 20, bottom: 60, left: 50 };
    const chartWidth = 800;
    const chartHeight = height - padding.top - padding.bottom;
    const barWidth = (chartWidth - padding.left - padding.right) / data.length * 0.7;
    const barSpacing = (chartWidth - padding.left - padding.right) / data.length;

    const bars = data.map((item, index) => {
      const barHeight = (item.value / maxValue) * chartHeight;
      const x = padding.left + index * barSpacing + (barSpacing - barWidth) / 2;
      const y = padding.top + chartHeight - barHeight;

      return {
        ...item,
        x,
        y,
        width: barWidth,
        height: barHeight,
        color: item.color || defaultColors[index % defaultColors.length],
      };
    });

    return {
      bars,
      maxValue,
      padding,
      chartWidth,
      chartHeight,
    };
  }, [data, height]);

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

  const { bars, maxValue, padding, chartWidth, chartHeight } = chartData;

  return (
    <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>

      <svg
        width="100%"
        height={height}
        viewBox={`0 0 ${chartWidth} ${height}`}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
          const y = padding.top + chartHeight * (1 - ratio);
          return (
            <g key={ratio}>
              <line
                x1={padding.left}
                y1={y}
                x2={chartWidth - padding.right}
                y2={y}
                stroke="#E5E7EB"
                strokeWidth="1"
              />
              <text
                x={padding.left - 10}
                y={y}
                textAnchor="end"
                dominantBaseline="middle"
                className="text-xs fill-gray-500"
              >
                {Math.round(maxValue * ratio)}
              </text>
            </g>
          );
        })}

        {/* Bars */}
        {bars.map((bar, index) => (
          <g key={index}>
            {/* Bar */}
            <rect
              x={bar.x}
              y={bar.y}
              width={bar.width}
              height={bar.height}
              fill={bar.color}
              rx="4"
              className="transition-opacity hover:opacity-80"
            >
              <title>{`${bar.label}: ${bar.value}`}</title>
            </rect>

            {/* Value label on top of bar */}
            {showValues && bar.height > 20 && (
              <text
                x={bar.x + bar.width / 2}
                y={bar.y - 8}
                textAnchor="middle"
                className="text-sm font-semibold fill-gray-700"
              >
                {bar.value}
              </text>
            )}

            {/* X-axis label */}
            <text
              x={bar.x + bar.width / 2}
              y={padding.top + chartHeight + 20}
              textAnchor="middle"
              className="text-xs fill-gray-600"
            >
              {bar.label.length > 12 ? `${bar.label.substring(0, 12)}...` : bar.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

export function BarChartSkeleton({ height = 300 }: { height?: number }) {
  return (
    <div className="bg-white rounded-lg shadow p-6 border border-gray-200 animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
      <div className="bg-gray-100 rounded" style={{ height: `${height}px` }}></div>
    </div>
  );
}

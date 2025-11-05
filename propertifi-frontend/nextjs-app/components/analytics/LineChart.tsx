'use client';

import { useMemo } from 'react';
import type { TimeSeriesDataPoint } from '@/types/analytics';

interface LineChartProps {
  data: TimeSeriesDataPoint[];
  title: string;
  height?: number;
  color?: string;
  showGrid?: boolean;
}

export default function LineChart({
  data,
  title,
  height = 300,
  color = '#4F46E5',
  showGrid = true,
}: LineChartProps) {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return null;

    const maxValue = Math.max(...data.map((d) => d.count));
    const minValue = Math.min(...data.map((d) => d.count));
    const range = maxValue - minValue || 1;

    const padding = { top: 20, right: 20, bottom: 40, left: 50 };
    const chartWidth = 800;
    const chartHeight = height - padding.top - padding.bottom;
    const chartWidthInner = chartWidth - padding.left - padding.right;

    const points = data.map((point, index) => {
      const x = padding.left + (index / (data.length - 1 || 1)) * chartWidthInner;
      const y = padding.top + chartHeight - ((point.count - minValue) / range) * chartHeight;
      return { x, y, ...point };
    });

    const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

    const areaData = `${pathData} L ${points[points.length - 1].x} ${padding.top + chartHeight} L ${padding.left} ${padding.top + chartHeight} Z`;

    return {
      points,
      pathData,
      areaData,
      maxValue,
      minValue,
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

  const { points, pathData, areaData, maxValue, minValue, padding, chartWidth, chartHeight } = chartData;

  return (
    <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>

      <svg
        width="100%"
        height={height}
        viewBox={`0 0 ${chartWidth} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        className="overflow-visible"
      >
        {/* Grid lines */}
        {showGrid && (
          <g className="grid">
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
                    {Math.round(minValue + (maxValue - minValue) * ratio)}
                  </text>
                </g>
              );
            })}
          </g>
        )}

        {/* Area fill */}
        <path
          d={areaData}
          fill={color}
          fillOpacity="0.1"
        />

        {/* Line */}
        <path
          d={pathData}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {points.map((point, index) => (
          <g key={index}>
            <circle
              cx={point.x}
              cy={point.y}
              r="4"
              fill="white"
              stroke={color}
              strokeWidth="2"
            />
            <title>{`${point.label || point.date}: ${point.count}`}</title>
          </g>
        ))}

        {/* X-axis labels */}
        {points.map((point, index) => {
          // Show every nth label to avoid crowding
          const showLabel = data.length <= 7 || index % Math.ceil(data.length / 7) === 0;
          if (!showLabel) return null;

          const date = new Date(point.date);
          const label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

          return (
            <text
              key={index}
              x={point.x}
              y={padding.top + chartHeight + 20}
              textAnchor="middle"
              className="text-xs fill-gray-600"
            >
              {label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

export function LineChartSkeleton({ height = 300 }: { height?: number }) {
  return (
    <div className="bg-white rounded-lg shadow p-6 border border-gray-200 animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
      <div className="bg-gray-100 rounded" style={{ height: `${height}px` }}></div>
    </div>
  );
}

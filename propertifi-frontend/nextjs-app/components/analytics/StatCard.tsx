import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  trend?: {
    value: number;
    label: string;
    direction: 'up' | 'down' | 'neutral';
  };
  color?: 'blue' | 'green' | 'yellow' | 'purple' | 'red' | 'gray';
}

const colorClasses = {
  blue: 'bg-blue-50 text-blue-600',
  green: 'bg-green-50 text-green-600',
  yellow: 'bg-yellow-50 text-yellow-600',
  purple: 'bg-purple-50 text-purple-600',
  red: 'bg-red-50 text-red-600',
  gray: 'bg-gray-50 text-gray-600',
};

export default function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  color = 'blue',
}: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
      <div className="flex items-center justify-between">
        {/* Icon */}
        {icon && (
          <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
            {icon}
          </div>
        )}

        {/* Trend Badge */}
        {trend && (
          <div
            className={`flex items-center gap-1 text-sm font-medium px-2.5 py-1 rounded-full ${
              trend.direction === 'up'
                ? 'bg-green-100 text-green-700'
                : trend.direction === 'down'
                ? 'bg-red-100 text-red-700'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            {trend.direction === 'up' && (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            )}
            {trend.direction === 'down' && (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            )}
            {trend.value > 0 ? '+' : ''}{trend.value}%
          </div>
        )}
      </div>

      {/* Title */}
      <div className="mt-4">
        <p className="text-sm font-medium text-gray-600">{title}</p>

        {/* Value */}
        <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>

        {/* Subtitle */}
        {subtitle && (
          <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
        )}

        {/* Trend Label */}
        {trend && (
          <p className="mt-2 text-xs text-gray-500">{trend.label}</p>
        )}
      </div>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow p-6 border border-gray-200 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
        <div className="w-16 h-6 bg-gray-200 rounded-full"></div>
      </div>
      <div className="mt-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-24"></div>
        <div className="h-8 bg-gray-200 rounded w-20"></div>
        <div className="h-3 bg-gray-200 rounded w-32"></div>
      </div>
    </div>
  );
}

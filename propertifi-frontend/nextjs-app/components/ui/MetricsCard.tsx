import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';

interface MetricsCardProps {
  title: string;
  value: number;
  comparisonValue: number;
  comparisonText: string;
}

export default function MetricsCard({ title, value, comparisonValue, comparisonText }: MetricsCardProps) {
  const isPositive = value >= comparisonValue;
  const percentageChange = Math.abs(((value - comparisonValue) / comparisonValue) * 100).toFixed(1);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-medium text-gray-500">{title}</h3>
      <div className="mt-2 flex items-baseline">
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
        <div className={`ml-2 flex items-baseline text-sm font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? (
            <ArrowUpIcon className="h-5 w-5 self-center text-green-500" />
          ) : (
            <ArrowDownIcon className="h-5 w-5 self-center text-red-500" />
          )}
          <span className="sr-only"> {isPositive ? 'Increased by' : 'Decreased by'} </span>
          {percentageChange}%
        </div>
      </div>
      <p className="text-sm text-gray-500">{comparisonText}</p>
    </div>
  );
}
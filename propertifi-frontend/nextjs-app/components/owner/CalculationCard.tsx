'use client';

import { motion } from 'framer-motion';
import { format } from 'date-fns';
import {
  CalculatorIcon,
  TrashIcon,
  EyeIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';
import { SavedCalculation, CalculatorType } from '@/types/owner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface CalculationCardProps {
  calculation: SavedCalculation;
  onView?: (calculation: SavedCalculation) => void;
  onDelete?: (calculationId: number) => void;
}

const calculatorTypeLabels: Record<CalculatorType, string> = {
  roi: 'ROI Calculator',
  mortgage: 'Mortgage Calculator',
  rent_vs_buy: 'Rent vs Buy',
  cash_flow: 'Cash Flow Calculator',
};

const calculatorTypeColors: Record<CalculatorType, string> = {
  roi: 'bg-blue-100 text-blue-700 border-blue-200',
  mortgage: 'bg-green-100 text-green-700 border-green-200',
  rent_vs_buy: 'bg-purple-100 text-purple-700 border-purple-200',
  cash_flow: 'bg-orange-100 text-orange-700 border-orange-200',
};

export function CalculationCard({ calculation, onView, onDelete }: CalculationCardProps) {
  // Extract key results to display
  const getKeyResults = () => {
    const { calculator_type, results } = calculation;

    switch (calculator_type) {
      case 'roi':
        return [
          { label: 'ROI', value: `${results.roi || 0}%` },
          { label: 'Annual Return', value: `$${(results.annual_return || 0).toLocaleString()}` },
        ];
      case 'mortgage':
        return [
          { label: 'Monthly Payment', value: `$${(results.monthly_payment || 0).toLocaleString()}` },
          { label: 'Total Interest', value: `$${(results.total_interest || 0).toLocaleString()}` },
        ];
      case 'rent_vs_buy':
        return [
          { label: 'Recommendation', value: results.recommendation || 'N/A' },
          { label: '5-Year Cost Diff', value: `$${(results.cost_difference || 0).toLocaleString()}` },
        ];
      case 'cash_flow':
        return [
          { label: 'Monthly Cash Flow', value: `$${(results.monthly_cash_flow || 0).toLocaleString()}` },
          { label: 'Annual Cash Flow', value: `$${(results.annual_cash_flow || 0).toLocaleString()}` },
        ];
      default:
        return [];
    }
  };

  const keyResults = getKeyResults();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-shadow duration-200"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Badge className={calculatorTypeColors[calculation.calculator_type]}>
              <CalculatorIcon className="h-3 w-3 mr-1" />
              {calculatorTypeLabels[calculation.calculator_type]}
            </Badge>
          </div>
          <h3 className="font-semibold text-lg text-gray-900 mb-1">
            {calculation.title}
          </h3>
        </div>
        {onDelete && (
          <Button
            size="sm"
            variant="ghost"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => onDelete(calculation.id)}
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Key Results */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {keyResults.map((result, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-600 mb-1">{result.label}</p>
            <p className="text-lg font-bold text-gray-900">{result.value}</p>
          </div>
        ))}
      </div>

      {/* Notes */}
      {calculation.notes && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 line-clamp-2">{calculation.notes}</p>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center text-xs text-gray-500">
          <CalendarIcon className="h-4 w-4 mr-1" />
          {format(new Date(calculation.created_at), 'MMM dd, yyyy')}
        </div>
        {onView && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => onView(calculation)}
          >
            <EyeIcon className="h-4 w-4 mr-1" />
            View Details
          </Button>
        )}
      </div>
    </motion.div>
  );
}

import React from 'react';
import { Income } from '@/types/calculators/roi';
import { CurrencyInput, PercentInput } from './index';

interface IncomeSectionProps {
  data: Income;
  onChange: (data: Income) => void;
}

export function IncomeSection({ data, onChange }: IncomeSectionProps) {
  const annualRent = data.monthlyRent * 12;
  const annualOtherIncome = data.otherIncome * 12;
  const totalAnnualIncome = annualRent + annualOtherIncome;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Rental Income
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Enter expected rental income and any additional revenue sources.
        </p>
      </div>

      {/* Monthly Rent */}
      <CurrencyInput
        label="Monthly Rent"
        value={data.monthlyRent}
        onChange={(monthlyRent) => onChange({ ...data, monthlyRent })}
        required
        min={0}
        helpText="Expected monthly rental income"
      />

      {/* Annual Rent Increase */}
      <PercentInput
        label="Annual Rent Increase"
        value={data.annualRentIncrease}
        onChange={(annualRentIncrease) => onChange({ ...data, annualRentIncrease })}
        min={0}
        max={20}
        step={0.1}
        helpText="Expected yearly rent increase (typical: 2-4%)"
      />

      {/* Other Monthly Income */}
      <CurrencyInput
        label="Other Monthly Income"
        value={data.otherIncome}
        onChange={(otherIncome) => onChange({ ...data, otherIncome })}
        min={0}
        helpText="Laundry, parking, storage, pet fees, etc."
      />

      {/* Income Projection Examples */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="text-sm font-medium text-gray-700 mb-3">
          5-Year Rent Projection
        </div>
        <div className="space-y-2 text-sm">
          {[1, 2, 3, 4, 5].map((year) => {
            const projectedRent =
              data.monthlyRent * Math.pow(1 + data.annualRentIncrease / 100, year - 1);
            return (
              <div key={year} className="flex justify-between">
                <span className="text-gray-600">Year {year}:</span>
                <span className="font-medium">${projectedRent.toFixed(0)}/month</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Annual Income Summary */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="text-sm font-medium text-gray-700 mb-3">
          Annual Gross Income (Year 1)
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Rental Income:</span>
            <span className="font-medium">${annualRent.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Other Income:</span>
            <span className="font-medium">${annualOtherIncome.toLocaleString()}</span>
          </div>
          <div className="border-t border-gray-300 pt-2 mt-2 flex justify-between">
            <span className="font-semibold text-gray-900">Total Annual:</span>
            <span className="font-bold text-gray-900">
              ${totalAnnualIncome.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Helpful Tips */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start">
          <svg
            className="h-5 w-5 text-amber-600 mt-0.5 mr-2 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div className="text-sm text-amber-800">
            <p className="font-medium mb-1">Income Tips</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Research comparable rentals in the area</li>
              <li>Consider seasonality and local market trends</li>
              <li>Account for rent control laws if applicable</li>
              <li>Be conservative with rent increase estimates</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

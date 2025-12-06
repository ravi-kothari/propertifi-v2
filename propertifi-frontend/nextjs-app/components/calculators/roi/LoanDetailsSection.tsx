import React from 'react';
import { LoanDetails } from '@/types/calculators/roi';
import { CurrencyInput, PercentInput, NumericInput } from './index';

interface LoanDetailsSectionProps {
  data: LoanDetails;
  onChange: (data: LoanDetails) => void;
}

export function LoanDetailsSection({ data, onChange }: LoanDetailsSectionProps) {
  const handlePurchasePriceChange = (purchasePrice: number) => {
    const loanAmount = purchasePrice - data.downPayment;
    const downPaymentPercent = purchasePrice > 0 ? (data.downPayment / purchasePrice) * 100 : 0;
    onChange({
      ...data,
      purchasePrice,
      loanAmount,
      downPaymentPercent,
    });
  };

  const handleDownPaymentChange = (downPayment: number) => {
    const loanAmount = data.purchasePrice - downPayment;
    const downPaymentPercent = data.purchasePrice > 0 ? (downPayment / data.purchasePrice) * 100 : 0;
    onChange({
      ...data,
      downPayment,
      loanAmount,
      downPaymentPercent,
    });
  };

  const handleDownPaymentPercentChange = (percent: number) => {
    const downPayment = (data.purchasePrice * percent) / 100;
    const loanAmount = data.purchasePrice - downPayment;
    onChange({
      ...data,
      downPayment,
      downPaymentPercent: percent,
      loanAmount,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Loan Details
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Enter the purchase price and financing details for your investment property.
        </p>
      </div>

      {/* Purchase Price */}
      <CurrencyInput
        label="Purchase Price"
        value={data.purchasePrice}
        onChange={handlePurchasePriceChange}
        required
        min={0}
        helpText="Total price of the property"
      />

      {/* Down Payment - Two inputs side by side */}
      <div className="grid grid-cols-2 gap-4">
        <CurrencyInput
          label="Down Payment"
          value={data.downPayment}
          onChange={handleDownPaymentChange}
          required
          min={0}
          max={data.purchasePrice}
          helpText="Cash down payment"
        />
        <PercentInput
          label="Down Payment %"
          value={data.downPaymentPercent}
          onChange={handleDownPaymentPercentChange}
          required
          min={0}
          max={100}
          helpText="Percentage of purchase price"
        />
      </div>

      {/* Loan Amount (calculated, read-only) */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-sm font-medium text-gray-700">Loan Amount</div>
            <div className="text-xs text-gray-500 mt-1">
              Calculated: Purchase Price - Down Payment
            </div>
          </div>
          <div className="text-2xl font-bold text-blue-600">
            ${data.loanAmount.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Interest Rate and Loan Term */}
      <div className="grid grid-cols-2 gap-4">
        <PercentInput
          label="Interest Rate"
          value={data.interestRate}
          onChange={(interestRate) => onChange({ ...data, interestRate })}
          required
          min={0}
          max={30}
          step={0.01}
          helpText="Annual interest rate"
        />
        <NumericInput
          label="Loan Term"
          value={data.loanTerm}
          onChange={(loanTerm) => onChange({ ...data, loanTerm })}
          required
          min={1}
          max={40}
          suffix="years"
          helpText="Typical: 15 or 30 years"
        />
      </div>

      {/* Loan Points and Closing Costs */}
      <div className="grid grid-cols-2 gap-4">
        <PercentInput
          label="Loan Points"
          value={data.loanPoints}
          onChange={(loanPoints) => onChange({ ...data, loanPoints })}
          min={0}
          max={10}
          step={0.01}
          helpText="Upfront points paid (% of loan)"
        />
        <CurrencyInput
          label="Closing Costs"
          value={data.closingCosts}
          onChange={(closingCosts) => onChange({ ...data, closingCosts })}
          required
          min={0}
          helpText="Total closing costs"
        />
      </div>

      {/* Total Cash Needed Summary */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="text-sm font-medium text-gray-700 mb-3">
          Total Cash Needed at Closing
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Down Payment:</span>
            <span className="font-medium">${data.downPayment.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Loan Points:</span>
            <span className="font-medium">
              ${((data.loanAmount * data.loanPoints) / 100).toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Closing Costs:</span>
            <span className="font-medium">${data.closingCosts.toLocaleString()}</span>
          </div>
          <div className="border-t border-gray-300 pt-2 mt-2 flex justify-between">
            <span className="font-semibold text-gray-900">Total:</span>
            <span className="font-bold text-gray-900">
              ${(
                data.downPayment +
                (data.loanAmount * data.loanPoints) / 100 +
                data.closingCosts
              ).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

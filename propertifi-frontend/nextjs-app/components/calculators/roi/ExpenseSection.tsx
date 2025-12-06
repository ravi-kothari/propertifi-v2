import React from 'react';
import { Expenses } from '@/types/calculators/roi';
import { CurrencyInput, PercentInput } from './index';

interface ExpenseSectionProps {
  data: Expenses;
  onChange: (data: Expenses) => void;
  monthlyRent: number;
}

export function ExpenseSection({ data, onChange, monthlyRent }: ExpenseSectionProps) {
  // Calculate derived values for display
  const monthlyPropertyManagement = (monthlyRent * data.propertyManagementFee) / 100;
  const monthlyMaintenance = (monthlyRent * data.maintenanceReserve) / 100;
  const annualTotal =
    data.propertyTaxes +
    data.homeInsurance +
    data.landlordInsurance +
    (data.hoaFees * 12) +
    (monthlyPropertyManagement * 12) +
    (monthlyMaintenance * 12) +
    (data.capexReserve * 12);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Operating Expenses
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Enter all expected operating expenses. These do not include mortgage payments.
        </p>
      </div>

      {/* Property Taxes */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-800">Property Taxes</h3>
        <div className="grid grid-cols-2 gap-4">
          <CurrencyInput
            label="Annual Property Taxes"
            value={data.propertyTaxes}
            onChange={(propertyTaxes) => onChange({ ...data, propertyTaxes })}
            required
            min={0}
            helpText="Annual property tax bill"
          />
          <PercentInput
            label="Annual Tax Increase Rate"
            value={data.propertyTaxIncreaseRate}
            onChange={(propertyTaxIncreaseRate) =>
              onChange({ ...data, propertyTaxIncreaseRate })
            }
            min={0}
            max={20}
            step={0.1}
            helpText="Expected yearly increase"
          />
        </div>
      </div>

      {/* Insurance */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-800">Insurance</h3>
        <div className="grid grid-cols-2 gap-4">
          <CurrencyInput
            label="Home Insurance"
            value={data.homeInsurance}
            onChange={(homeInsurance) => onChange({ ...data, homeInsurance })}
            required
            min={0}
            helpText="Annual home insurance"
          />
          <CurrencyInput
            label="Landlord Insurance"
            value={data.landlordInsurance}
            onChange={(landlordInsurance) => onChange({ ...data, landlordInsurance })}
            min={0}
            helpText="Annual landlord/rental insurance"
          />
        </div>
      </div>

      {/* HOA Fees */}
      <CurrencyInput
        label="HOA Fees"
        value={data.hoaFees}
        onChange={(hoaFees) => onChange({ ...data, hoaFees })}
        min={0}
        helpText="Monthly HOA or condo fees (if applicable)"
      />

      {/* Property Management */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-800">Management & Reserves</h3>
        <PercentInput
          label="Property Management Fee"
          value={data.propertyManagementFee}
          onChange={(propertyManagementFee) =>
            onChange({ ...data, propertyManagementFee })
          }
          min={0}
          max={50}
          step={0.1}
          helpText={`% of monthly rent (\$${monthlyPropertyManagement.toFixed(0)}/month)`}
        />
        <PercentInput
          label="Maintenance Reserve"
          value={data.maintenanceReserve}
          onChange={(maintenanceReserve) => onChange({ ...data, maintenanceReserve })}
          min={0}
          max={50}
          step={0.1}
          helpText={`% of monthly rent (\$${monthlyMaintenance.toFixed(0)}/month)`}
        />
        <CurrencyInput
          label="CapEx Reserve"
          value={data.capexReserve}
          onChange={(capexReserve) => onChange({ ...data, capexReserve })}
          min={0}
          helpText="Monthly capital expenditure reserve"
        />
      </div>

      {/* Vacancy Rate */}
      <PercentInput
        label="Vacancy Rate"
        value={data.vacancyRate}
        onChange={(vacancyRate) => onChange({ ...data, vacancyRate })}
        required
        min={0}
        max={100}
        step={0.1}
        helpText="Expected percentage of time property will be vacant"
      />

      {/* Total Annual Expenses Summary */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="text-sm font-medium text-gray-700 mb-3">
          Annual Operating Expenses
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Property Taxes:</span>
            <span className="font-medium">${data.propertyTaxes.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Insurance:</span>
            <span className="font-medium">
              ${(data.homeInsurance + data.landlordInsurance).toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">HOA Fees:</span>
            <span className="font-medium">${(data.hoaFees * 12).toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Property Management:</span>
            <span className="font-medium">
              ${(monthlyPropertyManagement * 12).toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Maintenance Reserve:</span>
            <span className="font-medium">
              ${(monthlyMaintenance * 12).toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">CapEx Reserve:</span>
            <span className="font-medium">${(data.capexReserve * 12).toLocaleString()}</span>
          </div>
          <div className="border-t border-gray-300 pt-2 mt-2 flex justify-between">
            <span className="font-semibold text-gray-900">Total Annual:</span>
            <span className="font-bold text-gray-900">${annualTotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>Monthly Average:</span>
            <span>${(annualTotal / 12).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

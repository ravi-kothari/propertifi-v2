'use client';

import React from 'react';
import { YearlyProjection } from '@/types/calculators/roi';

interface ProjectionsTableProps {
  projections: YearlyProjection[];
}

export function ProjectionsTable({ projections }: ProjectionsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Year
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Gross Income
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Expenses
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              NOI
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Debt Service
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Cash Flow
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Property Value
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Loan Balance
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Equity
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              ROI %
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {projections.map((projection) => (
            <tr key={projection.year} className="hover:bg-gray-50">
              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                {projection.year}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-700">
                ${projection.grossIncome.toLocaleString()}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-700">
                ${projection.operatingExpenses.toLocaleString()}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-700">
                ${projection.noi.toLocaleString()}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-700">
                ${projection.debtService.toLocaleString()}
              </td>
              <td className={`px-4 py-3 whitespace-nowrap text-sm text-right font-medium ${
                projection.cashFlow >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                ${projection.cashFlow.toLocaleString()}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-700">
                ${projection.propertyValue.toLocaleString()}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-700">
                ${projection.loanBalance.toLocaleString()}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-medium text-blue-600">
                ${projection.equity.toLocaleString()}
              </td>
              <td className={`px-4 py-3 whitespace-nowrap text-sm text-right font-medium ${
                projection.roi >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {projection.roi.toFixed(2)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

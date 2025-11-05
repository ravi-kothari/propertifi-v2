
'use client';

import React, { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import ROIChart from './ROIChart';
import CashFlowChart from './CashFlowChart';

const ROICalculator = () => {
  const { register, watch } = useForm();
  const [results, setResults] = useState<any>(null);

  const calculateROI = (data: any) => {
    const { purchasePrice, downPayment, interestRate, loanTerm, monthlyRent, vacancyRate, propertyTaxes, insurance, hoaFees, maintenance, propertyManagementFee } = data;

    const loanAmount = purchasePrice - downPayment;
    const monthlyInterestRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;
    const monthlyMortgage = loanAmount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);

    const grossIncome = monthlyRent * 12;
    const vacancyLoss = grossIncome * (vacancyRate / 100);
    const effectiveGrossIncome = grossIncome - vacancyLoss;

    const totalExpenses = (propertyTaxes / 12 + insurance / 12 + hoaFees + maintenance + (monthlyRent * (propertyManagementFee / 100))) * 12;
    const netOperatingIncome = effectiveGrossIncome - totalExpenses;

    const cashFlow = netOperatingIncome - (monthlyMortgage * 12);
    const cashOnCashReturn = (cashFlow / downPayment) * 100;
    const capRate = (netOperatingIncome / purchasePrice) * 100;

    setResults({
      monthlyMortgage: monthlyMortgage.toFixed(2),
      netOperatingIncome: netOperatingIncome.toFixed(2),
      cashFlow: cashFlow.toFixed(2),
      cashOnCashReturn: cashOnCashReturn.toFixed(2),
      capRate: capRate.toFixed(2),
      chartData: {
        roi: {
          labels: ['Cash on Cash Return', 'Cap Rate'],
          datasets: [
            {
              label: 'ROI',
              data: [cashOnCashReturn, capRate],
              backgroundColor: ['rgba(54, 162, 235, 0.2)', 'rgba(255, 99, 132, 0.2)'],
            },
          ],
        },
        cashFlow: {
          labels: Array.from({ length: loanTerm }, (_, i) => `Year ${i + 1}`),
          datasets: [
            {
              label: 'Cash Flow',
              data: Array.from({ length: loanTerm }, (_, i) => cashFlow * (i + 1)),
              borderColor: 'rgb(75, 192, 192)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
            },
          ],
        },
      },
    });
  };

  const formData = watch();

  useMemo(() => {
    calculateROI(formData);
  }, [formData]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Calculator Inputs</h3>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Purchase Price</label>
            <input type="number" {...register('purchasePrice', { valueAsNumber: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Down Payment</label>
            <input type="number" {...register('downPayment', { valueAsNumber: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Interest Rate (%)</label>
            <input type="number" {...register('interestRate', { valueAsNumber: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Loan Term (years)</label>
            <input type="number" {...register('loanTerm', { valueAsNumber: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Monthly Rent</label>
            <input type="number" {...register('monthlyRent', { valueAsNumber: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Vacancy Rate (%)</label>
            <input type="number" {...register('vacancyRate', { valueAsNumber: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Property Taxes (annual)</label>
            <input type="number" {...register('propertyTaxes', { valueAsNumber: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Insurance (annual)</label>
            <input type="number" {...register('insurance', { valueAsNumber: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">HOA Fees (monthly)</label>
            <input type="number" {...register('hoaFees', { valueAsNumber: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Maintenance (monthly)</label>
            <input type="number" {...register('maintenance', { valueAsNumber: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Property Management Fee (%)</label>
            <input type="number" {...register('propertyManagementFee', { valueAsNumber: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
          </div>
        </form>
      </div>
      <div className="space-y-8">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Results</h3>
          {results && (
            <div className="space-y-2">
              <p><strong>Monthly Mortgage:</strong> ${results.monthlyMortgage}</p>
              <p><strong>Net Operating Income:</strong> ${results.netOperatingIncome}</p>
              <p><strong>Cash Flow:</strong> ${results.cashFlow}</p>
              <p><strong>Cash on Cash Return:</strong> {results.cashOnCashReturn}%</p>
              <p><strong>Cap Rate:</strong> {results.capRate}%</p>
            </div>
          )}
        </div>
        {results && (
          <div className="bg-white shadow-lg rounded-lg p-6">
            <ROIChart data={results.chartData.roi} />
          </div>
        )}
        {results && (
          <div className="bg-white shadow-lg rounded-lg p-6">
            <CashFlowChart data={results.chartData.cashFlow} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ROICalculator;

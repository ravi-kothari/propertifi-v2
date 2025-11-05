'use client';

import { useState } from 'react';
import CalculatorForm from './CalculatorForm';
import { CalculatorResults } from './CalculatorResults';

export default function ROICalculator() {
  const [formData, setFormData] = useState({
    purchasePrice: 0,
    downPayment: 0,
    monthlyRent: 0,
    monthlyExpenses: 0,
  });

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const calculateResults = () => {
    const { purchasePrice, downPayment, monthlyRent, monthlyExpenses } = formData;
    if (!purchasePrice || !downPayment || !monthlyRent || !monthlyExpenses) {
      return null;
    }

    const annualRent = monthlyRent * 12;
    const annualExpenses = monthlyExpenses * 12;
    const netOperatingIncome = annualRent - annualExpenses;
    const capRate = netOperatingIncome / purchasePrice;
    const totalInvestment = downPayment;
    const annualCashFlow = netOperatingIncome;
    const cashOnCashReturn = annualCashFlow / totalInvestment;
    const annualROI = cashOnCashReturn;
    const monthlyCashFlow = annualCashFlow / 12;

    return {
      annualROI,
      monthlyCashFlow,
      annualCashFlow,
      capRate,
      cashOnCashReturn,
      totalInvestment,
    };
  };

  const results = calculateResults();

  return (
    <div>
      <h1 className="text-3xl font-semibold text-gray-800">ROI Calculator</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <CalculatorForm onFormChange={handleFormChange} />
        <CalculatorResults results={results} />
      </div>
    </div>
  );
}
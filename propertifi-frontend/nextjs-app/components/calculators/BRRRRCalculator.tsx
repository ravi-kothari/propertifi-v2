'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import jsPDF from "jspdf";

export default function BRRRRCalculator() {
  const [formData, setFormData] = useState({
    purchasePrice: 150000,
    downPayment: 30000, // Cash used for purchase
    closingCosts: 5000,
    rehabCosts: 40000,
    rehabDuration: 6, // months
    arv: 250000, // After Repair Value
    refinanceLTV: 75, // % Loan to Value for new loan
    refinanceRate: 7.0, // % Interest rate for new loan
    monthlyRent: 2200,
    monthlyExpenses: 800, // Tax, Insurance, Maintenance, etc. (excluding mortgage)
  });

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: Number(e.target.value),
    });
  };

  const calculateResults = () => {
    const { 
      purchasePrice, downPayment, closingCosts, rehabCosts, rehabDuration,
      arv, refinanceLTV, refinanceRate, monthlyRent, monthlyExpenses 
    } = formData;

    // 1. Total Capital Invested (Initial Cash Needed)
    const totalInitialCash = downPayment + closingCosts + rehabCosts;

    // 2. Refinance Numbers
    const newLoanAmount = arv * (refinanceLTV / 100);
    const originalLoanAmount = purchasePrice - downPayment;
    
    // Cash Out = New Loan - Payoff Old Loan
    // Assuming we pay off the original loan balance (simplified, ignoring original loan principal paydown during rehab)
    const cashOutRefi = newLoanAmount - originalLoanAmount;
    
    // Cash Left in Deal = Total Initial Cash - (New Loan - Old Loan)
    // Actually, simpler: Total Invested - Cash Recouped
    // Cash Recouped = New Loan Amount - Old Loan Payoff
    // Wait, simpler way to think:
    // Total Project Cost = Purchase Price + Closing + Rehab
    // Cash Left = Total Project Cost - New Loan Amount
    const totalProjectCost = purchasePrice + closingCosts + rehabCosts;
    const cashLeftInDeal = Math.max(0, totalProjectCost - newLoanAmount);
    
    const cashRecouped = totalInitialCash - cashLeftInDeal;
    const percentCashRecouped = (cashRecouped / totalInitialCash) * 100;

    // 3. Rental Cash Flow (Post-Refinance)
    const monthlyRate = refinanceRate / 100 / 12;
    const n = 30 * 12; // 30 year fixed assumption
    const newMonthlyMortgage = (newLoanAmount * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);
    
    const totalMonthlyExpenses = monthlyExpenses + newMonthlyMortgage;
    const monthlyCashFlow = monthlyRent - totalMonthlyExpenses;
    const annualCashFlow = monthlyCashFlow * 12;

    // 4. ROI
    // Cash on Cash Return = Annual Cash Flow / Cash Left in Deal
    // If Cash Left is 0 (Perfect BRRRR), ROI is infinite
    let cashOnCashROI = 0;
    let isInfinite = false;
    
    if (cashLeftInDeal <= 0) {
      isInfinite = true;
    } else {
      cashOnCashROI = (annualCashFlow / cashLeftInDeal) * 100;
    }

    return {
      totalInitialCash,
      totalProjectCost,
      newLoanAmount,
      cashLeftInDeal,
      cashRecouped,
      percentCashRecouped,
      monthlyMortgage: newMonthlyMortgage,
      monthlyCashFlow,
      annualCashFlow,
      cashOnCashROI,
      isInfinite,
      equity: arv - newLoanAmount
    };
  };

  const results = calculateResults();

  const handleExport = () => {
    const doc = new jsPDF();
    doc.text("BRRRR Calculator Results", 20, 20);
    doc.text(`Purchase Price: $${formData.purchasePrice.toLocaleString()}`, 20, 30);
    doc.text(`Rehab Costs: $${formData.rehabCosts.toLocaleString()}`, 20, 40);
    doc.text(`After Repair Value (ARV): $${formData.arv.toLocaleString()}`, 20, 50);
    doc.text("------------------------------------------------", 20, 60);
    doc.text(`Total Initial Investment: $${results.totalInitialCash.toLocaleString()}`, 20, 70);
    doc.text(`New Loan Amount: $${results.newLoanAmount.toLocaleString()}`, 20, 80);
    doc.text(`Cash Left in Deal: $${results.cashLeftInDeal.toLocaleString()}`, 20, 90);
    doc.text(`Monthly Cash Flow: $${results.monthlyCashFlow.toFixed(2)}`, 20, 100);
    
    const roiText = results.isInfinite ? "Infinite" : `${results.cashOnCashROI.toFixed(2)}%`;
    doc.text(`Cash on Cash ROI: ${roiText}`, 20, 110);
    
    doc.save("brrrr-analysis.pdf");
  };

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="space-y-6">
          
          {/* Purchase Phase */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-blue-900 border-b border-blue-100 pb-2">1. Buy</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Price</label>
                <input
                  type="number"
                  name="purchasePrice"
                  value={formData.purchasePrice}
                  onChange={handleFormChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Down Payment</label>
                <input
                  type="number"
                  name="downPayment"
                  value={formData.downPayment}
                  onChange={handleFormChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Closing Costs</label>
                <input
                  type="number"
                  name="closingCosts"
                  value={formData.closingCosts}
                  onChange={handleFormChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
          </div>

          {/* Rehab Phase */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-blue-900 border-b border-blue-100 pb-2">2. Rehab</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rehab Costs</label>
                <input
                  type="number"
                  name="rehabCosts"
                  value={formData.rehabCosts}
                  onChange={handleFormChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ARV (After Repair)</label>
                <input
                  type="number"
                  name="arv"
                  value={formData.arv}
                  onChange={handleFormChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
          </div>

          {/* Refinance Phase */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-blue-900 border-b border-blue-100 pb-2">3. Refinance</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Loan LTV %</label>
                <input
                  type="number"
                  name="refinanceLTV"
                  value={formData.refinanceLTV}
                  onChange={handleFormChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Interest Rate %</label>
                <input
                  type="number"
                  step="0.1"
                  name="refinanceRate"
                  value={formData.refinanceRate}
                  onChange={handleFormChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
          </div>

          {/* Rent Phase */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-blue-900 border-b border-blue-100 pb-2">4. Rent</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Rent</label>
                <input
                  type="number"
                  name="monthlyRent"
                  value={formData.monthlyRent}
                  onChange={handleFormChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Exp. (No Debt)</label>
                <input
                  type="number"
                  name="monthlyExpenses"
                  value={formData.monthlyExpenses}
                  onChange={handleFormChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Results Section */}
        <div className="bg-gray-50 rounded-xl p-6 lg:p-8 flex flex-col h-full">
          <div className="mb-8 text-center">
            <h3 className="text-gray-500 font-medium mb-2">Cash on Cash ROI (Post-Refi)</h3>
            <div className={`text-5xl font-bold ${results.isInfinite ? 'text-purple-600' : 'text-green-600'}`}>
              {results.isInfinite ? '∞ Infinite' : `${results.cashOnCashROI.toFixed(2)}%`}
            </div>
            <div className="text-sm text-gray-500 mt-2">
              Annual Cash Flow: {formatCurrency(results.annualCashFlow)}
            </div>
          </div>

          <div className="space-y-6 flex-grow">
            {/* Cash Analysis */}
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <h4 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">Cash Analysis</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Project Cost</span>
                  <span className="font-medium">{formatCurrency(results.totalProjectCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Initial Cash Invested</span>
                  <span className="font-medium text-red-600">-{formatCurrency(results.totalInitialCash)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">New Loan Amount</span>
                  <span className="font-medium text-blue-600">+{formatCurrency(results.newLoanAmount)}</span>
                </div>
                <div className="border-t pt-2 mt-2 flex justify-between font-bold">
                  <span>Cash Left in Deal</span>
                  <span className={results.cashLeftInDeal === 0 ? 'text-green-600' : 'text-red-600'}>
                    {formatCurrency(results.cashLeftInDeal)}
                  </span>
                </div>
              </div>
            </div>

            {/* Equity Analysis */}
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <h4 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">Equity & Cash Flow</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Instant Equity</span>
                  <span className="font-medium text-green-600">+{formatCurrency(results.equity)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Monthly Cash Flow</span>
                  <span className="font-medium text-green-600">+{formatCurrency(results.monthlyCashFlow)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <Button className="w-full" onClick={handleExport}>
              <ArrowDownTrayIcon className="mr-2 h-4 w-4" />
              Export BRRRR Report
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

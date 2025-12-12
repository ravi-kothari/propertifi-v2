'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import jsPDF from "jspdf";

export default function STRCalculator() {
  const [formData, setFormData] = useState({
    // Revenue
    nightlyRate: 250,
    occupancyRate: 70, // %
    // Long Term Comparison
    longTermRent: 3500, // Monthly
    
    // Startup Costs
    furnishingCost: 15000,
    
    // Operating Expenses
    managementFeePercent: 20, // STR management is usually 20-30%
    cleaningFeePerStay: 120,
    avgStaysPerMonth: 6,
    utilities: 300, // Monthly (Owner pays for STR)
    internet: 80,
    supplies: 100, // Toilet paper, coffee, etc.
    platformFeePercent: 3, // Airbnb host fee approx
    
    // Property Expenses (Fixed)
    mortgage: 2500,
    propertyTax: 500,
    insurance: 200, // STR insurance is higher
  });

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: Number(e.target.value),
    });
  };

  const calculateResults = () => {
    const { 
      nightlyRate, occupancyRate, longTermRent, furnishingCost,
      managementFeePercent, cleaningFeePerStay, avgStaysPerMonth,
      utilities, internet, supplies, platformFeePercent,
      mortgage, propertyTax, insurance
    } = formData;

    // STR Revenue
    const daysOccupied = 30 * (occupancyRate / 100);
    const grossMonthlyRevenue = nightlyRate * daysOccupied;
    // Note: Cleaning fees are usually passed through, but let's assume they wash out or are included in gross for simplicity here, 
    // OR strictly: Revenue = (Rate * Nights) + (CleaningFee * Stays). Expense = CleaningCost * Stays.
    // Let's assume Nightly Rate is the base rate revenue.
    
    // STR Variable Expenses
    const monthlyCleaningCost = cleaningFeePerStay * avgStaysPerMonth;
    const monthlyManagementFee = grossMonthlyRevenue * (managementFeePercent / 100);
    const monthlyPlatformFee = grossMonthlyRevenue * (platformFeePercent / 100);
    const monthlySupplies = supplies;
    const monthlyUtilities = utilities + internet;
    
    const totalVariableExpenses = monthlyCleaningCost + monthlyManagementFee + monthlyPlatformFee + monthlySupplies + monthlyUtilities;
    
    // Fixed Expenses
    const totalFixedExpenses = mortgage + propertyTax + insurance;
    
    // Net Operating Income (STR)
    const strNetIncome = grossMonthlyRevenue - totalVariableExpenses - totalFixedExpenses;
    
    // Long Term Rental Comparison
    // LTR Expenses (Owner usually doesn't pay utilities, management is lower ~8-10%)
    const ltrManagementFee = longTermRent * 0.08; 
    const ltrMaintenance = longTermRent * 0.05; // 5% reserve
    const ltrNetIncome = longTermRent - (mortgage + propertyTax + (insurance * 0.7)) - ltrManagementFee - ltrMaintenance; 
    // Assuming LTR insurance is 30% cheaper

    return {
      grossMonthlyRevenue,
      totalVariableExpenses,
      totalFixedExpenses,
      strNetIncome,
      ltrNetIncome,
      difference: strNetIncome - ltrNetIncome,
      annualDifference: (strNetIncome - ltrNetIncome) * 12,
      breakEvenOccupancy: ((totalVariableExpenses + totalFixedExpenses) / 30) / nightlyRate * 100 // Rough approx
    };
  };

  const results = calculateResults();
  const isSTRBetter = results.strNetIncome > results.ltrNetIncome;

  const handleExport = () => {
    const doc = new jsPDF();
    doc.text("Airbnb / STR Calculator Results", 20, 20);
    doc.text(`Nightly Rate: $${formData.nightlyRate}`, 20, 30);
    doc.text(`Occupancy Rate: ${formData.occupancyRate}%`, 20, 40);
    doc.text(`Gross Monthly Revenue: $${results.grossMonthlyRevenue.toLocaleString()}`, 20, 50);
    doc.text("------------------------------------------------", 20, 60);
    doc.text(`STR Monthly Net Income: $${results.strNetIncome.toLocaleString(undefined, {maximumFractionDigits: 2})}`, 20, 70);
    doc.text(`Long-Term Monthly Net Income: $${results.ltrNetIncome.toLocaleString(undefined, {maximumFractionDigits: 2})}`, 20, 80);
    
    doc.setFontSize(14);
    const verdict = isSTRBetter ? "STR is More Profitable" : "Long-Term is More Profitable";
    doc.text(`Verdict: ${verdict} by $${Math.abs(results.difference).toLocaleString(undefined, {maximumFractionDigits: 0})}/mo`, 20, 100);
    
    doc.save("str-analysis.pdf");
  };

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="space-y-6">
          
          {/* Revenue Assumptions */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-blue-900 border-b border-blue-100 pb-2">Revenue Assumptions</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nightly Rate</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    name="nightlyRate"
                    value={formData.nightlyRate}
                    onChange={handleFormChange}
                    className="block w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Occupancy Rate %</label>
                <input
                  type="number"
                  name="occupancyRate"
                  value={formData.occupancyRate}
                  onChange={handleFormChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
          </div>

          {/* Operating Expenses */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-blue-900 border-b border-blue-100 pb-2">Operating Expenses (Monthly)</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Utilities & Internet</label>
                <input
                  type="number"
                  name="utilities"
                  value={formData.utilities + formData.internet} // Simplified input
                  onChange={(e) => setFormData({...formData, utilities: Number(e.target.value)})}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Management Fee %</label>
                <input
                  type="number"
                  name="managementFeePercent"
                  value={formData.managementFeePercent}
                  onChange={handleFormChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Supplies & Restocking</label>
                <input
                  type="number"
                  name="supplies"
                  value={formData.supplies}
                  onChange={handleFormChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cleaning Fees (Total)</label>
                <input
                  type="number"
                  value={formData.cleaningFeePerStay * formData.avgStaysPerMonth}
                  disabled
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 sm:text-sm cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">Calc: Fee * {formData.avgStaysPerMonth} stays</p>
              </div>
            </div>
          </div>

          {/* Comparison */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-blue-900 border-b border-blue-100 pb-2">Long-Term Comparison</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Est. Long-Term Monthly Rent</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  name="longTermRent"
                  value={formData.longTermRent}
                  onChange={handleFormChange}
                  className="block w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Results Section */}
        <div className="bg-gray-50 rounded-xl p-6 lg:p-8 flex flex-col h-full">
          <div className="mb-8 text-center">
            <h3 className="text-gray-500 font-medium mb-2">Monthly Net Income (STR)</h3>
            <div className="text-5xl font-bold text-blue-600">
              {formatCurrency(results.strNetIncome)}
            </div>
            <div className={`text-sm font-medium mt-2 ${isSTRBetter ? 'text-green-600' : 'text-red-600'}`}>
              {isSTRBetter ? '+' : ''}{formatCurrency(results.difference)} vs. Long-Term Rental
            </div>
          </div>

          <div className="space-y-6 flex-grow">
            {/* Revenue Breakdown */}
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <h4 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">Short-Term Metrics</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Gross Revenue</span>
                  <span className="font-medium text-green-600">+{formatCurrency(results.grossMonthlyRevenue)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Operating Expenses</span>
                  <span className="font-medium text-red-600">-{formatCurrency(results.totalVariableExpenses)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Mortgage & Fixed</span>
                  <span className="font-medium text-red-600">-{formatCurrency(results.totalFixedExpenses)}</span>
                </div>
              </div>
            </div>

            {/* Long Term Comparison */}
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <h4 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">Long-Term Comparison</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Long-Term Rent</span>
                  <span className="font-medium">{formatCurrency(formData.longTermRent)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Net Income (LTR)</span>
                  <span className="font-medium text-blue-600">{formatCurrency(results.ltrNetIncome)}</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-bold">
                    <span>Annual "Airbnb Bonus"</span>
                    <span className={results.annualDifference > 0 ? 'text-green-600' : 'text-red-600'}>
                      {results.annualDifference > 0 ? '+' : ''}{formatCurrency(results.annualDifference)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <Button className="w-full" onClick={handleExport}>
              <ArrowDownTrayIcon className="mr-2 h-4 w-4" />
              Export Analysis PDF
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

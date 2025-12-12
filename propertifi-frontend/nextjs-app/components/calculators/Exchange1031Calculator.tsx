'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import jsPDF from "jspdf";

export default function Exchange1031Calculator() {
  const [formData, setFormData] = useState({
    salePrice: 1000000,
    sellingExpenses: 60000, // ~6% commissions + closing
    mortgagePayoff: 400000,
    originalPrice: 600000,
    improvements: 50000,
    depreciationTaken: 150000,
    capitalGainsRate: 20, // %
    stateTaxRate: 5, // %
    depreciationRecaptureRate: 25, // % (Fixed by IRS usually)
  });

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: Number(e.target.value),
    });
  };

  const calculateResults = () => {
    const { 
      salePrice, sellingExpenses, mortgagePayoff, 
      originalPrice, improvements, depreciationTaken,
      capitalGainsRate, stateTaxRate, depreciationRecaptureRate 
    } = formData;

    // 1. Calculate Gain
    const adjustedBasis = originalPrice + improvements - depreciationTaken;
    const netSalePrice = salePrice - sellingExpenses; // "Contract Price" for 1031 purposes usually excludes non-transactional costs, simplifying here
    const realizedGain = netSalePrice - adjustedBasis;

    // 2. Calculate Potential Tax Liability (If NOT Exchanged)
    const depreciationRecaptureTax = depreciationTaken * (depreciationRecaptureRate / 100);
    const remainingGain = realizedGain - depreciationTaken; // Capital Gain portion
    const federalCapitalGainsTax = Math.max(0, remainingGain) * (capitalGainsRate / 100);
    const stateTax = realizedGain * (stateTaxRate / 100);
    const njitTax = realizedGain * 0.038; // Net Investment Income Tax (NIIT) 3.8% for high earners
    
    // Simplified Total Tax:
    const totalEstimatedTax = depreciationRecaptureTax + federalCapitalGainsTax + stateTax + njitTax;

    // 3. 1031 Exchange Requirements
    // To defer ALL tax:
    // 1. Reinvest ALL Net Proceeds (Equity)
    // 2. Acquire replacement property of EQUAL or GREATER value than Net Sale Price
    
    const cashToReinvest = netSalePrice - mortgagePayoff; // Net Cash Proceeds
    const replacementPropertyValueNeeded = netSalePrice; 
    const newDebtNeeded = Math.max(0, replacementPropertyValueNeeded - cashToReinvest); // Must replace old debt or add cash

    return {
      adjustedBasis,
      realizedGain,
      depreciationRecaptureTax,
      federalCapitalGainsTax,
      stateTax,
      njitTax,
      totalEstimatedTax,
      cashToReinvest,
      replacementPropertyValueNeeded,
      newDebtNeeded
    };
  };

  const results = calculateResults();

  const handleExport = () => {
    const doc = new jsPDF();
    doc.text("1031 Exchange Calculator Results", 20, 20);
    doc.text(`Sale Price: $${formData.salePrice.toLocaleString()}`, 20, 30);
    doc.text(`Original Basis: $${formData.originalPrice.toLocaleString()}`, 20, 40);
    doc.text(`Realized Gain: $${results.realizedGain.toLocaleString()}`, 20, 50);
    doc.text("------------------------------------------------", 20, 60);
    doc.text(`Total Estimated Tax (If Sold): $${results.totalEstimatedTax.toLocaleString(undefined, {maximumFractionDigits: 0})}`, 20, 70);
    doc.text(`   - Depreciation Recapture: $${results.depreciationRecaptureTax.toLocaleString(undefined, {maximumFractionDigits: 0})}`, 25, 80);
    doc.text(`   - Federal Cap Gains: $${results.federalCapitalGainsTax.toLocaleString(undefined, {maximumFractionDigits: 0})}`, 25, 90);
    doc.text("------------------------------------------------", 20, 100);
    doc.text(`EXCHANGE REQUIREMENTS (To Defer 100% Tax):`, 20, 115);
    doc.text(`1. Buy Replacement Property Value >= $${results.replacementPropertyValueNeeded.toLocaleString()}`, 20, 125);
    doc.text(`2. Reinvest Net Cash Proceeds >= $${results.cashToReinvest.toLocaleString()}`, 20, 135);
    
    doc.save("1031-exchange-analysis.pdf");
  };

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="space-y-6">
          
          {/* Sale Details */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-blue-900 border-b border-blue-100 pb-2">Relinquished Property (Sale)</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sale Price</label>
                <input
                  type="number"
                  name="salePrice"
                  value={formData.salePrice}
                  onChange={handleFormChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Selling Expenses</label>
                <input
                  type="number"
                  name="sellingExpenses"
                  value={formData.sellingExpenses}
                  onChange={handleFormChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mortgage Payoff</label>
                <input
                  type="number"
                  name="mortgagePayoff"
                  value={formData.mortgagePayoff}
                  onChange={handleFormChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
          </div>

          {/* Basis Details */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-blue-900 border-b border-blue-100 pb-2">Cost Basis</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Original Price</label>
                <input
                  type="number"
                  name="originalPrice"
                  value={formData.originalPrice}
                  onChange={handleFormChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Improvements (CapEx)</label>
                <input
                  type="number"
                  name="improvements"
                  value={formData.improvements}
                  onChange={handleFormChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Depreciation Taken</label>
                <input
                  type="number"
                  name="depreciationTaken"
                  value={formData.depreciationTaken}
                  onChange={handleFormChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
          </div>

          {/* Tax Rates */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-blue-900 border-b border-blue-100 pb-2">Tax Rates (%)</h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fed Cap Gains</label>
                <input
                  type="number"
                  name="capitalGainsRate"
                  value={formData.capitalGainsRate}
                  onChange={handleFormChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State Tax</label>
                <input
                  type="number"
                  name="stateTaxRate"
                  value={formData.stateTaxRate}
                  onChange={handleFormChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Recapture</label>
                <input
                  type="number"
                  value={formData.depreciationRecaptureRate}
                  disabled
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 sm:text-sm cursor-not-allowed"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Results Section */}
        <div className="bg-gray-50 rounded-xl p-6 lg:p-8 flex flex-col h-full">
          <div className="mb-8 text-center">
            <h3 className="text-gray-500 font-medium mb-2">Estimated Tax Savings</h3>
            <div className="text-5xl font-bold text-green-600">
              {formatCurrency(results.totalEstimatedTax)}
            </div>
            <div className="text-sm text-gray-500 mt-2">
              If you complete a full 1031 Exchange
            </div>
          </div>

          <div className="space-y-6 flex-grow">
            {/* Exchange Requirements */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 shadow-sm">
              <h4 className="font-semibold text-blue-900 mb-3 text-sm uppercase tracking-wide">To Defer 100% Tax:</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-700">Buy Replacement Property Worth</span>
                  <span className="font-bold text-blue-700">≥ {formatCurrency(results.replacementPropertyValueNeeded)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Reinvest Net Cash Proceeds</span>
                  <span className="font-bold text-blue-700">≥ {formatCurrency(results.cashToReinvest)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">New Mortgage / Cash Needed</span>
                  <span className="font-bold text-blue-700">≥ {formatCurrency(results.newDebtNeeded)}</span>
                </div>
              </div>
            </div>

            {/* Tax Breakdown */}
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <h4 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">Tax Liability (If Sold)</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Realized Gain</span>
                  <span className="font-medium">{formatCurrency(results.realizedGain)}</span>
                </div>
                <div className="border-t my-2"></div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Depreciation Recapture</span>
                  <span className="font-medium text-red-600">{formatCurrency(results.depreciationRecaptureTax)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Federal Capital Gains</span>
                  <span className="font-medium text-red-600">{formatCurrency(results.federalCapitalGainsTax)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">State Tax</span>
                  <span className="font-medium text-red-600">{formatCurrency(results.stateTax)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">NIIT (3.8%)</span>
                  <span className="font-medium text-red-600">{formatCurrency(results.njitTax)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <Button className="w-full" onClick={handleExport}>
              <ArrowDownTrayIcon className="mr-2 h-4 w-4" />
              Export Exchange Analysis
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

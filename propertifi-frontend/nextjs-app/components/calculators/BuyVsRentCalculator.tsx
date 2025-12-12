'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import jsPDF from "jspdf";

export default function BuyVsRentCalculator() {
  const [formData, setFormData] = useState({
    monthlyRent: 2500,
    homePrice: 500000,
    years: 5,
    homeAppreciation: 3, // Annual %
    rentIncrease: 2, // Annual %
    investmentReturn: 5, // Annual % on down payment if invested
  });

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: Number(e.target.value),
    });
  };

  const calculateResults = () => {
    const { monthlyRent, homePrice, years, homeAppreciation, rentIncrease, investmentReturn } = formData;

    // Assumptions
    const downPaymentPercent = 0.20;
    const downPayment = homePrice * downPaymentPercent;
    const loanAmount = homePrice - downPayment;
    const interestRate = 6.5; 
    const monthlyRate = interestRate / 100 / 12;
    const loanTermMonths = 30 * 12;

    // 1. Buying Costs
    const monthlyMortgage = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, loanTermMonths)) / (Math.pow(1 + monthlyRate, loanTermMonths) - 1);
    const monthlyPropertyTax = (homePrice * 0.01) / 12;
    const monthlyMaintenance = (homePrice * 0.01) / 12;
    const monthlyInsurance = 100; // Est
    const buyingClosingCosts = homePrice * 0.03; // ~3% closing costs
    const sellingCosts = homePrice * 0.06; // ~6% agent fees when selling

    const totalMonthlyBuyCost = monthlyMortgage + monthlyPropertyTax + monthlyMaintenance + monthlyInsurance;
    const totalBuyOutflow = (totalMonthlyBuyCost * 12 * years) + downPayment + buyingClosingCosts;

    // 2. Equity & Value at End
    const futureHomeValue = homePrice * Math.pow(1 + (homeAppreciation / 100), years);
    
    // Remaining Principal Balance Formula
    const p = years * 12;
    const remainingBalance = loanAmount * (Math.pow(1 + monthlyRate, loanTermMonths) - Math.pow(1 + monthlyRate, p)) / (Math.pow(1 + monthlyRate, loanTermMonths) - 1);
    
    const equity = futureHomeValue - remainingBalance;
    const netBuyCost = totalBuyOutflow - (equity - sellingCosts); // Net cost after selling and paying off loan

    // 3. Renting Costs
    let totalRentPaid = 0;
    let currentRent = monthlyRent;
    for (let i = 0; i < years; i++) {
      totalRentPaid += currentRent * 12;
      currentRent *= (1 + (rentIncrease / 100));
    }
    const rentingInsurance = 15 * 12 * years; // Renters insurance
    const totalRentOutflow = totalRentPaid + rentingInsurance;

    // 4. Opportunity Cost (Investing the Down Payment + Closing Costs)
    const initialInvestment = downPayment + buyingClosingCosts;
    const investmentGains = initialInvestment * Math.pow(1 + (investmentReturn / 100), years) - initialInvestment;
    
    const netRentCost = totalRentOutflow - investmentGains;

    return {
      netBuyCost,
      netRentCost,
      difference: netBuyCost - netRentCost,
      futureHomeValue,
      equity,
      investmentGains
    };
  };

  const results = calculateResults();
  const isBuyingCheaper = results.difference < 0;

  const handleExport = () => {
    const doc = new jsPDF();
    doc.text("Buy vs. Rent Calculator Results", 20, 20);
    doc.text(`Time Horizon: ${formData.years} Years`, 20, 30);
    doc.text(`Home Price: $${formData.homePrice.toLocaleString()}`, 20, 40);
    doc.text(`Starting Rent: $${formData.monthlyRent.toLocaleString()}`, 20, 50);
    doc.text("------------------------------------------------", 20, 60);
    doc.text(`Net Cost to Buy: $${results.netBuyCost.toLocaleString(undefined, {maximumFractionDigits: 0})}`, 20, 70);
    doc.text(`Net Cost to Rent: $${results.netRentCost.toLocaleString(undefined, {maximumFractionDigits: 0})}`, 20, 80);
    doc.text(`Home Equity Gained: $${results.equity.toLocaleString(undefined, {maximumFractionDigits: 0})}`, 20, 90);
    doc.text(`Rent Investment Gains: $${results.investmentGains.toLocaleString(undefined, {maximumFractionDigits: 0})}`, 20, 100);
    
    doc.setFontSize(14);
    const verdict = isBuyingCheaper ? "Buying is Cheaper" : "Renting is Cheaper";
    doc.text(`Verdict: ${verdict} by $${Math.abs(results.difference).toLocaleString(undefined, {maximumFractionDigits: 0})}`, 20, 120);
    
    doc.save("buy-vs-rent-analysis.pdf");
  };

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Assumptions</h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="homePrice" className="block text-sm font-medium text-gray-700 mb-1">Home Price</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  name="homePrice"
                  id="homePrice"
                  value={formData.homePrice}
                  onChange={handleFormChange}
                  className="block w-full pl-7 pr-12 py-2 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="monthlyRent" className="block text-sm font-medium text-gray-700 mb-1">Monthly Rent</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  name="monthlyRent"
                  id="monthlyRent"
                  value={formData.monthlyRent}
                  onChange={handleFormChange}
                  className="block w-full pl-7 pr-12 py-2 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="years" className="block text-sm font-medium text-gray-700 mb-1">Duration (Years)</label>
              <input
                type="range"
                name="years"
                id="years"
                min="1"
                max="30"
                value={formData.years}
                onChange={(e) => setFormData({...formData, years: Number(e.target.value)})}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="text-right text-sm text-gray-500">{formData.years} Years</div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="homeAppreciation" className="block text-sm font-medium text-gray-700 mb-1">Appreciation %</label>
                <input
                  type="number"
                  name="homeAppreciation"
                  id="homeAppreciation"
                  step="0.1"
                  value={formData.homeAppreciation}
                  onChange={handleFormChange}
                  className="block w-full py-2 px-3 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="rentIncrease" className="block text-sm font-medium text-gray-700 mb-1">Rent Increase %</label>
                <input
                  type="number"
                  name="rentIncrease"
                  id="rentIncrease"
                  step="0.1"
                  value={formData.rentIncrease}
                  onChange={handleFormChange}
                  className="block w-full py-2 px-3 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="investmentReturn" className="block text-sm font-medium text-gray-700 mb-1">Investment Return %</label>
              <p className="text-xs text-gray-500 mb-1">Return on down payment if invested instead of buying.</p>
              <input
                type="number"
                name="investmentReturn"
                id="investmentReturn"
                step="0.1"
                value={formData.investmentReturn}
                onChange={handleFormChange}
                className="block w-full py-2 px-3 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="bg-gray-50 rounded-xl p-6 lg:p-8 flex flex-col h-full">
          <div className="mb-8 text-center">
            <h3 className="text-gray-500 font-medium mb-2">Verdict over {formData.years} Years</h3>
            <div className={`text-3xl font-bold ${isBuyingCheaper ? 'text-green-600' : 'text-blue-600'}`}>
              {isBuyingCheaper ? 'Buying' : 'Renting'} is Cheaper
            </div>
            <div className="text-gray-600 mt-1">
              by {formatCurrency(Math.abs(results.difference))}
            </div>
          </div>

          <div className="space-y-4 flex-grow">
            <div className="p-4 bg-white rounded-lg border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-2">Buying Scenario</h4>
              <div className="flex justify-between items-center text-sm mb-1">
                <span className="text-gray-600">Net Cost</span>
                <span className="font-medium text-red-600">-{formatCurrency(results.netBuyCost)}</span>
              </div>
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>Includes equity gained:</span>
                <span className="text-green-600">+{formatCurrency(results.equity)}</span>
              </div>
            </div>

            <div className="p-4 bg-white rounded-lg border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-2">Renting Scenario</h4>
              <div className="flex justify-between items-center text-sm mb-1">
                <span className="text-gray-600">Net Cost</span>
                <span className="font-medium text-red-600">-{formatCurrency(results.netRentCost)}</span>
              </div>
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>Includes investment gains:</span>
                <span className="text-green-600">+{formatCurrency(results.investmentGains)}</span>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <Button className="w-full" onClick={handleExport}>
              <ArrowDownTrayIcon className="mr-2 h-4 w-4" />
              Export PDF Analysis
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

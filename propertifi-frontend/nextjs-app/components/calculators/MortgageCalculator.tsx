'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import jsPDF from "jspdf";

export default function MortgageCalculator() {
  const [formData, setFormData] = useState({
    homePrice: 500000,
    downPayment: 100000,
    interestRate: 6.5,
    loanTerm: 30,
    propertyTax: 5000, // Annual
    homeInsurance: 1500, // Annual
    hoaFees: 0, // Monthly
  });

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: Number(e.target.value),
    });
  };

  const calculateResults = () => {
    const { homePrice, downPayment, interestRate, loanTerm, propertyTax, homeInsurance, hoaFees } = formData;

    const principal = homePrice - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;

    // Mortgage Payment Formula: M = P [i(1+i)^n] / [(1+i)^n - 1]
    const monthlyPrincipalAndInterest =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    const monthlyTax = propertyTax / 12;
    const monthlyInsurance = homeInsurance / 12;
    const totalMonthlyPayment = monthlyPrincipalAndInterest + monthlyTax + monthlyInsurance + hoaFees;

    return {
      principal,
      monthlyPrincipalAndInterest,
      monthlyTax,
      monthlyInsurance,
      totalMonthlyPayment,
    };
  };

  const results = calculateResults();

  const handleExport = () => {
    const doc = new jsPDF();
    doc.text("Mortgage Calculator Results", 20, 20);
    doc.text(`Home Price: $${formData.homePrice.toLocaleString()}`, 20, 30);
    doc.text(`Down Payment: $${formData.downPayment.toLocaleString()}`, 20, 40);
    doc.text(`Loan Amount: $${results.principal.toLocaleString()}`, 20, 50);
    doc.text(`Interest Rate: ${formData.interestRate}%`, 20, 60);
    doc.text(`Loan Term: ${formData.loanTerm} Years`, 20, 70);
    doc.text("------------------------------------------------", 20, 80);
    doc.text(`Monthly Principal & Interest: $${results.monthlyPrincipalAndInterest.toFixed(2)}`, 20, 90);
    doc.text(`Monthly Property Tax: $${results.monthlyTax.toFixed(2)}`, 20, 100);
    doc.text(`Monthly Insurance: $${results.monthlyInsurance.toFixed(2)}`, 20, 110);
    doc.text(`Monthly HOA: $${formData.hoaFees.toFixed(2)}`, 20, 120);
    doc.text(`TOTAL MONTHLY PAYMENT: $${results.totalMonthlyPayment.toFixed(2)}`, 20, 140);
    doc.save("mortgage-calculator-results.pdf");
  };

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Loan Details</h2>
          
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="downPayment" className="block text-sm font-medium text-gray-700 mb-1">Down Payment</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    name="downPayment"
                    id="downPayment"
                    value={formData.downPayment}
                    onChange={handleFormChange}
                    className="block w-full pl-7 pr-12 py-2 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="interestRate" className="block text-sm font-medium text-gray-700 mb-1">Interest Rate (%)</label>
                <input
                  type="number"
                  name="interestRate"
                  id="interestRate"
                  step="0.1"
                  value={formData.interestRate}
                  onChange={handleFormChange}
                  className="block w-full py-2 px-3 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="loanTerm" className="block text-sm font-medium text-gray-700 mb-1">Loan Term</label>
              <select
                name="loanTerm"
                id="loanTerm"
                value={formData.loanTerm}
                onChange={handleFormChange}
                className="block w-full py-2 px-3 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value={30}>30 Years</option>
                <option value={20}>20 Years</option>
                <option value={15}>15 Years</option>
                <option value={10}>10 Years</option>
              </select>
            </div>

            <h3 className="text-lg font-medium text-gray-900 pt-4">Taxes & Insurance (Annual)</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="propertyTax" className="block text-sm font-medium text-gray-700 mb-1">Property Tax</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    name="propertyTax"
                    id="propertyTax"
                    value={formData.propertyTax}
                    onChange={handleFormChange}
                    className="block w-full pl-7 pr-12 py-2 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="homeInsurance" className="block text-sm font-medium text-gray-700 mb-1">Home Insurance</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    name="homeInsurance"
                    id="homeInsurance"
                    value={formData.homeInsurance}
                    onChange={handleFormChange}
                    className="block w-full pl-7 pr-12 py-2 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="hoaFees" className="block text-sm font-medium text-gray-700 mb-1">HOA Fees (Monthly)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  name="hoaFees"
                  id="hoaFees"
                  value={formData.hoaFees}
                  onChange={handleFormChange}
                  className="block w-full pl-7 pr-12 py-2 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="bg-gray-50 rounded-xl p-6 lg:p-8 flex flex-col h-full">
          <div className="mb-8 text-center">
            <h3 className="text-gray-500 font-medium mb-2">Estimated Monthly Payment</h3>
            <div className="text-5xl font-bold text-blue-600">
              {formatCurrency(results.totalMonthlyPayment)}
            </div>
          </div>

          <div className="space-y-4 flex-grow">
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-gray-600">Principal & Interest</span>
              <span className="font-semibold text-gray-900">{formatCurrency(results.monthlyPrincipalAndInterest)}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-gray-600">Property Tax</span>
              <span className="font-semibold text-gray-900">{formatCurrency(results.monthlyTax)}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-gray-600">Home Insurance</span>
              <span className="font-semibold text-gray-900">{formatCurrency(results.monthlyInsurance)}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-gray-600">HOA Fees</span>
              <span className="font-semibold text-gray-900">{formatCurrency(formData.hoaFees)}</span>
            </div>
            
            <div className="mt-8 pt-4">
              <div className="flex justify-between items-center text-sm text-gray-500 mb-2">
                <span>Loan Amount</span>
                <span>{formatCurrency(results.principal)}</span>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>Down Payment</span>
                <span>{formatCurrency(formData.downPayment)} ({((formData.downPayment / formData.homePrice) * 100).toFixed(1)}%)</span>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <Button className="w-full" onClick={handleExport}>
              <ArrowDownTrayIcon className="mr-2 h-4 w-4" />
              Export PDF Report
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

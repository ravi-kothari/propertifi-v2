'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { ArrowDownTrayIcon, BookmarkIcon } from "@heroicons/react/24/outline";
import jsPDF from "jspdf";
import { saveCalculation } from '@/lib/saved-calculations-api';

export default function HouseHackingCalculator() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    purchasePrice: 450000,
    downPayment: 15750,
    interestRate: 6.5,
    loanTerm: 30,
    totalUnits: 2,
    otherUnitsRent: 1800,
    propertyTax: 4500,
    homeInsurance: 1200,
    maintenance: 150,
    capex: 150,
    pmi: 180,
    utilities: 0,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const getAuthToken = () => {
    if (typeof window !== 'undefined') return localStorage.getItem('auth_token');
    return null;
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: Number(e.target.value),
    });
  };

  const calculateResults = () => {
    const {
      purchasePrice, downPayment, interestRate, loanTerm,
      otherUnitsRent, propertyTax, homeInsurance,
      maintenance, capex, pmi, utilities
    } = formData;

    const principal = purchasePrice - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;

    // P&I
    const monthlyPrincipalAndInterest =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    const monthlyTax = propertyTax / 12;
    const monthlyInsurance = homeInsurance / 12;

    // Total Monthly Expenses (PITI + PMI + Reserves)
    const totalMonthlyPITI = monthlyPrincipalAndInterest + monthlyTax + monthlyInsurance + pmi;
    const totalMonthlyExpenses = totalMonthlyPITI + maintenance + capex + utilities;

    // Net Housing Cost = Total Expenses - Rental Income
    const netHousingCost = totalMonthlyExpenses - otherUnitsRent;

    // "Saved" compared to renting elsewhere (assuming you'd pay ~same as unit rent)
    // Or simpler: How much of mortgage is covered?
    const percentCovered = (otherUnitsRent / totalMonthlyExpenses) * 100;

    return {
      monthlyPrincipalAndInterest,
      monthlyTax,
      monthlyInsurance,
      totalMonthlyPITI,
      totalMonthlyExpenses,
      netHousingCost,
      percentCovered,
      isPositive: netHousingCost < 0 // Living for free + profit!
    };
  };

  const results = calculateResults();

  const handleExport = () => {
    const doc = new jsPDF();
    doc.text("House Hacking Calculator Results", 20, 20);
    doc.text(`Purchase Price: $${formData.purchasePrice.toLocaleString()}`, 20, 30);
    doc.text(`Total Units: ${formData.totalUnits}`, 20, 40);
    doc.text(`Rental Income (Other Units): $${formData.otherUnitsRent.toLocaleString()}/mo`, 20, 50);
    doc.text("------------------------------------------------", 20, 60);
    doc.text(`Total Monthly PITI: $${results.totalMonthlyPITI.toLocaleString(undefined, { maximumFractionDigits: 2 })}`, 20, 70);
    doc.text(`Total Operating Expenses: $${results.totalMonthlyExpenses.toLocaleString(undefined, { maximumFractionDigits: 2 })}`, 20, 80);

    doc.setFontSize(14);
    if (results.isPositive) {
      doc.text(`PROFIT: You live for FREE + make $${Math.abs(results.netHousingCost).toLocaleString(undefined, { maximumFractionDigits: 2 })}/mo!`, 20, 100);
    } else {
      doc.text(`Net Cost to Live: $${results.netHousingCost.toLocaleString(undefined, { maximumFractionDigits: 2 })}/mo`, 20, 100);
    }

    doc.save("house-hacking-analysis.pdf");
  };

  const handleSaveClick = async () => {
    const token = getAuthToken();
    if (!token) { router.push('/login?returnUrl=/calculators/house-hacking&message=Please login to save your calculations'); return; }
    setIsSaving(true);
    try {
      await saveCalculation(token, { calculator_type: 'house-hacking', input_data: formData, result_data: results });
      setSaveMessage({ type: 'success', text: 'Calculation saved successfully!' });
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error: any) {
      setSaveMessage({ type: 'error', text: error.message || 'Failed to save calculation' });
      setTimeout(() => setSaveMessage(null), 5000);
    } finally { setIsSaving(false); }
  };

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="space-y-6">

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-blue-900 border-b border-blue-100 pb-2">Deal Details</h2>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Interest Rate %</label>
                <input
                  type="number"
                  step="0.1"
                  name="interestRate"
                  value={formData.interestRate}
                  onChange={handleFormChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Units</label>
                <select
                  name="totalUnits"
                  value={formData.totalUnits}
                  onChange={handleFormChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value={2}>Duplex (2)</option>
                  <option value={3}>Triplex (3)</option>
                  <option value={4}>Fourplex (4)</option>
                  <option value={5}>5+ Units</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-blue-900 border-b border-blue-100 pb-2">Income & Expenses</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rental Income (Other Units)</label>
              <input
                type="number"
                name="otherUnitsRent"
                value={formData.otherUnitsRent}
                onChange={handleFormChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">Total rent from tenants (excluding your unit)</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Property Tax (Yr)</label>
                <input
                  type="number"
                  name="propertyTax"
                  value={formData.propertyTax}
                  onChange={handleFormChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Insurance (Yr)</label>
                <input
                  type="number"
                  name="homeInsurance"
                  value={formData.homeInsurance}
                  onChange={handleFormChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">PMI (Mo)</label>
                <input
                  type="number"
                  name="pmi"
                  value={formData.pmi}
                  onChange={handleFormChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Maint/CapEx (Mo)</label>
                <input
                  type="number"
                  value={formData.maintenance + formData.capex}
                  onChange={(e) => setFormData({ ...formData, maintenance: Number(e.target.value) / 2, capex: Number(e.target.value) / 2 })}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Results Section */}
        <div className="bg-gray-50 rounded-xl p-6 lg:p-8 flex flex-col h-full">
          <div className="mb-8 text-center">
            <h3 className="text-gray-500 font-medium mb-2">Net Monthly Housing Cost</h3>
            <div className={`text-5xl font-bold ${results.isPositive ? 'text-green-600' : 'text-blue-600'}`}>
              {results.isPositive ? '+' : '-'}{formatCurrency(Math.abs(results.netHousingCost))}
            </div>
            <div className="text-sm font-medium mt-2 text-gray-600">
              {results.isPositive ? 'You are living for FREE and getting paid!' : 'Your portion of the mortgage'}
            </div>
          </div>

          <div className="space-y-6 flex-grow">
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                    Expense Coverage
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-blue-600">
                    {results.percentCovered.toFixed(0)}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                <div style={{ width: `${Math.min(results.percentCovered, 100)}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"></div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Monthly Expenses</span>
                <span className="font-semibold text-red-600">{formatCurrency(results.totalMonthlyExpenses)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Rental Income</span>
                <span className="font-semibold text-green-600">{formatCurrency(formData.otherUnitsRent)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold text-gray-900">
                <span>Net Cost</span>
                <span>{formatCurrency(results.netHousingCost)}</span>
              </div>
            </div>
          </div>

          {saveMessage && (<div className={`mb-4 p-3 rounded-lg text-center text-sm font-medium ${saveMessage.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>{saveMessage.text}</div>)}

          <div className="mt-8 space-y-3">
            <Button className="w-full" onClick={handleExport}><ArrowDownTrayIcon className="mr-2 h-4 w-4" />Export Analysis PDF</Button>
            <Button variant="outline" className="w-full" onClick={handleSaveClick} disabled={isSaving}>
              {isSaving ? (<><svg className="animate-spin mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Saving...</>) : (<><BookmarkIcon className="mr-2 h-4 w-4" />Save Calculation</>)}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

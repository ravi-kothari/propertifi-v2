'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { ArrowDownTrayIcon, BookmarkIcon } from "@heroicons/react/24/outline";
import jsPDF from "jspdf";
import { saveCalculation } from '@/lib/saved-calculations-api';

export default function DepreciationCalculator() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    purchasePrice: 500000,
    landValue: 100000,
    placedInServiceDate: new Date().toISOString().split('T')[0],
    propertyType: 'residential',
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
      [e.target.name]: e.target.type === 'number' ? Number(e.target.value) : e.target.value,
    });
  };

  const calculateResults = () => {
    const { purchasePrice, landValue, propertyType } = formData;

    // Depreciation Basis = Purchase Price - Land Value
    // (Land is not depreciable)
    const depreciableBasis = Math.max(0, purchasePrice - landValue);

    // Recovery Period
    const recoveryPeriod = propertyType === 'residential' ? 27.5 : 39;

    // Annual Depreciation
    const annualDepreciation = depreciableBasis / recoveryPeriod;

    // Monthly Depreciation
    const monthlyDepreciation = annualDepreciation / 12;

    return {
      depreciableBasis,
      recoveryPeriod,
      annualDepreciation,
      monthlyDepreciation,
    };
  };

  const results = calculateResults();

  const handleExport = () => {
    const doc = new jsPDF();
    doc.text("Depreciation Calculator Results", 20, 20);
    doc.text(`Purchase Price: $${formData.purchasePrice.toLocaleString()}`, 20, 30);
    doc.text(`Land Value: $${formData.landValue.toLocaleString()}`, 20, 40);
    doc.text(`Property Type: ${formData.propertyType === 'residential' ? 'Residential (27.5 yrs)' : 'Commercial (39 yrs)'}`, 20, 50);
    doc.text("------------------------------------------------", 20, 60);
    doc.text(`Depreciable Basis: $${results.depreciableBasis.toLocaleString()}`, 20, 70);
    doc.text(`Annual Deduction: $${results.annualDepreciation.toLocaleString(undefined, { maximumFractionDigits: 2 })}`, 20, 80);
    doc.text(`Monthly Deduction: $${results.monthlyDepreciation.toLocaleString(undefined, { maximumFractionDigits: 2 })}`, 20, 90);
    doc.save("depreciation-schedule.pdf");
  };

  const handleSaveClick = async () => {
    const token = getAuthToken();
    if (!token) { router.push('/login?returnUrl=/calculators/depreciation&message=Please login to save your calculations'); return; }
    setIsSaving(true);
    try {
      await saveCalculation(token, { calculator_type: 'depreciation', input_data: formData, result_data: results });
      setSaveMessage({ type: 'success', text: 'Calculation saved successfully!' });
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error: any) {
      setSaveMessage({ type: 'error', text: error.message || 'Failed to save calculation' });
      setTimeout(() => setSaveMessage(null), 5000);
    } finally { setIsSaving(false); }
  };

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Property Details</h2>

          <div className="space-y-4">
            <div>
              <label htmlFor="purchasePrice" className="block text-sm font-medium text-gray-700 mb-1">Purchase Price</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  name="purchasePrice"
                  id="purchasePrice"
                  value={formData.purchasePrice}
                  onChange={handleFormChange}
                  className="block w-full pl-7 pr-12 py-2 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="landValue" className="block text-sm font-medium text-gray-700 mb-1">Land Value</label>
              <p className="text-xs text-gray-500 mb-1">Land is not depreciable. Estimate usually 15-25% of price.</p>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  name="landValue"
                  id="landValue"
                  value={formData.landValue}
                  onChange={handleFormChange}
                  className="block w-full pl-7 pr-12 py-2 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
              <select
                name="propertyType"
                id="propertyType"
                value={formData.propertyType}
                onChange={handleFormChange}
                className="block w-full py-2 px-3 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="residential">Residential Rental (27.5 Years)</option>
                <option value="commercial">Commercial Property (39 Years)</option>
              </select>
            </div>

            <div>
              <label htmlFor="placedInServiceDate" className="block text-sm font-medium text-gray-700 mb-1">Date Placed in Service</label>
              <input
                type="date"
                name="placedInServiceDate"
                id="placedInServiceDate"
                value={formData.placedInServiceDate}
                onChange={handleFormChange}
                className="block w-full py-2 px-3 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="bg-gray-50 rounded-xl p-6 lg:p-8 flex flex-col h-full">
          <div className="mb-8 text-center">
            <h3 className="text-gray-500 font-medium mb-2">Annual Tax Deduction</h3>
            <div className="text-5xl font-bold text-blue-600">
              {formatCurrency(results.annualDepreciation)}
            </div>
            <div className="text-sm text-gray-500 mt-2">
              For {results.recoveryPeriod} years
            </div>
          </div>

          <div className="space-y-4 flex-grow">
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-gray-600">Depreciable Basis</span>
              <span className="font-semibold text-gray-900">{formatCurrency(results.depreciableBasis)}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-gray-600">Monthly Deduction</span>
              <span className="font-semibold text-gray-900">{formatCurrency(results.monthlyDepreciation)}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-gray-600">Land Allocation</span>
              <span className="font-semibold text-gray-900">{((formData.landValue / formData.purchasePrice) * 100).toFixed(1)}%</span>
            </div>

            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-sm text-blue-800">
                <strong>Tip:</strong> Depreciation is a non-cash expense that reduces your taxable income, effectively increasing your cash flow.
              </p>
            </div>
          </div>

          {saveMessage && (<div className={`mb-4 p-3 rounded-lg text-center text-sm font-medium ${saveMessage.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>{saveMessage.text}</div>)}

          <div className="mt-8 space-y-3">
            <Button className="w-full" onClick={handleExport}><ArrowDownTrayIcon className="mr-2 h-4 w-4" />Export PDF Schedule</Button>
            <Button variant="outline" className="w-full" onClick={handleSaveClick} disabled={isSaving}>
              {isSaving ? (<><svg className="animate-spin mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Saving...</>) : (<><BookmarkIcon className="mr-2 h-4 w-4" />Save Calculation</>)}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

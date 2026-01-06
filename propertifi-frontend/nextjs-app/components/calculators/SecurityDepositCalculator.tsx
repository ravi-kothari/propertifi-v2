'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { ArrowDownTrayIcon, PlusIcon, TrashIcon, BookmarkIcon } from "@heroicons/react/24/outline";
import jsPDF from "jspdf";
import { saveCalculation } from '@/lib/saved-calculations-api';

interface Deduction {
  id: number;
  description: string;
  amount: number;
  category: 'cleaning' | 'repairs' | 'unpaid_rent' | 'other';
}

export default function SecurityDepositCalculator() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    depositAmount: 2000,
    interestRate: 0,
    tenancyDurationMonths: 12,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const getAuthToken = () => { if (typeof window !== 'undefined') return localStorage.getItem('auth_token'); return null; };

  const [deductions, setDeductions] = useState<Deduction[]>([
    { id: 1, description: 'Professional Cleaning', amount: 250, category: 'cleaning' },
  ]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: Number(e.target.value),
    });
  };

  const handleDeductionChange = (id: number, field: keyof Deduction, value: string | number) => {
    setDeductions(deductions.map(d =>
      d.id === id ? { ...d, [field]: value } : d
    ));
  };

  const addDeduction = () => {
    setDeductions([
      ...deductions,
      { id: Date.now(), description: '', amount: 0, category: 'repairs' }
    ]);
  };

  const removeDeduction = (id: number) => {
    setDeductions(deductions.filter(d => d.id !== id));
  };

  const calculateResults = () => {
    const { depositAmount, interestRate, tenancyDurationMonths } = formData;

    // Calculate Interest (Simple Interest)
    // Interest = Principal * Rate * Time(years)
    const accruedInterest = depositAmount * (interestRate / 100) * (tenancyDurationMonths / 12);

    const totalDepositWithInterest = depositAmount + accruedInterest;

    const totalDeductions = deductions.reduce((sum, d) => sum + d.amount, 0);

    const refundAmount = totalDepositWithInterest - totalDeductions;
    const balanceDue = refundAmount < 0 ? Math.abs(refundAmount) : 0;
    const finalRefund = Math.max(0, refundAmount);

    return {
      accruedInterest,
      totalDepositWithInterest,
      totalDeductions,
      finalRefund,
      balanceDue,
      isRefund: refundAmount >= 0
    };
  };

  const results = calculateResults();

  const handleExport = () => {
    const doc = new jsPDF();
    doc.text("Security Deposit Refund Statement", 20, 20);

    doc.setFontSize(12);
    doc.text(`Original Deposit: $${formData.depositAmount.toLocaleString()}`, 20, 40);
    doc.text(`Accrued Interest (${formData.interestRate}%): $${results.accruedInterest.toFixed(2)}`, 20, 50);
    doc.text(`Total Credit: $${results.totalDepositWithInterest.toLocaleString(undefined, { maximumFractionDigits: 2 })}`, 20, 60);

    doc.text("Itemized Deductions:", 20, 80);
    let yPos = 90;
    deductions.forEach(d => {
      doc.text(`- ${d.description || 'Item'}: $${d.amount.toFixed(2)}`, 25, yPos);
      yPos += 10;
    });

    doc.text("------------------------------------------------", 20, yPos);
    yPos += 10;

    doc.setFontSize(14);
    if (results.isRefund) {
      doc.text(`TOTAL REFUND DUE TO TENANT: $${results.finalRefund.toLocaleString(undefined, { maximumFractionDigits: 2 })}`, 20, yPos + 10);
    } else {
      doc.text(`BALANCE DUE FROM TENANT: $${results.balanceDue.toLocaleString(undefined, { maximumFractionDigits: 2 })}`, 20, yPos + 10);
    }

    doc.save("security-deposit-statement.pdf");
  };

  const handleSaveClick = async () => {
    const token = getAuthToken();
    if (!token) { router.push('/login?returnUrl=/calculators/security-deposit&message=Please login'); return; }
    setIsSaving(true);
    try {
      await saveCalculation(token, { calculator_type: 'security-deposit', input_data: { ...formData, deductions }, result_data: results });
      setSaveMessage({ type: 'success', text: 'Saved!' }); setTimeout(() => setSaveMessage(null), 3000);
    } catch (error: any) {
      setSaveMessage({ type: 'error', text: error.message || 'Failed' }); setTimeout(() => setSaveMessage(null), 5000);
    } finally { setIsSaving(false); }
  };

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="space-y-6">

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-blue-900 border-b border-blue-100 pb-2">Deposit Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Original Deposit</label>
                <input
                  type="number"
                  name="depositAmount"
                  value={formData.depositAmount}
                  onChange={handleFormChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Interest Rate %</label>
                <input
                  type="number"
                  name="interestRate"
                  step="0.1"
                  value={formData.interestRate}
                  onChange={handleFormChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tenancy Duration (Months)</label>
              <input
                type="number"
                name="tenancyDurationMonths"
                value={formData.tenancyDurationMonths}
                onChange={handleFormChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-blue-100 pb-2">
              <h2 className="text-lg font-semibold text-blue-900">Deductions</h2>
              <button
                onClick={addDeduction}
                className="text-sm flex items-center text-blue-600 hover:text-blue-800 font-medium"
              >
                <PlusIcon className="w-4 h-4 mr-1" /> Add Item
              </button>
            </div>

            {deductions.map((deduction, index) => (
              <div key={deduction.id} className="flex gap-2 items-start bg-gray-50 p-3 rounded-md">
                <div className="flex-grow space-y-2">
                  <input
                    type="text"
                    placeholder="Description (e.g. Carpet Cleaning)"
                    value={deduction.description}
                    onChange={(e) => handleDeductionChange(deduction.id, 'description', e.target.value)}
                    className="block w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm"
                  />
                  <div className="flex gap-2">
                    <select
                      value={deduction.category}
                      onChange={(e) => handleDeductionChange(deduction.id, 'category', e.target.value)}
                      className="block w-1/2 px-2 py-1.5 border border-gray-300 rounded-md text-sm"
                    >
                      <option value="cleaning">Cleaning</option>
                      <option value="repairs">Repairs</option>
                      <option value="unpaid_rent">Unpaid Rent</option>
                      <option value="other">Other</option>
                    </select>
                    <div className="relative w-1/2">
                      <span className="absolute left-2 top-1.5 text-gray-500 text-sm">$</span>
                      <input
                        type="number"
                        placeholder="0.00"
                        value={deduction.amount}
                        onChange={(e) => handleDeductionChange(deduction.id, 'amount', Number(e.target.value))}
                        className="block w-full pl-6 px-2 py-1.5 border border-gray-300 rounded-md text-sm"
                      />
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => removeDeduction(deduction.id)}
                  className="text-gray-400 hover:text-red-500 mt-2"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            ))}

            {deductions.length === 0 && (
              <p className="text-sm text-gray-500 italic text-center py-2">No deductions added.</p>
            )}
          </div>

        </div>

        {/* Results Section */}
        <div className="bg-gray-50 rounded-xl p-6 lg:p-8 flex flex-col h-full">
          <div className="mb-8 text-center">
            <h3 className="text-gray-500 font-medium mb-2">
              {results.isRefund ? 'Refund Due to Tenant' : 'Balance Due from Tenant'}
            </h3>
            <div className={`text-5xl font-bold ${results.isRefund ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(results.isRefund ? results.finalRefund : results.balanceDue)}
            </div>
          </div>

          <div className="space-y-6 flex-grow">
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Original Deposit</span>
                <span className="font-medium">{formatCurrency(formData.depositAmount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Accrued Interest ({formData.interestRate}%)</span>
                <span className="font-medium text-green-600">+{formatCurrency(results.accruedInterest)}</span>
              </div>
              <div className="border-t pt-2 mt-2"></div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 font-medium">Total Credit</span>
                <span className="font-bold">{formatCurrency(results.totalDepositWithInterest)}</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600 font-medium">Total Deductions</span>
                <span className="font-bold text-red-600">-{formatCurrency(results.totalDeductions)}</span>
              </div>

              {deductions.length > 0 && (
                <div className="pl-2 border-l-2 border-gray-100 space-y-1 mt-2">
                  {deductions.map(d => (
                    <div key={d.id} className="flex justify-between text-xs text-gray-500">
                      <span>{d.description || d.category}</span>
                      <span>{formatCurrency(d.amount)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {saveMessage && (<div className={`mb-4 p-3 rounded-lg text-center text-sm font-medium ${saveMessage.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>{saveMessage.text}</div>)}

          <div className="mt-8 space-y-3">
            <Button className="w-full" onClick={handleExport}><ArrowDownTrayIcon className="mr-2 h-4 w-4" />Generate Statement PDF</Button>
            <Button variant="outline" className="w-full" onClick={handleSaveClick} disabled={isSaving}>
              {isSaving ? (<><svg className="animate-spin mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Saving...</>) : (<><BookmarkIcon className="mr-2 h-4 w-4" />Save Calculation</>)}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

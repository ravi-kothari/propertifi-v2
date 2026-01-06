'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { ArrowDownTrayIcon, BookmarkIcon } from "@heroicons/react/24/outline";
import jsPDF from "jspdf";
import { saveCalculation } from '@/lib/saved-calculations-api';

export default function LeaseBuyoutCalculator() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    currentRent: 2500,
    monthsRemaining: 6,
    marketRent: 2700,
    estimatedVacancyWeeks: 4,
    reLettingCosts: 500,
    securityDeposit: 2500,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const getAuthToken = () => { if (typeof window !== 'undefined') return localStorage.getItem('auth_token'); return null; };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: Number(e.target.value),
    });
  };

  const calculateResults = () => {
    const {
      currentRent, monthsRemaining, marketRent,
      estimatedVacancyWeeks, reLettingCosts
    } = formData;

    // 1. Tenant's Maximum Liability (Remaining Rent)
    const totalRemainingRent = currentRent * monthsRemaining;

    // 2. Landlord's Cost to Turnover (Vacancy + Fees)
    const vacancyCost = (marketRent / 4) * estimatedVacancyWeeks; // Weekly rent * weeks
    const totalTurnoverCost = vacancyCost + reLettingCosts;

    // 3. Potential Gain for Landlord (If Market Rent > Current Rent)
    const monthlyGain = Math.max(0, marketRent - currentRent);
    const totalGainOverTerm = monthlyGain * (monthsRemaining - (estimatedVacancyWeeks / 4));

    // 4. Fair Buyout Price
    // Logic: Landlord shouldn't lose money, Tenant wants to save money.
    // Base: Turnover Costs - Potential Gain from higher rent
    let fairBuyout = totalTurnoverCost - totalGainOverTerm;

    // Safety buffer (Landlord incentive)
    const convenienceFee = currentRent * 0.5; // Half a month rent as "profit" / risk premium
    fairBuyout += convenienceFee;

    // If result is negative (Market rent implies huge gain), 
    // floor it at maybe 1 month rent or turnover cost to cover immediate cash flow gap.
    fairBuyout = Math.max(currentRent, fairBuyout);

    // Cap at remaining rent (otherwise tenant stays)
    fairBuyout = Math.min(fairBuyout, totalRemainingRent);

    return {
      totalRemainingRent,
      totalTurnoverCost,
      totalGainOverTerm,
      fairBuyout,
      tenantSavings: totalRemainingRent - fairBuyout
    };
  };

  const results = calculateResults();

  const handleExport = () => {
    const doc = new jsPDF();
    doc.text("Lease Buyout Calculator Results", 20, 20);
    doc.text(`Current Rent: $${formData.currentRent.toLocaleString()}`, 20, 30);
    doc.text(`Months Remaining: ${formData.monthsRemaining}`, 20, 40);
    doc.text(`Market Rent: $${formData.marketRent.toLocaleString()}`, 20, 50);
    doc.text("------------------------------------------------", 20, 60);
    doc.text(`Total Remaining Liability: $${results.totalRemainingRent.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, 20, 70);
    doc.text(`Est. Landlord Turnover Cost: $${results.totalTurnoverCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, 20, 80);

    doc.setFontSize(14);
    doc.text(`Recommended Buyout Price: $${results.fairBuyout.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, 20, 100);
    doc.setFontSize(10);
    doc.text(`(Tenant saves approx. $${results.tenantSavings.toLocaleString(undefined, { maximumFractionDigits: 0 })})`, 20, 110);

    doc.save("lease-buyout-analysis.pdf");
  };

  const handleSaveClick = async () => {
    const token = getAuthToken();
    if (!token) { router.push('/login?returnUrl=/calculators/lease-buyout&message=Please login'); return; }
    setIsSaving(true);
    try {
      await saveCalculation(token, { calculator_type: 'lease-buyout', input_data: formData, result_data: results });
      setSaveMessage({ type: 'success', text: 'Saved!' }); setTimeout(() => setSaveMessage(null), 3000);
    } catch (error: any) {
      setSaveMessage({ type: 'error', text: error.message || 'Failed' }); setTimeout(() => setSaveMessage(null), 5000);
    } finally { setIsSaving(false); }
  };

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="space-y-6">

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-blue-900 border-b border-blue-100 pb-2">Lease Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Monthly Rent</label>
                <input
                  type="number"
                  name="currentRent"
                  value={formData.currentRent}
                  onChange={handleFormChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Months Remaining</label>
                <input
                  type="number"
                  name="monthsRemaining"
                  value={formData.monthsRemaining}
                  onChange={handleFormChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-blue-900 border-b border-blue-100 pb-2">Market & Turnover</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Market Rent</label>
                <p className="text-xs text-gray-500 mb-1">Rent for new tenant</p>
                <input
                  type="number"
                  name="marketRent"
                  value={formData.marketRent}
                  onChange={handleFormChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vacancy Time (Weeks)</label>
                <p className="text-xs text-gray-500 mb-1">Time to find new tenant</p>
                <input
                  type="number"
                  name="estimatedVacancyWeeks"
                  value={formData.estimatedVacancyWeeks}
                  onChange={handleFormChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Re-Letting Costs</label>
                <p className="text-xs text-gray-500 mb-1">Marketing, cleaning, fees</p>
                <input
                  type="number"
                  name="reLettingCosts"
                  value={formData.reLettingCosts}
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
            <h3 className="text-gray-500 font-medium mb-2">Recommended Buyout Price</h3>
            <div className="text-5xl font-bold text-blue-600">
              {formatCurrency(results.fairBuyout)}
            </div>
            <div className="text-sm text-gray-500 mt-2">
              Tenant saves: <span className="text-green-600 font-semibold">{formatCurrency(results.tenantSavings)}</span>
            </div>
          </div>

          <div className="space-y-6 flex-grow">
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Remaining Rent</span>
                <span className="font-semibold text-red-600">{formatCurrency(results.totalRemainingRent)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Est. Turnover Cost</span>
                <span className="font-medium text-gray-900">{formatCurrency(results.totalTurnoverCost)}</span>
              </div>
              {results.totalGainOverTerm > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Gain from Higher Rent</span>
                  <span className="font-medium text-green-600">-{formatCurrency(results.totalGainOverTerm)}</span>
                </div>
              )}
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-sm text-blue-800">
                <strong>Why this price?</strong> It covers the landlord's vacancy and turnover costs while offering the tenant significant savings compared to paying out the full lease term.
              </p>
            </div>
          </div>

          {saveMessage && (<div className={`mb-4 p-3 rounded-lg text-center text-sm font-medium ${saveMessage.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>{saveMessage.text}</div>)}

          <div className="mt-8 space-y-3">
            <Button className="w-full" onClick={handleExport}><ArrowDownTrayIcon className="mr-2 h-4 w-4" />Export Proposal</Button>
            <Button variant="outline" className="w-full" onClick={handleSaveClick} disabled={isSaving}>
              {isSaving ? (<><svg className="animate-spin mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Saving...</>) : (<><BookmarkIcon className="mr-2 h-4 w-4" />Save Calculation</>)}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

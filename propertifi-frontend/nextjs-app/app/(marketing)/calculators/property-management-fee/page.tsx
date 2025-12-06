'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  PMFeeInputs,
  defaultPMFeeInputs,
  PMFeeResults,
  PropertyType,
} from '@/types/calculators/pm-fee';
import { calculatePMFees } from '@/lib/calculators/pm-fee/calculations';
import { trackCalculatorView, trackCalculatorUsed, trackCTAClick, trackSaveAttempt } from '@/lib/analytics';
import { saveCalculation } from '@/lib/saved-calculations-api';
import { useRouter } from 'next/navigation';

const PROPERTY_TYPES: { value: PropertyType; label: string }[] = [
  { value: 'single-family', label: 'Single Family Home' },
  { value: 'multi-family', label: 'Multi-Family (2-4 units)' },
  { value: 'condo', label: 'Condo' },
  { value: 'townhouse', label: 'Townhouse' },
];

export default function PropertyManagementFeeCalculator() {
  const [inputs, setInputs] = useState<PMFeeInputs>(defaultPMFeeInputs);
  const [results, setResults] = useState<PMFeeResults | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const router = useRouter();

  React.useEffect(() => {
    trackCalculatorView('pm-fee');
  }, []);

  // Load saved calculation if available
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const loadData = localStorage.getItem('loadCalculation');
      if (loadData) {
        try {
          const savedCalc = JSON.parse(loadData);
          if (savedCalc.calculator_type === 'pm-fee' && savedCalc.input_data) {
            setInputs(savedCalc.input_data);
            setResults(savedCalc.result_data || null);
            localStorage.removeItem('loadCalculation');
            setSaveMessage({ type: 'success', text: `Loaded: ${savedCalc.name}` });
            setTimeout(() => setSaveMessage(null), 3000);
          }
        } catch (err) {
          console.error('Error loading saved calculation:', err);
        }
      }
    }
  }, []);

  const getAuthToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  };

  const handleCalculate = () => {
    const calculatedResults = calculatePMFees(inputs);
    setResults(calculatedResults);
    trackCalculatorUsed('pm-fee', {
      property_type: inputs.propertyType,
      num_units: inputs.numberOfUnits,
      monthly_rent: inputs.monthlyRent,
    });
  };

  const handleReset = () => {
    setInputs(defaultPMFeeInputs);
    setResults(null);
  };

  const handleSaveClick = async () => {
    const token = getAuthToken();

    if (!token) {
      trackSaveAttempt('pm-fee', false);
      router.push('/login?returnUrl=/calculators/property-management-fee&message=Please login to save your calculations');
      return;
    }

    if (!results) {
      setSaveMessage({ type: 'error', text: 'Please calculate results before saving.' });
      setTimeout(() => setSaveMessage(null), 3000);
      return;
    }

    setIsSaving(true);
    trackSaveAttempt('pm-fee', true);

    try {
      await saveCalculation(token, {
        calculator_type: 'pm-fee',
        input_data: inputs,
        result_data: results,
      });

      setSaveMessage({ type: 'success', text: 'Calculation saved successfully!' });
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error: any) {
      console.error('Error saving calculation:', error);
      setSaveMessage({ type: 'error', text: error.message || 'Failed to save calculation' });
      setTimeout(() => setSaveMessage(null), 5000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/calculators"
            className="inline-flex items-center text-sm text-gray-600 hover:text-blue-600 mb-4"
          >
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Calculators
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Property Management Fee Calculator
          </h1>
          <p className="text-lg text-gray-600">
            Estimate the cost of professional property management for your rental property.
            Compare different fee structures and get personalized recommendations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Inputs */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Property Details
            </h2>

            {/* Property Type */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Type
              </label>
              <select
                value={inputs.propertyType}
                onChange={(e) =>
                  setInputs({ ...inputs, propertyType: e.target.value as PropertyType })
                }
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
              >
                {PROPERTY_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Monthly Rent */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monthly Rent per Unit
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">$</span>
                </div>
                <input
                  type="number"
                  value={inputs.monthlyRent}
                  onChange={(e) =>
                    setInputs({ ...inputs, monthlyRent: Number(e.target.value) })
                  }
                  className="block w-full rounded-md border-gray-300 pl-7 pr-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="2000"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Average monthly rent per unit
              </p>
            </div>

            {/* Number of Units */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Units
              </label>
              <input
                type="number"
                value={inputs.numberOfUnits}
                onChange={(e) =>
                  setInputs({ ...inputs, numberOfUnits: Number(e.target.value) })
                }
                min={1}
                className="block w-full rounded-md border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                placeholder="1"
              />
              <p className="mt-1 text-xs text-gray-500">
                Total number of rental units
              </p>
            </div>

            {/* Total Monthly Income Display */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm text-gray-600">Total Monthly Income</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {inputs.numberOfUnits} unit(s) × ${inputs.monthlyRent}
                  </div>
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  ${(inputs.monthlyRent * inputs.numberOfUnits).toLocaleString()}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleCalculate}
                className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Calculate Fees
              </button>
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Right Column - Results */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Fee Estimates
            </h2>

            {results ? (
              <div className="space-y-6">
                {/* Market Average */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="text-sm font-medium text-gray-700 mb-2">
                    Market Average
                  </div>
                  <div className="flex items-baseline gap-2">
                    <div className="text-3xl font-bold text-green-600">
                      {results.marketAverage.percentageFee}%
                    </div>
                    <div className="text-lg text-gray-600">
                      (${results.marketAverage.monthlyDollarAmount.toFixed(0)}/month)
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    Typical for {inputs.propertyType.replace('-', ' ')} properties
                  </div>
                </div>

                {/* Fee Structure Options */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">
                    Fee Structure Options
                  </h3>
                  <div className="space-y-3">
                    {results.estimates.map((estimate, idx) => (
                      <div
                        key={idx}
                        className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="font-semibold text-gray-900">
                              {estimate.structure === 'percentage' && `${estimate.percentageFee}% of Rent`}
                              {estimate.structure === 'flat' && `Flat Fee`}
                              {estimate.structure === 'hybrid' && `Hybrid Model`}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {estimate.description}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-gray-900">
                              ${estimate.monthlyFee.toFixed(0)}
                            </div>
                            <div className="text-xs text-gray-500">per month</div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-600 pt-2 border-t border-gray-100">
                          Annual cost: ${estimate.annualFee.toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-3">
                  <svg
                    className="mx-auto h-16 w-16"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <p className="text-gray-500">
                  Enter your property details and click Calculate Fees to see estimates
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Results Section - Full Width */}
        {results && (
          <div className="mt-8 space-y-6">
            {/* Typical Services */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                What's Typically Included
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {results.typicalServices.map((service, idx) => (
                  <div key={idx} className="flex items-start">
                    <svg
                      className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm text-gray-700">{service}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                💡 Expert Recommendations
              </h3>
              <div className="space-y-3">
                {results.recommendations.map((rec, idx) => (
                  <div key={idx} className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2 flex-shrink-0" />
                    <p className="text-sm text-gray-700">{rec}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Save Message */}
            {saveMessage && (
              <div className={`max-w-md mx-auto p-4 rounded-lg ${
                saveMessage.type === 'success'
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                <p className="text-center font-medium">{saveMessage.text}</p>
              </div>
            )}

            {/* Save Button */}
            <div className="flex justify-center">
              <button
                className={`px-6 py-3 font-semibold rounded-lg transition-colors flex items-center gap-2 ${
                  isSaving
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
                onClick={handleSaveClick}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                    Save Calculation
                  </>
                )}
              </button>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-lg p-8 text-center">
              <h3 className="text-2xl font-bold mb-3">
                Ready to Find a Property Manager?
              </h3>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                Your estimated management cost is <strong>${results.marketAverage.monthlyDollarAmount.toFixed(0)}/month</strong>.
                Connect with top-rated property managers in your area who can maximize your income and handle the day-to-day hassles.
              </p>
              <div className="flex gap-4 justify-center">
                <Link
                  href="/register"
                  className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Find Property Managers
                </Link>
                <Link
                  href="/calculators"
                  className="px-6 py-3 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 transition-colors"
                >
                  Try Another Calculator
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

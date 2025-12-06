'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  RentEstimateInputs,
  defaultRentEstimateInputs,
  RentEstimateResults,
  PropertyType,
  PropertyCondition,
} from '@/types/calculators/rent-estimate';
import { calculateRentEstimate } from '@/lib/calculators/rent-estimate/calculations';
import { trackCalculatorView, trackCalculatorUsed, trackSaveAttempt } from '@/lib/analytics';
import { saveCalculation } from '@/lib/saved-calculations-api';
import { useRouter } from 'next/navigation';

const PROPERTY_TYPES = [
  { value: 'single-family', label: 'Single Family Home' },
  { value: 'multi-family', label: 'Multi-Family (2-4 units)' },
  { value: 'condo', label: 'Condo' },
  { value: 'townhouse', label: 'Townhouse' },
  { value: 'apartment', label: 'Apartment' },
];

const CONDITIONS = [
  { value: 'excellent', label: 'Excellent' },
  { value: 'good', label: 'Good' },
  { value: 'average', label: 'Average' },
  { value: 'fair', label: 'Fair' },
  { value: 'poor', label: 'Poor' },
];

export default function RentEstimateCalculator() {
  const [inputs, setInputs] = useState(defaultRentEstimateInputs);
  const [results, setResults] = useState<RentEstimateResults | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const router = useRouter();

  React.useEffect(() => {
    trackCalculatorView('rent-estimate');
  }, []);

  // Load saved calculation if available
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const loadData = localStorage.getItem('loadCalculation');
      if (loadData) {
        try {
          const savedCalc = JSON.parse(loadData);
          if (savedCalc.calculator_type === 'rent-estimate' && savedCalc.input_data) {
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
    const calculatedResults = calculateRentEstimate(inputs);
    setResults(calculatedResults);
    trackCalculatorUsed('rent-estimate', {
      property_type: inputs.propertyType,
      bedrooms: inputs.bedrooms,
      bathrooms: inputs.bathrooms,
      sqft: inputs.squareFeet,
    });
  };

  const handleReset = () => {
    setInputs(defaultRentEstimateInputs);
    setResults(null);
  };

  const handleSaveClick = async () => {
    const token = getAuthToken();

    if (!token) {
      trackSaveAttempt('rent-estimate', false);
      router.push('/login?returnUrl=/calculators/rent-estimate&message=Please login to save your calculations');
      return;
    }

    if (!results) {
      setSaveMessage({ type: 'error', text: 'Please calculate results before saving.' });
      setTimeout(() => setSaveMessage(null), 3000);
      return;
    }

    setIsSaving(true);
    trackSaveAttempt('rent-estimate', true);

    try {
      await saveCalculation(token, {
        calculator_type: 'rent-estimate',
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
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link href="/calculators" className="inline-flex items-center text-sm text-gray-600 hover:text-blue-600 mb-4">
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Calculators
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Rent Estimate Calculator</h1>
          <p className="text-lg text-gray-600">Get a data-driven estimate of your property's rental income.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Property Location */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Property Location</h2>
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="City" value={inputs.address.city}
                  onChange={(e) => setInputs({...inputs, address: {...inputs.address, city: e.target.value}})}
                  className="rounded-md border-gray-300 px-3 py-2" />
                <input type="text" placeholder="State" value={inputs.address.state}
                  onChange={(e) => setInputs({...inputs, address: {...inputs.address, state: e.target.value}})}
                  className="rounded-md border-gray-300 px-3 py-2" />
              </div>
            </div>

            {/* Property Details */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Property Details</h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
                  <select value={inputs.propertyType}
                    onChange={(e) => setInputs({...inputs, propertyType: e.target.value as PropertyType})}
                    className="block w-full rounded-md border-gray-300 px-3 py-2">
                    {PROPERTY_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Condition</label>
                  <select value={inputs.condition}
                    onChange={(e) => setInputs({...inputs, condition: e.target.value as PropertyCondition})}
                    className="block w-full rounded-md border-gray-300 px-3 py-2">
                    {CONDITIONS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
                  <input type="number" value={inputs.bedrooms}
                    onChange={(e) => setInputs({...inputs, bedrooms: Number(e.target.value)})}
                    className="block w-full rounded-md border-gray-300 px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bathrooms</label>
                  <input type="number" step="0.5" value={inputs.bathrooms}
                    onChange={(e) => setInputs({...inputs, bathrooms: Number(e.target.value)})}
                    className="block w-full rounded-md border-gray-300 px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Square Feet</label>
                  <input type="number" value={inputs.squareFeet}
                    onChange={(e) => setInputs({...inputs, squareFeet: Number(e.target.value)})}
                    className="block w-full rounded-md border-gray-300 px-3 py-2" />
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={handleCalculate}
                className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">
                Calculate Rent Estimate
              </button>
              <button onClick={handleReset}
                className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200">
                Reset
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Estimated Rent</h2>
              {results ? (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300 rounded-lg p-6 text-center">
                    <div className="text-sm font-medium text-gray-600 mb-2">Mid-Range Estimate</div>
                    <div className="text-4xl font-bold text-blue-600 mb-3">
                      ${results.estimatedRent.mid.toLocaleString()}
                      <span className="text-lg text-gray-600">/mo</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <div><div className="font-medium">Low</div><div>${results.estimatedRent.low.toLocaleString()}</div></div>
                      <div><div className="font-medium">High</div><div>${results.estimatedRent.high.toLocaleString()}</div></div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">Enter property details to see estimate</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {results && (
          <div className="mt-8 space-y-6">
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
              <h3 className="text-2xl font-bold mb-3">Want a Certified Rental Analysis?</h3>
              <p className="text-blue-100 mb-6">Get a professional analysis from local property managers.</p>
              <Link href="/register"
                className="inline-block px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50">
                Connect with Property Managers
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  RehabInputs,
  defaultRehabInputs,
  RehabResults,
  RoomType,
  RehabScope,
  FinishQuality,
  RoomRehab,
} from '@/types/calculators/rehab';
import { calculateRehabCost } from '@/lib/calculators/rehab/calculations';
import { trackCalculatorView, trackCalculatorUsed, trackSaveAttempt } from '@/lib/analytics';
import { saveCalculation } from '@/lib/saved-calculations-api';
import { useRouter } from 'next/navigation';

const ROOM_TYPES = [
  { value: 'kitchen', label: 'Kitchen' },
  { value: 'bathroom', label: 'Bathroom' },
  { value: 'bedroom', label: 'Bedroom' },
  { value: 'living', label: 'Living Room' },
  { value: 'basement', label: 'Basement' },
  { value: 'exterior', label: 'Exterior' },
];

const SCOPES = [
  { value: 'cosmetic', label: 'Cosmetic (Paint, Flooring)' },
  { value: 'moderate', label: 'Moderate (+ Fixtures, Updates)' },
  { value: 'extensive', label: 'Extensive (Major Renovation)' },
  { value: 'gut-rehab', label: 'Gut Rehab (Down to Studs)' },
];

const QUALITIES = [
  { value: 'budget', label: 'Budget' },
  { value: 'mid-grade', label: 'Mid-Grade' },
  { value: 'high-end', label: 'High-End' },
  { value: 'luxury', label: 'Luxury' },
];

export default function RehabCostCalculator() {
  const [inputs, setInputs] = useState(defaultRehabInputs);
  const [results, setResults] = useState<RehabResults | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const router = useRouter();

  React.useEffect(() => {
    trackCalculatorView('rehab-cost');
  }, []);

  // Load saved calculation if available
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const loadData = localStorage.getItem('loadCalculation');
      if (loadData) {
        try {
          const savedCalc = JSON.parse(loadData);
          if (savedCalc.calculator_type === 'rehab-cost' && savedCalc.input_data) {
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

  const addRoom = () => {
    const newRoom: RoomRehab = {
      type: 'bedroom',
      scope: 'moderate',
      squareFeet: 150,
      quality: 'mid-grade',
      items: {
        flooring: true,
        paint: true,
        fixtures: false,
        cabinets: false,
        countertops: false,
        appliances: false,
        lighting: false,
        plumbing: false,
        electrical: false,
      },
    };
    setInputs({...inputs, rooms: [...inputs.rooms, newRoom]});
  };

  const updateRoom = (idx: number, field: string, value: any) => {
    const newRooms = [...inputs.rooms];
    newRooms[idx] = {...newRooms[idx], [field]: value};
    setInputs({...inputs, rooms: newRooms});
  };

  const removeRoom = (idx: number) => {
    setInputs({...inputs, rooms: inputs.rooms.filter((_, i) => i !== idx)});
  };

  const handleCalculate = () => {
    const calculatedResults = calculateRehabCost(inputs);
    setResults(calculatedResults);
    trackCalculatorUsed('rehab-cost', {
      property_sqft: inputs.propertySquareFeet,
      property_age: inputs.propertyAge,
      num_rooms: inputs.rooms.length,
      total_cost_mid: calculatedResults.totalCost.mid,
      estimated_weeks: calculatedResults.timeline.estimatedWeeks,
    });
  };

  const handleSaveClick = async () => {
    const token = getAuthToken();

    if (!token) {
      trackSaveAttempt('rehab-cost', false);
      router.push('/login?returnUrl=/calculators/rehab-cost&message=Please login to save your calculations');
      return;
    }

    if (!results) {
      setSaveMessage({ type: 'error', text: 'Please calculate results before saving.' });
      setTimeout(() => setSaveMessage(null), 3000);
      return;
    }

    setIsSaving(true);
    trackSaveAttempt('rehab-cost', true);

    try {
      await saveCalculation(token, {
        calculator_type: 'rehab-cost',
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Rehab Cost Estimator</h1>
          <p className="text-lg text-gray-600">
            Estimate renovation costs from cosmetic updates to full gut rehabs.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Property Basics */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Property Basics</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Square Feet</label>
                  <input type="number" value={inputs.propertySquareFeet}
                    onChange={(e) => setInputs({...inputs, propertySquareFeet: Number(e.target.value)})}
                    className="block w-full rounded-md border-gray-300 px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Property Age</label>
                  <input type="number" value={inputs.propertyAge}
                    onChange={(e) => setInputs({...inputs, propertyAge: Number(e.target.value)})}
                    className="block w-full rounded-md border-gray-300 px-3 py-2" />
                </div>
              </div>
            </div>

            {/* Rooms */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Rooms to Renovate</h2>
                <button onClick={addRoom}
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
                  + Add Room
                </button>
              </div>
              <div className="space-y-4">
                {inputs.rooms.map((room, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg p-4">
                    <div className="grid grid-cols-4 gap-3 mb-3">
                      <select value={room.type}
                        onChange={(e) => updateRoom(idx, 'type', e.target.value)}
                        className="rounded-md border-gray-300 px-2 py-2 text-sm">
                        {ROOM_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                      </select>
                      <select value={room.scope}
                        onChange={(e) => updateRoom(idx, 'scope', e.target.value)}
                        className="rounded-md border-gray-300 px-2 py-2 text-sm">
                        {SCOPES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                      </select>
                      <select value={room.quality}
                        onChange={(e) => updateRoom(idx, 'quality', e.target.value)}
                        className="rounded-md border-gray-300 px-2 py-2 text-sm">
                        {QUALITIES.map(q => <option key={q.value} value={q.value}>{q.label}</option>)}
                      </select>
                      <input type="number" placeholder="Sq Ft" value={room.squareFeet}
                        onChange={(e) => updateRoom(idx, 'squareFeet', Number(e.target.value))}
                        className="rounded-md border-gray-300 px-2 py-2 text-sm" />
                    </div>
                    <button onClick={() => removeRoom(idx)}
                      className="text-sm text-red-600 hover:text-red-700">
                      Remove
                    </button>
                  </div>
                ))}
                {inputs.rooms.length === 0 && (
                  <p className="text-gray-500 text-center py-4">Click "Add Room" to start</p>
                )}
              </div>
            </div>

            {/* Structural */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Major Systems</h2>
              <div className="grid grid-cols-2 gap-3">
                {(Object.keys(inputs.structural) as Array<keyof typeof inputs.structural>).map((system) => (
                  <label key={system} className="flex items-center cursor-pointer">
                    <input type="checkbox"
                      checked={inputs.structural[system]}
                      onChange={(e) => setInputs({
                        ...inputs,
                        structural: {...inputs.structural, [system]: e.target.checked}
                      })}
                      className="rounded border-gray-300 text-blue-600 mr-2" />
                    <span className="text-sm text-gray-700 capitalize">{system}</span>
                  </label>
                ))}
              </div>
            </div>

            <button onClick={handleCalculate}
              className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">
              Calculate Rehab Cost
            </button>
          </div>

          {/* Results */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Estimated Cost</h2>
              {results ? (
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300 rounded-lg p-6 text-center">
                    <div className="text-sm font-medium text-gray-600 mb-2">Mid-Range Estimate</div>
                    <div className="text-4xl font-bold text-blue-600 mb-3">
                      ${results.totalCost.mid.toLocaleString()}
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <div><div>Low</div><div>${results.totalCost.low.toLocaleString()}</div></div>
                      <div><div>High</div><div>${results.totalCost.high.toLocaleString()}</div></div>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-2">Cost per Sq Ft</div>
                    <div className="text-2xl font-bold text-gray-900">${results.costPerSqft.mid}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-2">Timeline</div>
                    <div className="text-2xl font-bold text-gray-900">{results.timeline.estimatedWeeks} weeks</div>
                  </div>
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <div className="text-sm font-medium text-gray-700 mb-1">Contingency (15%)</div>
                    <div className="text-lg font-bold text-amber-700">${results.contingency.toLocaleString()}</div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">Add rooms and click Calculate</p>
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
              <h3 className="text-2xl font-bold mb-3">Need Help Managing Your Renovation?</h3>
              <p className="text-blue-100 mb-6">Connect with property managers who can oversee your rehab project.</p>
              <Link href="/register"
                className="inline-block px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50">
                Find Property Managers
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

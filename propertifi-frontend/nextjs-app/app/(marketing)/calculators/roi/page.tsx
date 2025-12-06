'use client';

import React, { useState } from 'react';
import {
  CalculatorState,
  defaultCalculatorState,
} from '@/types/calculators/roi';
import { calculateROI } from '@/lib/calculators/roi/calculations';
import {
  LoanDetailsSection,
  ExpenseSection,
  IncomeSection,
  ProjectionSettingsSection,
} from '@/components/calculators/roi';
import { CashFlowChart, EquityChart, ROIChart } from '@/components/calculators/roi/charts';
import { ProjectionsTable } from '@/components/calculators/roi/ProjectionsTable';
import { generateROIPDF } from '@/lib/calculators/roi/utils/pdfExport';
import {
  trackCalculatorView,
  trackCalculatorUsed,
  trackPDFExport,
  trackSaveAttempt,
  trackCalculationComplete,
} from '@/lib/analytics';
import { saveCalculation } from '@/lib/saved-calculations-api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ROICalculatorPage() {
  const [state, setState] = useState<CalculatorState>(defaultCalculatorState);
  const [activeTab, setActiveTab] = useState<'loan' | 'expenses' | 'income' | 'settings'>('loan');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const router = useRouter();

  // Track page view on mount
  React.useEffect(() => {
    trackCalculatorView('roi');
  }, []);

  // Load saved calculation if available
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const loadData = localStorage.getItem('loadCalculation');
      if (loadData) {
        try {
          const savedCalc = JSON.parse(loadData);
          if (savedCalc.calculator_type === 'roi' && savedCalc.input_data) {
            // Load the saved state
            setState({
              loanDetails: savedCalc.input_data.loanDetails,
              expenses: savedCalc.input_data.expenses,
              income: savedCalc.input_data.income,
              settings: savedCalc.input_data.settings,
              results: savedCalc.result_data || null,
              isSaved: false,
            });
            // Clear the localStorage
            localStorage.removeItem('loadCalculation');
            // Show success message
            setSaveMessage({ type: 'success', text: `Loaded: ${savedCalc.name}` });
            setTimeout(() => setSaveMessage(null), 3000);
          }
        } catch (err) {
          console.error('Error loading saved calculation:', err);
        }
      }
    }
  }, []);

  // Get auth token from localStorage
  const getAuthToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  };

  const handleCalculate = () => {
    const results = calculateROI(state);
    setState(prev => ({ ...prev, results }));

    // Track calculation event
    trackCalculatorUsed('roi', {
      purchase_price: state.loanDetails.purchasePrice,
      down_payment_percent: state.loanDetails.downPaymentPercent,
      loan_term: state.loanDetails.loanTerm,
    });

    // Track completion with key metrics
    trackCalculationComplete('roi', {
      cash_on_cash_return: results.cashOnCashReturn,
      cap_rate: results.capRate,
      irr: results.irr,
    });
  };

  const handleReset = () => {
    setState(defaultCalculatorState);
  };

  const handleExportPDF = async () => {
    if (state.results) {
      trackPDFExport('roi');
      await generateROIPDF(state, state.results);
    }
  };

  const handleSaveClick = async () => {
    const token = getAuthToken();

    // Check if user is authenticated
    if (!token) {
      trackSaveAttempt('roi', false);
      // Redirect to login with return URL
      router.push('/login?returnUrl=/calculators/roi&message=Please login to save your calculations');
      return;
    }

    // Check if there are results to save
    if (!state.results) {
      setSaveMessage({ type: 'error', text: 'Please calculate results before saving.' });
      setTimeout(() => setSaveMessage(null), 3000);
      return;
    }

    setIsSaving(true);
    trackSaveAttempt('roi', true);

    try {
      await saveCalculation(token, {
        calculator_type: 'roi',
        input_data: {
          loanDetails: state.loanDetails,
          expenses: state.expenses,
          income: state.income,
          settings: state.settings,
        },
        result_data: state.results,
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
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Advanced ROI Calculator
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Calculate cash flow, cap rate, cash-on-cash return, and IRR for your rental property investment.
            Get detailed year-by-year projections to make informed decisions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Input Forms */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              {/* Tab Navigation */}
              <div className="border-b border-gray-200">
                <nav className="flex -mb-px">
                  <button
                    onClick={() => setActiveTab('loan')}
                    className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === 'loan'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300'
                    }`}
                  >
                    Loan Details
                  </button>
                  <button
                    onClick={() => setActiveTab('expenses')}
                    className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === 'expenses'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300'
                    }`}
                  >
                    Expenses
                  </button>
                  <button
                    onClick={() => setActiveTab('income')}
                    className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === 'income'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300'
                    }`}
                  >
                    Income
                  </button>
                  <button
                    onClick={() => setActiveTab('settings')}
                    className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === 'settings'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300'
                    }`}
                  >
                    Projections
                  </button>
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'loan' && (
                  <LoanDetailsSection
                    data={state.loanDetails}
                    onChange={(loanDetails) =>
                      setState((prev) => ({ ...prev, loanDetails }))
                    }
                  />
                )}

                {activeTab === 'expenses' && (
                  <ExpenseSection
                    data={state.expenses}
                    onChange={(expenses) =>
                      setState((prev) => ({ ...prev, expenses }))
                    }
                    monthlyRent={state.income.monthlyRent}
                  />
                )}

                {activeTab === 'income' && (
                  <IncomeSection
                    data={state.income}
                    onChange={(income) =>
                      setState((prev) => ({ ...prev, income }))
                    }
                  />
                )}

                {activeTab === 'settings' && (
                  <ProjectionSettingsSection
                    data={state.settings}
                    onChange={(settings) =>
                      setState((prev) => ({ ...prev, settings }))
                    }
                  />
                )}
              </div>

              {/* Action Buttons */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
                <button
                  onClick={handleReset}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Reset
                </button>
                <button
                  onClick={handleCalculate}
                  className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Calculate ROI
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Results Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Results Summary
              </h2>

              {state.results ? (
                <div className="space-y-4">
                  {/* Monthly Cash Flow */}
                  <div className="pb-4 border-b border-gray-200">
                    <div className="text-sm text-gray-600 mb-1">Monthly Cash Flow</div>
                    <div className={`text-2xl font-bold ${
                      state.results.netMonthlyCashFlow >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      ${state.results.netMonthlyCashFlow.toLocaleString()}
                    </div>
                  </div>

                  {/* Key Metrics */}
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-gray-600">Cash-on-Cash Return</div>
                      <div className="text-lg font-semibold text-gray-900">
                        {state.results.cashOnCashReturn.toFixed(2)}%
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-gray-600">Cap Rate</div>
                      <div className="text-lg font-semibold text-gray-900">
                        {state.results.capRate.toFixed(2)}%
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-gray-600">DSCR</div>
                      <div className="text-lg font-semibold text-gray-900">
                        {state.results.dscr.toFixed(2)}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-gray-600">IRR</div>
                      <div className="text-lg font-semibold text-gray-900">
                        {state.results.irr.toFixed(2)}%
                      </div>
                    </div>
                  </div>

                  {/* Investment Summary */}
                  <div className="pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-600 mb-2">Total Cash Invested</div>
                    <div className="text-xl font-bold text-gray-900">
                      ${state.results.totalCashInvested.toLocaleString()}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400 mb-2">
                    <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-500">
                    Enter property details and click Calculate ROI to see results
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Charts and Detailed Results */}
        {state.results && (
          <div className="mt-8 space-y-8">
            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <CashFlowChart projections={state.results.yearlyProjections} />
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <EquityChart projections={state.results.yearlyProjections} />
              </div>
            </div>

            {/* ROI Chart - Full Width */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <ROIChart projections={state.results.yearlyProjections} />
            </div>

            {/* Detailed Projections Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Year-by-Year Projections
              </h2>
              <ProjectionsTable projections={state.results.yearlyProjections} />
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

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center">
              <button
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                onClick={handleExportPDF}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export to PDF
              </button>
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
          </div>
        )}
      </div>
    </div>
  );
}

import React from 'react';
import { ProjectionSettings } from '@/types/calculators/roi';
import { PercentInput } from './index';

interface ProjectionSettingsSectionProps {
  data: ProjectionSettings;
  onChange: (data: ProjectionSettings) => void;
}

export function ProjectionSettingsSection({
  data,
  onChange,
}: ProjectionSettingsSectionProps) {
  const analysisOptions = [
    { value: 5, label: '5 Years' },
    { value: 10, label: '10 Years' },
    { value: 20, label: '20 Years' },
    { value: 30, label: '30 Years' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Projection Settings
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Configure the timeframe and assumptions for your investment analysis.
        </p>
      </div>

      {/* Analysis Period */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Analysis Period
        </label>
        <div className="grid grid-cols-4 gap-3">
          {analysisOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() =>
                onChange({ ...data, analysisYears: option.value })
              }
              className={`px-4 py-3 rounded-lg border-2 transition-all ${
                data.analysisYears === option.value
                  ? 'border-blue-600 bg-blue-50 text-blue-700 font-semibold'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-gray-500">
          Select the timeframe for year-by-year projections
        </p>
      </div>

      {/* Property Appreciation */}
      <PercentInput
        label="Property Appreciation Rate"
        value={data.propertyAppreciation}
        onChange={(propertyAppreciation) =>
          onChange({ ...data, propertyAppreciation })
        }
        required
        min={-10}
        max={20}
        step={0.1}
        helpText="Expected annual property value appreciation (typical: 3-4%)"
      />

      {/* Appreciation Impact */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="text-sm font-medium text-gray-700 mb-3">
          Property Appreciation Impact
        </div>
        <div className="text-xs text-gray-600 mb-3">
          Historical appreciation varies by market. Conservative estimates are recommended.
        </div>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Market Average:</span>
            <span className="font-medium">3-4% per year</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">High Growth Markets:</span>
            <span className="font-medium">5-7% per year</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Declining Markets:</span>
            <span className="font-medium">0-2% per year</span>
          </div>
        </div>
      </div>

      {/* Summary of Settings */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="text-sm font-medium text-gray-700 mb-3">
          Analysis Summary
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Projection Period:</span>
            <span className="font-medium">{data.analysisYears} years</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Annual Appreciation:</span>
            <span className="font-medium">{data.propertyAppreciation}%</span>
          </div>
        </div>
      </div>

      {/* Important Note */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <svg
            className="h-5 w-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">About Projections</p>
            <p className="text-xs">
              These projections are estimates based on your inputs. Actual results will vary
              based on market conditions, property performance, and other factors. Always
              conduct thorough due diligence before making investment decisions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

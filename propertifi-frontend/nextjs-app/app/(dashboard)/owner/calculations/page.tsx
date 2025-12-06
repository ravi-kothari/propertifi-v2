'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  CalculatorIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  TrashIcon,
  PencilIcon,
  ArrowPathIcon,
  DocumentArrowDownIcon,
} from '@heroicons/react/24/outline';
import { getSavedCalculations, deleteSavedCalculation, SavedCalculation } from '@/lib/saved-calculations-api';

const CALCULATOR_LABELS = {
  'roi': 'ROI Calculator',
  'pm-fee': 'PM Fee Calculator',
  'rent-estimate': 'Rent Estimate',
  'rehab-cost': 'Rehab Cost',
};

const CALCULATOR_COLORS = {
  'roi': 'bg-blue-100 text-blue-800',
  'pm-fee': 'bg-green-100 text-green-800',
  'rent-estimate': 'bg-purple-100 text-purple-800',
  'rehab-cost': 'bg-orange-100 text-orange-800',
};

const CALCULATOR_ROUTES = {
  'roi': '/calculators/roi',
  'pm-fee': '/calculators/property-management-fee',
  'rent-estimate': '/calculators/rent-estimate',
  'rehab-cost': '/calculators/rehab-cost',
};

export default function SavedCalculationsPage() {
  const router = useRouter();
  const [calculations, setCalculations] = useState<SavedCalculation[]>([]);
  const [filteredCalculations, setFilteredCalculations] = useState<SavedCalculation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Get auth token
  const getAuthToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  };

  // Load calculations
  useEffect(() => {
    loadCalculations();
  }, []);

  const loadCalculations = async () => {
    const token = getAuthToken();
    if (!token) {
      router.push('/login');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await getSavedCalculations(token);
      setCalculations(data);
      setFilteredCalculations(data);
    } catch (err: any) {
      console.error('Error loading calculations:', err);
      setError(err.message || 'Failed to load saved calculations');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter and search
  useEffect(() => {
    let filtered = calculations;

    // Filter by type
    if (typeFilter !== 'all') {
      filtered = filtered.filter(calc => calc.calculator_type === typeFilter);
    }

    // Search by name
    if (searchTerm) {
      filtered = filtered.filter(calc =>
        calc.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredCalculations(filtered);
  }, [searchTerm, typeFilter, calculations]);

  // Handle delete
  const handleDelete = async () => {
    if (!deleteId) return;

    const token = getAuthToken();
    if (!token) {
      router.push('/login');
      return;
    }

    setIsDeleting(true);

    try {
      await deleteSavedCalculation(token, deleteId);
      setCalculations(prev => prev.filter(c => c.id !== deleteId));
      setDeleteId(null);
    } catch (err: any) {
      console.error('Error deleting calculation:', err);
      alert(err.message || 'Failed to delete calculation');
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle load (navigate to calculator with saved data)
  const handleLoad = (calculation: SavedCalculation) => {
    const route = CALCULATOR_ROUTES[calculation.calculator_type as keyof typeof CALCULATOR_ROUTES];
    if (route) {
      // Store the calculation data in localStorage temporarily
      localStorage.setItem('loadCalculation', JSON.stringify(calculation));
      router.push(route);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Saved Calculations</h1>
              <p className="text-gray-600 mt-1">
                View and manage your saved calculator results
              </p>
            </div>
            <Link
              href="/calculators"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              <PlusIcon className="h-5 w-5" />
              New Calculation
            </Link>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search calculations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filter by Type */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Calculator Types</option>
              <option value="roi">ROI Calculator</option>
              <option value="pm-fee">PM Fee Calculator</option>
              <option value="rent-estimate">Rent Estimate</option>
              <option value="rehab-cost">Rehab Cost</option>
            </select>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <ArrowPathIcon className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading saved calculations...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-800 font-medium mb-4">{error}</p>
            <button
              onClick={loadCalculations}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredCalculations.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <CalculatorIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {typeFilter !== 'all' || searchTerm
                ? 'No calculations found'
                : 'No saved calculations yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {typeFilter !== 'all' || searchTerm
                ? 'Try adjusting your filters or search term.'
                : 'Start using our calculators to analyze investments and save your results.'}
            </p>
            {typeFilter === 'all' && !searchTerm && (
              <Link
                href="/calculators"
                className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
              >
                Try Calculators
              </Link>
            )}
          </div>
        )}

        {/* Calculations Grid */}
        {!isLoading && !error && filteredCalculations.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCalculations.map((calculation) => (
              <div
                key={calculation.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                {/* Type Badge */}
                <div className="flex items-start justify-between mb-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    CALCULATOR_COLORS[calculation.calculator_type as keyof typeof CALCULATOR_COLORS] || 'bg-gray-100 text-gray-800'
                  }`}>
                    {CALCULATOR_LABELS[calculation.calculator_type as keyof typeof CALCULATOR_LABELS] || calculation.calculator_type}
                  </span>
                </div>

                {/* Name */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {calculation.name}
                </h3>

                {/* Date */}
                <p className="text-sm text-gray-600 mb-4">
                  Saved {formatDate(calculation.created_at)}
                </p>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleLoad(calculation)}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <ArrowPathIcon className="h-4 w-4" />
                    Load
                  </button>
                  <button
                    onClick={() => setDeleteId(calculation.id)}
                    className="px-4 py-2 bg-red-50 text-red-600 text-sm font-medium rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        {deleteId !== null && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Delete Calculation?
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this saved calculation? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteId(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 disabled:bg-gray-400"
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

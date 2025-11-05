'use client';

import { useEffect } from 'react';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to monitoring service
    console.error('Dashboard error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6">
          <svg
            className="mx-auto h-12 w-12 text-orange-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <h3 className="text-xl font-semibold text-gray-900 mb-3">
          Dashboard Error
        </h3>

        <p className="text-gray-600 mb-6">
          We encountered an issue loading your dashboard data.
        </p>

        {process.env.NODE_ENV === 'development' && (
          <div className="mb-6 text-left">
            <details className="rounded-lg bg-orange-50 p-3 text-sm">
              <summary className="cursor-pointer font-medium text-orange-900">
                Error Details
              </summary>
              <pre className="mt-3 overflow-auto text-xs text-orange-800">
                {error.message}
              </pre>
            </details>
          </div>
        )}

        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="px-5 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Retry
          </button>

          <a
            href="/property-manager"
            className="px-5 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Back to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}

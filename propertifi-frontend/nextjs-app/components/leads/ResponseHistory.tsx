/**
 * Response History Component
 * Displays the history of responses for a lead
 */

'use client';

import { useLeadResponses } from '@/hooks/useLeadResponse';
import type { LeadResponse } from '@/types/leads';

interface ResponseHistoryProps {
  leadId: number;
}

const RESPONSE_TYPE_LABELS: Record<string, { label: string; icon: string; color: string }> = {
  contact_info: {
    label: 'Contact Info Shared',
    icon: '📞',
    color: 'bg-blue-100 text-blue-700 border-blue-200',
  },
  availability: {
    label: 'Viewing Scheduled',
    icon: '📅',
    color: 'bg-green-100 text-green-700 border-green-200',
  },
  price_quote: {
    label: 'Quote Sent',
    icon: '💰',
    color: 'bg-purple-100 text-purple-700 border-purple-200',
  },
  decline: {
    label: 'Declined',
    icon: '👋',
    color: 'bg-gray-100 text-gray-700 border-gray-200',
  },
};

function ResponseCard({ response }: { response: LeadResponse }) {
  const typeInfo = RESPONSE_TYPE_LABELS[response.response_type] || RESPONSE_TYPE_LABELS.contact_info;
  const date = new Date(response.created_at);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${typeInfo.color}`}>
            <span>{typeInfo.icon}</span>
            {typeInfo.label}
          </span>
        </div>
        <time className="text-sm text-gray-500" dateTime={response.created_at}>
          {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          {' at '}
          {date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
        </time>
      </div>

      {/* Message */}
      <p className="text-gray-700 text-sm mb-3">{response.message}</p>

      {/* Additional Details */}
      {response.contact_info && (
        <div className="bg-blue-50 border border-blue-100 rounded-md p-3 mt-3">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Contact Information</h4>
          <div className="space-y-1 text-sm text-blue-800">
            {response.contact_info.phone && (
              <p>
                <span className="font-medium">Phone:</span> {response.contact_info.phone}
              </p>
            )}
            {response.contact_info.email && (
              <p>
                <span className="font-medium">Email:</span> {response.contact_info.email}
              </p>
            )}
            {response.contact_info.preferred_time && (
              <p>
                <span className="font-medium">Preferred Time:</span> {response.contact_info.preferred_time}
              </p>
            )}
            {response.contact_info.notes && (
              <p>
                <span className="font-medium">Notes:</span> {response.contact_info.notes}
              </p>
            )}
          </div>
        </div>
      )}

      {response.availability && (
        <div className="bg-green-50 border border-green-100 rounded-md p-3 mt-3">
          <h4 className="text-sm font-medium text-green-900 mb-2">Viewing Details</h4>
          <div className="space-y-1 text-sm text-green-800">
            <p>
              <span className="font-medium">Date:</span>{' '}
              {new Date(response.availability.date).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
            <p>
              <span className="font-medium">Time:</span> {response.availability.time}
            </p>
            {response.availability.location && (
              <p>
                <span className="font-medium">Location:</span> {response.availability.location}
              </p>
            )}
            {response.availability.notes && (
              <p>
                <span className="font-medium">Notes:</span> {response.availability.notes}
              </p>
            )}
          </div>
        </div>
      )}

      {response.price_quote && (
        <div className="bg-purple-50 border border-purple-100 rounded-md p-3 mt-3">
          <h4 className="text-sm font-medium text-purple-900 mb-2">Price Quote</h4>
          <div className="space-y-1 text-sm text-purple-800">
            <p>
              <span className="font-medium">Amount:</span> ${response.price_quote.amount.toFixed(2)}{' '}
              <span className="text-purple-600">({response.price_quote.frequency})</span>
            </p>
            <p>
              <span className="font-medium">Details:</span> {response.price_quote.details}
            </p>
            {response.price_quote.includes && response.price_quote.includes.length > 0 && (
              <div>
                <span className="font-medium">Includes:</span>
                <ul className="list-disc list-inside ml-2 mt-1">
                  {response.price_quote.includes.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
            {response.price_quote.valid_until && (
              <p>
                <span className="font-medium">Valid Until:</span>{' '}
                {new Date(response.price_quote.valid_until).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ResponseHistory({ leadId }: ResponseHistoryProps) {
  const { data: responses, isLoading, isError } = useLeadResponses(leadId);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-3" />
            <div className="h-4 bg-gray-200 rounded w-full mb-2" />
            <div className="h-4 bg-gray-200 rounded w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <p className="text-sm text-red-700">Failed to load response history.</p>
      </div>
    );
  }

  if (!responses || responses.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No responses yet</h3>
        <p className="mt-1 text-sm text-gray-500">Be the first to respond to this lead!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Response History</h3>
      <div className="space-y-3">
        {responses.map((response) => (
          <ResponseCard key={response.id} response={response} />
        ))}
      </div>
    </div>
  );
}

'use client';

import { useLeadResponses } from '@/hooks/useLeads';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import type { LeadResponse } from '@/types/leads';

interface ResponseHistoryProps {
  leadId: number;
}

const getResponseTypeLabel = (type: LeadResponse['response_type']) => {
  switch (type) {
    case 'contact_info':
      return 'Contact Information Shared';
    case 'availability':
      return 'Meeting Scheduled';
    case 'price_quote':
      return 'Quote Sent';
    case 'decline':
      return 'Declined';
    default:
      return 'Response';
  }
};

const getResponseTypeColor = (type: LeadResponse['response_type']) => {
  switch (type) {
    case 'contact_info':
      return 'bg-blue-50 border-blue-400';
    case 'availability':
      return 'bg-green-50 border-green-400';
    case 'price_quote':
      return 'bg-purple-50 border-purple-400';
    case 'decline':
      return 'bg-red-50 border-red-400';
    default:
      return 'bg-gray-50 border-gray-400';
  }
};

export default function ResponseHistory({ leadId }: ResponseHistoryProps) {
  const { data: responses, isLoading } = useLeadResponses(leadId);

  return (
    <div className="space-y-4">
      <h4 className="font-semibold text-sm text-gray-900 mb-3">Response History</h4>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center py-4">
          <LoadingSpinner size="sm" label="Loading responses..." />
        </div>
      ) : responses && responses.length > 0 ? (
        <div className="space-y-3">
          {responses.map((response) => (
            <div
              key={response.id}
              className={`border-l-4 p-4 rounded ${getResponseTypeColor(response.response_type)}`}
            >
              {/* Response Header */}
              <div className="flex items-start justify-between mb-2">
                <span className="text-xs font-medium text-gray-700 uppercase tracking-wide">
                  {getResponseTypeLabel(response.response_type)}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(response.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>

              {/* Response Message */}
              <p className="text-sm text-gray-800 mb-3">{response.message}</p>

              {/* Contact Info Details */}
              {response.contact_info && (
                <div className="bg-white bg-opacity-50 rounded p-3 space-y-1">
                  <p className="text-xs font-medium text-gray-700 mb-2">Contact Details:</p>
                  {response.contact_info.phone && (
                    <p className="text-xs text-gray-600">
                      <span className="font-medium">Phone:</span> {response.contact_info.phone}
                    </p>
                  )}
                  {response.contact_info.email && (
                    <p className="text-xs text-gray-600">
                      <span className="font-medium">Email:</span> {response.contact_info.email}
                    </p>
                  )}
                  {response.contact_info.preferred_time && (
                    <p className="text-xs text-gray-600">
                      <span className="font-medium">Best Time:</span> {response.contact_info.preferred_time}
                    </p>
                  )}
                  {response.contact_info.notes && (
                    <p className="text-xs text-gray-600 mt-2">
                      <span className="font-medium">Notes:</span> {response.contact_info.notes}
                    </p>
                  )}
                </div>
              )}

              {/* Availability Details */}
              {response.availability && (
                <div className="bg-white bg-opacity-50 rounded p-3 space-y-1">
                  <p className="text-xs font-medium text-gray-700 mb-2">Meeting Details:</p>
                  <p className="text-xs text-gray-600">
                    <span className="font-medium">Date:</span>{' '}
                    {new Date(response.availability.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                  <p className="text-xs text-gray-600">
                    <span className="font-medium">Time:</span> {response.availability.time}
                  </p>
                  {response.availability.location && (
                    <p className="text-xs text-gray-600">
                      <span className="font-medium">Location:</span> {response.availability.location}
                    </p>
                  )}
                  {response.availability.notes && (
                    <p className="text-xs text-gray-600 mt-2">
                      <span className="font-medium">Notes:</span> {response.availability.notes}
                    </p>
                  )}
                </div>
              )}

              {/* Price Quote Details */}
              {response.price_quote && (
                <div className="bg-white bg-opacity-50 rounded p-3 space-y-1">
                  <p className="text-xs font-medium text-gray-700 mb-2">Quote Details:</p>
                  <p className="text-sm font-semibold text-gray-900 mb-2">
                    ${response.price_quote.amount.toLocaleString()} /{' '}
                    {response.price_quote.frequency}
                  </p>
                  <p className="text-xs text-gray-600 mb-2">{response.price_quote.details}</p>
                  {response.price_quote.includes && response.price_quote.includes.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs font-medium text-gray-700 mb-1">Includes:</p>
                      <div className="flex flex-wrap gap-1">
                        {response.price_quote.includes.map((item, index) => (
                          <span
                            key={index}
                            className="inline-block px-2 py-0.5 rounded text-xs bg-purple-100 text-purple-800"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {response.price_quote.valid_until && (
                    <p className="text-xs text-gray-500 mt-2">
                      Valid until:{' '}
                      {new Date(response.price_quote.valid_until).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500 italic">No responses sent yet</p>
      )}
    </div>
  );
}

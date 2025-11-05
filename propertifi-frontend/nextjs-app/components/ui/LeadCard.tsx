'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useAuth } from '@/hooks/useAuth';
import { useUpdateLeadStatus } from '@/hooks/useLeads';
import type { Lead, LeadStatus } from '@/types/leads';

const ResponseForm = dynamic(() => import('@/components/forms/ResponseForm'));
const Notes = dynamic(() => import('@/components/ui/Notes'));
const ResponseHistory = dynamic(() => import('@/components/ui/ResponseHistory'));

interface LeadCardProps {
  lead: Lead;
  onView: () => void;
  onRespond: (leadId: number, responseData: any) => void;
  onNoteSubmit: (leadId: number, note: string) => void;
}

const getStatusColor = (status: Lead['status']) => {
  switch (status) {
    case 'new':
      return 'bg-blue-500';
    case 'viewed':
      return 'bg-indigo-500';
    case 'contacted':
      return 'bg-yellow-500';
    case 'qualified':
      return 'bg-green-500';
    case 'closed':
      return 'bg-gray-500';
    case 'archived':
      return 'bg-gray-400';
    default:
      return 'bg-gray-500';
  }
};

const getStatusLabel = (status: Lead['status']) => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};

export default function LeadCard({ lead, onView, onRespond, onNoteSubmit }: LeadCardProps) {
  const [isResponding, setIsResponding] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [showResponseHistory, setShowResponseHistory] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  const { user } = useAuth();
  const updateStatus = useUpdateLeadStatus();

  const handleCardClick = () => {
    if (!lead.viewed_at) {
      onView();
    }
  };

  const handleRespond = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResponding(true);
  };

  const handleResponseSubmit = (data: any) => {
    onRespond(lead.id, data);
    setIsResponding(false);
  };

  const handleNoteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowNotes(!showNotes);
  };

  const handleNoteSubmit = (note: string) => {
    onNoteSubmit(lead.id, note);
  };

  const handleStatusChange = async (newStatus: LeadStatus) => {
    if (!user?.id) return;

    try {
      await updateStatus.mutateAsync({
        leadId: lead.id,
        status: newStatus,
        pmId: user.id,
      });
      setShowStatusMenu(false);
    } catch (error) {
      console.error('Failed to update lead status:', error);
    }
  };

  const handleStatusMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowStatusMenu(!showStatusMenu);
  };

  const isViewed = !!lead.viewed_at;
  const fullAddress = `${lead.street_address}, ${lead.city}, ${lead.state} ${lead.zip_code}`;

  return (
    <div
      className={`p-4 rounded-lg border shadow-sm mb-4 transition-all cursor-pointer hover:shadow-md ${
        isViewed ? 'bg-gray-50 border-gray-200' : 'bg-white border-indigo-200'
      }`}
      onClick={handleCardClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{lead.full_name}</h3>
          <p className="text-sm text-gray-600 mt-1">{lead.property_type}</p>
        </div>

        {/* Status Badge with Dropdown */}
        <div className="relative">
          <button
            onClick={handleStatusMenuClick}
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${getStatusColor(
              lead.status
            )} hover:opacity-90 transition-opacity`}
          >
            {getStatusLabel(lead.status)}
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Status Dropdown Menu */}
          {showStatusMenu && (
            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
              <div className="py-1" role="menu">
                {(['new', 'contacted', 'qualified', 'closed', 'archived'] as LeadStatus[]).map((status) => (
                  <button
                    key={status}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStatusChange(status);
                    }}
                    disabled={lead.status === status || updateStatus.isPending}
                    className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                      lead.status === status
                        ? 'bg-gray-100 text-gray-900 font-medium cursor-default'
                        : 'text-gray-700 hover:bg-gray-50 cursor-pointer'
                    } ${updateStatus.isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${getStatusColor(status)}`}></span>
                      {getStatusLabel(status)}
                      {lead.status === status && (
                        <svg className="ml-auto h-4 w-4 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Property Details */}
      <div className="space-y-2 mb-3">
        <div className="flex items-center text-sm text-gray-600">
          <svg
            className="h-4 w-4 mr-2 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span className="truncate">{fullAddress}</span>
        </div>

        {lead.number_of_units && (
          <div className="flex items-center text-sm text-gray-600">
            <svg
              className="h-4 w-4 mr-2 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <span>{lead.number_of_units} units</span>
          </div>
        )}

        {lead.square_footage && (
          <div className="flex items-center text-sm text-gray-600">
            <svg
              className="h-4 w-4 mr-2 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
              />
            </svg>
            <span>{lead.square_footage.toLocaleString()} sq ft</span>
          </div>
        )}
      </div>

      {/* Contact Info */}
      <div className="border-t border-gray-200 pt-3 mb-3">
        <div className="flex items-center text-sm text-gray-600 mb-1">
          <svg
            className="h-4 w-4 mr-2 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          <span className="truncate">{lead.email}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <svg
            className="h-4 w-4 mr-2 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
          <span>{lead.phone}</span>
          {lead.preferred_contact && (
            <span className="ml-2 text-xs text-gray-500">(prefers {lead.preferred_contact})</span>
          )}
        </div>
      </div>

      {/* Additional Services */}
      {lead.additional_services && lead.additional_services.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-medium text-gray-700 mb-1">Requested Services:</p>
          <div className="flex flex-wrap gap-1">
            {lead.additional_services.map((service, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800"
              >
                {service}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Timestamp */}
      <div className="text-xs text-gray-500 mb-3">
        Received: {new Date(lead.created_at).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-200">
        <button
          onClick={handleRespond}
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded text-sm transition-colors"
        >
          Respond
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowResponseHistory(!showResponseHistory);
          }}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded text-sm transition-colors"
        >
          {showResponseHistory ? 'Hide History' : 'History'}
        </button>
        <button
          onClick={handleNoteClick}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded text-sm transition-colors"
        >
          {showNotes ? 'Hide Notes' : 'Notes'}
        </button>
      </div>

      {/* Response History Section */}
      {showResponseHistory && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <ResponseHistory leadId={lead.id} />
        </div>
      )}

      {/* Notes Section */}
      {showNotes && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <Notes leadId={lead.id} onNoteSubmit={handleNoteSubmit} />
        </div>
      )}

      {/* Response Modal */}
      {isResponding && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setIsResponding(false)}
        >
          <div
            className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsResponding(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <h2 className="text-xl font-semibold mb-4">Respond to {lead.full_name}</h2>
            <ResponseForm lead={lead} onSubmit={handleResponseSubmit} onCancel={() => setIsResponding(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

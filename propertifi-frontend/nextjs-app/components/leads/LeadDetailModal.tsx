/**
 * Lead Detail Modal Component
 * Modal displaying full lead information with response functionality
 */

'use client';

import { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useTrackLeadView } from '@/hooks/useLeadResponse';
import { useAuth } from '@/hooks/useAuth';
import ResponseForm from './ResponseForm';
import ResponseHistory from './ResponseHistory';
import type { Lead } from '@/types/leads';

interface LeadDetailModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
}

const PROPERTY_TYPE_ICONS: Record<string, string> = {
  'Single Family': '🏠',
  'Multi-Family': '🏘️',
  'Apartment': '🏢',
  'Condo': '🏙️',
  'Townhouse': '🏘️',
  'Commercial': '🏬',
};

export default function LeadDetailModal({ lead, isOpen, onClose }: LeadDetailModalProps) {
  const { user } = useAuth();
  const { mutate: trackView } = useTrackLeadView(user?.id || '');
  const [activeTab, setActiveTab] = useState<'details' | 'respond' | 'history'>('details');

  // Track view when modal opens
  useEffect(() => {
    if (isOpen && lead && user?.id) {
      trackView(lead.id);
    }
  }, [isOpen, lead?.id, user?.id, trackView]);

  if (!lead) return null;

  const icon = PROPERTY_TYPE_ICONS[lead.property_type] || '🏠';

  const handleResponseSuccess = () => {
    setActiveTab('history');
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">{icon}</span>
                      <div>
                        <Dialog.Title as="h3" className="text-xl font-semibold text-white">
                          {lead.property_type}
                        </Dialog.Title>
                        <p className="text-blue-100 text-sm">
                          {lead.street_address}, {lead.city}, {lead.state} {lead.zip_code}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="text-white hover:text-gray-200 transition-colors"
                      onClick={onClose}
                    >
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Status Badge */}
                  <div className="mt-3">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      lead.status === 'new' ? 'bg-green-100 text-green-800' :
                      lead.status === 'viewed' ? 'bg-blue-100 text-blue-800' :
                      lead.status === 'contacted' ? 'bg-purple-100 text-purple-800' :
                      lead.status === 'qualified' ? 'bg-yellow-100 text-yellow-800' :
                      lead.status === 'closed' ? 'bg-gray-100 text-gray-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200">
                  <nav className="flex -mb-px px-6">
                    {[
                      { id: 'details', label: 'Details', icon: '📋' },
                      { id: 'respond', label: 'Respond', icon: '✉️' },
                      { id: 'history', label: 'History', icon: '📜' },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium text-sm transition-colors ${
                          activeTab === tab.id
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <span>{tab.icon}</span>
                        {tab.label}
                      </button>
                    ))}
                  </nav>
                </div>

                {/* Content */}
                <div className="px-6 py-6 max-h-[600px] overflow-y-auto">
                  {activeTab === 'details' && (
                    <div className="space-y-6">
                      {/* Property Information */}
                      <div>
                        <h4 className="text-lg font-medium text-gray-900 mb-3">Property Information</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-sm text-gray-600">Property Type</p>
                            <p className="text-base font-medium text-gray-900 mt-1">{lead.property_type}</p>
                          </div>
                          {lead.number_of_units && (
                            <div className="bg-gray-50 rounded-lg p-4">
                              <p className="text-sm text-gray-600">Number of Units</p>
                              <p className="text-base font-medium text-gray-900 mt-1">{lead.number_of_units}</p>
                            </div>
                          )}
                          {lead.square_footage && (
                            <div className="bg-gray-50 rounded-lg p-4">
                              <p className="text-sm text-gray-600">Square Footage</p>
                              <p className="text-base font-medium text-gray-900 mt-1">{lead.square_footage.toLocaleString()} sq ft</p>
                            </div>
                          )}
                          <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-sm text-gray-600">Lead Source</p>
                            <p className="text-base font-medium text-gray-900 mt-1">{lead.source}</p>
                          </div>
                        </div>
                      </div>

                      {/* Owner Information */}
                      <div>
                        <h4 className="text-lg font-medium text-gray-900 mb-3">Owner Contact</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-sm text-gray-600">Name</p>
                            <p className="text-base font-medium text-gray-900 mt-1">{lead.full_name}</p>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-sm text-gray-600">Email</p>
                            <p className="text-base font-medium text-gray-900 mt-1">{lead.email}</p>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-sm text-gray-600">Phone</p>
                            <p className="text-base font-medium text-gray-900 mt-1">{lead.phone}</p>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-sm text-gray-600">Preferred Contact</p>
                            <p className="text-base font-medium text-gray-900 mt-1 capitalize">{lead.preferred_contact}</p>
                          </div>
                        </div>
                      </div>

                      {/* Additional Services */}
                      {lead.additional_services && lead.additional_services.length > 0 && (
                        <div>
                          <h4 className="text-lg font-medium text-gray-900 mb-3">Additional Services Requested</h4>
                          <div className="flex flex-wrap gap-2">
                            {lead.additional_services.map((service, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700"
                              >
                                {service}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Timestamps */}
                      <div className="border-t border-gray-200 pt-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Activity Timeline</h4>
                        <div className="space-y-2 text-sm text-gray-600">
                          <p>
                            <span className="font-medium">Created:</span>{' '}
                            {new Date(lead.created_at).toLocaleString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: 'numeric',
                              minute: '2-digit',
                            })}
                          </p>
                          {lead.viewed_at && (
                            <p>
                              <span className="font-medium">First Viewed:</span>{' '}
                              {new Date(lead.viewed_at).toLocaleString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: 'numeric',
                                minute: '2-digit',
                              })}
                            </p>
                          )}
                          {lead.responded_at && (
                            <p>
                              <span className="font-medium">Responded:</span>{' '}
                              {new Date(lead.responded_at).toLocaleString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: 'numeric',
                                minute: '2-digit',
                              })}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'respond' && (
                    <ResponseForm
                      leadId={lead.id}
                      onSuccess={handleResponseSuccess}
                      onCancel={() => setActiveTab('details')}
                    />
                  )}

                  {activeTab === 'history' && <ResponseHistory leadId={lead.id} />}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

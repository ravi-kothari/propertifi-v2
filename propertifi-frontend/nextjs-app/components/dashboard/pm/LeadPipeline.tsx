'use client';

import { useState, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLeads } from '@/hooks/useLeads';
import { LeadPipelineSkeleton } from '@/components/ui/skeleton';
import { PageErrorMessage } from '@/components/ui/ErrorMessage';
import { LeadCard } from '@/components/leads/LeadCard';
import LeadDetailModal from '@/components/leads/LeadDetailModal';
import type { Lead, LeadStatus } from '@/types/leads';

export default function LeadPipeline() {
  const { user } = useAuth();
  const { data: leads, isLoading, isError, error, refetch } = useLeads(user?.id);

  const [statusFilter, setStatusFilter] = useState<'All' | LeadStatus>('All');
  const [dateFilter, setDateFilter] = useState<'All' | 'Last 7 days' | 'Last 30 days'>('All');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter leads based on selected filters
  const filteredLeads = useMemo(() => {
    if (!leads) return [];

    return leads.filter((lead) => {
      // Status filter
      if (statusFilter !== 'All' && lead.status !== statusFilter) {
        return false;
      }

      // Date filter
      if (dateFilter !== 'All') {
        const today = new Date();
        const leadDate = new Date(lead.created_at);
        const diffTime = Math.abs(today.getTime() - leadDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (dateFilter === 'Last 7 days' && diffDays > 7) {
          return false;
        }
        if (dateFilter === 'Last 30 days' && diffDays > 30) {
          return false;
        }
      }

      return true;
    });
  }, [leads, statusFilter, dateFilter]);

  // Group leads by status for pipeline columns
  const groupedLeads = useMemo(() => {
    const groups: Record<string, Lead[]> = {
      new: [],
      contacted: [],
      qualified: [],
    };

    filteredLeads.forEach((lead) => {
      if (lead.status === 'new') groups.new.push(lead);
      else if (lead.status === 'contacted') groups.contacted.push(lead);
      else if (lead.status === 'qualified') groups.qualified.push(lead);
    });

    return groups;
  }, [filteredLeads]);

  // Handle lead card click - open modal
  const handleLeadClick = (lead: Lead) => {
    setSelectedLead(lead);
    setIsModalOpen(true);
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedLead(null);
  };

  // Loading state
  if (isLoading) {
    return <LeadPipelineSkeleton />;
  }

  // Error state
  if (isError) {
    return (
      <PageErrorMessage
        title="Failed to load leads"
        message={error instanceof Error ? error.message : 'An unexpected error occurred'}
        onRetry={refetch}
      />
    );
  }

  // Empty state
  if (!leads || leads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <svg
          className="h-16 w-16 text-gray-400 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No leads yet</h3>
        <p className="text-gray-500">When property owners submit inquiries, they'll appear here.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Filters */}
      <div className="flex space-x-4 mb-6">
        <div>
          <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            id="status-filter"
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
          >
            <option value="All">All</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
          </select>
        </div>

        <div>
          <label htmlFor="date-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <select
            id="date-filter"
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value as typeof dateFilter)}
          >
            <option value="All">All</option>
            <option value="Last 7 days">Last 7 days</option>
            <option value="Last 30 days">Last 30 days</option>
          </select>
        </div>

        <div className="ml-auto flex items-end">
          <p className="text-sm text-gray-600">
            Showing {filteredLeads.length} of {leads.length} leads
          </p>
        </div>
      </div>

      {/* Pipeline Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* New Leads Column */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">New</h2>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {groupedLeads.new.length}
            </span>
          </div>
          <div className="space-y-4">
            {groupedLeads.new.length > 0 ? (
              groupedLeads.new.map((lead) => (
                <LeadCard
                  key={lead.id}
                  lead={lead}
                  onClick={() => handleLeadClick(lead)}
                />
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-8">No new leads</p>
            )}
          </div>
        </div>

        {/* Contacted Column */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Contacted</h2>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              {groupedLeads.contacted.length}
            </span>
          </div>
          <div className="space-y-4">
            {groupedLeads.contacted.length > 0 ? (
              groupedLeads.contacted.map((lead) => (
                <LeadCard
                  key={lead.id}
                  lead={lead}
                  onClick={() => handleLeadClick(lead)}
                />
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-8">No contacted leads</p>
            )}
          </div>
        </div>

        {/* Qualified Column */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Qualified</h2>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              {groupedLeads.qualified.length}
            </span>
          </div>
          <div className="space-y-4">
            {groupedLeads.qualified.length > 0 ? (
              groupedLeads.qualified.map((lead) => (
                <LeadCard
                  key={lead.id}
                  lead={lead}
                  onClick={() => handleLeadClick(lead)}
                />
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-8">No qualified leads</p>
            )}
          </div>
        </div>
      </div>

      {/* Lead Detail Modal */}
      <LeadDetailModal
        lead={selectedLead}
        isOpen={isModalOpen}
        onClose={handleModalClose}
      />
    </div>
  );
}

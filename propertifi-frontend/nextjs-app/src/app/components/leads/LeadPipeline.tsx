
'use client';

import React, { useState } from 'react';
import LeadCard from './LeadCard';
import LeadDetail from './LeadDetail';

interface LeadPipelineProps {
  leads: any[]; // Replace with a proper lead type
}

const LeadPipeline: React.FC<LeadPipelineProps> = ({ leads }) => {
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const handleLeadClick = (lead: any) => {
    setSelectedLead(lead);
  };

  const handleCloseModal = () => {
    setSelectedLead(null);
  };

  const filteredLeads = leads.filter((lead) => {
    const statusMatch = statusFilter ? lead.status.toLowerCase().includes(statusFilter.toLowerCase()) : true;
    const dateMatch = dateFilter ? new Date(lead.created_at).toLocaleDateString() === new Date(dateFilter).toLocaleDateString() : true;
    return statusMatch && dateMatch;
  });

  return (
    <div>
      <div className="flex space-x-4 mb-4">
        <input
          type="text"
          placeholder="Filter by status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border p-2 rounded-lg"
        />
        <input
          type="date"
          placeholder="Filter by date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="border p-2 rounded-lg"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLeads.map((lead) => (
          <LeadCard key={lead.id} lead={lead} onClick={() => handleLeadClick(lead)} />
        ))}
        {selectedLead && <LeadDetail lead={selectedLead} onClose={handleCloseModal} />}
      </div>
    </div>
  );
};

export default LeadPipeline;

'use client';

import { useState } from 'react';
import { Lead } from '@/types/leads';
import { Mail, Phone, MapPin, Building2, Users as UsersIcon, MoreVertical } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Stage {
  id: string;
  name: string;
  color: string;
  count: number;
}

const stages: Stage[] = [
  { id: 'new', name: 'New Inquiries', color: 'bg-blue-100 text-blue-700 border-blue-200', count: 0 },
  { id: 'contacted', name: 'Contacted', color: 'bg-purple-100 text-purple-700 border-purple-200', count: 0 },
  { id: 'tour_scheduled', name: 'Tour Scheduled', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', count: 0 },
  { id: 'application', name: 'Application', color: 'bg-green-100 text-green-700 border-green-200', count: 0 },
  { id: 'approved', name: 'Approved', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', count: 0 },
];

interface LeadKanbanProps<T extends Lead = Lead> {
  leads: T[];
  onLeadClick: (lead: T) => void;
}

function KanbanCard({ lead, onClick }: { lead: Lead; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer mb-3"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 capitalize">
            {lead.property_type?.replace('_', ' ')}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            {new Date(lead.created_at).toLocaleDateString()}
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              onClick={(e) => e.stopPropagation()}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <MoreVertical className="h-4 w-4 text-gray-400" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>View Details</DropdownMenuItem>
            <DropdownMenuItem>Send Email</DropdownMenuItem>
            <DropdownMenuItem>Schedule Tour</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">Archive</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Address */}
      <div className="flex items-start gap-2 mb-2">
        <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-gray-700">
          <p>{lead.street_address}</p>
          <p>{lead.city}, {lead.state} {lead.zip_code}</p>
        </div>
      </div>

      {/* Units */}
      {lead.number_of_units && (
        <div className="flex items-center gap-2 mb-2">
          <Building2 className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600">{lead.number_of_units} units</span>
        </div>
      )}

      {/* Contact */}
      <div className="border-t border-gray-100 mt-3 pt-3">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <UsersIcon className="h-4 w-4 text-gray-400" />
          <span className="font-medium">{lead.full_name}</span>
        </div>
        {lead.email && (
          <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
            <Mail className="h-3 w-3" />
            <span className="truncate">{lead.email}</span>
          </div>
        )}
        {lead.phone && (
          <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
            <Phone className="h-3 w-3" />
            <span>{lead.phone}</span>
          </div>
        )}
      </div>

      {/* AI Score Badge (if available) */}
      {(lead as any).ai_score && (
        <div className="mt-3">
          <Badge
            className={`text-xs ${
              (lead as any).ai_score >= 80
                ? 'bg-red-100 text-red-700'
                : (lead as any).ai_score >= 65
                ? 'bg-green-100 text-green-700'
                : 'bg-blue-100 text-blue-700'
            }`}
          >
            AI Score: {(lead as any).ai_score}/100
          </Badge>
        </div>
      )}
    </div>
  );
}

export function LeadKanban<T extends Lead = Lead>({ leads, onLeadClick }: LeadKanbanProps<T>) {
  // Group leads by stage
  const leadsByStage = stages.reduce((acc, stage) => {
    acc[stage.id] = leads.filter((lead) => {
      // Map lead status to stage
      const status = lead.status?.toLowerCase() || 'new';
      if (stage.id === 'new') return status === 'new' || status === 'pending';
      if (stage.id === 'contacted') return status === 'contacted' || status === 'in_progress';
      if (stage.id === 'tour_scheduled') return status === 'tour_scheduled';
      if (stage.id === 'application') return status === 'application' || status === 'applied';
      if (stage.id === 'approved') return status === 'approved' || status === 'completed';
      return false;
    });
    return acc;
  }, {} as Record<string, Lead[]>);

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {stages.map((stage) => {
        const stageLeads = leadsByStage[stage.id] || [];

        return (
          <div
            key={stage.id}
            className="flex-shrink-0 w-80 bg-gray-50 rounded-lg p-4"
          >
            {/* Stage Header */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">{stage.name}</h3>
                <Badge variant="default" className="text-xs">
                  {stageLeads.length}
                </Badge>
              </div>
              <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full ${stage.color.split(' ')[0]}`}
                  style={{ width: `${Math.min((stageLeads.length / leads.length) * 100, 100)}%` }}
                />
              </div>
            </div>

            {/* Cards */}
            <div className="space-y-3 max-h-[calc(100vh-280px)] overflow-y-auto custom-scrollbar">
              {stageLeads.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-sm">
                  No leads in this stage
                </div>
              ) : (
                stageLeads.map((lead) => (
                  <KanbanCard
                    key={lead.id}
                    lead={lead}
                    onClick={() => onLeadClick(lead as T)}
                  />
                ))
              )}
            </div>

            {/* Add Card Button */}
            <button className="w-full mt-3 p-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-400 hover:border-gray-400 hover:text-gray-600 transition-colors text-sm">
              + Add Lead
            </button>
          </div>
        );
      })}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    </div>
  );
}

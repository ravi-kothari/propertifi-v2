'use client';

import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { LeadCardEnhanced } from '@/components/leads/LeadCardEnhanced';
import { LeadKanban } from '@/components/leads/LeadKanban';
import LeadDetailModal from '@/components/leads/LeadDetailModal';
import { Lead, LeadWithAssignment } from '@/types/leads';
import { getPMLeads } from '@/lib/leads-api';
import { UpgradeBanner } from '@/components/pm/UpgradeBanner';
import {
  Zap,
  LayoutList,
  LayoutGrid,
  Filter,
  Search,
  Download,
  Mail,
  Archive
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface LeadScore {
  score: number;
  tier: string;
  badge: {
    text: string;
    color: string;
    priority: string;
  };
  reasons?: string[];
}

interface ScoredLead {
  id: number;
  user_lead_id: number;
  score: number;
  tier: string;
  badge: LeadScore['badge'];
  reasons: string[];
  [key: string]: any;
}

async function fetchLeadScores(): Promise<ScoredLead[]> {
  const response = await fetch('/api/v1/leads/scores', {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch lead scores');
  }

  const data = await response.json();
  return data.leads || [];
}

export default function PropertyManagerPage() {
  const [selectedLead, setSelectedLead] = useState<LeadWithAssignment | null>(null);

  // View and filter state
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [propertyTypeFilter, setPropertyTypeFilter] = useState('all');
  const [selectedLeads, setSelectedLeads] = useState<number[]>([]);

  // Fetch PM leads with tiered access filtering
  const { data: leadsData, isLoading, error } = useQuery({
    queryKey: ['pm-leads', statusFilter],
    queryFn: () => getPMLeads({
      status: statusFilter !== 'all' ? statusFilter : undefined,
      sort_by: 'created_at',
      sort_order: 'desc',
      per_page: 100,
    }),
    refetchInterval: 60000, // Refetch every minute to check for newly available leads
  });

  const leads = leadsData?.leads || [];

  // Fetch AI scores
  const { data: scoredLeads } = useQuery<ScoredLead[]>({
    queryKey: ['lead-scores'],
    queryFn: fetchLeadScores,
  });

  // Create a map of lead scores
  const scoreMap = new Map(
    scoredLeads?.map(sl => [sl.id, {
      score: sl.score,
      tier: sl.tier,
      badge: sl.badge,
      reasons: sl.reasons,
    }]) || []
  );

  // Filtered leads
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          lead.full_name?.toLowerCase().includes(query) ||
          lead.email?.toLowerCase().includes(query) ||
          lead.city?.toLowerCase().includes(query) ||
          lead.street_address?.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Status filter
      if (statusFilter !== 'all' && lead.status !== statusFilter) {
        return false;
      }

      // Property type filter
      if (propertyTypeFilter !== 'all' && lead.property_type !== propertyTypeFilter) {
        return false;
      }

      return true;
    });
  }, [leads, searchQuery, statusFilter, propertyTypeFilter]);

  // Mock tier - in production this comes from user profile
  const userTier = 'free';
  const missedLeadsCount = 5; // This would come from API

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          Leads
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full">
            <Zap className="h-3 w-3" />
            AI-Powered
          </span>
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Manage and track your property leads
        </p>
      </div>

      {/* Upgrade Banner for Free Tier */}
      <UpgradeBanner tier={userTier} missedLeadsCount={missedLeadsCount} />

      {/* Filters and Actions Bar */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search leads by name, email, city, address..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>

            {/* Property Type Filter */}
            <Select value={propertyTypeFilter} onValueChange={setPropertyTypeFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Property Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="residential">Residential</SelectItem>
                <SelectItem value="multi_family">Multi Family</SelectItem>
                <SelectItem value="single_family">Single Family</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
              </SelectContent>
            </Select>

            {/* View Toggle */}
            <div className="flex border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('list')}
                className={`inline-flex items-center justify-center h-8 px-3 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                  viewMode === 'list'
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'bg-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <LayoutList className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('kanban')}
                className={`inline-flex items-center justify-center h-8 px-3 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                  viewMode === 'kanban'
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'bg-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
            </div>

            {/* Bulk Actions */}
            {selectedLeads.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    Actions ({selectedLeads.length})
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <Mail className="h-4 w-4 mr-2" />
                    Send Bulk Email
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Download className="h-4 w-4 mr-2" />
                    Export Selected
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">
                    <Archive className="h-4 w-4 mr-2" />
                    Archive
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        {/* Results count */}
        <div className="mt-3 text-sm text-gray-600">
          Showing {filteredLeads.length} of {leads.length} leads
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : error ? (
        <div className="text-center py-12 bg-red-50 rounded-lg">
          <p className="text-red-600">{error instanceof Error ? error.message : 'Failed to load leads'}</p>
        </div>
      ) : filteredLeads.length === 0 ? (
        <div className="text-center py-12 bg-white border border-gray-200 rounded-lg">
          <p className="text-gray-500">No leads found matching your filters.</p>
          <Button
            variant="link"
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('all');
              setPropertyTypeFilter('all');
            }}
            className="mt-2"
          >
            Clear filters
          </Button>
        </div>
      ) : viewMode === 'kanban' ? (
        <LeadKanban leads={filteredLeads} onLeadClick={setSelectedLead} />
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredLeads.map((lead) => (
            <LeadCardEnhanced
              key={lead.id}
              lead={lead}
              onClick={() => setSelectedLead(lead)}
              score={scoreMap.get(lead.id)}
              isLoading={!scoredLeads}
            />
          ))}
        </div>
      )}

      <LeadDetailModal
        lead={selectedLead}
        isOpen={selectedLead !== null}
        onClose={() => setSelectedLead(null)}
      />
    </div>
  );
}
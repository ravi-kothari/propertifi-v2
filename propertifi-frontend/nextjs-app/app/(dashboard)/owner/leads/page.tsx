'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ClipboardDocumentListIcon,
} from '@heroicons/react/24/outline';
import { getLeads } from '@/lib/owner-api';
import { LeadCard } from '@/components/owner/LeadCard';
import { EmptyState } from '@/components/owner/EmptyState';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LeadStatus, PropertyType } from '@/types/owner';
import { useRouter } from 'next/navigation';

export default function LeadsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<PropertyType | 'all'>('all');

  // Fetch leads
  const { data, isLoading, error } = useQuery({
    queryKey: ['owner-leads', page, search, statusFilter, typeFilter],
    queryFn: () =>
      getLeads({
        page,
        per_page: 12,
        filters: {
          search: search || undefined,
          status: statusFilter !== 'all' ? statusFilter : undefined,
          property_type: typeFilter !== 'all' ? typeFilter : undefined,
        },
      }),
  });

  const handleViewDetails = (lead: any) => {
    router.push(`/owner/leads/${lead.id}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Leads</h1>
          <p className="text-gray-600 mt-1">
            Track and manage your property leads
          </p>
        </div>
        <Button
          size="lg"
          onClick={() => router.push('/get-started')}
          className="gap-2"
        >
          <PlusIcon className="h-5 w-5" />
          Submit New Lead
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by address..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Status Filter */}
          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value as LeadStatus | 'all')}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="matched">Matched</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>

          {/* Property Type Filter */}
          <Select
            value={typeFilter}
            onValueChange={(value) => setTypeFilter(value as PropertyType | 'all')}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="single_family">Single Family</SelectItem>
              <SelectItem value="multi_family">Multi Family</SelectItem>
              <SelectItem value="apartment">Apartment</SelectItem>
              <SelectItem value="condo">Condo</SelectItem>
              <SelectItem value="townhouse">Townhouse</SelectItem>
              <SelectItem value="commercial">Commercial</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Leads Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading leads...</p>
          </div>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">Error loading leads</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      ) : data && data.data.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.data.map((lead) => (
              <LeadCard
                key={lead.id}
                lead={lead}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>

          {/* Pagination */}
          {data.last_page > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              <Button
                variant="outline"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-600">
                Page {page} of {data.last_page}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage(page + 1)}
                disabled={page === data.last_page}
              >
                Next
              </Button>
            </div>
          )}
        </>
      ) : (
        <EmptyState
          icon={ClipboardDocumentListIcon}
          title="No Leads Found"
          description={
            search || statusFilter !== 'all' || typeFilter !== 'all'
              ? 'Try adjusting your filters to see more results.'
              : 'Submit your first property lead to get matched with property managers.'
          }
          actionLabel={
            search || statusFilter !== 'all' || typeFilter !== 'all'
              ? undefined
              : 'Submit a Lead'
          }
          onAction={
            search || statusFilter !== 'all' || typeFilter !== 'all'
              ? undefined
              : () => router.push('/get-started')
          }
        />
      )}
    </div>
  );
}

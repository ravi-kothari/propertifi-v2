'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Target, MapPin, Clock, Users, TrendingUp, Filter, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface LeadAssignment {
  id: number;
  lead_id: number;
  manager_id: number;
  manager_name: string;
  manager_tier: string;
  lead_address: string;
  lead_city: string;
  lead_state: string;
  property_type: string;
  match_score: number;
  distance_miles: number | null;
  status: string;
  available_at: string;
  created_at: string;
}

// Mock data for demonstration
const mockAssignments: LeadAssignment[] = [
  {
    id: 1,
    lead_id: 101,
    manager_id: 1,
    manager_name: 'John Smith',
    manager_tier: 'pro',
    lead_address: '123 Main St',
    lead_city: 'Austin',
    lead_state: 'TX',
    property_type: 'multi_family',
    match_score: 92,
    distance_miles: 2.5,
    status: 'pending',
    available_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
  // Add more mock data as needed
];

export default function AdminLeadAssignmentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // In production, this would fetch from API
  const { data: assignments = mockAssignments, isLoading } = useQuery({
    queryKey: ['admin-lead-assignments', tierFilter, statusFilter],
    queryFn: async () => {
      // const response = await get('/api/admin/lead-assignments');
      // return response.data;
      return mockAssignments;
    },
  });

  const getTierBadge = (tier: string) => {
    const config: Record<string, { label: string; color: string }> = {
      free: { label: 'Free', color: 'bg-gray-100 text-gray-700' },
      basic: { label: 'Basic', color: 'bg-blue-100 text-blue-700' },
      pro: { label: 'Pro', color: 'bg-purple-100 text-purple-700' },
      enterprise: { label: 'Enterprise', color: 'bg-amber-100 text-amber-700' },
    };
    const { label, color } = config[tier] || config.free;
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${color}`}>
        {label}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-700',
      contacted: 'bg-blue-100 text-blue-700',
      accepted: 'bg-green-100 text-green-700',
      declined: 'bg-red-100 text-red-700',
    };
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-700'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-gray-600';
  };

  const isAvailable = (availableAt: string) => {
    return new Date(availableAt) <= new Date();
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Lead Assignments</h1>
        <p className="text-sm text-gray-600 mt-1">
          Monitor and manage lead assignments across all tiers
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Assignments</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-2">{assignments.length}</h3>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Premium Tier</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-2">
                {assignments.filter(a => ['pro', 'enterprise'].includes(a.manager_tier)).length}
              </h3>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Match Score</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-2">
                {Math.round(assignments.reduce((sum, a) => sum + a.match_score, 0) / assignments.length)}%
              </h3>
            </div>
            <Target className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Available Now</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-2">
                {assignments.filter(a => isAvailable(a.available_at)).length}
              </h3>
            </div>
            <Clock className="h-8 w-8 text-amber-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search by manager name, lead address, city..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Select value={tierFilter} onValueChange={setTierFilter}>
              <SelectTrigger className="w-[140px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Tier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tiers</SelectItem>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="basic">Basic</SelectItem>
                <SelectItem value="pro">Pro</SelectItem>
                <SelectItem value="enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="declined">Declined</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Assignments Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lead
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Manager
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tier
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Match
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Distance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Available At
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {assignments.map((assignment) => (
                <tr key={assignment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {assignment.property_type.replace('_', ' ').toUpperCase()}
                      </div>
                      <div className="text-sm text-gray-500">
                        {assignment.lead_address}
                      </div>
                      <div className="text-xs text-gray-400">
                        {assignment.lead_city}, {assignment.lead_state}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {assignment.manager_name}
                    </div>
                    <div className="text-xs text-gray-500">ID: {assignment.manager_id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getTierBadge(assignment.manager_tier)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Target className={`h-4 w-4 ${getMatchScoreColor(assignment.match_score)}`} />
                      <span className={`text-sm font-semibold ${getMatchScoreColor(assignment.match_score)}`}>
                        {Math.round(assignment.match_score)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {assignment.distance_miles !== null ? (
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <MapPin className="h-3 w-3" />
                        {assignment.distance_miles.toFixed(1)} mi
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">N/A</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-gray-900">
                        {new Date(assignment.available_at).toLocaleString()}
                      </div>
                      {isAvailable(assignment.available_at) ? (
                        <span className="text-xs text-green-600 font-medium">Available now</span>
                      ) : (
                        <span className="text-xs text-amber-600 font-medium">
                          Available in {Math.ceil((new Date(assignment.available_at).getTime() - Date.now()) / (1000 * 60 * 60))}h
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(assignment.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import AdminLayout from '@/components/layout/AdminLayout';
import { FileText, MapPin, User, Calendar, TrendingUp } from 'lucide-react';

interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  propertyType: string;
  city: string;
  state: string;
  status: 'new' | 'contacted' | 'qualified' | 'closed' | 'lost';
  qualityScore: number;
  createdAt: string;
  assignedTo?: string;
}

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'new' | 'contacted' | 'qualified' | 'closed' | 'lost'>('all');

  useEffect(() => {
    // Simulate fetching leads
    setTimeout(() => {
      setLeads([
        {
          id: 1,
          name: 'Alice Martinez',
          email: 'alice@example.com',
          phone: '(415) 555-0101',
          propertyType: 'Single Family Home',
          city: 'San Francisco',
          state: 'CA',
          status: 'new',
          qualityScore: 85,
          createdAt: '2024-11-01T10:30:00',
        },
        {
          id: 2,
          name: 'Bob Williams',
          email: 'bob@example.com',
          phone: '(415) 555-0202',
          propertyType: 'Condo',
          city: 'Oakland',
          state: 'CA',
          status: 'contacted',
          qualityScore: 72,
          createdAt: '2024-11-02T14:15:00',
          assignedTo: 'John Smith',
        },
        {
          id: 3,
          name: 'Carol Chen',
          email: 'carol@example.com',
          phone: '(415) 555-0303',
          propertyType: 'Multi-Family',
          city: 'San Jose',
          state: 'CA',
          status: 'qualified',
          qualityScore: 91,
          createdAt: '2024-10-28T09:20:00',
          assignedTo: 'Sarah Johnson',
        },
        {
          id: 4,
          name: 'David Brown',
          email: 'david@example.com',
          phone: '(415) 555-0404',
          propertyType: 'Single Family Home',
          city: 'Palo Alto',
          state: 'CA',
          status: 'closed',
          qualityScore: 88,
          createdAt: '2024-10-20T11:45:00',
          assignedTo: 'John Smith',
        },
      ]);
      setIsLoading(false);
    }, 500);
  }, []);

  const filteredLeads = leads.filter(
    (lead) => filter === 'all' || lead.status === filter
  );

  const getStatusBadge = (status: string) => {
    const styles = {
      new: 'bg-blue-100 text-blue-800',
      contacted: 'bg-yellow-100 text-yellow-800',
      qualified: 'bg-purple-100 text-purple-800',
      closed: 'bg-green-100 text-green-800',
      lost: 'bg-red-100 text-red-800',
    };
    return styles[status as keyof typeof styles] || styles.new;
  };

  const getQualityColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Lead Management</h1>
            <p className="text-gray-500 mt-1">
              View and manage all incoming leads
            </p>
          </div>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
            Export Leads
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-5">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gray-900">{leads.length}</div>
              <div className="text-sm text-gray-600">Total Leads</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">
                {leads.filter((l) => l.status === 'new').length}
              </div>
              <div className="text-sm text-gray-600">New</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-yellow-600">
                {leads.filter((l) => l.status === 'contacted').length}
              </div>
              <div className="text-sm text-gray-600">Contacted</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple-600">
                {leads.filter((l) => l.status === 'qualified').length}
              </div>
              <div className="text-sm text-gray-600">Qualified</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">
                {leads.filter((l) => l.status === 'closed').length}
              </div>
              <div className="text-sm text-gray-600">Closed</div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 border-b">
          {(['all', 'new', 'contacted', 'qualified', 'closed', 'lost'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 font-medium capitalize transition-colors ${
                filter === status
                  ? 'border-b-2 border-indigo-600 text-indigo-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {status}
              {status === 'all' && ` (${leads.length})`}
              {status !== 'all' &&
                ` (${leads.filter((l) => l.status === status).length})`}
            </button>
          ))}
        </div>

        {/* Leads List */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredLeads.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No leads found for this filter</p>
                </CardContent>
              </Card>
            ) : (
              filteredLeads.map((lead) => (
                <Card key={lead.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-blue-100 rounded-lg">
                            <FileText className="w-6 h-6 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg font-semibold text-gray-900">
                                {lead.name}
                              </h3>
                              <span
                                className={`px-3 py-1 text-xs rounded-full font-medium ${getStatusBadge(
                                  lead.status
                                )}`}
                              >
                                {lead.status}
                              </span>
                            </div>
                            <div className="space-y-1 mt-2">
                              <p className="text-sm text-gray-600">{lead.email}</p>
                              <p className="text-sm text-gray-600">{lead.phone}</p>
                            </div>
                            <div className="flex items-center text-gray-600 mt-2">
                              <MapPin className="w-4 h-4 mr-1" />
                              <span className="text-sm">
                                {lead.propertyType} in {lead.city}, {lead.state}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 mt-3">
                              <div className="flex items-center text-sm">
                                <TrendingUp className="w-4 h-4 mr-1" />
                                <span className={`font-semibold ${getQualityColor(lead.qualityScore)}`}>
                                  Quality: {lead.qualityScore}
                                </span>
                              </div>
                              {lead.assignedTo && (
                                <div className="flex items-center text-sm text-gray-600">
                                  <User className="w-4 h-4 mr-1" />
                                  <span>Assigned to {lead.assignedTo}</span>
                                </div>
                              )}
                            </div>
                            <div className="flex items-center text-sm text-gray-500 mt-2">
                              <Calendar className="w-4 h-4 mr-1" />
                              {new Date(lead.createdAt).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 lg:w-48">
                        <button className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm">
                          View Details
                        </button>
                        {lead.status === 'new' && (
                          <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
                            Assign Lead
                          </button>
                        )}
                        <button className="w-full px-4 py-2 text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors text-sm">
                          Edit
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

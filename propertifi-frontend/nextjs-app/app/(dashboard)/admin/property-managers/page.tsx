'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import AdminLayout from '@/components/layout/AdminLayout';
import { Building2, MapPin, Star, CheckCircle, XCircle, Clock } from 'lucide-react';

interface PropertyManager {
  id: number;
  name: string;
  email: string;
  company: string;
  city: string;
  state: string;
  rating: number;
  reviewCount: number;
  propertiesManaged: number;
  status: 'active' | 'pending' | 'suspended';
  verified: boolean;
  joinedDate: string;
}

export default function AdminPropertyManagersPage() {
  const [managers, setManagers] = useState<PropertyManager[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'pending' | 'suspended'>('all');

  useEffect(() => {
    // Simulate fetching property managers
    setTimeout(() => {
      setManagers([
        {
          id: 1,
          name: 'John Smith',
          email: 'john@bayareapm.com',
          company: 'Bay Area Property Management',
          city: 'San Francisco',
          state: 'CA',
          rating: 4.8,
          reviewCount: 45,
          propertiesManaged: 125,
          status: 'active',
          verified: true,
          joinedDate: '2024-01-15',
        },
        {
          id: 2,
          name: 'Sarah Johnson',
          email: 'sarah@premierpropsf.com',
          company: 'Premier Properties SF',
          city: 'San Francisco',
          state: 'CA',
          rating: 4.9,
          reviewCount: 62,
          propertiesManaged: 87,
          status: 'active',
          verified: true,
          joinedDate: '2024-02-01',
        },
        {
          id: 3,
          name: 'Mike Davis',
          email: 'mike@newpm.com',
          company: 'New Property Management',
          city: 'Oakland',
          state: 'CA',
          rating: 0,
          reviewCount: 0,
          propertiesManaged: 0,
          status: 'pending',
          verified: false,
          joinedDate: '2024-10-28',
        },
      ]);
      setIsLoading(false);
    }, 500);
  }, []);

  const filteredManagers = managers.filter(
    (m) => filter === 'all' || m.status === filter
  );

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      suspended: 'bg-red-100 text-red-800',
    };
    return styles[status as keyof typeof styles] || styles.active;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Property Managers</h1>
            <p className="text-gray-500 mt-1">
              Manage and review all property managers
            </p>
          </div>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
            Add Property Manager
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 border-b">
          {(['all', 'active', 'pending', 'suspended'] as const).map((status) => (
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
              {status === 'all' && ` (${managers.length})`}
              {status !== 'all' &&
                ` (${managers.filter((m) => m.status === status).length})`}
            </button>
          ))}
        </div>

        {/* Property Managers List */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredManagers.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">
                    No property managers found for this filter
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredManagers.map((manager) => (
                <Card key={manager.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-indigo-100 rounded-lg">
                            <Building2 className="w-6 h-6 text-indigo-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg font-semibold text-gray-900">
                                {manager.name}
                              </h3>
                              {manager.verified && (
                                <CheckCircle className="w-5 h-5 text-green-600" />
                              )}
                            </div>
                            <p className="text-indigo-600 font-medium">
                              {manager.company}
                            </p>
                            <p className="text-sm text-gray-600">{manager.email}</p>
                            <div className="flex items-center text-gray-600 mt-2">
                              <MapPin className="w-4 h-4 mr-1" />
                              <span className="text-sm">
                                {manager.city}, {manager.state}
                              </span>
                            </div>

                            {manager.rating > 0 && (
                              <div className="flex items-center gap-2 mt-3">
                                <div className="flex items-center">
                                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                  <span className="ml-1 text-sm font-semibold">
                                    {manager.rating}
                                  </span>
                                </div>
                                <span className="text-sm text-gray-600">
                                  ({manager.reviewCount} reviews)
                                </span>
                              </div>
                            )}

                            <div className="flex items-center gap-4 mt-3">
                              <span
                                className={`px-3 py-1 text-xs rounded-full font-medium ${getStatusBadge(
                                  manager.status
                                )}`}
                              >
                                {manager.status}
                              </span>
                              <span className="text-sm text-gray-600">
                                Joined: {new Date(manager.joinedDate).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="lg:text-right space-y-3">
                        <div>
                          <div className="text-2xl font-bold text-gray-900">
                            {manager.propertiesManaged}
                          </div>
                          <div className="text-sm text-gray-600">
                            Properties Managed
                          </div>
                        </div>
                        <div className="space-y-2">
                          <button className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm">
                            View Details
                          </button>
                          {manager.status === 'pending' && (
                            <>
                              <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
                                Approve
                              </button>
                              <button className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm">
                                Reject
                              </button>
                            </>
                          )}
                          {manager.status === 'active' && (
                            <button className="w-full px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm">
                              Suspend
                            </button>
                          )}
                        </div>
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

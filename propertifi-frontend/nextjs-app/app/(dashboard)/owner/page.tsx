'use client';

import {
  Building2,
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Home,
  Wrench,
  FileText,
  Calendar,
  ArrowUpRight,
} from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Mock data for property owner dashboard
const portfolioMetrics = {
  totalValue: 2450000,
  monthlyRevenue: 18500,
  occupancyRate: 94,
  roi: 12.5,
  properties: 4,
  units: 47,
};

const properties = [
  {
    id: 1,
    name: 'Sunset Apartments',
    address: '456 Oak Street, Austin, TX',
    units: 12,
    occupancy: 11,
    monthlyRevenue: 8400,
    manager: 'John Smith',
    value: 850000,
  },
  {
    id: 2,
    name: 'Downtown Lofts',
    address: '123 Main Street, Los Angeles, CA',
    units: 20,
    occupancy: 19,
    monthlyRevenue: 12000,
    manager: 'Sarah Johnson',
    value: 1200000,
  },
  {
    id: 3,
    name: 'Harbor View Complex',
    address: '789 Beach Ave, Miami, FL',
    units: 10,
    occupancy: 9,
    monthlyRevenue: 6800,
    manager: 'Mike Davis',
    value: 650000,
  },
  {
    id: 4,
    name: 'Oak Street Residences',
    address: '321 Oak St, Seattle, WA',
    units: 5,
    occupancy: 5,
    monthlyRevenue: 4500,
    manager: 'Emily Brown',
    value: 420000,
  },
];

const recentActivity = [
  { type: 'payment', message: 'Rent payment received - Unit 4B', property: 'Sunset Apartments', time: '2 hours ago', amount: '$1,200' },
  { type: 'maintenance', message: 'Maintenance request completed', property: 'Downtown Lofts', time: '5 hours ago' },
  { type: 'lease', message: 'New lease signed - Unit 12A', property: 'Harbor View Complex', time: '1 day ago' },
  { type: 'report', message: 'Monthly financial report available', property: 'All Properties', time: '2 days ago' },
];

const maintenanceRequests = [
  { id: 1, property: 'Sunset Apartments', unit: '4B', issue: 'Leaking faucet', status: 'in_progress', priority: 'medium', date: '2025-01-02' },
  { id: 2, property: 'Downtown Lofts', unit: '12A', issue: 'AC not working', status: 'pending', priority: 'high', date: '2025-01-03' },
  { id: 3, property: 'Harbor View Complex', unit: '7C', issue: 'Window replacement', status: 'completed', priority: 'low', date: '2024-12-28' },
];

function StatCard({ title, value, change, icon: Icon, trend, prefix, suffix }: any) {
  const isPositive = trend === 'up';
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardDescription className="text-sm font-medium">{title}</CardDescription>
          <div className={`p-2 rounded-lg ${isPositive ? 'bg-green-50' : 'bg-blue-50'}`}>
            <Icon className={`h-5 w-5 ${isPositive ? 'text-green-600' : 'text-blue-600'}`} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-gray-900">
          {prefix}{value}{suffix}
        </div>
        {change && (
          <div className={`flex items-center gap-1 mt-2 text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            <TrendIcon className="h-4 w-4" />
            <span>{change} vs last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function OwnerDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Portfolio Overview</h1>
        <p className="text-sm text-gray-600 mt-1">
          Track your real estate investments and property performance
        </p>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Portfolio Value"
          value={portfolioMetrics.totalValue.toLocaleString()}
          prefix="$"
          change="+5.2%"
          icon={Building2}
          trend="up"
        />
        <StatCard
          title="Monthly Revenue"
          value={portfolioMetrics.monthlyRevenue.toLocaleString()}
          prefix="$"
          change="+8.3%"
          icon={DollarSign}
          trend="up"
        />
        <StatCard
          title="Occupancy Rate"
          value={portfolioMetrics.occupancyRate}
          suffix="%"
          change="+2.1%"
          icon={Home}
          trend="up"
        />
        <StatCard
          title="Annual ROI"
          value={portfolioMetrics.roi}
          suffix="%"
          change="+1.5%"
          icon={TrendingUp}
          trend="up"
        />
      </div>

      {/* Property Portfolio */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Property Portfolio</CardTitle>
                  <CardDescription>Performance overview of your {portfolioMetrics.properties} properties</CardDescription>
                </div>
                <Link href="/owner/properties">
                  <Button variant="outline" size="sm">
                    View All
                    <ArrowUpRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {properties.map((property) => {
                  const occupancyRate = Math.round((property.occupancy / property.units) * 100);
                  return (
                    <div key={property.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-indigo-300 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-gray-900">{property.name}</h3>
                            <p className="text-sm text-gray-600">{property.address}</p>
                          </div>
                          <span className="text-lg font-bold text-indigo-600">
                            ${property.monthlyRevenue.toLocaleString()}/mo
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-4 mt-3">
                          <div>
                            <p className="text-xs text-gray-500">Units</p>
                            <p className="text-sm font-semibold text-gray-900">{property.units}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Occupancy</p>
                            <p className={`text-sm font-semibold ${occupancyRate >= 90 ? 'text-green-600' : occupancyRate >= 75 ? 'text-yellow-600' : 'text-red-600'}`}>
                              {occupancyRate}%
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Manager</p>
                            <p className="text-sm font-medium text-gray-700">{property.manager}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates from your properties</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${
                    activity.type === 'payment' ? 'bg-green-50' :
                    activity.type === 'maintenance' ? 'bg-yellow-50' :
                    activity.type === 'lease' ? 'bg-blue-50' :
                    'bg-purple-50'
                  }`}>
                    {activity.type === 'payment' && <DollarSign className="h-4 w-4 text-green-600" />}
                    {activity.type === 'maintenance' && <Wrench className="h-4 w-4 text-yellow-600" />}
                    {activity.type === 'lease' && <FileText className="h-4 w-4 text-blue-600" />}
                    {activity.type === 'report' && <FileText className="h-4 w-4 text-purple-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-600 mt-0.5">{activity.property}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{activity.time}</p>
                  </div>
                  {activity.amount && (
                    <span className="text-sm font-semibold text-green-600">{activity.amount}</span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Maintenance Requests */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Maintenance Requests</CardTitle>
              <CardDescription>Track ongoing and pending maintenance issues</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              View All
              <ArrowUpRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Property</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Unit</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Issue</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Priority</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {maintenanceRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">{request.property}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">{request.unit}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">{request.issue}</td>
                    <td className="py-3 px-4 text-sm">
                      <Badge className={
                        request.priority === 'high' ? 'bg-red-100 text-red-700' :
                        request.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-blue-100 text-blue-700'
                      }>
                        {request.priority}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <Badge className={
                        request.status === 'completed' ? 'bg-green-100 text-green-700' :
                        request.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }>
                        {request.status.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {new Date(request.date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-lg p-6 text-white">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Link href="/owner/properties" className="bg-white/10 hover:bg-white/20 rounded-lg p-4 text-center transition-colors">
            <Building2 className="h-6 w-6 mx-auto mb-2" />
            <span className="text-sm font-medium">My Properties</span>
          </Link>
          <Link href="/owner/managers" className="bg-white/10 hover:bg-white/20 rounded-lg p-4 text-center transition-colors">
            <Users className="h-6 w-6 mx-auto mb-2" />
            <span className="text-sm font-medium">Managers</span>
          </Link>
          <div className="bg-white/10 hover:bg-white/20 rounded-lg p-4 text-center transition-colors cursor-pointer">
            <FileText className="h-6 w-6 mx-auto mb-2" />
            <span className="text-sm font-medium">Reports</span>
          </div>
          <div className="bg-white/10 hover:bg-white/20 rounded-lg p-4 text-center transition-colors cursor-pointer">
            <Calendar className="h-6 w-6 mx-auto mb-2" />
            <span className="text-sm font-medium">Schedule</span>
          </div>
        </div>
      </div>
    </div>
  );
}

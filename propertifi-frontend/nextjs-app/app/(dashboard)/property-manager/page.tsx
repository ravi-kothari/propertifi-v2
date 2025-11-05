'use client';

import { TrendingUp, Users, Calendar, CheckCircle, Clock, Target } from 'lucide-react';
import Link from 'next/link';

// KPI Card Component
function KPICard({ title, value, change, icon: Icon, trend = 'up' }: any) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-2">{value}</h3>
          {change && (
            <p className={`text-sm mt-2 flex items-center gap-1 ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              <TrendingUp className="h-4 w-4" />
              {change} vs last period
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${trend === 'up' ? 'bg-green-50' : 'bg-blue-50'}`}>
          <Icon className={`h-6 w-6 ${trend === 'up' ? 'text-green-600' : 'text-blue-600'}`} />
        </div>
      </div>
    </div>
  );
}

// Recent Activity Item
function ActivityItem({ title, description, time, type }: any) {
  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'new':
        return 'bg-blue-100 text-blue-700';
      case 'tour':
        return 'bg-purple-100 text-purple-700';
      case 'application':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="flex items-start gap-3 py-3">
      <div className={`h-2 w-2 rounded-full mt-2 ${type === 'new' ? 'bg-blue-500' : type === 'tour' ? 'bg-purple-500' : 'bg-green-500'}`} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">{title}</p>
        <p className="text-sm text-gray-500 mt-0.5">{description}</p>
      </div>
      <span className="text-xs text-gray-400">{time}</span>
    </div>
  );
}

export default function PropertyManagerDashboard() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back!</h1>
        <p className="text-gray-600 mt-1">Here's what's happening with your properties today.</p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="New Leads (24h)"
          value="12"
          change="+15%"
          icon={Users}
          trend="up"
        />
        <KPICard
          title="Tours Scheduled"
          value="8"
          change="+20%"
          icon={Calendar}
          trend="up"
        />
        <KPICard
          title="Applications"
          value="5"
          change="+25%"
          icon={CheckCircle}
          trend="up"
        />
        <KPICard
          title="Avg Response Time"
          value="2.4h"
          change="-10%"
          icon={Clock}
          trend="up"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lead Funnel */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Lead Pipeline</h2>
            <Link href="/property-manager/leads" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
              View all leads →
            </Link>
          </div>

          {/* Funnel Visualization */}
          <div className="space-y-3">
            <div className="relative">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">New Inquiries</span>
                <span className="text-sm font-bold text-gray-900">45</span>
              </div>
              <div className="h-12 bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-lg flex items-center px-4 text-white font-medium">
                100% Conversion
              </div>
            </div>

            <div className="relative">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Contacted</span>
                <span className="text-sm font-bold text-gray-900">38</span>
              </div>
              <div className="h-12 bg-gradient-to-r from-blue-500 to-blue-400 rounded-lg flex items-center px-4 text-white font-medium" style={{ width: '84%' }}>
                84% Conversion
              </div>
            </div>

            <div className="relative">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Tour Scheduled</span>
                <span className="text-sm font-bold text-gray-900">28</span>
              </div>
              <div className="h-12 bg-gradient-to-r from-purple-500 to-purple-400 rounded-lg flex items-center px-4 text-white font-medium" style={{ width: '62%' }}>
                62% Conversion
              </div>
            </div>

            <div className="relative">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Application Submitted</span>
                <span className="text-sm font-bold text-gray-900">18</span>
              </div>
              <div className="h-12 bg-gradient-to-r from-green-500 to-green-400 rounded-lg flex items-center px-4 text-white font-medium" style={{ width: '40%' }}>
                40% Conversion
              </div>
            </div>

            <div className="relative">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Lease Signed</span>
                <span className="text-sm font-bold text-gray-900">12</span>
              </div>
              <div className="h-12 bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-lg flex items-center px-4 text-white font-medium" style={{ width: '27%' }}>
                27% Conversion
              </div>
            </div>
          </div>

          {/* Overall Conversion Rate */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Overall Lead-to-Lease Conversion Rate</span>
              <span className="text-lg font-bold text-indigo-600">26.7%</span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-1 divide-y divide-gray-100">
            <ActivityItem
              title="New Lead Received"
              description="123 Main St, Austin TX"
              time="5m ago"
              type="new"
            />
            <ActivityItem
              title="Tour Scheduled"
              description="Sarah Johnson - Tomorrow 2PM"
              time="1h ago"
              type="tour"
            />
            <ActivityItem
              title="Application Submitted"
              description="456 Oak Ave - John Doe"
              time="2h ago"
              type="application"
            />
            <ActivityItem
              title="New Lead Received"
              description="789 Pine Blvd, Los Angeles CA"
              time="3h ago"
              type="new"
            />
            <ActivityItem
              title="Tour Completed"
              description="Michael Anderson - 123 Maple St"
              time="4h ago"
              type="tour"
            />
            <ActivityItem
              title="Application Approved"
              description="Susan Williams - 456 Oak Ave"
              time="5h ago"
              type="application"
            />
          </div>

          <Link
            href="/property-manager/inbox"
            className="block mt-4 text-center text-sm text-indigo-600 hover:text-indigo-700 font-medium"
          >
            View all activity →
          </Link>
        </div>
      </div>

      {/* Upcoming Tours */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Upcoming Tours This Week</h2>
          <Link href="/property-manager/calendar" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
            View calendar →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { property: '456 Oak St', tenant: 'Sarah Johnson', date: 'Tomorrow', time: '2:00 PM', units: 50 },
            { property: '789 Pine Blvd', tenant: 'Mike Davis', date: 'Wednesday', time: '10:30 AM', units: 100 },
            { property: '123 Maple Ave', tenant: 'Emma Wilson', date: 'Thursday', time: '3:00 PM', units: 25 },
          ].map((tour, i) => (
            <div key={i} className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:shadow-sm transition-all">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-medium text-gray-900">{tour.property}</p>
                  <p className="text-sm text-gray-600">{tour.units} units</p>
                </div>
                <Calendar className="h-5 w-5 text-indigo-600" />
              </div>
              <p className="text-sm text-gray-700 mt-2">{tour.tenant}</p>
              <p className="text-xs text-gray-500 mt-1">{tour.date} at {tour.time}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-lg p-6 text-white">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Link href="/property-manager/leads" className="bg-white/10 hover:bg-white/20 rounded-lg p-4 text-center transition-colors">
            <Users className="h-6 w-6 mx-auto mb-2" />
            <span className="text-sm font-medium">View Leads</span>
          </Link>
          <Link href="/property-manager/calendar" className="bg-white/10 hover:bg-white/20 rounded-lg p-4 text-center transition-colors">
            <Calendar className="h-6 w-6 mx-auto mb-2" />
            <span className="text-sm font-medium">Schedule Tour</span>
          </Link>
          <Link href="/property-manager/properties" className="bg-white/10 hover:bg-white/20 rounded-lg p-4 text-center transition-colors">
            <Target className="h-6 w-6 mx-auto mb-2" />
            <span className="text-sm font-medium">Manage Properties</span>
          </Link>
          <Link href="/property-manager/analytics" className="bg-white/10 hover:bg-white/20 rounded-lg p-4 text-center transition-colors">
            <TrendingUp className="h-6 w-6 mx-auto mb-2" />
            <span className="text-sm font-medium">View Analytics</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

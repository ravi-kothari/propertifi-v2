'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getDashboardStats } from '@/lib/admin-api';
import type { DashboardStats } from '@/types/admin';
import {
  Users,
  UserCheck,
  Building2,
  FileText,
  TrendingUp,
  DollarSign,
  Activity,
  CheckCircle,
} from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true);
        const data = await getDashboardStats();
        setStats(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to load dashboard statistics');
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500 mt-1">Welcome to your admin dashboard</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-8 rounded" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-20 mb-2" />
                  <Skeleton className="h-3 w-32" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error || !stats) {
    return (
      <AdminLayout>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600">Error: {error || 'Failed to load dashboard'}</p>
          </CardContent>
        </Card>
      </AdminLayout>
    );
  }

  const overviewCards = [
    {
      title: 'Total Users',
      value: stats.overview.total_users,
      change: '+12.5%',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Active Users',
      value: stats.overview.active_users,
      change: '+8.2%',
      icon: UserCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Property Managers',
      value: stats.overview.total_property_managers,
      subtitle: `${stats.overview.verified_property_managers} verified`,
      icon: Building2,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Total Leads',
      value: stats.overview.total_leads,
      subtitle: `${stats.overview.distributed_leads} distributed`,
      icon: FileText,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      title: 'Monthly Revenue (MRR)',
      value: `$${stats.revenue_stats.mrr.toLocaleString()}`,
      change: '+18.2%',
      icon: DollarSign,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
    },
    {
      title: 'Annual Revenue (ARR)',
      value: `$${stats.revenue_stats.arr.toLocaleString()}`,
      subtitle: `${stats.revenue_stats.active_subscriptions} subscriptions`,
      icon: TrendingUp,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-100',
    },
    {
      title: 'Response Rate',
      value: `${stats.lead_stats.response_rate.toFixed(1)}%`,
      change: '+5.3%',
      icon: Activity,
      color: 'text-pink-600',
      bgColor: 'bg-pink-100',
    },
    {
      title: 'Distribution Rate',
      value: `${stats.lead_stats.distribution_rate.toFixed(1)}%`,
      change: '+3.1%',
      icon: CheckCircle,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome to your admin dashboard</p>
        </div>

        {/* Overview Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {overviewCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {card.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${card.bgColor}`}>
                    <Icon className={`h-5 w-5 ${card.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{card.value}</div>
                  {card.change && (
                    <p className="text-xs text-green-600 mt-1">
                      {card.change} from last month
                    </p>
                  )}
                  {card.subtitle && (
                    <p className="text-xs text-gray-500 mt-1">{card.subtitle}</p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Lead Statistics */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Lead Performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">This Month</span>
                <span className="text-lg font-semibold">{stats.lead_stats.total_this_month}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Last Month</span>
                <span className="text-lg font-semibold">{stats.lead_stats.total_last_month}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Growth</span>
                <span className={`text-lg font-semibold ${stats.lead_stats.growth_percentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stats.lead_stats.growth_percentage >= 0 ? '+' : ''}{stats.lead_stats.growth_percentage.toFixed(1)}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Avg Quality Score</span>
                <span className="text-lg font-semibold">{stats.lead_stats.average_quality_score.toFixed(1)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>User Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">New This Month</span>
                <span className="text-lg font-semibold">{stats.user_stats.new_this_month}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Pending Verification</span>
                <span className="text-lg font-semibold">{stats.user_stats.pending_verification}</span>
              </div>
              <div className="pt-2">
                <p className="text-sm font-medium text-gray-600 mb-2">PMs by Tier</p>
                <div className="space-y-2">
                  {stats.user_stats.pm_by_tier.map((tier, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{tier.tier_name}</span>
                      <span className="font-medium">{tier.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Leads</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.recent_activity.recent_leads.map((lead) => (
                  <div key={lead.id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{lead.name}</p>
                      <p className="text-xs text-gray-500">
                        {lead.property_type} in {lead.state}
                      </p>
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(lead.created_at).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.recent_activity.recent_users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                      {user.type}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}

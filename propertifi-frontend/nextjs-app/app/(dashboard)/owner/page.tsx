'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  ClipboardDocumentListIcon,
  CalculatorIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '@/hooks/useAuth';
import { getDashboardData } from '@/lib/owner-api';
import { DashboardStats } from '@/components/owner/DashboardStats';
import { LeadCard } from '@/components/owner/LeadCard';
import { RecentActivity } from '@/components/owner/RecentActivity';
import { EmptyState } from '@/components/owner/EmptyState';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function OwnerDashboard() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [isMounted, setIsMounted] = useState(false);

  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Redirect if not authenticated
  useEffect(() => {
    if (isMounted && !isAuthenticated) {
      router.push('/login');
    }
  }, [isMounted, isAuthenticated, router]);

  // Fetch dashboard data
  const { data, isLoading, error } = useQuery({
    queryKey: ['owner-dashboard'],
    queryFn: getDashboardData,
    enabled: isMounted && isAuthenticated,
  });

  // Don't render until mounted to prevent hydration mismatch
  if (!isMounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading dashboard</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.name?.split(' ')[0]}!
        </h1>
        <p className="text-gray-600">
          Here's what's happening with your property search
        </p>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex flex-wrap gap-4"
      >
        <Button
          size="lg"
          onClick={() => router.push('/get-started')}
          className="gap-2"
        >
          <PlusIcon className="h-5 w-5" />
          Submit New Lead
        </Button>
        <Button
          size="lg"
          variant="outline"
          onClick={() => router.push('/property-managers')}
          className="gap-2"
        >
          <MagnifyingGlassIcon className="h-5 w-5" />
          Find Managers
        </Button>
        <Button
          size="lg"
          variant="outline"
          onClick={() => router.push('/calculators')}
          className="gap-2"
        >
          <CalculatorIcon className="h-5 w-5" />
          Calculators
        </Button>
      </motion.div>

      {/* Statistics Cards */}
      <DashboardStats stats={data.stats} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Leads */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Leads</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push('/owner/leads')}
                >
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {data.recent_leads && data.recent_leads.length > 0 ? (
                <div className="space-y-4">
                  {data.recent_leads.slice(0, 3).map((lead) => (
                    <LeadCard
                      key={lead.id}
                      lead={lead}
                      onViewDetails={(lead) =>
                        router.push(`/owner/leads/${lead.id}`)
                      }
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={ClipboardDocumentListIcon}
                  title="No Leads Yet"
                  description="Submit your first property lead to get matched with property managers."
                  actionLabel="Submit a Lead"
                  onAction={() => router.push('/get-started')}
                />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <RecentActivity activities={data.recent_activity || []} />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tips Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">💡</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Quick Tip
                </h3>
                <p className="text-gray-700">
                  Save property managers you're interested in to easily contact them
                  later. You can also save your calculator results to compare different
                  investment scenarios.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

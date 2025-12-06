'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import {
  ArrowLeftIcon,
  MapPinIcon,
  HomeIcon,
  EyeIcon,
  UserGroupIcon,
  CheckCircleIcon,
  ClockIcon,
  DocumentTextIcon,
  UserPlusIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '@/hooks/useAuth';
import { getLead } from '@/lib/owner-api';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const statusColors = {
  new: 'bg-blue-100 text-blue-700 border-blue-200',
  matched: 'bg-green-100 text-green-700 border-green-200',
  contacted: 'bg-purple-100 text-purple-700 border-purple-200',
  closed: 'bg-gray-100 text-gray-700 border-gray-200',
};

const statusLabels = {
  new: 'New',
  matched: 'Matched',
  contacted: 'Contacted',
  closed: 'Closed',
};

const propertyTypeLabels: Record<string, string> = {
  single_family: 'Single Family',
  multi_family: 'Multi Family',
  apartment: 'Apartment',
  condo: 'Condo',
  townhouse: 'Townhouse',
  commercial: 'Commercial',
};

const timelineIcons: Record<string, React.ElementType> = {
  document: DocumentTextIcon,
  'user-plus': UserPlusIcon,
  eye: EyeIcon,
  'check-circle': CheckCircleIcon,
};

export default function LeadDetailPage() {
  const router = useRouter();
  const params = useParams();
  const leadId = params?.id as string;
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const { data, isLoading, error } = useQuery({
    queryKey: ['lead-detail', leadId],
    queryFn: () => getLead(parseInt(leadId)),
    enabled: isAuthenticated && !!leadId,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading lead details...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading lead details</p>
          <Button onClick={() => router.push('/owner')}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  const { lead, stats, assignments, timeline } = data;

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => router.push('/owner')}
        className="gap-2"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Back to Dashboard
      </Button>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-md border p-6"
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Badge className={statusColors[lead.status as keyof typeof statusColors]}>
                {statusLabels[lead.status as keyof typeof statusLabels]}
              </Badge>
              <span className="text-sm text-gray-500">
                #{lead.confirmation_number}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              {lead.property_address}
            </h1>
            <div className="flex items-center text-gray-600">
              <MapPinIcon className="h-5 w-5 mr-2" />
              {lead.property_city}, {lead.property_state} {lead.property_zip}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
          <div className="flex items-center text-sm text-gray-600">
            <HomeIcon className="h-5 w-5 mr-2 text-gray-400" />
            <span>{propertyTypeLabels[lead.property_type] || lead.property_type}</span>
          </div>
          {lead.number_of_units && (
            <div className="text-sm text-gray-600">
              <span className="font-medium">{lead.number_of_units}</span> Units
            </div>
          )}
          {lead.square_footage && (
            <div className="text-sm text-gray-600">
              <span className="font-medium">{lead.square_footage.toLocaleString()}</span> sq ft
            </div>
          )}
          <div className="flex items-center text-sm text-gray-600">
            <ClockIcon className="h-5 w-5 mr-2 text-gray-400" />
            {format(new Date(lead.created_at), 'MMM dd, yyyy')}
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-5 gap-4"
      >
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Views</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total_views}</p>
              </div>
              <EyeIcon className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Unique Viewers</p>
                <p className="text-2xl font-bold text-gray-900">{stats.unique_viewers}</p>
              </div>
              <UserGroupIcon className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Matches</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total_matches}</p>
              </div>
              <UserPlusIcon className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Contacted</p>
                <p className="text-2xl font-bold text-gray-900">{stats.contacted_count}</p>
              </div>
              <EyeIcon className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Accepted</p>
                <p className="text-2xl font-bold text-gray-900">{stats.accepted_count}</p>
              </div>
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Manager Assignments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <CardTitle>Matched Property Managers</CardTitle>
            </CardHeader>
            <CardContent>
              {assignments.length > 0 ? (
                <div className="space-y-4">
                  {assignments.map((assignment) => (
                    <div
                      key={assignment.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-gray-900">
                          {assignment.manager_name}
                        </p>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                          {assignment.distance_miles && (
                            <span>{assignment.distance_miles.toFixed(1)} miles</span>
                          )}
                          <span>Score: {assignment.match_score}%</span>
                        </div>
                      </div>
                      <Badge
                        className={
                          assignment.status === 'accepted'
                            ? 'bg-green-100 text-green-700'
                            : assignment.status === 'contacted'
                            ? 'bg-purple-100 text-purple-700'
                            : assignment.status === 'rejected'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-gray-100 text-gray-700'
                        }
                      >
                        {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <UserGroupIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No managers matched yet</p>
                  <p className="text-sm text-gray-400 mt-1">
                    We're working on finding the best matches for your property.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Activity Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              {timeline.length > 0 ? (
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                  <div className="space-y-6">
                    {timeline.map((event, index) => {
                      const IconComponent = timelineIcons[event.icon] || DocumentTextIcon;
                      return (
                        <div key={index} className="relative flex items-start pl-10">
                          <div className="absolute left-0 w-8 h-8 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center">
                            <IconComponent className="h-4 w-4 text-gray-500" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 text-sm">
                              {event.title}
                            </p>
                            <p className="text-sm text-gray-500 mt-0.5">
                              {event.description}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {format(new Date(event.timestamp), 'MMM dd, yyyy h:mm a')}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <ClockIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No activity yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

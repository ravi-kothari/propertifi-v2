'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import ProfileTab from './components/ProfileTab';
import LeadCriteriaTab from './components/LeadCriteriaTab';
import NotificationsTab from './components/NotificationsTab';

// Types
export interface PreferencesData {
  profile: {
    name: string;
    email: string;
    phone: string;
    company_name: string;
    bio: string;
  };
  leadCriteria: {
    property_types: string[];
    zip_codes: string[];
    min_units: number | null;
    max_units: number | null;
    service_radius_miles: number;
    latitude: number | null;
    longitude: number | null;
  };
  notifications: {
    email_notifications: boolean;
    sms_notifications: boolean;
  };
  subscription: {
    tier_id: number | null;
    tier_name: string;
    exclusivity_hours: number;
  };
}

// API functions
async function fetchPreferences(): Promise<PreferencesData> {
  const response = await fetch('/api/v1/preferences', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch preferences');
  }

  return response.json();
}

async function updatePreferences(data: Partial<PreferencesData>): Promise<{ data: PreferencesData }> {
  const response = await fetch('/api/v1/preferences', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update preferences');
  }

  return response.json();
}

export default function PreferencesPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch preferences
  const { data: preferences, isLoading, error } = useQuery<PreferencesData>({
    queryKey: ['preferences'],
    queryFn: fetchPreferences,
  });

  // Update preferences mutation
  const updateMutation = useMutation({
    mutationFn: updatePreferences,
    onSuccess: (response) => {
      queryClient.setQueryData(['preferences'], response.data);
      toast({
        title: 'Success',
        description: 'Your preferences have been updated successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update preferences.',
        variant: 'destructive',
      });
    },
  });

  const handleSave = (data: Partial<PreferencesData>) => {
    updateMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Failed to load preferences. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Preferences</h1>
        <p className="text-gray-600 mt-2">
          Manage your profile, lead preferences, and notification settings
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="lead-criteria">Lead Criteria</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-4">
              <ProfileTab
                data={preferences}
                onSave={handleSave}
                isSaving={updateMutation.isPending}
              />
            </TabsContent>

            <TabsContent value="lead-criteria" className="space-y-4">
              <LeadCriteriaTab
                data={preferences}
                onSave={handleSave}
                isSaving={updateMutation.isPending}
              />
            </TabsContent>

            <TabsContent value="notifications" className="space-y-4">
              <NotificationsTab
                data={preferences}
                onSave={handleSave}
                isSaving={updateMutation.isPending}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Subscription Info */}
      {preferences?.subscription && (
        <Card>
          <CardHeader>
            <CardTitle>Current Subscription</CardTitle>
            <CardDescription>Your subscription tier and benefits</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold capitalize">
                  {preferences.subscription.tier_name} Tier
                </p>
                <p className="text-sm text-gray-600">
                  {preferences.subscription.exclusivity_hours > 0
                    ? `${preferences.subscription.exclusivity_hours} hours early access to new leads`
                    : 'Standard lead access'}
                </p>
              </div>
              {preferences.subscription.tier_name !== 'enterprise' && (
                <Button variant="outline">Upgrade Plan</Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getUser } from '@/lib/admin-api';
import type { UserWithStats } from '@/types/admin';
import { useToast } from '@/hooks/use-toast';
import {
  User,
  Mail,
  Phone,
  Building2,
  Calendar,
  CheckCircle,
  XCircle,
  BarChart3,
  Eye,
  MessageSquare,
} from 'lucide-react';

interface UserDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: number;
}

export default function UserDetailDialog({
  open,
  onOpenChange,
  userId,
}: UserDetailDialogProps) {
  const [user, setUser] = useState<UserWithStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (open && userId) {
      loadUser();
    }
  }, [open, userId]);

  async function loadUser() {
    try {
      setLoading(true);
      const data = await getUser(userId);
      setUser(data);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to load user details',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <Skeleton className="h-8 w-48" />
          </DialogHeader>
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!user) return null;

  const statusConfig = {
    0: { label: 'Inactive', color: 'bg-gray-100 text-gray-700' },
    1: { label: 'Active', color: 'bg-green-100 text-green-700' },
    2: { label: 'Suspended', color: 'bg-red-100 text-red-700' },
    3: { label: 'Deleted', color: 'bg-gray-100 text-gray-700' },
  };

  const status = statusConfig[user.status];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            User Details
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="statistics">Statistics</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Full Name</p>
                    <p className="text-base font-medium mt-1">{user.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">User Type</p>
                    <Badge className="mt-1 bg-blue-100 text-blue-700">
                      {user.type}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-base mt-1 flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      {user.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Mobile</p>
                    <p className="text-base mt-1 flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      {user.mobile || 'N/A'}
                    </p>
                  </div>
                  {user.company_name && (
                    <div className="col-span-2">
                      <p className="text-sm font-medium text-gray-500">Company</p>
                      <p className="text-base mt-1 flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-gray-400" />
                        {user.company_name}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Status & Verification */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Status & Verification</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Account Status</p>
                    <Badge className={`mt-1 ${status.color}`}>
                      {status.label}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Verification Status</p>
                    <div className="mt-1 flex items-center gap-2">
                      {user.is_verified ? (
                        <>
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <span className="text-green-700 font-medium">Verified</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-5 w-5 text-gray-400" />
                          <span className="text-gray-500">Not Verified</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Joined Date</p>
                    <p className="text-base mt-1 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      {new Date(user.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  {user.last_login && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Last Login</p>
                      <p className="text-base mt-1 flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        {new Date(user.last_login).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                  {user.verified_at && (
                    <div className="col-span-2">
                      <p className="text-sm font-medium text-gray-500">Verified At</p>
                      <p className="text-base mt-1 flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        {new Date(user.verified_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Role & Permissions */}
            {user.role && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Role & Permissions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Role</p>
                      <p className="text-base font-medium mt-1">{user.role.title}</p>
                      {user.role.description && (
                        <p className="text-sm text-gray-500 mt-1">{user.role.description}</p>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-2">Permissions</p>
                      <div className="flex flex-wrap gap-2">
                        {user.role.permissions.map((permission) => (
                          <Badge key={permission} variant="default" className="text-xs">
                            {permission}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Subscription Info */}
            {user.preferences && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Subscription</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Tier</p>
                      <p className="text-base font-medium mt-1">
                        {user.preferences.tier?.title || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Status</p>
                      <Badge className={`mt-1 ${user.preferences.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                        {user.preferences.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email Notifications</p>
                      <div className="mt-1 flex items-center gap-2">
                        {user.preferences.email_notifications ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-gray-400" />
                        )}
                        <span>{user.preferences.email_notifications ? 'Enabled' : 'Disabled'}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">SMS Notifications</p>
                      <div className="mt-1 flex items-center gap-2">
                        {user.preferences.sms_notifications ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-gray-400" />
                        )}
                        <span>{user.preferences.sms_notifications ? 'Enabled' : 'Disabled'}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="statistics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Lead Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">
                      {user.statistics.total_leads}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">Total Leads</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <Eye className="h-6 w-6 mx-auto text-green-600 mb-2" />
                    <p className="text-2xl font-bold text-green-600">
                      {user.statistics.viewed_leads}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">Viewed</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <MessageSquare className="h-6 w-6 mx-auto text-purple-600 mb-2" />
                    <p className="text-2xl font-bold text-purple-600">
                      {user.statistics.responded_leads}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">Responded</p>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">View Rate</span>
                      <span className="font-medium">
                        {user.statistics.total_leads > 0
                          ? ((user.statistics.viewed_leads / user.statistics.total_leads) * 100).toFixed(1)
                          : 0}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{
                          width: `${user.statistics.total_leads > 0
                            ? (user.statistics.viewed_leads / user.statistics.total_leads) * 100
                            : 0}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Response Rate</span>
                      <span className="font-medium">
                        {user.statistics.total_leads > 0
                          ? ((user.statistics.responded_leads / user.statistics.total_leads) * 100).toFixed(1)
                          : 0}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-500 h-2 rounded-full"
                        style={{
                          width: `${user.statistics.total_leads > 0
                            ? (user.statistics.responded_leads / user.statistics.total_leads) * 100
                            : 0}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

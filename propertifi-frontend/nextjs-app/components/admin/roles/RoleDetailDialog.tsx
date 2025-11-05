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
import { Separator } from '@/components/ui/separator';
import { getRole } from '@/lib/admin-api';
import type { RoleWithUsers } from '@/types/admin';
import { useToast } from '@/hooks/use-toast';
import {
  Shield,
  Users,
  CheckCircle,
  Calendar,
  Mail,
  User,
} from 'lucide-react';

interface RoleDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roleId: number;
}

export default function RoleDetailDialog({
  open,
  onOpenChange,
  roleId,
}: RoleDetailDialogProps) {
  const [role, setRole] = useState<RoleWithUsers | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (open && roleId) {
      loadRole();
    }
  }, [open, roleId]);

  async function loadRole() {
    try {
      setLoading(true);
      const data = await getRole(roleId);
      setRole(data);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to load role details',
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
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!role) return null;

  // Group permissions by category (simple grouping based on prefixes)
  const groupedPermissions: { [key: string]: string[] } = {};
  role.permissions.forEach((perm) => {
    const category = perm.split('_')[0] || 'other';
    if (!groupedPermissions[category]) {
      groupedPermissions[category] = [];
    }
    groupedPermissions[category].push(perm);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            {role.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Role Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Role Name</p>
                  <p className="text-base font-medium mt-1">{role.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Display Title</p>
                  <p className="text-base font-medium mt-1">{role.title}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium text-gray-500">Description</p>
                  <p className="text-base mt-1 text-gray-700">
                    {role.description || 'No description provided'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <Badge className="mt-1" variant="default">
                    {role.status === 1 ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Type</p>
                  <div className="flex gap-2 mt-1">
                    {role.is_admin && (
                      <Badge className="bg-red-100 text-red-700">Admin Role</Badge>
                    )}
                    {role.is_default && (
                      <Badge variant="default">Default Role</Badge>
                    )}
                    {!role.is_admin && !role.is_default && (
                      <span className="text-sm text-gray-500">Standard Role</span>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Created</p>
                  <p className="text-base mt-1 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    {new Date(role.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Last Updated</p>
                  <p className="text-base mt-1 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    {new Date(role.updated_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Users with this role */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5" />
                Users ({role.users_count || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {role.sample_users && role.sample_users.length > 0 ? (
                <div className="space-y-3">
                  {role.sample_users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {user.email}
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-blue-100 text-blue-700">
                        {user.type}
                      </Badge>
                    </div>
                  ))}
                  {(role.users_count || 0) > 5 && (
                    <p className="text-sm text-gray-500 text-center pt-2">
                      And {(role.users_count || 0) - 5} more users...
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">
                  No users assigned to this role yet
                </p>
              )}
            </CardContent>
          </Card>

          {/* Permissions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Permissions ({role.permissions.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {role.permissions.length > 0 ? (
                <div className="space-y-4">
                  {Object.entries(groupedPermissions).map(([category, perms]) => (
                    <div key={category} className="space-y-2">
                      <h4 className="text-sm font-semibold text-gray-700 capitalize">
                        {category.replace(/_/g, ' ')}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {perms.map((perm) => (
                          <Badge
                            key={perm}
                            variant="default"
                            className="text-xs font-normal"
                          >
                            {perm.replace(/_/g, ' ')}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">
                  No permissions assigned
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}

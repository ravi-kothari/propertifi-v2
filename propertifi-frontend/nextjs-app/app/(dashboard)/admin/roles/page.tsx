'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import AdminLayout from '@/components/layout/AdminLayout';
import { getRoles, deleteRole } from '@/lib/admin-api';
import type { Role } from '@/types/admin';
import {
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Copy,
  Shield,
  Users,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import CreateRoleDialog from '@/components/admin/roles/CreateRoleDialog';
import EditRoleDialog from '@/components/admin/roles/EditRoleDialog';
import RoleDetailDialog from '@/components/admin/roles/RoleDetailDialog';
import CloneRoleDialog from '@/components/admin/roles/CloneRoleDialog';

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [cloneDialogOpen, setCloneDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadRoles();
  }, []);

  async function loadRoles() {
    try {
      setLoading(true);
      const response = await getRoles();
      setRoles(response.data.data);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to load roles',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  const handleDeleteRole = async (role: Role) => {
    if (role.is_default) {
      toast({
        title: 'Cannot delete',
        description: 'Default roles cannot be deleted',
        variant: 'destructive',
      });
      return;
    }

    if (!confirm(`Are you sure you want to delete the role "${role.title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteRole(role.id);
      toast({
        title: 'Success',
        description: 'Role deleted successfully',
      });
      loadRoles();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || error.message || 'Failed to delete role',
        variant: 'destructive',
      });
    }
  };

  const filteredRoles = roles.filter(
    (role) =>
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Roles & Permissions</h1>
            <p className="text-gray-500 mt-1">Manage user roles and their permissions</p>
          </div>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Role
          </Button>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search roles by name or title..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Roles Grid */}
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-32 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredRoles.map((role) => (
              <Card
                key={role.id}
                className="hover:shadow-lg transition-shadow cursor-pointer group"
                onClick={() => {
                  setSelectedRole(role);
                  setDetailDialogOpen(true);
                }}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-blue-600" />
                        {role.title}
                        {role.is_default && (
                          <Badge variant="default" className="text-xs">
                            Default
                          </Badge>
                        )}
                        {role.is_admin && (
                          <Badge className="text-xs bg-red-100 text-red-700">
                            Admin
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="mt-2 line-clamp-2">
                        {role.description || 'No description provided'}
                      </CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRole(role);
                            setDetailDialogOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRole(role);
                            setEditDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRole(role);
                            setCloneDialogOpen(true);
                          }}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Clone
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600"
                          disabled={role.is_default}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteRole(role);
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Users
                      </span>
                      <span className="font-semibold">{role.users_count || 0}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Permissions</span>
                      <Badge variant="default">{role.permissions.length}</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Status</span>
                      <Badge variant="default">
                        {role.status === 1 ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>

                  {/* Permission Preview */}
                  {role.permissions.length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-xs text-gray-500 mb-2">Top Permissions:</p>
                      <div className="flex flex-wrap gap-1">
                        {role.permissions.slice(0, 3).map((perm) => (
                          <Badge
                            key={perm}
                            variant="default"
                            className="text-xs px-2 py-0"
                          >
                            {perm.replace(/_/g, ' ')}
                          </Badge>
                        ))}
                        {role.permissions.length > 3 && (
                          <Badge variant="default" className="text-xs px-2 py-0">
                            +{role.permissions.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && filteredRoles.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No roles found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm
                  ? 'Try adjusting your search term'
                  : 'Get started by creating your first role'}
              </p>
              {!searchTerm && (
                <Button onClick={() => setCreateDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Role
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Dialogs */}
      <CreateRoleDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSuccess={loadRoles}
      />
      {selectedRole && (
        <>
          <EditRoleDialog
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            role={selectedRole}
            onSuccess={loadRoles}
          />
          <RoleDetailDialog
            open={detailDialogOpen}
            onOpenChange={setDetailDialogOpen}
            roleId={selectedRole.id}
          />
          <CloneRoleDialog
            open={cloneDialogOpen}
            onOpenChange={setCloneDialogOpen}
            role={selectedRole}
            onSuccess={loadRoles}
          />
        </>
      )}
    </AdminLayout>
  );
}

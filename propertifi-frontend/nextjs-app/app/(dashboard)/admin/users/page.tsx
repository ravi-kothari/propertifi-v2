'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import AdminLayout from '@/components/layout/AdminLayout';
import { getUsers, deleteUser, bulkUpdateUsers, verifyUser } from '@/lib/admin-api';
import type { AdminUser, UserFilters, UserType, UserStatus } from '@/types/admin';
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Eye,
  UserCog,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import CreateUserDialog from '@/components/admin/users/CreateUserDialog';
import EditUserDialog from '@/components/admin/users/EditUserDialog';
import UserDetailDialog from '@/components/admin/users/UserDetailDialog';

export default function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [filters, setFilters] = useState<UserFilters>({
    page: 1,
    per_page: 10,
  });
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadUsers();
  }, [filters]);

  async function loadUsers() {
    try {
      setLoading(true);
      const response = await getUsers(filters);
      setUsers(response.data.data);
      setTotalPages(response.data.last_page);
      setTotalUsers(response.data.total);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to load users',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  const handleSearch = (value: string) => {
    setFilters({ ...filters, search: value, page: 1 });
  };

  const handleFilterChange = (key: keyof UserFilters, value: any) => {
    setFilters({ ...filters, [key]: value, page: 1 });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(users.map((u) => u.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (userId: number, checked: boolean) => {
    if (checked) {
      setSelectedUsers([...selectedUsers, userId]);
    } else {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    }
  };

  const handleBulkAction = async (action: 'activate' | 'deactivate' | 'verify' | 'unverify' | 'delete') => {
    if (selectedUsers.length === 0) {
      toast({
        title: 'No users selected',
        description: 'Please select users to perform bulk action',
        variant: 'destructive',
      });
      return;
    }

    try {
      await bulkUpdateUsers({ user_ids: selectedUsers, action });
      toast({
        title: 'Success',
        description: `Successfully ${action}d ${selectedUsers.length} users`,
      });
      setSelectedUsers([]);
      loadUsers();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to perform bulk action',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      await deleteUser(userId);
      toast({
        title: 'Success',
        description: 'User deleted successfully',
      });
      loadUsers();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete user',
        variant: 'destructive',
      });
    }
  };

  const handleVerifyUser = async (userId: number, isVerified: boolean) => {
    try {
      await verifyUser(userId, isVerified);
      toast({
        title: 'Success',
        description: `User ${isVerified ? 'verified' : 'unverified'} successfully`,
      });
      loadUsers();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to verify user',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: UserStatus) => {
    const statusMap = {
      0: { label: 'Inactive', variant: 'default' as const },
      1: { label: 'Active', variant: 'verified' as const },
      2: { label: 'Suspended', variant: 'default' as const },
      3: { label: 'Deleted', variant: 'default' as const },
    };
    const config = statusMap[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getTypeBadge = (type: UserType) => {
    const typeColors = {
      admin: 'bg-red-100 text-red-700',
      AccountManager: 'bg-purple-100 text-purple-700',
      pm: 'bg-blue-100 text-blue-700',
      owner: 'bg-green-100 text-green-700',
    };
    return (
      <Badge className={typeColors[type] || 'bg-gray-100 text-gray-700'}>
        {type}
      </Badge>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Users</h1>
            <p className="text-gray-500 mt-1">Manage user accounts and permissions</p>
          </div>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by name or email..."
                    className="pl-10"
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>
              </div>
              <Select
                value={filters.type}
                onValueChange={(value) => handleFilterChange('type', value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="User Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="AccountManager">Account Manager</SelectItem>
                  <SelectItem value="pm">Property Manager</SelectItem>
                  <SelectItem value="owner">Owner</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={filters.status?.toString()}
                onValueChange={(value) => handleFilterChange('status', parseInt(value))}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="1">Active</SelectItem>
                  <SelectItem value="0">Inactive</SelectItem>
                  <SelectItem value="2">Suspended</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={filters.is_verified?.toString()}
                onValueChange={(value) => handleFilterChange('is_verified', value === 'true')}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Verification" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="true">Verified</SelectItem>
                  <SelectItem value="false">Unverified</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Bulk Actions */}
        {selectedUsers.length > 0 && (
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-900">
                  {selectedUsers.length} user(s) selected
                </span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleBulkAction('activate')}
                  >
                    Activate
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleBulkAction('deactivate')}
                  >
                    Deactivate
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleBulkAction('verify')}
                  >
                    Verify
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleBulkAction('delete')}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              {totalUsers} {totalUsers === 1 ? 'User' : 'Users'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedUsers.length === users.length && users.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Verified</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedUsers.includes(user.id)}
                          onCheckedChange={(checked) =>
                            handleSelectUser(user.id, checked as boolean)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                          {user.company_name && (
                            <p className="text-xs text-gray-400">{user.company_name}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{getTypeBadge(user.type)}</TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell>
                        {user.is_verified ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-gray-400" />
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {new Date(user.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedUser(user);
                                setDetailDialogOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedUser(user);
                                setEditDialogOpen(true);
                              }}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            {user.type === 'pm' && (
                              <DropdownMenuItem
                                onClick={() => handleVerifyUser(user.id, !user.is_verified)}
                              >
                                <UserCog className="h-4 w-4 mr-2" />
                                {user.is_verified ? 'Unverify' : 'Verify'}
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDeleteUser(user.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-gray-500">
                  Page {filters.page} of {totalPages}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={filters.page === 1}
                    onClick={() => setFilters({ ...filters, page: (filters.page || 1) - 1 })}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={filters.page === totalPages}
                    onClick={() => setFilters({ ...filters, page: (filters.page || 1) + 1 })}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialogs */}
      <CreateUserDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSuccess={loadUsers}
      />
      {selectedUser && (
        <>
          <EditUserDialog
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            user={selectedUser}
            onSuccess={loadUsers}
          />
          <UserDetailDialog
            open={detailDialogOpen}
            onOpenChange={setDetailDialogOpen}
            userId={selectedUser.id}
          />
        </>
      )}
    </AdminLayout>
  );
}

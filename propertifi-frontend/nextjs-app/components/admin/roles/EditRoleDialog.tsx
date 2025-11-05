'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { updateRole, getAvailablePermissions } from '@/lib/admin-api';
import { useToast } from '@/hooks/use-toast';
import type { Role, AvailablePermissions } from '@/types/admin';
import { Skeleton } from '@/components/ui/skeleton';

const editRoleSchema = z.object({
  name: z.string().min(2).regex(/^[a-z_]+$/).optional(),
  title: z.string().min(2).optional(),
  description: z.string().optional(),
  permissions: z.array(z.string()).min(1, 'Select at least one permission'),
  is_admin: z.boolean(),
  is_default: z.boolean(),
});

type EditRoleFormData = z.infer<typeof editRoleSchema>;

interface EditRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: Role;
  onSuccess: () => void;
}

export default function EditRoleDialog({
  open,
  onOpenChange,
  role,
  onSuccess,
}: EditRoleDialogProps) {
  const [loading, setLoading] = useState(false);
  const [loadingPermissions, setLoadingPermissions] = useState(true);
  const [availablePermissions, setAvailablePermissions] = useState<AvailablePermissions | null>(null);
  const { toast } = useToast();

  const form = useForm<EditRoleFormData>({
    resolver: zodResolver(editRoleSchema),
  });

  useEffect(() => {
    if (open && role) {
      form.reset({
        name: role.name,
        title: role.title,
        description: role.description || '',
        permissions: role.permissions,
        is_admin: role.is_admin,
        is_default: role.is_default,
      });
      loadPermissions();
    }
  }, [open, role, form]);

  async function loadPermissions() {
    try {
      setLoadingPermissions(true);
      const data = await getAvailablePermissions();
      setAvailablePermissions(data);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to load permissions',
        variant: 'destructive',
      });
    } finally {
      setLoadingPermissions(false);
    }
  }

  const onSubmit = async (data: EditRoleFormData) => {
    try {
      setLoading(true);
      await updateRole(role.id, data);
      toast({
        title: 'Success',
        description: 'Role updated successfully',
      });
      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || error.message || 'Failed to update role',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleCategoryPermissions = (categoryPerms: string[], checked: boolean) => {
    const currentPermissions = form.getValues('permissions');
    if (checked) {
      const newPermissions = Array.from(new Set([...currentPermissions, ...categoryPerms]));
      form.setValue('permissions', newPermissions);
    } else {
      const newPermissions = currentPermissions.filter(p => !categoryPerms.includes(p));
      form.setValue('permissions', newPermissions);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Edit Role</DialogTitle>
          <DialogDescription>
            Update role information and permissions
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Display Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Content Manager" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe what this role can do..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Separator />

                {/* Role Settings */}
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="is_admin"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Administrator Role</FormLabel>
                          <FormDescription>
                            Admin roles have elevated privileges in the system
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="is_default"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Default Role</FormLabel>
                          <FormDescription>
                            Automatically assigned to new users
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <Separator />

                {/* Permissions */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-900">Permissions</h3>

                  {loadingPermissions ? (
                    <div className="space-y-3">
                      {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} className="h-24 w-full" />
                      ))}
                    </div>
                  ) : (
                    <FormField
                      control={form.control}
                      name="permissions"
                      render={() => (
                        <FormItem>
                          <div className="space-y-6">
                            {availablePermissions && Object.entries(availablePermissions.categories).map(([categoryKey, category]) => {
                              const categoryPerms = Object.keys(category.permissions);
                              const selectedPerms = form.watch('permissions') || [];
                              const allSelected = categoryPerms.every(p => selectedPerms.includes(p));

                              return (
                                <div key={categoryKey} className="space-y-3 border rounded-lg p-4">
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <h4 className="text-sm font-medium">{category.label}</h4>
                                      <p className="text-xs text-gray-500">{category.description}</p>
                                    </div>
                                    <Checkbox
                                      checked={allSelected}
                                      onCheckedChange={(checked) => toggleCategoryPermissions(categoryPerms, checked as boolean)}
                                    />
                                  </div>
                                  <div className="grid grid-cols-2 gap-3 pl-4">
                                    {Object.entries(category.permissions).map(([permKey, permission]) => (
                                      <FormField
                                        key={permKey}
                                        control={form.control}
                                        name="permissions"
                                        render={({ field }) => (
                                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                            <FormControl>
                                              <Checkbox
                                                checked={field.value?.includes(permKey)}
                                                onCheckedChange={(checked) => {
                                                  return checked
                                                    ? field.onChange([...field.value, permKey])
                                                    : field.onChange(
                                                        field.value?.filter((value) => value !== permKey)
                                                      );
                                                }}
                                              />
                                            </FormControl>
                                            <div className="space-y-1 leading-none">
                                              <FormLabel className="text-sm font-normal cursor-pointer">
                                                {permission.label}
                                              </FormLabel>
                                            </div>
                                          </FormItem>
                                        )}
                                      />
                                    ))}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </div>
            </ScrollArea>

            <DialogFooter>
              <Button
                type="button"
                variant="default"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading || loadingPermissions}>
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

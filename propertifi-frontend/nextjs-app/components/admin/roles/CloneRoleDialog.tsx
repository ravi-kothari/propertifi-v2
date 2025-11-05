'use client';

import { useState } from 'react';
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
import { cloneRole } from '@/lib/admin-api';
import { useToast } from '@/hooks/use-toast';
import type { Role } from '@/types/admin';

const cloneRoleSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').regex(/^[a-z_]+$/, 'Name must be lowercase with underscores only'),
  title: z.string().min(2, 'Title must be at least 2 characters').optional(),
});

type CloneRoleFormData = z.infer<typeof cloneRoleSchema>;

interface CloneRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: Role;
  onSuccess: () => void;
}

export default function CloneRoleDialog({
  open,
  onOpenChange,
  role,
  onSuccess,
}: CloneRoleDialogProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<CloneRoleFormData>({
    resolver: zodResolver(cloneRoleSchema),
    defaultValues: {
      name: `${role.name}_copy`,
      title: `${role.title} (Copy)`,
    },
  });

  const onSubmit = async (data: CloneRoleFormData) => {
    try {
      setLoading(true);
      await cloneRole(role.id, data);
      toast({
        title: 'Success',
        description: 'Role cloned successfully',
      });
      form.reset();
      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || error.message || 'Failed to clone role',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Clone Role</DialogTitle>
          <DialogDescription>
            Create a copy of "{role.title}" with all its permissions
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role Name</FormLabel>
                  <FormControl>
                    <Input placeholder="role_copy" {...field} />
                  </FormControl>
                  <FormDescription>
                    Lowercase with underscores (e.g., content_manager_copy)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Content Manager (Copy)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                <strong>Note:</strong> The cloned role will have the same permissions as "{role.title}".
                You can edit them after creation.
              </p>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="default"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Cloning...' : 'Clone Role'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

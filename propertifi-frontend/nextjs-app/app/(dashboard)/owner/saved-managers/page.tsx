'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  MagnifyingGlassIcon,
  BookmarkIcon,
} from '@heroicons/react/24/outline';
import { getBookmarks, removeBookmark } from '@/lib/owner-api';
import { ManagerCard } from '@/components/owner/ManagerCard';
import { EmptyState } from '@/components/owner/EmptyState';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { toast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function SavedManagersPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // Fetch bookmarks
  const { data, isLoading, error } = useQuery({
    queryKey: ['owner-bookmarks'],
    queryFn: getBookmarks,
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: removeBookmark,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['owner-bookmarks'] });
      toast({
        title: 'Success',
        description: 'Property manager removed from saved list',
      });
      setDeleteId(null);
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to remove property manager',
        variant: 'destructive',
      });
    },
  });

  const handleRemove = (bookmarkId: number) => {
    setDeleteId(bookmarkId);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId);
    }
  };

  // Filter bookmarks by search
  const filteredBookmarks = data?.data?.filter((bookmark) => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      bookmark.property_manager.company_name.toLowerCase().includes(searchLower) ||
      bookmark.property_manager.contact_name?.toLowerCase().includes(searchLower) ||
      bookmark.property_manager.city?.toLowerCase().includes(searchLower) ||
      bookmark.property_manager.state?.toLowerCase().includes(searchLower)
    );
  }) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Saved Managers</h1>
          <p className="text-gray-600 mt-1">
            Property managers you've saved for later
          </p>
        </div>
        <Button
          size="lg"
          variant="outline"
          onClick={() => router.push('/property-managers')}
          className="gap-2"
        >
          <MagnifyingGlassIcon className="h-5 w-5" />
          Find More Managers
        </Button>
      </div>

      {/* Search */}
      {data && data.data.length > 0 && (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
          <div className="relative max-w-md">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search saved managers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      )}

      {/* Managers Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading saved managers...</p>
          </div>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">Error loading saved managers</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      ) : filteredBookmarks && filteredBookmarks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBookmarks.map((bookmark) => (
            <ManagerCard
              key={bookmark.id}
              bookmark={bookmark}
              onRemove={handleRemove}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={BookmarkIcon}
          title={
            search
              ? 'No Managers Found'
              : 'No Saved Managers Yet'
          }
          description={
            search
              ? 'Try adjusting your search to see more results.'
              : 'Start saving property managers you are interested in to easily contact them later.'
          }
          actionLabel={search ? undefined : 'Find Managers'}
          onAction={search ? undefined : () => router.push('/property-managers')}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Saved Manager?</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this property manager from your saved
              list? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Removing...' : 'Remove'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

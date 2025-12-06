/**
 * Lead Management Hooks
 * React Query hooks for lead-related API calls
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { get, post, patch } from '@/lib/api';
import type {
  Lead,
  LeadsResponse,
  LeadDetailResponse,
  SubmitResponseRequest,
  SubmitResponseResponse,
  AddNoteRequest,
  AddNoteResponse,
  UpdateLeadStatusRequest,
  UpdateLeadStatusResponse,
  LeadStatistics,
} from '@/types/leads';

// ============================================================================
// Query Keys
// ============================================================================

export const leadKeys = {
  all: ['leads'] as const,
  lists: () => [...leadKeys.all, 'list'] as const,
  list: (pmId: number | string) => [...leadKeys.lists(), pmId] as const,
  details: () => [...leadKeys.all, 'detail'] as const,
  detail: (id: number) => [...leadKeys.details(), id] as const,
  statistics: (pmId: number | string) => [...leadKeys.all, 'statistics', pmId] as const,
  responses: (leadId: number) => [...leadKeys.all, 'responses', leadId] as const,
  notes: (leadId: number) => [...leadKeys.all, 'notes', leadId] as const,
};

// ============================================================================
// Queries
// ============================================================================

/**
 * Fetch all leads for a property manager
 */
export function useLeads(pmId: number | string | null | undefined) {
  return useQuery({
    queryKey: leadKeys.list(pmId || 0),
    queryFn: async () => {
      const response = await get<LeadsResponse>(`/v2/property-managers/${pmId}/leads`);
      return response.data;
    },
    enabled: !!pmId, // Only run if pmId is provided
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

/**
 * Fetch a single lead by ID
 */
export function useLead(leadId: number | null | undefined) {
  return useQuery({
    queryKey: leadKeys.detail(leadId || 0),
    queryFn: async () => {
      const response = await get<LeadDetailResponse>(`/v2/leads/${leadId}`);
      return response.data;
    },
    enabled: !!leadId,
  });
}

/**
 * Fetch lead statistics for a property manager
 */
export function useLeadStatistics(pmId: number | string | null | undefined) {
  return useQuery({
    queryKey: leadKeys.statistics(pmId || 0),
    queryFn: () => get<LeadStatistics>(`/v2/property-managers/${pmId}/leads/statistics`),
    enabled: !!pmId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Fetch responses for a lead
 */
export function useLeadResponses(leadId: number | null | undefined) {
  return useQuery({
    queryKey: leadKeys.responses(leadId || 0),
    queryFn: async () => {
      const response = await get<{ data: any[] }>(`/v2/leads/${leadId}/responses`);
      return response.data;
    },
    enabled: !!leadId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

/**
 * Fetch notes for a lead
 */
export function useLeadNotes(leadId: number | null | undefined) {
  return useQuery({
    queryKey: leadKeys.notes(leadId || 0),
    queryFn: async () => {
      const response = await get<{ data: any[] }>(`/v2/leads/${leadId}/notes`);
      return response.data;
    },
    enabled: !!leadId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

// ============================================================================
// Mutations
// ============================================================================

/**
 * Mark a lead as viewed
 */
export function useMarkLeadViewed() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ pmId, leadId }: { pmId: number; leadId: number }) => {
      return post(`/v2/property-managers/${pmId}/leads/${leadId}/view`, {});
    },
    onMutate: async ({ pmId, leadId }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: leadKeys.list(pmId) });

      // Snapshot previous value
      const previousLeads = queryClient.getQueryData<Lead[]>(leadKeys.list(pmId));

      // Optimistically update to the new value
      queryClient.setQueryData<Lead[]>(leadKeys.list(pmId), (old) =>
        old?.map((lead) =>
          lead.id === leadId
            ? { ...lead, viewed_at: new Date().toISOString(), status: 'viewed' as const }
            : lead
        )
      );

      return { previousLeads };
    },
    onError: (err, { pmId }, context) => {
      // Rollback on error
      if (context?.previousLeads) {
        queryClient.setQueryData(leadKeys.list(pmId), context.previousLeads);
      }
    },
    onSettled: (data, error, { pmId }) => {
      // Refetch to ensure we have the latest data
      queryClient.invalidateQueries({ queryKey: leadKeys.list(pmId) });
      queryClient.invalidateQueries({ queryKey: leadKeys.statistics(pmId) });
    },
  });
}

/**
 * Submit a response to a lead
 */
export function useSubmitResponse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      leadId,
      data,
    }: {
      leadId: number;
      data: SubmitResponseRequest;
    }) => {
      return post<SubmitResponseResponse>(`/v2/leads/${leadId}/responses`, data);
    },
    onSuccess: (response, { leadId }) => {
      // Invalidate lead queries to refetch updated data
      queryClient.invalidateQueries({ queryKey: leadKeys.detail(leadId) });
      queryClient.invalidateQueries({ queryKey: leadKeys.lists() });
      queryClient.invalidateQueries({ queryKey: leadKeys.responses(leadId) });
    },
  });
}

/**
 * Add a note to a lead
 */
export function useAddLeadNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ leadId, content }: { leadId: number; content: string }) => {
      return post<AddNoteResponse>(`/v2/leads/${leadId}/notes`, { content });
    },
    onSuccess: (response, { leadId }) => {
      // Invalidate lead detail to refetch with new note
      queryClient.invalidateQueries({ queryKey: leadKeys.detail(leadId) });
      queryClient.invalidateQueries({ queryKey: leadKeys.notes(leadId) });
    },
  });
}

/**
 * Update lead status
 */
export function useUpdateLeadStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      leadId,
      status,
      pmId,
    }: {
      leadId: number;
      status: UpdateLeadStatusRequest['status'];
      pmId: number;
    }) => {
      return patch<UpdateLeadStatusResponse>(`/v2/leads/${leadId}/status`, { status });
    },
    onMutate: async ({ leadId, status, pmId }) => {
      await queryClient.cancelQueries({ queryKey: leadKeys.list(pmId) });

      const previousLeads = queryClient.getQueryData<Lead[]>(leadKeys.list(pmId));

      // Optimistically update status
      queryClient.setQueryData<Lead[]>(leadKeys.list(pmId), (old) =>
        old?.map((lead) =>
          lead.id === leadId
            ? { ...lead, status, updated_at: new Date().toISOString() }
            : lead
        )
      );

      return { previousLeads };
    },
    onError: (err, { pmId }, context) => {
      if (context?.previousLeads) {
        queryClient.setQueryData(leadKeys.list(pmId), context.previousLeads);
      }
    },
    onSettled: (data, error, { pmId, leadId }) => {
      queryClient.invalidateQueries({ queryKey: leadKeys.list(pmId) });
      queryClient.invalidateQueries({ queryKey: leadKeys.detail(leadId) });
      queryClient.invalidateQueries({ queryKey: leadKeys.statistics(pmId) });
    },
  });
}

/**
 * Delete/Archive a lead
 */
export function useArchiveLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ leadId, pmId }: { leadId: number; pmId: number }) => {
      return patch(`/v2/leads/${leadId}/status`, { status: 'archived' });
    },
    onSuccess: (data, { pmId, leadId }) => {
      queryClient.invalidateQueries({ queryKey: leadKeys.list(pmId) });
      queryClient.invalidateQueries({ queryKey: leadKeys.statistics(pmId) });
    },
  });
}

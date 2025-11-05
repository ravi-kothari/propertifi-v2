/**
 * Lead Response Hooks
 * React Query hooks for lead responses and view tracking
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { post, get } from '@/lib/api';
import type {
  SubmitResponseRequest,
  SubmitResponseResponse,
  LeadResponse,
} from '@/types/leads';

// ============================================================================
// Query Keys
// ============================================================================

export const leadResponseKeys = {
  all: ['lead-responses'] as const,
  byLead: (leadId: number | string) =>
    [...leadResponseKeys.all, 'lead', leadId] as const,
};

// ============================================================================
// Mutations
// ============================================================================

/**
 * Submit a response to a lead
 */
export function useSubmitResponse(leadId: number | string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: SubmitResponseRequest) => {
      const url = `/v2/leads/${leadId}/responses`;
      const response = await post<SubmitResponseResponse>(url, data);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate lead responses to refetch
      queryClient.invalidateQueries({ queryKey: leadResponseKeys.byLead(leadId) });
      // Invalidate leads query to update lead status
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });
}

/**
 * Track lead view
 */
export function useTrackLeadView(pmId: number | string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (leadId: number | string) => {
      const url = `/v2/property-managers/${pmId}/leads/${leadId}/view`;
      const response = await post<{ data: { viewed_at: string } }>(url, {});
      return response.data;
    },
    onSuccess: (_, leadId) => {
      // Invalidate leads query to update viewed status
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['lead', leadId] });
    },
  });
}

// ============================================================================
// Queries
// ============================================================================

/**
 * Fetch response history for a lead
 */
export function useLeadResponses(leadId: number | string | null | undefined) {
  return useQuery({
    queryKey: leadResponseKeys.byLead(leadId || 0),
    queryFn: async () => {
      const url = `/v2/leads/${leadId}/responses`;
      const response = await get<{ data: LeadResponse[] }>(url);
      return response.data;
    },
    enabled: !!leadId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

/**
 * Analytics Hooks
 * React Query hooks for analytics and metrics
 */

import { useQuery } from '@tanstack/react-query';
import { get } from '@/lib/api';
import type {
  AnalyticsResponse,
  AnalyticsFilters,
  LeadMetrics,
  ResponseMetrics,
  PerformanceMetrics,
} from '@/types/analytics';

// ============================================================================
// Query Keys
// ============================================================================

export const analyticsKeys = {
  all: ['analytics'] as const,
  dashboard: (pmId: number | string, filters?: AnalyticsFilters) =>
    [...analyticsKeys.all, 'dashboard', pmId, filters] as const,
  leadMetrics: (pmId: number | string, filters?: AnalyticsFilters) =>
    [...analyticsKeys.all, 'lead-metrics', pmId, filters] as const,
  responseMetrics: (pmId: number | string, filters?: AnalyticsFilters) =>
    [...analyticsKeys.all, 'response-metrics', pmId, filters] as const,
  performanceMetrics: (pmId: number | string, filters?: AnalyticsFilters) =>
    [...analyticsKeys.all, 'performance-metrics', pmId, filters] as const,
};

// ============================================================================
// Queries
// ============================================================================

/**
 * Fetch complete analytics dashboard data
 */
export function useAnalyticsDashboard(
  pmId: number | string | null | undefined,
  filters?: AnalyticsFilters
) {
  return useQuery({
    queryKey: analyticsKeys.dashboard(pmId || 0, filters),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.date_range) params.append('date_range', filters.date_range);
      if (filters?.start_date) params.append('start_date', filters.start_date);
      if (filters?.end_date) params.append('end_date', filters.end_date);
      if (filters?.property_type) params.append('property_type', filters.property_type);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.source) params.append('source', filters.source);

      const queryString = params.toString();
      const url = `/v2/property-managers/${pmId}/analytics${queryString ? `?${queryString}` : ''}`;

      const response = await get<AnalyticsResponse>(url);
      return response.data;
    },
    enabled: !!pmId,
    staleTime: 1000 * 60 * 5, // 5 minutes - analytics don't change frequently
  });
}

/**
 * Fetch lead metrics only
 */
export function useLeadMetrics(
  pmId: number | string | null | undefined,
  filters?: AnalyticsFilters
) {
  return useQuery({
    queryKey: analyticsKeys.leadMetrics(pmId || 0, filters),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.date_range) params.append('date_range', filters.date_range);
      if (filters?.start_date) params.append('start_date', filters.start_date);
      if (filters?.end_date) params.append('end_date', filters.end_date);

      const queryString = params.toString();
      const url = `/v2/property-managers/${pmId}/analytics/leads${queryString ? `?${queryString}` : ''}`;

      const response = await get<{ data: LeadMetrics }>(url);
      return response.data;
    },
    enabled: !!pmId,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Fetch response metrics only
 */
export function useResponseMetrics(
  pmId: number | string | null | undefined,
  filters?: AnalyticsFilters
) {
  return useQuery({
    queryKey: analyticsKeys.responseMetrics(pmId || 0, filters),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.date_range) params.append('date_range', filters.date_range);
      if (filters?.start_date) params.append('start_date', filters.start_date);
      if (filters?.end_date) params.append('end_date', filters.end_date);

      const queryString = params.toString();
      const url = `/v2/property-managers/${pmId}/analytics/responses${queryString ? `?${queryString}` : ''}`;

      const response = await get<{ data: ResponseMetrics }>(url);
      return response.data;
    },
    enabled: !!pmId,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Fetch performance metrics only
 */
export function usePerformanceMetrics(
  pmId: number | string | null | undefined,
  filters?: AnalyticsFilters
) {
  return useQuery({
    queryKey: analyticsKeys.performanceMetrics(pmId || 0, filters),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.date_range) params.append('date_range', filters.date_range);
      if (filters?.start_date) params.append('start_date', filters.start_date);
      if (filters?.end_date) params.append('end_date', filters.end_date);

      const queryString = params.toString();
      const url = `/v2/property-managers/${pmId}/analytics/performance${queryString ? `?${queryString}` : ''}`;

      const response = await get<{ data: PerformanceMetrics }>(url);
      return response.data;
    },
    enabled: !!pmId,
    staleTime: 1000 * 60 * 5,
  });
}

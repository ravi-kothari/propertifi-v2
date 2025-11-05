/**
 * Analytics Types
 * Type definitions for analytics and metrics
 */

export interface LeadMetrics {
  total_leads: number;
  new_leads: number;
  contacted_leads: number;
  qualified_leads: number;
  closed_leads: number;
  archived_leads: number;
  conversion_rate: number;
  average_response_time: number; // in hours
}

export interface TimeSeriesDataPoint {
  date: string;
  count: number;
  label?: string;
}

export interface LeadsByStatus {
  status: string;
  count: number;
  percentage: number;
}

export interface LeadsBySource {
  source: string;
  count: number;
  percentage: number;
}

export interface ResponseMetrics {
  total_responses: number;
  contact_info_responses: number;
  availability_responses: number;
  price_quote_responses: number;
  decline_responses: number;
  average_response_time: number; // in hours
  response_rate: number; // percentage
}

export interface PerformanceMetrics {
  leads_this_week: number;
  leads_last_week: number;
  week_over_week_change: number; // percentage
  leads_this_month: number;
  leads_last_month: number;
  month_over_month_change: number; // percentage
  top_performing_day: string;
  top_performing_source: string;
}

export interface AnalyticsDashboard {
  lead_metrics: LeadMetrics;
  response_metrics: ResponseMetrics;
  performance_metrics: PerformanceMetrics;
  leads_over_time: TimeSeriesDataPoint[];
  leads_by_status: LeadsByStatus[];
  leads_by_source: LeadsBySource[];
}

export interface AnalyticsFilters {
  date_range: 'week' | 'month' | 'quarter' | 'year' | 'all' | 'custom';
  start_date?: string;
  end_date?: string;
  property_type?: string;
  status?: string;
  source?: string;
}

export interface AnalyticsResponse {
  data: AnalyticsDashboard;
  filters: AnalyticsFilters;
  generated_at: string;
}

/**
 * Owner Dashboard Types
 * Types for owner-specific features including leads, bookmarks, and calculations
 */

// Lead Status Types
export type LeadStatus = 'new' | 'matched' | 'contacted' | 'closed';

export type PropertyType =
  | 'single_family'
  | 'multi_family'
  | 'apartment'
  | 'condo'
  | 'townhouse'
  | 'commercial';

// Lead Interface
export interface Lead {
  id: number;
  user_id?: number;
  confirmation_number: string;
  property_address: string;
  property_city: string;
  property_state: string;
  property_zip: string;
  property_type: PropertyType;
  number_of_units?: number;
  bedrooms?: number;
  bathrooms?: number;
  square_footage?: number;
  status: LeadStatus;
  matched_managers_count: number;
  views_count?: number;
  responses_count?: number;
  notes?: string;
  created_at: string;
  updated_at?: string;
}

// Lead Assignment from a property manager
export interface LeadAssignment {
  id: number;
  manager_name: string;
  distance_miles?: number;
  match_score: number;
  status: 'pending' | 'contacted' | 'accepted' | 'rejected';
  contacted_at?: string;
  responded_at?: string;
  created_at: string;
}

// Timeline event for lead activity
export interface LeadTimelineEvent {
  type: 'created' | 'matched' | 'contacted' | 'accepted';
  title: string;
  description: string;
  timestamp: string;
  icon: string;
}

// Lead detail stats
export interface LeadDetailStats {
  total_views: number;
  unique_viewers: number;
  total_matches: number;
  contacted_count: number;
  accepted_count: number;
}

// Lead detail response
export interface LeadDetailData {
  lead: Lead;
  stats: LeadDetailStats;
  assignments: LeadAssignment[];
  timeline: LeadTimelineEvent[];
}

// Property Manager Interface
export interface PropertyManager {
  id: number;
  company_name: string;
  contact_name: string;
  email: string;
  phone?: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  services: string[];
  property_types: PropertyType[];
  rating?: number;
  review_count?: number;
  description?: string;
  logo_url?: string;
  created_at?: string;
  updated_at?: string;
}

// Bookmark Interface
export interface Bookmark {
  id: number;
  user_id: number;
  property_manager_id: number;
  property_manager: PropertyManager;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// Calculator Types
export type CalculatorType = 'roi' | 'mortgage' | 'rent_vs_buy' | 'cash_flow';

export interface SavedCalculation {
  id: number;
  user_id: number;
  calculator_type: CalculatorType;
  title: string;
  inputs: Record<string, any>;
  results: Record<string, any>;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// Dashboard Statistics
export interface DashboardStats {
  total_leads: number;
  active_leads: number;
  total_views: number;
  total_responses: number;
  total_bookmarks: number;
  total_calculations: number;
}

// Recent Activity
export interface RecentActivity {
  id: number;
  type: 'lead_created' | 'manager_matched' | 'bookmark_added' | 'calculation_saved';
  title: string;
  description: string;
  timestamp: string;
  link?: string;
}

// Owner Dashboard Data
export interface OwnerDashboardData {
  user: {
    id: number;
    name: string;
    email: string;
  };
  stats: DashboardStats;
  recent_leads: Lead[];
  recent_activity: RecentActivity[];
  saved_managers: Bookmark[];
}

// API Response Types
export interface LeadsResponse {
  data: Lead[];
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

export interface BookmarksResponse {
  data: Bookmark[];
  total: number;
}

export interface CalculationsResponse {
  data: SavedCalculation[];
  total: number;
}

// Filter and Sort Types
export interface LeadFilters {
  status?: LeadStatus;
  property_type?: PropertyType;
  search?: string;
  date_from?: string;
  date_to?: string;
}

export type LeadSortField = 'created_at' | 'status' | 'property_address';
export type SortDirection = 'asc' | 'desc';

export interface LeadSort {
  field: LeadSortField;
  direction: SortDirection;
}

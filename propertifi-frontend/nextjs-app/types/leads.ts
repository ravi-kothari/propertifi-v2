/**
 * Lead Management Types
 * Type definitions for the lead management system
 */

export type LeadStatus = 'new' | 'viewed' | 'contacted' | 'qualified' | 'closed' | 'archived';

export type ResponseType = 'contact_info' | 'availability' | 'price_quote' | 'decline';

export type PreferredContact = 'email' | 'phone';

export interface Lead {
  id: number;
  property_type: string;
  street_address: string;
  city: string;
  state: string;
  zip_code: string;
  number_of_units?: number | null;
  square_footage?: number | null;
  additional_services: string[];
  full_name: string;
  email: string;
  phone: string;
  preferred_contact: PreferredContact;
  status: LeadStatus;
  viewed_at?: string | null;
  responded_at?: string | null;
  qualified_at?: string | null;
  closed_at?: string | null;
  archived_at?: string | null;
  source: string;
  created_at: string;
  updated_at: string;
}

/**
 * Lead with assignment information for property managers
 * Includes match score, distance, and tiered access data
 */
export interface LeadWithAssignment extends Lead {
  assignment_id: number;
  match_score: number;
  distance_miles: number | null;
  assignment_status: string;
  available_at: string | null;
  contacted_at: string | null;
  responded_at: string | null;
}

export interface ContactInfo {
  phone?: string;
  email?: string;
  preferred_time?: string;
  notes?: string;
}

export interface Availability {
  date: string;
  time: string;
  location?: string;
  notes?: string;
}

export interface PriceQuote {
  amount: number;
  frequency: 'monthly' | 'yearly' | 'one-time';
  details: string;
  includes?: string[];
  valid_until?: string;
}

export interface LeadResponse {
  id: number;
  lead_id: number;
  property_manager_id: number;
  response_type: ResponseType;
  message: string;
  contact_info?: ContactInfo | null;
  availability?: Availability | null;
  price_quote?: PriceQuote | null;
  created_at: string;
  updated_at: string;
}

export interface LeadNote {
  id: number;
  lead_id: number;
  property_manager_id: number;
  content: string;
  created_at: string;
  updated_at: string;
}

// API Request/Response Types

export interface LeadsResponse {
  data: Lead[];
  meta?: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
}

export interface LeadDetailResponse {
  data: Lead;
}

export interface SubmitResponseRequest {
  response_type: ResponseType;
  message: string;
  contact_info?: ContactInfo;
  availability?: Availability;
  price_quote?: PriceQuote;
}

export interface SubmitResponseResponse {
  data: LeadResponse;
  message: string;
}

export interface AddNoteRequest {
  content: string;
}

export interface AddNoteResponse {
  data: LeadNote;
  message: string;
}

export interface UpdateLeadStatusRequest {
  status: LeadStatus;
}

export interface UpdateLeadStatusResponse {
  data: Lead;
  message: string;
}

// Filter Types

export interface LeadFilters {
  status?: LeadStatus | 'all';
  dateRange?: {
    start: string;
    end: string;
  };
  propertyType?: string;
  city?: string;
  state?: string;
  search?: string;
}

// Statistics Types

export interface LeadStatistics {
  total: number;
  new: number;
  viewed: number;
  contacted: number;
  qualified: number;
  closed: number;
  archived: number;
  response_rate: number;
  average_response_time: number; // in hours
}

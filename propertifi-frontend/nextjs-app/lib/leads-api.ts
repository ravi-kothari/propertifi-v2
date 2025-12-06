/**
 * Leads API Functions
 * Fetches and manages lead data from the backend
 */

import { apiClient } from './api';
import { Lead, LeadWithAssignment } from '../types/leads';

const LEADS_BASE_PATH = '/api/v2/leads';

// Backend lead structure (from database)
interface BackendLead {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipcode: string;
  property_type: string;
  number_of_units?: number | null;
  square_footage?: number | null;
  additional_services?: string | null;
  preferred_contact: string;
  status: string;
  source: string;
  created_at: string;
  updated_at: string;
}

// Map backend lead structure to frontend Lead type
function mapBackendLead(backendLead: BackendLead): Lead {
  // Parse additional_services safely
  let additionalServices: string[] = [];
  if (backendLead.additional_services) {
    if (typeof backendLead.additional_services === 'string') {
      // Try to parse as JSON first
      try {
        const parsed = JSON.parse(backendLead.additional_services);
        additionalServices = Array.isArray(parsed) ? parsed : [backendLead.additional_services];
      } catch {
        // If JSON parsing fails, treat it as a plain string and wrap in array
        additionalServices = [backendLead.additional_services];
      }
    } else {
      additionalServices = backendLead.additional_services;
    }
  }

  return {
    id: backendLead.id,
    property_type: backendLead.property_type,
    street_address: backendLead.address,
    city: backendLead.city,
    state: backendLead.state,
    zip_code: backendLead.zipcode,
    number_of_units: backendLead.number_of_units,
    square_footage: backendLead.square_footage,
    additional_services: additionalServices,
    full_name: backendLead.name,
    email: backendLead.email,
    phone: backendLead.phone || '',
    preferred_contact: backendLead.preferred_contact === 'phone' ? 'phone' : 'email',
    status: backendLead.status as any, // Cast to LeadStatus type
    source: backendLead.source,
    created_at: backendLead.created_at,
    updated_at: backendLead.updated_at,
  };
}

export const getLeads = async (): Promise<Lead[]> => {
  const response = await apiClient.get<{ data: BackendLead[] }>(LEADS_BASE_PATH);
  return response.data.data.map(mapBackendLead);
};

export const getLead = async (id: number): Promise<Lead> => {
  const response = await apiClient.get<{ data: BackendLead }>(`${LEADS_BASE_PATH}/${id}`);
  return mapBackendLead(response.data.data);
};

// PM-specific lead assignment structure from backend
interface BackendLeadAssignment {
  assignment_id: number;
  lead_id: number;
  match_score: number;
  distance_miles: number | null;
  status: string;
  available_at: string | null;
  contacted_at: string | null;
  responded_at: string | null;
  created_at: string;
  lead: BackendLead | null;
}

interface PMLeadsResponse {
  success: boolean;
  data: BackendLeadAssignment[];
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
}

// Map backend lead assignment to frontend type
function mapBackendLeadAssignment(backendAssignment: BackendLeadAssignment): LeadWithAssignment {
  const baseLead = backendAssignment.lead ? mapBackendLead(backendAssignment.lead) : null;

  if (!baseLead) {
    throw new Error('Lead data is missing from assignment');
  }

  return {
    ...baseLead,
    assignment_id: backendAssignment.assignment_id,
    match_score: backendAssignment.match_score,
    distance_miles: backendAssignment.distance_miles,
    assignment_status: backendAssignment.status,
    available_at: backendAssignment.available_at,
    contacted_at: backendAssignment.contacted_at,
    responded_at: backendAssignment.responded_at,
  };
}

/**
 * Get leads assigned to the authenticated property manager
 * Includes tiered access filtering (available_at)
 */
export const getPMLeads = async (params?: {
  status?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  per_page?: number;
}): Promise<{ leads: LeadWithAssignment[]; pagination: PMLeadsResponse['pagination'] }> => {
  const queryParams = new URLSearchParams();

  if (params?.status) queryParams.append('status', params.status);
  if (params?.sort_by) queryParams.append('sort_by', params.sort_by);
  if (params?.sort_order) queryParams.append('sort_order', params.sort_order);
  if (params?.per_page) queryParams.append('per_page', params.per_page.toString());

  const url = `/api/pm/leads${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  const response = await apiClient.get<PMLeadsResponse>(url);

  return {
    leads: response.data.data.map(mapBackendLeadAssignment),
    pagination: response.data.pagination,
  };
};

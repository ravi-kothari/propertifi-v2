/**
 * Leads API Functions
 * Fetches and manages lead data from the backend
 */

import { apiClient } from './api';
import { Lead } from '../types/leads';

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

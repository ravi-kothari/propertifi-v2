/**
 * MSW Mock API Handlers
 * Mock responses for testing Lead Response System
 */

import { http, HttpResponse } from 'msw';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Mock Leads Data
const mockLeads = [
  {
    id: 1,
    property_type: 'Single Family',
    street_address: '123 Main St',
    city: 'Los Angeles',
    state: 'CA',
    zip_code: '90001',
    number_of_units: 1,
    square_footage: 2000,
    additional_services: ['Maintenance', 'Tenant Screening'],
    full_name: 'John Doe',
    email: 'john@example.com',
    phone: '555-123-4567',
    preferred_contact: 'email',
    status: 'new',
    viewed_at: null,
    responded_at: null,
    qualified_at: null,
    closed_at: null,
    archived_at: null,
    source: 'Website',
    created_at: '2025-01-15T10:00:00Z',
    updated_at: '2025-01-15T10:00:00Z',
  },
  {
    id: 2,
    property_type: 'Multi-Family',
    street_address: '456 Oak Ave',
    city: 'San Diego',
    state: 'CA',
    zip_code: '92101',
    number_of_units: 4,
    square_footage: 5000,
    additional_services: ['HOA Management'],
    full_name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '555-987-6543',
    preferred_contact: 'phone',
    status: 'contacted',
    viewed_at: '2025-01-16T09:00:00Z',
    responded_at: '2025-01-16T14:00:00Z',
    qualified_at: null,
    closed_at: null,
    archived_at: null,
    source: 'Referral',
    created_at: '2025-01-14T15:30:00Z',
    updated_at: '2025-01-16T14:00:00Z',
  },
];

// Mock Response History
const mockResponses = [
  {
    id: 1,
    lead_id: 2,
    property_manager_id: 1,
    response_type: 'contact_info',
    message: "I'd be happy to manage your property! Here's my contact information.",
    contact_info: {
      phone: '555-111-2222',
      email: 'pm@example.com',
      preferred_time: 'morning',
      notes: 'Available for calls weekdays 9am-5pm',
    },
    created_at: '2025-01-16T14:00:00Z',
    updated_at: '2025-01-16T14:00:00Z',
  },
];

export const handlers = [
  // Get Leads
  http.get(`${API_BASE_URL}/v2/property-managers/:pmId/leads`, () => {
    return HttpResponse.json({
      data: mockLeads,
      meta: {
        total: mockLeads.length,
        per_page: 50,
        current_page: 1,
        last_page: 1,
      },
    });
  }),

  // Track Lead View
  http.post(`${API_BASE_URL}/v2/property-managers/:pmId/leads/:leadId/view`, () => {
    return HttpResponse.json({
      data: {
        viewed_at: new Date().toISOString(),
      },
    });
  }),

  // Get Lead Responses
  http.get(`${API_BASE_URL}/v2/leads/:leadId/responses`, ({ params }) => {
    const { leadId } = params;
    const responses = mockResponses.filter((r) => r.lead_id === Number(leadId));

    return HttpResponse.json({
      data: responses,
    });
  }),

  // Submit Response
  http.post(`${API_BASE_URL}/v2/leads/:leadId/responses`, async ({ request, params }) => {
    const { leadId } = params;
    const body = await request.json();

    const newResponse = {
      id: mockResponses.length + 1,
      lead_id: Number(leadId),
      property_manager_id: 1,
      ...body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    mockResponses.push(newResponse);

    return HttpResponse.json({
      data: newResponse,
      message: 'Response submitted successfully',
    });
  }),
];

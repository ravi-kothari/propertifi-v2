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

export interface LeadWithAssignment extends Lead {
    assignment_id: number;
    match_score: number;
    distance_miles: number | null;
    assignment_status: string;
    available_at: string | null;
    contacted_at: string | null;
    responded_at: string | null;
}

export interface LeadsResponse {
    data: Lead[];
    meta?: {
        total: number;
        per_page: number;
        current_page: number;
        last_page: number;
    };
}

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

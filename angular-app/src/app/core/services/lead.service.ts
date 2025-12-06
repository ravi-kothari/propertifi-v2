import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Lead, LeadWithAssignment, LeadsResponse, LeadFilters } from '../models/lead.model';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class LeadService {
    private http = inject(HttpClient);
    private apiUrl = environment.apiUrl;

    /**
     * Fetch leads for the Owner dashboard with optional filters.
     * @param filters - Filters for status, search, city, state
     * @returns Observable of LeadsResponse
     */
    getLeads(filters: LeadFilters = {}): Observable<LeadsResponse> {
        let params = new HttpParams();
        if (filters.status && filters.status !== 'all') params = params.set('status', filters.status);
        if (filters.search) params = params.set('search', filters.search);
        if (filters.city) params = params.set('city', filters.city);
        if (filters.state) params = params.set('state', filters.state);

        return this.http.get<LeadsResponse>(`/api/owner/leads`, { params });
    }

    /**
     * Fetch a single lead by ID for the Owner.
     * @param id - Lead ID
     * @returns Observable containing lead data
     */
    getLead(id: number): Observable<{ data: Lead }> {
        return this.http.get<{ data: Lead }>(`/api/owner/leads/${id}`);
    }

    /**
     * Submit a new lead from the home page.
     * @param leadData - The lead form data
     * @returns Observable of the submission result
     */
    submitLead(leadData: any): Observable<any> {
        return this.http.post(`/api/home-page-lead`, leadData);
    }

    // PM specific methods

    /**
     * Fetch assigned leads for the Property Manager dashboard.
     * @param filters - Filters for status
     * @returns Observable of LeadWithAssignment array
     */
    getMyLeads(filters: LeadFilters = {}): Observable<{ data: LeadWithAssignment[] }> {
        let params = new HttpParams();
        if (filters.status && filters.status !== 'all') params = params.set('status', filters.status);

        return this.http.get<{ data: LeadWithAssignment[] }>(`/api/pm/leads`, { params });
    }

    /**
     * Submit a response (accept/reject/contact) to a lead assignment.
     * @param leadId - The ID of the lead
     * @param response - The response data
     * @returns Observable of the result
     */
    submitResponse(leadId: number, response: any): Observable<any> {
        return this.http.post(`/api/leads/${leadId}/response`, response);
    }
}

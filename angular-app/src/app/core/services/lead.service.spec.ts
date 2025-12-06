import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LeadService } from './lead.service';
import { LeadsResponse, Lead } from '../models/lead.model';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('LeadService', () => {
    let service: LeadService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [LeadService]
        });
        service = TestBed.inject(LeadService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should fetch leads with filters', () => {
        const mockLeads: LeadsResponse = { data: [] };
        const filters = { status: 'new' as const, city: 'New York' };

        service.getLeads(filters).subscribe(response => {
            expect(response).toEqual(mockLeads);
        });

        const req = httpMock.expectOne(req =>
            req.url === '/api/leads' &&
            req.params.has('status') &&
            req.params.get('status') === 'new' &&
            req.params.has('city') &&
            req.params.get('city') === 'New York'
        );
        expect(req.request.method).toBe('GET');
        req.flush(mockLeads);
    });

    it('should fetch a single lead', () => {
        const mockLead = { data: { id: 1, full_name: 'John Doe' } as Lead };

        service.getLead(1).subscribe(response => {
            expect(response).toEqual(mockLead);
        });

        const req = httpMock.expectOne('/api/leads/1');
        expect(req.request.method).toBe('GET');
        req.flush(mockLead);
    });
});

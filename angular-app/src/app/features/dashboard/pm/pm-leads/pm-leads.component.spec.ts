import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PmLeadsComponent } from './pm-leads.component';
import { LeadService } from '../../../../core/services/lead.service';
import { of } from 'rxjs';
import { LeadWithAssignment } from '../../../../core/models/lead.model';
import { LeadCardComponent } from '../../../../shared/components/lead-card/lead-card.component';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { RouterTestingModule } from '@angular/router/testing';

describe('PmLeadsComponent', () => {
    let component: PmLeadsComponent;
    let fixture: ComponentFixture<PmLeadsComponent>;
    let leadServiceMock: any;

    const mockLeads: LeadWithAssignment[] = [
        {
            id: 1,
            property_type: 'House',
            street_address: '123 Main St',
            city: 'New York',
            state: 'NY',
            zip_code: '10001',
            additional_services: [],
            full_name: 'John Doe',
            email: 'john@example.com',
            phone: '1234567890',
            preferred_contact: 'email',
            status: 'new',
            source: 'web',
            created_at: '2023-01-01',
            updated_at: '2023-01-01',
            assignment_id: 1,
            match_score: 95,
            distance_miles: 5,
            assignment_status: 'pending',
            available_at: null,
            contacted_at: null,
            responded_at: null
        }
    ];

    beforeEach(async () => {
        leadServiceMock = {
            getMyLeads: vi.fn().mockReturnValue(of({ data: mockLeads }))
        };

        await TestBed.configureTestingModule({
            imports: [PmLeadsComponent, RouterTestingModule],
            providers: [
                { provide: LeadService, useValue: leadServiceMock }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(PmLeadsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should display leads with match scores', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.textContent).toContain('Available Leads');
        // Check if LeadCardComponent renders the score (assuming it renders inputs correctly)
        // Since LeadCardComponent is standalone and imported, it should render.
        // We can check for the text content that LeadCardComponent projects.
        expect(compiled.textContent).toContain('Score: 95');
        expect(compiled.textContent).toContain('House');
    });
});

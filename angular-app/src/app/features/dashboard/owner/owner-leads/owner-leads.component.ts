import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeadService } from '../../../../core/services/lead.service';
import { Observable } from 'rxjs';
import { LeadsResponse } from '../../../../core/models/lead.model';
import { UiCardComponent } from '../../../../shared/components/ui-card/ui-card.component';
import { UiBadgeComponent } from '../../../../shared/components/ui-badge/ui-badge';
import { UiScoreRingComponent } from '../../../../shared/components/ui-score-ring/ui-score-ring';
import { UiButtonComponent } from '../../../../shared/components/ui-button/ui-button.component';

@Component({
    selector: 'app-owner-leads',
    standalone: true,
    imports: [CommonModule, UiCardComponent, UiBadgeComponent, UiScoreRingComponent, UiButtonComponent],
    templateUrl: './owner-leads.component.html'
})
export class OwnerLeadsComponent {
    private leadService = inject(LeadService);
    leads$: Observable<LeadsResponse> = this.leadService.getLeads();
}

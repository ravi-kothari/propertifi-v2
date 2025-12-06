import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LeadService } from '../../../core/services/lead.service';
import { Observable, switchMap } from 'rxjs';
import { Lead } from '../../../core/models/lead.model';

import { LeadResponseComponent } from '../lead-response/lead-response.component';
import { UiCardComponent } from '../../../shared/components/ui-card/ui-card.component';
import { UiBadgeComponent } from '../../../shared/components/ui-badge/ui-badge';
import { UiButtonComponent } from '../../../shared/components/ui-button/ui-button.component';

@Component({
    selector: 'app-lead-detail',
    standalone: true,
    imports: [CommonModule, RouterLink, LeadResponseComponent, UiCardComponent, UiBadgeComponent, UiButtonComponent],
    templateUrl: './lead-detail.component.html'
})
export class LeadDetailComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private leadService = inject(LeadService);

    lead$!: Observable<{ data: Lead }>;

    ngOnInit(): void {
        this.lead$ = this.route.paramMap.pipe(
            switchMap(params => {
                const id = Number(params.get('id'));
                return this.leadService.getLead(id);
            })
        );
    }
}

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeadWithAssignment } from '../../../core/models/lead.model';
import { UiCardComponent } from '../ui-card/ui-card.component';
import { UiBadgeComponent } from '../ui-badge/ui-badge';
import { UiScoreRingComponent } from '../ui-score-ring/ui-score-ring';
import { UiButtonComponent } from '../ui-button/ui-button.component';

@Component({
    selector: 'app-lead-card',
    standalone: true,
    imports: [CommonModule, UiCardComponent, UiBadgeComponent, UiScoreRingComponent, UiButtonComponent],
    templateUrl: './lead-card.component.html',
    host: {
        class: 'block animate-fade-in'
    }
})
/**
 * A card component displaying lead summary information.
 * Used in lists and grids to show a preview of a lead.
 *
 * @example
 * <app-lead-card [lead]="leadData" (viewDetails)="onViewDetails($event)"></app-lead-card>
 */
export class LeadCardComponent {
    /** The lead data to display */
    @Input({ required: true }) lead!: LeadWithAssignment | any; // TODO: Fix type to be Lead | LeadWithAssignment

    /** Whether to display a compact version of the card */
    @Input() compact = false;

    /** Optional AI Score for the lead */
    @Input() score?: any; // Using any to avoid circular dependency if LeadScore is in pm.model

    /** Event emitted when the "View Details" button is clicked */
    @Output() viewDetails = new EventEmitter<number>();

    onViewDetails(): void {
        this.viewDetails.emit(this.lead.id);
    }
}

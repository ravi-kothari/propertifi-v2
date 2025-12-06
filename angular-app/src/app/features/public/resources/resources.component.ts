import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiCardComponent } from '../../../shared/components/ui-card/ui-card.component';
import { UiButtonComponent } from '../../../shared/components/ui-button/ui-button.component';

@Component({
    selector: 'app-resources',
    standalone: true,
    imports: [CommonModule, UiCardComponent, UiButtonComponent],
    templateUrl: './resources.component.html'
})
export class ResourcesComponent {
    activeTab: 'laws' | 'templates' = 'laws';

    states = [
        { name: 'California', code: 'CA', lawsCount: 15 },
        { name: 'New York', code: 'NY', lawsCount: 12 },
        { name: 'Texas', code: 'TX', lawsCount: 8 },
        { name: 'Florida', code: 'FL', lawsCount: 10 }
    ];

    templates = [
        { name: 'Lease Agreement', category: 'Legal', downloads: 1200 },
        { name: 'Eviction Notice', category: 'Legal', downloads: 850 },
        { name: 'Rental Application', category: 'Tenant', downloads: 2100 },
        { name: 'Move-in Checklist', category: 'Inspection', downloads: 1500 }
    ];
}

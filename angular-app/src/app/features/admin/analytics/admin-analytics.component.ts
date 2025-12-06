import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../core/services/admin.service';
import { AdminAnalytics } from '../../../core/models/admin.model';
import { UiCardComponent } from '../../../shared/components/ui-card/ui-card.component';

@Component({
    selector: 'app-admin-analytics',
    standalone: true,
    imports: [CommonModule, UiCardComponent],
    templateUrl: './admin-analytics.component.html'
})
export class AdminAnalyticsComponent implements OnInit {
    private adminService = inject(AdminService);
    analytics: AdminAnalytics | null = null;

    ngOnInit() {
        // Mock data for now until API is ready
        this.analytics = {
            revenue: {
                total: 125000,
                growth: 12.5,
                history: []
            },
            users: {
                total: 1250,
                growth: 5.2,
                breakdown: []
            },
            leads: {
                total: 450,
                conversion_rate: 22.5,
                recent: 15
            }
        };

        /* Uncomment when API is ready
        this.adminService.getAnalytics().subscribe(data => {
            this.analytics = data;
        });
        */
    }
}

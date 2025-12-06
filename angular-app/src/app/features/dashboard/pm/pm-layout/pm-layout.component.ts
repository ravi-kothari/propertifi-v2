import { Component, inject, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../../core/auth/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
    selector: 'app-pm-layout',
    standalone: true,
    imports: [CommonModule, RouterLink, RouterOutlet, RouterLinkActive],
    templateUrl: './pm-layout.component.html',
    styleUrl: './pm-layout.component.scss'
})
export class PmLayoutComponent implements OnInit {
    authService = inject(AuthService);
    notificationService = inject(NotificationService);
    currentUser = this.authService.currentUser;

    constructor() {
        effect(() => {
            const user = this.currentUser();
            if (user) {
                this.notificationService.listenForUserNotifications(user.id);
            }
        });
    }

    ngOnInit(): void {
        // Initial fetch
    }

    logout() {
        this.authService.logout();
    }
}

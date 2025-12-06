import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../../core/services/user.service';
import { AdminService } from '../../../../core/services/admin.service';
import { Observable } from 'rxjs';
import { User } from '../../../../core/models/user.model';
import { UiCardComponent } from '../../../../shared/components/ui-card/ui-card.component';
import { UiBadgeComponent } from '../../../../shared/components/ui-badge/ui-badge';
import { UiButtonComponent } from '../../../../shared/components/ui-button/ui-button.component';

@Component({
    selector: 'app-user-list',
    standalone: true,
    imports: [CommonModule, UiCardComponent, UiBadgeComponent, UiButtonComponent],
    templateUrl: './user-list.component.html'
})
export class UserListComponent {
    private userService = inject(UserService);
    private adminService = inject(AdminService);
    users$: Observable<{ data: User[] }> = this.userService.getUsers();

    onVerify(userId: number) {
        if (confirm('Are you sure you want to verify this user?')) {
            this.adminService.verifyUser(userId).subscribe(() => {
                // Refresh list or show notification
                alert('User verified successfully');
            });
        }
    }

    onAssignRole(userId: number, role: string) {
        if (confirm(`Are you sure you want to assign ${role} role to this user?`)) {
            this.adminService.assignRole(userId, role).subscribe(() => {
                // Refresh list or show notification
                alert(`Role ${role} assigned successfully`);
            });
        }
    }
}

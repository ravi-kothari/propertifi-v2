import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';
import { UserType } from '../models/user.model';

export const roleGuard = (allowedRoles: UserType[]): CanActivateFn => {
    return (route, state) => {
        const authService = inject(AuthService);
        const router = inject(Router);
        const user = authService.currentUser();

        if (user && user.type && allowedRoles.includes(user.type)) {
            return true;
        }

        // Redirect to unauthorized or dashboard
        return router.createUrlTree(['/unauthorized']);
    };
};

import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';

export const guestGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isAuthenticated()) {
        return true;
    }

    // Redirect to dashboard if already logged in
    const user = authService.currentUser();
    if (user?.type === 'owner') {
        return router.createUrlTree(['/dashboard/owner']);
    } else if (user?.type === 'pm') {
        return router.createUrlTree(['/dashboard/pm']);
    } else if (user?.type === 'admin') {
        return router.createUrlTree(['/admin']);
    }

    return router.createUrlTree(['/']);
};

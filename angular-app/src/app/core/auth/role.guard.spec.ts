import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { roleGuard } from './role.guard';
import { AuthService } from './auth.service';
import { User } from '../models/user.model';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { RouterTestingModule } from '@angular/router/testing';

describe('roleGuard', () => {
    let authServiceMock: any;
    let routerMock: any;

    const executeGuard = (allowedRoles: any[]) =>
        TestBed.runInInjectionContext(() => roleGuard(allowedRoles)({} as any, {} as any));

    beforeEach(() => {
        authServiceMock = {
            currentUser: vi.fn()
        };
        routerMock = {
            createUrlTree: vi.fn().mockReturnValue('unauthorized-tree')
        };

        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            providers: [
                { provide: AuthService, useValue: authServiceMock },
                { provide: Router, useValue: routerMock }
            ]
        });
    });

    it('should allow access if user has allowed role', () => {
        const user: User = { id: 1, name: 'Owner', email: 'owner@test.com', role: 'owner', type: 'owner', email_verified_at: null };
        authServiceMock.currentUser.mockReturnValue(user);

        const result = executeGuard(['owner']);
        expect(result).toBe(true);
    });

    it('should deny access if user does not have allowed role', () => {
        const user: User = { id: 1, name: 'PM', email: 'pm@test.com', role: 'property_manager', type: 'pm', email_verified_at: null };
        authServiceMock.currentUser.mockReturnValue(user);

        const result = executeGuard(['owner']);
        expect(result).toBe('unauthorized-tree');
        expect(routerMock.createUrlTree).toHaveBeenCalledWith(['/unauthorized']);
    });

    it('should deny access if user is not logged in', () => {
        authServiceMock.currentUser.mockReturnValue(null);

        const result = executeGuard(['owner']);
        expect(result).toBe('unauthorized-tree');
    });
});

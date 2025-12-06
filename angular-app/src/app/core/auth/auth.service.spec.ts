import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { User } from '../models/user.model';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('AuthService', () => {
    let service: AuthService;
    let httpMock: HttpTestingController;
    let router: Router;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, RouterTestingModule],
            providers: [AuthService]
        });
        service = TestBed.inject(AuthService);
        httpMock = TestBed.inject(HttpTestingController);
        router = TestBed.inject(Router);
    });

    afterEach(() => {
        httpMock.verify();
        localStorage.clear();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should login and store user details', () => {
        const mockUser: User = {
            id: 1,
            name: 'Test User',
            email: 'test@example.com',
            role: 'owner',
            type: 'owner',
            email_verified_at: null
        };
        const mockResponse = { access_token: 'fake-token', token_type: 'Bearer' as const, user: mockUser };
        const credentials = { email: 'test@example.com', password: 'password' };

        const navigateSpy = vi.spyOn(router, 'navigate');

        service.login(credentials).subscribe(response => {
            expect(response.access_token).toBe('fake-token');
            expect(service.currentUser()).toEqual(mockUser);
            expect(service.token()).toBe('fake-token');
        });

        const req = httpMock.expectOne('/api/login');
        expect(req.request.method).toBe('POST');
        req.flush(mockResponse);

        expect(localStorage.getItem('token')).toBe('fake-token');
        expect(navigateSpy).toHaveBeenCalledWith(['/dashboard/owner']);
    });

    it('should logout and clear storage', () => {
        localStorage.setItem('token', 'old-token');
        const navigateSpy = vi.spyOn(router, 'navigate');

        service.logout();

        const req = httpMock.expectOne('/api/logout');
        expect(req.request.method).toBe('POST');
        req.flush({});

        expect(localStorage.getItem('token')).toBeNull();
        expect(service.currentUser()).toBeNull();
        expect(navigateSpy).toHaveBeenCalledWith(['/auth/login']);
    });
});

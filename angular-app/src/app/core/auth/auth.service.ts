import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap, catchError, throwError, Observable, of } from 'rxjs';
import { User, LoginCredentials, RegisterData, AuthResponse } from '../models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private http = inject(HttpClient);
    private router = inject(Router);
    private apiUrl = environment.apiUrl;

    // Signals
    currentUser = signal<User | null>(this.getUserFromStorage());
    token = signal<string | null>(localStorage.getItem('token'));
    isLoading = signal<boolean>(false);

    // Computed
    isAuthenticated = computed(() => !!this.currentUser());
    isOwner = computed(() => this.currentUser()?.type === 'owner');
    isPropertyManager = computed(() => this.currentUser()?.type === 'pm');
    isAdmin = computed(() => this.currentUser()?.type === 'admin');

    constructor() { }

    /**
     * Attempt to log in a user.
     * @param credentials - Email and password
     * @returns Observable of AuthResponse
     */
    login(credentials: LoginCredentials): Observable<AuthResponse> {
        this.isLoading.set(true);
        // CSRF cookie is handled by Sanctum automatically if we hit /sanctum/csrf-cookie first
        // But for API token auth, we just hit the endpoint.
        return this.http.post<AuthResponse>(`/api/v2/auth/login`, credentials).pipe(
            tap(response => {
                this.setAuth(response.access_token, response.user);
                this.isLoading.set(false);
                this.redirectUser(response.user);
            }),
            catchError(error => {
                this.isLoading.set(false);
                return throwError(() => error);
            })
        );
    }

    /**
     * Register a new user (Owner).
     * @param data - Registration data
     * @returns Observable of AuthResponse
     */
    register(data: RegisterData): Observable<AuthResponse> {
        this.isLoading.set(true);
        return this.http.post<AuthResponse>(`/api/v2/auth/register`, data).pipe(
            tap(response => {
                this.setAuth(response.access_token, response.user);
                this.isLoading.set(false);
                this.redirectUser(response.user);
            }),
            catchError(error => {
                this.isLoading.set(false);
                return throwError(() => error);
            })
        );
    }

    /**
     * Log out the current user and clear local storage.
     */
    logout(): void {
        this.isLoading.set(true);
        this.http.post(`/api/v2/auth/logout`, {}).pipe(
            catchError(() => of(null)), // Ignore errors on logout
            tap(() => {
                this.clearAuth();
                this.isLoading.set(false);
                this.router.navigate(['/auth/login']);
            })
        ).subscribe();
    }

    private setAuth(token: string, user: User): void {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        this.token.set(token);
        this.currentUser.set(user);
    }

    private clearAuth(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.token.set(null);
        this.currentUser.set(null);
    }

    private getUserFromStorage(): User | null {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    }

    private redirectUser(user: User): void {
        if (user.type === 'owner') {
            this.router.navigate(['/dashboard/owner']);
        } else if (user.type === 'pm') {
            this.router.navigate(['/dashboard/pm']);
        } else if (user.type === 'admin') {
            this.router.navigate(['/admin']);
        } else {
            this.router.navigate(['/']);
        }
    }
}

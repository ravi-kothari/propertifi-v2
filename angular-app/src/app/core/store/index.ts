import { AuthState } from './auth/auth.state';

/**
 * Application State Interface
 *
 * This is the root state interface for the entire application.
 * It defines the shape of the global NgRx store, which is composed
 * of feature states.
 *
 * Currently includes:
 * - auth: Authentication state (user, token, loading, errors)
 *
 * Future feature states will be added here as the application grows, e.g.:
 * - leads: Lead management state
 * - notifications: Notification state
 * - templates: Template management state
 * - analytics: Analytics and metrics state
 *
 * Each feature state should be defined in its own directory under
 * src/app/core/store/[feature-name]/ following the pattern established
 * by the auth store.
 *
 * @interface AppState
 */
export interface AppState {
  /**
   * Authentication feature state
   * Manages user authentication, tokens, and auth-related UI state
   */
  auth: AuthState;

  // Future feature states will be added here:
  // leads: LeadsState;
  // notifications: NotificationsState;
  // templates: TemplatesState;
  // analytics: AnalyticsState;
}

/**
 * Re-export auth store components for convenience
 *
 * This allows components to import everything they need from a single location:
 *
 * @example
 * // Instead of multiple imports:
 * import { login } from './core/store/auth/auth.actions';
 * import { selectUser } from './core/store/auth/auth.selectors';
 * import { User } from './core/store/auth/auth.state';
 *
 * // Components can do:
 * import { login, selectUser, User } from './core/store';
 */

// Export all auth actions
export * from './auth/auth.actions';

// Export all auth selectors
export * from './auth/auth.selectors';

// Export auth state interfaces
export * from './auth/auth.state';

/**
 * Usage Guide
 * ===========
 *
 * In Components:
 * --------------
 * import { Component, OnInit } from '@angular/core';
 * import { Store } from '@ngrx/store';
 * import { Observable } from 'rxjs';
 * import { AppState, selectUser, selectIsLoading, login, User } from './core/store';
 *
 * @Component({
 *   selector: 'app-login',
 *   template: `
 *     <form (ngSubmit)="onLogin()">
 *       <input [(ngModel)]="email" type="email" />
 *       <input [(ngModel)]="password" type="password" />
 *       <button [disabled]="isLoading$ | async">
 *         {{ (isLoading$ | async) ? 'Logging in...' : 'Login' }}
 *       </button>
 *     </form>
 *   `
 * })
 * export class LoginComponent {
 *   user$: Observable<User | null>;
 *   isLoading$: Observable<boolean>;
 *   email = '';
 *   password = '';
 *
 *   constructor(private store: Store<AppState>) {
 *     // Subscribe to store slices
 *     this.user$ = this.store.select(selectUser);
 *     this.isLoading$ = this.store.select(selectIsLoading);
 *   }
 *
 *   onLogin() {
 *     // Dispatch action to store
 *     this.store.dispatch(login({
 *       email: this.email,
 *       password: this.password
 *     }));
 *   }
 * }
 *
 * In Guards:
 * ----------
 * import { inject } from '@angular/core';
 * import { Router } from '@angular/router';
 * import { Store } from '@ngrx/store';
 * import { map } from 'rxjs/operators';
 * import { AppState, selectIsAuthenticated } from './core/store';
 *
 * export const authGuard = () => {
 *   const store = inject(Store<AppState>);
 *   const router = inject(Router);
 *
 *   return store.select(selectIsAuthenticated).pipe(
 *     map(isAuth => isAuth || router.parseUrl('/auth/login'))
 *   );
 * };
 */

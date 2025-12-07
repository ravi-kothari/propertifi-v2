import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, exhaustMap, tap } from 'rxjs/operators';
import { AuthService } from '../../auth/auth.service';
import { WebSocketService } from '../../services/websocket.service';
import * as AuthActions from './auth.actions';

/**
 * Authentication Effects
 *
 * Effects are where side effects are handled in NgRx applications.
 * Side effects include:
 * - API calls
 * - localStorage operations
 * - Navigation
 * - Logging
 * - Any other operations that interact with the outside world
 *
 * Effects listen to actions dispatched from the Store, perform side effects,
 * and then dispatch new actions based on the results.
 *
 * Key RxJS operators used:
 * - ofType: Filters actions to only those we care about
 * - exhaustMap: Ignores new actions while previous operation is in progress
 *               (prevents multiple login attempts while one is pending)
 * - map: Transforms the result into a new action
 * - catchError: Handles errors by dispatching failure actions
 * - tap: Performs side effects without changing the stream (e.g., navigation)
 */
@Injectable()
export class AuthEffects {
  /**
   * Inject dependencies using the modern Angular inject() function.
   * This is preferred over constructor injection in Angular 14+.
   */
  private actions$ = inject(Actions);
  private authService = inject(AuthService);
  private router = inject(Router);
  private websocketService = inject(WebSocketService);

  /**
   * Login Effect
   *
   * Listens for: AuthActions.login
   * Side effects: Call backend API via AuthService
   * Dispatches: loginSuccess on success, loginFailure on error
   *
   * Flow:
   * 1. User submits login form -> component dispatches login action
   * 2. This effect catches the action and calls AuthService.login()
   * 3. On success, dispatches loginSuccess with user and token
   * 4. On failure, dispatches loginFailure with error message
   *
   * Note: AuthService.login() already saves token/user to localStorage,
   * so we don't duplicate that logic here.
   *
   * exhaustMap is used to prevent multiple concurrent login attempts.
   * If user clicks login button multiple times, only the first click
   * will trigger the API call.
   */
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      exhaustMap(({ email, password }) =>
        this.authService.login({ email, password }).pipe(
          map(({ user, access_token }) => {
            // AuthService already handles localStorage - we just dispatch success
            return AuthActions.loginSuccess({ user, token: access_token });
          }),
          catchError((error) => {
            // Log full error for debugging
            console.error('[Auth Effect] Login failed:', error);
            // Return sanitized user-facing message
            const userMessage = this.sanitizeErrorMessage(error, 'Unable to log in. Please check your credentials and try again.');
            return of(AuthActions.loginFailure({ error: userMessage }));
          })
        )
      )
    )
  );

  /**
   * Login Success Effect
   *
   * Listens for: AuthActions.loginSuccess
   * Side effects:
   *   - Initialize WebSocket connection with user token
   *   - Navigate to appropriate dashboard based on user type
   * Dispatches: Nothing (dispatch: false)
   *
   * This is a "dispatch: false" effect because it only performs side effects.
   * Side effects performed:
   * 1. Establish WebSocket connection for real-time updates
   * 2. Navigate to the appropriate dashboard based on user role
   *
   * Route mapping by user type:
   * - admin -> /admin (admin dashboard)
   * - owner -> /dashboard/owner (owner dashboard)
   * - pm -> /dashboard/pm (property manager dashboard)
   *
   * WebSocket connection enables:
   * - Real-time notifications
   * - Live lead updates
   * - Dashboard analytics updates
   */
  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(({ user, token }) => {
          // Initialize WebSocket connection with authentication token
          // This enables real-time features for the authenticated user
          this.websocketService.connect(token);

          // Navigate based on user type
          if (user.type === 'admin') {
            this.router.navigate(['/admin']);
          } else if (user.type === 'owner') {
            this.router.navigate(['/dashboard/owner']);
          } else if (user.type === 'pm') {
            this.router.navigate(['/dashboard/pm']);
          }
        })
      ),
    { dispatch: false } // This effect doesn't dispatch another action
  );

  /**
   * Register Effect
   *
   * Listens for: AuthActions.register
   * Side effects: Call backend API to create new user account
   * Dispatches: registerSuccess on success, registerFailure on error
   *
   * Flow:
   * 1. User submits registration form -> component dispatches register action
   * 2. This effect catches the action and calls AuthService.register()
   * 3. Backend creates user and returns user object + token
   * 4. On success, dispatches registerSuccess (user is now logged in)
   * 5. On failure, dispatches registerFailure with error message
   *
   * Note: Password confirmation is handled by duplicating the password
   * since the backend expects password_confirmation field.
   */
  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.register),
      exhaustMap(({ email, password, name, userType }) =>
        this.authService.register({
          name,
          email,
          password,
          password_confirmation: password // Backend expects this field
        }).pipe(
          map(({ user, access_token }) => {
            // AuthService already handles localStorage
            return AuthActions.registerSuccess({ user, token: access_token });
          }),
          catchError((error) => {
            // Log full error for debugging
            console.error('[Auth Effect] Registration failed:', error);
            // Return sanitized user-facing message
            const userMessage = this.sanitizeErrorMessage(error, 'Unable to create account. Please try again.');
            return of(AuthActions.registerFailure({ error: userMessage }));
          })
        )
      )
    )
  );

  /**
   * Register Success Effect
   *
   * Listens for: AuthActions.registerSuccess
   * Side effects: Navigate to email verification page
   * Dispatches: Nothing (dispatch: false)
   *
   * After successful registration, the user is authenticated but their
   * email is not verified. We redirect them to the verification page
   * where they'll be prompted to check their email.
   */
  registerSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.registerSuccess),
        tap(() => {
          this.router.navigate(['/auth/verify-email']);
        })
      ),
    { dispatch: false }
  );

  /**
   * Logout Effect
   *
   * Listens for: AuthActions.logout
   * Side effects:
   *   - Call AuthService.logout() to clear session
   *   - Disconnect WebSocket connection
   * Dispatches: logoutSuccess
   *
   * AuthService.logout() is a void method that:
   * - Clears localStorage (token, user)
   * - Optionally calls backend to invalidate token
   * - Performs any other cleanup
   *
   * WebSocket cleanup is important to:
   * - Free up resources
   * - Close unnecessary connections
   * - Prevent memory leaks
   * - Stop receiving notifications for logged-out user
   *
   * We always dispatch logoutSuccess, even if backend call fails,
   * because we want to clear local state regardless.
   */
  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      tap(() => {
        // Disconnect WebSocket to stop real-time updates and free resources
        this.websocketService.disconnect();

        // AuthService.logout() handles all cleanup
        this.authService.logout();
      }),
      map(() => AuthActions.logoutSuccess())
    )
  );

  /**
   * Logout Success Effect
   *
   * Listens for: AuthActions.logoutSuccess
   * Side effects: Navigate to login page
   * Dispatches: Nothing (dispatch: false)
   *
   * After logout is complete and state is cleared, redirect user
   * to the login page so they can authenticate again.
   */
  logoutSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logoutSuccess),
        tap(() => {
          // Navigate to login page
          this.router.navigate(['/auth/login']);
        })
      ),
    { dispatch: false }
  );

  /**
   * Refresh User Effect
   *
   * Listens for: AuthActions.refreshUser
   * Side effects: Load user from localStorage (backend endpoint not implemented yet)
   * Dispatches: refreshUserSuccess with user data, or refreshUserFailure
   *
   * TODO: This should call a backend endpoint like GET /api/user to fetch
   * the latest user data. Currently, it just reads from localStorage as a
   * temporary implementation.
   *
   * Use cases:
   * - After updating user profile
   * - Periodically to sync remote changes
   * - When resuming a session
   * - Token validation on app load
   */
  refreshUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.refreshUser),
      map(() => {
        // TODO: Replace with actual API call when backend endpoint exists
        // For now, just reload from localStorage
        const userStr = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (userStr && token) {
          try {
            const user = JSON.parse(userStr);
            return AuthActions.refreshUserSuccess({ user });
          } catch (error) {
            console.error('[Auth Effect] Failed to parse user from localStorage:', error);
            return AuthActions.refreshUserFailure({ error: 'Invalid user data' });
          }
        }
        return AuthActions.refreshUserFailure({ error: 'No user in storage' });
      })
    )
  );

  /**
   * Refresh User Success Effect
   *
   * Listens for: AuthActions.refreshUserSuccess
   * Side effects: Re-initialize WebSocket connection when user is refreshed
   * Dispatches: Nothing (dispatch: false)
   *
   * When the user is refreshed (typically on app load), we need to
   * re-establish the WebSocket connection if a token is available.
   * This ensures real-time features work after page reload.
   */
  refreshUserSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.refreshUserSuccess),
        tap(() => {
          const token = localStorage.getItem('token');
          if (token) {
            // Re-initialize WebSocket connection with stored token
            this.websocketService.connect(token);
          }
        })
      ),
    { dispatch: false }
  );

  /**
   * Refresh User Failure Effect
   *
   * Listens for: AuthActions.refreshUserFailure
   * Side effects: Dispatch logout when token refresh fails
   * Dispatches: logout
   *
   * This ensures that when token validation fails on app load,
   * the user is logged out and any stale data is cleared.
   */
  refreshUserFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.refreshUserFailure),
      map(() => {
        console.warn('[Auth Effect] Token validation failed, logging out user');
        return AuthActions.logout();
      })
    )
  );

  /**
   * Load Auth From Storage Effect
   *
   * Listens for: AuthActions.loadAuthFromStorage
   * Side effects: Read token and user from localStorage, validate token
   * Dispatches: refreshUser if found, logoutSuccess if not found
   *
   * This effect should be dispatched when the app initializes (in app.component.ts)
   * to restore the authentication state from a previous session.
   *
   * Flow:
   * 1. App starts -> app.component dispatches loadAuthFromStorage
   * 2. This effect reads localStorage
   * 3. If token and user exist -> dispatch refreshUser (validates token)
   * 4. If refreshUser succeeds -> user is logged in
   * 5. If refreshUser fails -> refreshUserFailure$ effect dispatches logout
   * 6. If not found -> dispatch logoutSuccess (clean initial state)
   *
   * This allows users to remain logged in across browser sessions
   * while also ensuring expired tokens are detected and handled.
   */
  loadAuthFromStorage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loadAuthFromStorage),
      map(() => {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');

        if (token && userStr) {
          try {
            // Validate that user data is parseable JSON
            JSON.parse(userStr);
            // Trigger refreshUser which will validate the token
            return AuthActions.refreshUser();
          } catch (error) {
            // Invalid JSON in localStorage - clear it
            console.error('[Auth Effect] Invalid data in localStorage:', error);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            return AuthActions.logoutSuccess();
          }
        }

        // No stored session - start with clean state
        return AuthActions.logoutSuccess();
      })
    )
  );

  /**
   * Error Message Sanitization Helper
   *
   * Sanitizes backend error messages to prevent exposing sensitive information.
   * Logs the full error for debugging while returning a user-friendly message.
   *
   * @param error - The error object from the backend
   * @param defaultMessage - The default user-facing message to return
   * @returns A sanitized error message safe to display to users
   */
  private sanitizeErrorMessage(error: any, defaultMessage: string): string {
    // If error has a user-friendly message from backend, use it
    // Otherwise use the default message
    if (error?.error?.message && typeof error.error.message === 'string') {
      return error.error.message;
    }
    return defaultMessage;
  }
}

import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.state';

/**
 * Authentication Selectors
 *
 * Selectors are pure functions used for obtaining slices of store state.
 * They provide several benefits:
 *
 * 1. Memoization: Selectors are memoized, meaning they only recompute when
 *    their input state changes, improving performance.
 *
 * 2. Composability: Complex selectors can be built from simpler ones,
 *    promoting code reuse and maintainability.
 *
 * 3. Testability: Selectors are pure functions that can be easily unit tested.
 *
 * 4. Encapsulation: Components don't need to know the shape of the state tree,
 *    they just use selectors to get what they need.
 *
 * Usage in components:
 *   this.user$ = this.store.select(selectUser);
 *   this.isAuthenticated$ = this.store.select(selectIsAuthenticated);
 */

/**
 * Feature Selector for Auth State
 *
 * This is the root selector for the auth feature state.
 * It extracts the 'auth' slice from the global store.
 *
 * The 'auth' key must match the key used in app.config.ts:
 *   provideStore({ auth: authReducer })
 */
export const selectAuthState = createFeatureSelector<AuthState>('auth');

/**
 * Select Current User
 *
 * Returns the authenticated user object or null if not logged in.
 * Use this to display user information in the UI (name, email, avatar, etc.)
 *
 * @example
 * // In component
 * this.user$ = this.store.select(selectUser);
 * // In template
 * <div *ngIf="user$ | async as user">{{ user.name }}</div>
 */
export const selectUser = createSelector(
  selectAuthState,
  (state) => state.user
);

/**
 * Select Auth Token
 *
 * Returns the JWT authentication token or null.
 * The token is automatically added to HTTP requests by the auth interceptor,
 * so components rarely need to access this directly.
 *
 * Useful for debugging or manual API calls.
 */
export const selectToken = createSelector(
  selectAuthState,
  (state) => state.token
);

/**
 * Select Authentication Status
 *
 * Returns true if a user is currently authenticated.
 * This is the primary selector used by route guards to protect routes.
 *
 * @example
 * // In guard
 * return this.store.select(selectIsAuthenticated).pipe(
 *   map(isAuth => isAuth || this.router.parseUrl('/login'))
 * );
 */
export const selectIsAuthenticated = createSelector(
  selectAuthState,
  (state) => state.isAuthenticated
);

/**
 * Select Loading State
 *
 * Returns true during async authentication operations.
 * Use this to show loading spinners and disable form submission buttons.
 *
 * @example
 * // In template
 * <button [disabled]="isLoading$ | async">
 *   {{ (isLoading$ | async) ? 'Logging in...' : 'Login' }}
 * </button>
 */
export const selectIsLoading = createSelector(
  selectAuthState,
  (state) => state.isLoading
);

/**
 * Select Auth Error
 *
 * Returns the current error message or null if no error.
 * Display this in the login/register forms to show validation errors
 * or authentication failures.
 *
 * @example
 * // In template
 * <div class="error" *ngIf="error$ | async as error">{{ error }}</div>
 */
export const selectAuthError = createSelector(
  selectAuthState,
  (state) => state.error
);

/**
 * Select User Role
 *
 * Returns the user's role (admin, owner, pm) or undefined if not logged in.
 * Use this for role-based UI rendering and permissions.
 *
 * Note: Uses optional chaining (?.) since user may be null.
 */
export const selectUserRole = createSelector(
  selectUser,
  (user) => user?.role
);

/**
 * Select User Type
 *
 * Returns the user's type (admin, owner, pm) or undefined if not logged in.
 * Similar to role but uses the 'type' field which is the actual field
 * name in the User model.
 *
 * This is the preferred selector over selectUserRole as it matches
 * the actual database schema.
 */
export const selectUserType = createSelector(
  selectUser,
  (user) => user?.type
);

/**
 * Select Is Admin
 *
 * Returns true if the current user is an admin.
 * Composed selector that builds on selectUserType.
 *
 * Use this to show/hide admin-only UI elements:
 * @example
 * <div *ngIf="isAdmin$ | async">Admin Panel</div>
 */
export const selectIsAdmin = createSelector(
  selectUserType,
  (type) => type === 'admin'
);

/**
 * Select Is Owner
 *
 * Returns true if the current user is a property owner.
 * Use this to show owner-specific features and navigation.
 *
 * @example
 * <a *ngIf="isOwner$ | async" routerLink="/dashboard/owner">My Properties</a>
 */
export const selectIsOwner = createSelector(
  selectUserType,
  (type) => type === 'owner'
);

/**
 * Select Is Property Manager
 *
 * Returns true if the current user is a property manager.
 * Use this to show PM-specific features like lead management and templates.
 *
 * @example
 * <a *ngIf="isPM$ | async" routerLink="/dashboard/pm/leads">Leads</a>
 */
export const selectIsPropertyManager = createSelector(
  selectUserType,
  (type) => type === 'pm'
);

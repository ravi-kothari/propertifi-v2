import { createAction, props } from '@ngrx/store';
import { User } from './auth.state';

/**
 * Authentication Actions
 *
 * This file defines all NgRx actions related to authentication.
 * Actions are payloads of information that send data from the application
 * to the store. They are the only source of information for the store.
 *
 * Action naming convention: [Source] Event
 * - Source: The feature/component that dispatches the action
 * - Event: What happened (past tense for results, present tense for requests)
 */

// ============================================================================
// Login Actions
// ============================================================================

/**
 * Login Action
 *
 * Dispatched when a user attempts to log in.
 * Triggers the login effect which calls the AuthService.
 *
 * @property email - User's email address
 * @property password - User's password (will be sent securely to backend)
 */
export const login = createAction(
  '[Auth] Login',
  props<{ email: string; password: string }>()
);

/**
 * Login Success Action
 *
 * Dispatched by the login effect when authentication succeeds.
 * Updates the store with user data and token, and triggers navigation.
 *
 * @property user - Authenticated user object from backend
 * @property token - JWT token for API authentication
 */
export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ user: User; token: string }>()
);

/**
 * Login Failure Action
 *
 * Dispatched by the login effect when authentication fails.
 * Stores the error message in state for display to the user.
 *
 * @property error - Error message describing what went wrong
 */
export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: string }>()
);

// ============================================================================
// Register Actions
// ============================================================================

/**
 * Register Action
 *
 * Dispatched when a user attempts to create a new account.
 * Triggers the register effect which calls the AuthService.
 *
 * @property email - User's email address
 * @property password - User's chosen password
 * @property name - User's full name
 * @property role - User's role (owner, property-manager, admin)
 */
export const register = createAction(
  '[Auth] Register',
  props<{ email: string; password: string; name: string; role: string }>()
);

/**
 * Register Success Action
 *
 * Dispatched by the register effect when account creation succeeds.
 * Updates the store with user data and token, then navigates to email verification.
 *
 * @property user - Newly created user object from backend
 * @property token - JWT token for API authentication
 */
export const registerSuccess = createAction(
  '[Auth] Register Success',
  props<{ user: User; token: string }>()
);

/**
 * Register Failure Action
 *
 * Dispatched by the register effect when account creation fails.
 * Common failures: email already exists, validation errors.
 *
 * @property error - Error message describing what went wrong
 */
export const registerFailure = createAction(
  '[Auth] Register Failure',
  props<{ error: string }>()
);

// ============================================================================
// Logout Actions
// ============================================================================

/**
 * Logout Action
 *
 * Dispatched when a user clicks logout or when a 401 error occurs.
 * Triggers the logout effect which calls the AuthService and clears storage.
 */
export const logout = createAction('[Auth] Logout');

/**
 * Logout Success Action
 *
 * Dispatched by the logout effect after successfully logging out.
 * Resets the auth state to initial values and navigates to login page.
 */
export const logoutSuccess = createAction('[Auth] Logout Success');

// ============================================================================
// Refresh User Actions
// ============================================================================

/**
 * Refresh User Action
 *
 * Dispatched to update the user object with the latest data from the backend.
 * Useful after profile updates or when resuming a session.
 * Currently implemented with localStorage fallback since there's no backend endpoint yet.
 */
export const refreshUser = createAction('[Auth] Refresh User');

/**
 * Refresh User Success Action
 *
 * Dispatched when user data has been successfully refreshed.
 * Updates only the user object while preserving the token.
 *
 * @property user - Updated user object
 */
export const refreshUserSuccess = createAction(
  '[Auth] Refresh User Success',
  props<{ user: User }>()
);

/**
 * Refresh User Failure Action
 *
 * Dispatched when refreshing user data fails.
 * May indicate token expiration or network issues.
 *
 * @property error - Error message describing what went wrong
 */
export const refreshUserFailure = createAction(
  '[Auth] Refresh User Failure',
  props<{ error: string }>()
);

// ============================================================================
// Storage Actions
// ============================================================================

/**
 * Load Auth From Storage Action
 *
 * Dispatched on application initialization to restore authentication state
 * from localStorage. This allows users to remain logged in across browser sessions.
 *
 * The corresponding effect checks localStorage for token and user data,
 * then dispatches either loginSuccess or logoutSuccess accordingly.
 */
export const loadAuthFromStorage = createAction('[Auth] Load From Storage');

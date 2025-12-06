import { createReducer, on } from '@ngrx/store';
import { AuthState, initialAuthState } from './auth.state';
import * as AuthActions from './auth.actions';

/**
 * Authentication Reducer
 *
 * A reducer is a pure function that takes the current state and an action,
 * and returns a new state. Reducers specify how the application's state changes
 * in response to actions sent to the store.
 *
 * Key principles:
 * - Pure functions (no side effects)
 * - Always return a new state object (immutability)
 * - Never modify the input state directly
 *
 * This reducer handles all authentication-related state changes including:
 * - Login/Logout flows
 * - Registration flows
 * - User data refresh
 * - Loading states
 * - Error handling
 */
export const authReducer = createReducer(
  initialAuthState,

  // ==========================================================================
  // Login Handlers
  // ==========================================================================

  /**
   * Handle Login Action
   *
   * Sets loading state to true and clears any previous errors.
   * This provides immediate UI feedback that authentication is in progress.
   */
  on(AuthActions.login, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  /**
   * Handle Login Success Action
   *
   * Updates state with authenticated user and token.
   * Sets isAuthenticated flag for route guards and UI logic.
   * Clears loading state and any errors.
   *
   * Note: Token and user are also persisted to localStorage by the effect,
   * but the store is the single source of truth during the session.
   */
  on(AuthActions.loginSuccess, (state, { user, token }) => ({
    ...state,
    user,
    token,
    isAuthenticated: true,
    isLoading: false,
    error: null,
  })),

  /**
   * Handle Login Failure Action
   *
   * Clears loading state and stores the error message.
   * User and token remain null, isAuthenticated remains false.
   * Error message will be displayed in the login form.
   */
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),

  // ==========================================================================
  // Register Handlers
  // ==========================================================================

  /**
   * Handle Register Action
   *
   * Sets loading state to true and clears any previous errors.
   * Similar to login, provides UI feedback during account creation.
   */
  on(AuthActions.register, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  /**
   * Handle Register Success Action
   *
   * Updates state with newly created user and token.
   * User is now authenticated immediately after registration.
   * The effect will navigate to email verification page.
   */
  on(AuthActions.registerSuccess, (state, { user, token }) => ({
    ...state,
    user,
    token,
    isAuthenticated: true,
    isLoading: false,
    error: null,
  })),

  /**
   * Handle Register Failure Action
   *
   * Clears loading state and stores the error message.
   * Common errors: email already exists, password too weak, validation failures.
   */
  on(AuthActions.registerFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),

  // ==========================================================================
  // Logout Handlers
  // ==========================================================================

  /**
   * Handle Logout Success Action
   *
   * Resets the entire auth state to initial values.
   * This is a complete reset - no partial state remains.
   * localStorage is also cleared by the logout effect.
   *
   * Note: We reset on logoutSuccess rather than logout action itself
   * to ensure the effect has completed its cleanup.
   */
  on(AuthActions.logoutSuccess, () => initialAuthState),

  // ==========================================================================
  // Refresh User Handlers
  // ==========================================================================

  /**
   * Handle Refresh User Action
   *
   * Sets loading state while fetching updated user data.
   * Preserves existing user and token during the refresh.
   */
  on(AuthActions.refreshUser, (state) => ({
    ...state,
    isLoading: true,
  })),

  /**
   * Handle Refresh User Success Action
   *
   * Updates the user object with fresh data from the backend.
   * Token remains unchanged - only user profile data is refreshed.
   * This is useful after profile updates or to sync remote changes.
   */
  on(AuthActions.refreshUserSuccess, (state, { user }) => ({
    ...state,
    user,
    isLoading: false,
  })),

  /**
   * Handle Refresh User Failure Action
   *
   * Clears loading state and stores the error.
   * User and token are preserved - this is not a logout scenario.
   * May indicate network issues or token expiration.
   */
  on(AuthActions.refreshUserFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  }))
);

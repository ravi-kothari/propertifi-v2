import { User, UserType } from '../../models/user.model';

/**
 * Authentication State Interface
 *
 * Represents the complete authentication state in the NgRx store.
 * This interface defines all authentication-related data that needs to be
 * maintained globally across the application.
 *
 * @interface AuthState
 */
export interface AuthState {
  /**
   * The currently authenticated user object
   * Null when no user is logged in
   */
  user: User | null;

  /**
   * JWT authentication token
   * Used for API authentication via HTTP interceptors
   * Stored in localStorage for persistence across sessions
   */
  token: string | null;

  /**
   * Authentication status flag
   * True when a valid user and token exist
   * Used by route guards to protect authenticated routes
   */
  isAuthenticated: boolean;

  /**
   * Loading state indicator
   * True during async authentication operations (login, register, refresh)
   * Used to show loading spinners and disable UI elements
   */
  isLoading: boolean;

  /**
   * Error message from failed authentication operations
   * Null when no error has occurred
   * Displayed to users when authentication fails
   */
  error: string | null;
}

/**
 * Initial Authentication State
 *
 * Default state when the application starts before any authentication
 * actions have been dispatched. Represents an unauthenticated user
 * with no ongoing operations.
 *
 * @constant
 */
export const initialAuthState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Re-export User and UserType types for convenience when importing from auth state
export type { User, UserType };

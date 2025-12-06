import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { routes } from './app.routes';
import { authReducer } from './core/store/auth/auth.reducer';
import { AuthEffects } from './core/store/auth/auth.effects';
import { authInterceptor } from './core/auth/auth.interceptor';

/**
 * Application Configuration
 *
 * This file configures the Angular application using the new standalone API
 * (introduced in Angular 14+). The ApplicationConfig object defines all
 * global providers that will be available throughout the application.
 *
 * Traditional app.module.ts pattern:
 * - Uses NgModule decorator
 * - Requires imports, declarations, providers arrays
 * - More boilerplate code
 *
 * New standalone pattern (used here):
 * - Uses ApplicationConfig object
 * - Cleaner, more functional approach
 * - Better tree-shaking and code splitting
 * - Easier to understand and maintain
 *
 * This configuration sets up:
 * 1. Routing
 * 2. HTTP client with authentication interceptor
 * 3. Animations
 * 4. NgRx Store (state management)
 * 5. NgRx Effects (side effects handling)
 * 6. NgRx DevTools (debugging)
 */
export const appConfig: ApplicationConfig = {
  providers: [
    /**
     * Router Configuration
     *
     * Provides the Angular router with application routes.
     * Routes are defined in app.routes.ts and include:
     * - Public routes (login, register, home)
     * - Protected routes (dashboards, profiles)
     * - Role-based routes (admin, owner, PM)
     * - Lazy-loaded feature modules
     */
    provideRouter(routes),

    /**
     * HTTP Client Configuration
     *
     * Provides the HttpClient service for making HTTP requests.
     * withInterceptors() registers the authInterceptor which:
     * - Automatically adds the JWT token to outgoing requests
     * - Handles 401 errors by redirecting to login
     * - Adds common headers (Content-Type, Accept)
     *
     * Using functional interceptors (new in Angular 15+) instead of
     * class-based interceptors for better tree-shaking and simplicity.
     */
    provideHttpClient(withInterceptors([authInterceptor])),

    /**
     * Animations Configuration
     *
     * Enables Angular animations throughout the application asynchronously.
     * Required for:
     * - Route transition animations (defined in route-animations.ts)
     * - Material UI component animations
     * - Custom component animations
     *
     * Using provideAnimationsAsync() instead of deprecated provideAnimations()
     * for better performance through lazy-loading of animation modules.
     * Without this, animations would be disabled and transitions
     * would be instant (which might be desired for performance-critical apps).
     */
    provideAnimationsAsync(),

    /**
     * NgRx Store Configuration
     *
     * Sets up the NgRx store with initial feature states.
     * The store is the single source of truth for application state.
     *
     * Configuration:
     * - auth: authReducer - Handles authentication state
     *
     * Future feature states will be added here as the app grows:
     * - leads: leadsReducer
     * - notifications: notificationsReducer
     * - templates: templatesReducer
     *
     * The store object shape matches the AppState interface in
     * src/app/core/store/index.ts
     */
    provideStore({
      auth: authReducer,
    }),

    /**
     * NgRx Effects Configuration
     *
     * Registers effect classes that handle side effects.
     * Effects listen to actions dispatched to the store and:
     * - Make HTTP requests
     * - Navigate between routes
     * - Access localStorage
     * - Dispatch new actions based on results
     *
     * Current effects:
     * - AuthEffects: Handles login, register, logout, and token refresh
     *
     * Future effects:
     * - LeadsEffects: Handle lead CRUD operations
     * - NotificationsEffects: Handle real-time notifications
     * - TemplatesEffects: Handle template management
     */
    provideEffects([AuthEffects]),

    /**
     * NgRx Store DevTools Configuration
     *
     * Enables the Redux DevTools Extension for debugging.
     * Features include:
     * - Time-travel debugging (replay actions)
     * - Inspect state at any point in time
     * - See action history with payload details
     * - Export/import state for testing
     *
     * Configuration:
     * - maxAge: 25 - Keep last 25 actions in history
     * - logOnly: !isDevMode() - In production, only log actions
     *                           (don't enable time-travel to save memory)
     *
     * To use:
     * 1. Install Redux DevTools browser extension
     * 2. Open browser DevTools
     * 3. Click "Redux" tab
     * 4. Interact with the app and watch actions/state changes
     */
    provideStoreDevtools({
      maxAge: 25, // Retain last 25 states for time-travel debugging
      logOnly: !isDevMode(), // In production mode, restrict to logging only
    }),
  ],
};

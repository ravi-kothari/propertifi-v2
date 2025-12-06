# Next.js to Angular Migration - Full Feature Parity Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Migrate all features from the Next.js application to Angular to achieve complete feature parity, including state management, real-time capabilities, RBAC, lead management, calculators, analytics, and third-party integrations.

**Architecture:** Three-phase approach starting with core infrastructure (NgRx state management, WebSocket service), then core features (RBAC, lead management, calculators), and finally advanced features (Google Maps, analytics, PDF generation). Uses NgRx for global state, Angular Signals for local state, and RxJS for reactive streams.

**Tech Stack:** Angular 17+, NgRx, RxJS, Laravel Echo, Pusher, Google Maps API, Chart.js, jsPDF, TailwindCSS, Angular Material

---

## Phase 1: Core Infrastructure (Week 1-2)

### Task 1: Setup NgRx Store Infrastructure

**Goal:** Establish NgRx state management with auth store as proof of concept

**Files:**
- Create: `angular-app/src/app/core/store/index.ts`
- Create: `angular-app/src/app/core/store/auth/auth.actions.ts`
- Create: `angular-app/src/app/core/store/auth/auth.reducer.ts`
- Create: `angular-app/src/app/core/store/auth/auth.selectors.ts`
- Create: `angular-app/src/app/core/store/auth/auth.effects.ts`
- Create: `angular-app/src/app/core/store/auth/auth.state.ts`
- Modify: `angular-app/src/app/app.config.ts`
- Install: `@ngrx/store`, `@ngrx/effects`, `@ngrx/store-devtools`

**Step 1: Install NgRx dependencies**

Run:
```bash
cd angular-app
npm install @ngrx/store @ngrx/effects @ngrx/store-devtools @ngrx/entity
```

**Step 2: Create auth state interface**

Create `angular-app/src/app/core/store/auth/auth.state.ts`:
```typescript
export interface User {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'owner' | 'property-manager';
  email_verified_at: string | null;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export const initialAuthState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};
```

**Step 3: Create auth actions**

Create `angular-app/src/app/core/store/auth/auth.actions.ts`:
```typescript
import { createAction, props } from '@ngrx/store';
import { User } from './auth.state';

// Login
export const login = createAction(
  '[Auth] Login',
  props<{ email: string; password: string }>()
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ user: User; token: string }>()
);

export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: string }>()
);

// Register
export const register = createAction(
  '[Auth] Register',
  props<{ email: string; password: string; name: string; role: string }>()
);

export const registerSuccess = createAction(
  '[Auth] Register Success',
  props<{ user: User; token: string }>()
);

export const registerFailure = createAction(
  '[Auth] Register Failure',
  props<{ error: string }>()
);

// Logout
export const logout = createAction('[Auth] Logout');

export const logoutSuccess = createAction('[Auth] Logout Success');

// Refresh User
export const refreshUser = createAction('[Auth] Refresh User');

export const refreshUserSuccess = createAction(
  '[Auth] Refresh User Success',
  props<{ user: User }>()
);

export const refreshUserFailure = createAction(
  '[Auth] Refresh User Failure',
  props<{ error: string }>()
);

// Load from storage
export const loadAuthFromStorage = createAction('[Auth] Load From Storage');
```

**Step 4: Create auth reducer**

Create `angular-app/src/app/core/store/auth/auth.reducer.ts`:
```typescript
import { createReducer, on } from '@ngrx/store';
import { AuthState, initialAuthState } from './auth.state';
import * as AuthActions from './auth.actions';

export const authReducer = createReducer(
  initialAuthState,

  // Login
  on(AuthActions.login, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(AuthActions.loginSuccess, (state, { user, token }) => ({
    ...state,
    user,
    token,
    isAuthenticated: true,
    isLoading: false,
    error: null,
  })),

  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),

  // Register
  on(AuthActions.register, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(AuthActions.registerSuccess, (state, { user, token }) => ({
    ...state,
    user,
    token,
    isAuthenticated: true,
    isLoading: false,
    error: null,
  })),

  on(AuthActions.registerFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),

  // Logout
  on(AuthActions.logoutSuccess, () => initialAuthState),

  // Refresh User
  on(AuthActions.refreshUser, (state) => ({
    ...state,
    isLoading: true,
  })),

  on(AuthActions.refreshUserSuccess, (state, { user }) => ({
    ...state,
    user,
    isLoading: false,
  })),

  on(AuthActions.refreshUserFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  }))
);
```

**Step 5: Create auth selectors**

Create `angular-app/src/app/core/store/auth/auth.selectors.ts`:
```typescript
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.state';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectUser = createSelector(
  selectAuthState,
  (state) => state.user
);

export const selectToken = createSelector(
  selectAuthState,
  (state) => state.token
);

export const selectIsAuthenticated = createSelector(
  selectAuthState,
  (state) => state.isAuthenticated
);

export const selectIsLoading = createSelector(
  selectAuthState,
  (state) => state.isLoading
);

export const selectAuthError = createSelector(
  selectAuthState,
  (state) => state.error
);

export const selectUserRole = createSelector(
  selectUser,
  (user) => user?.role
);

export const selectIsAdmin = createSelector(
  selectUserRole,
  (role) => role === 'admin'
);

export const selectIsOwner = createSelector(
  selectUserRole,
  (role) => role === 'owner'
);

export const selectIsPropertyManager = createSelector(
  selectUserRole,
  (role) => role === 'property-manager'
);
```

**Step 6: Create auth effects**

Create `angular-app/src/app/core/store/auth/auth.effects.ts`:
```typescript
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, exhaustMap, tap } from 'rxjs/operators';
import { AuthService } from '../../auth/auth.service';
import * as AuthActions from './auth.actions';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router
  ) {}

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      exhaustMap(({ email, password }) =>
        this.authService.login(email, password).pipe(
          map(({ user, token }) => {
            // Save to localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            return AuthActions.loginSuccess({ user, token });
          }),
          catchError((error) =>
            of(AuthActions.loginFailure({ error: error.message }))
          )
        )
      )
    )
  );

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(({ user }) => {
          // Navigate based on role
          if (user.role === 'admin') {
            this.router.navigate(['/admin']);
          } else if (user.role === 'owner') {
            this.router.navigate(['/owner']);
          } else if (user.role === 'property-manager') {
            this.router.navigate(['/property-manager']);
          }
        })
      ),
    { dispatch: false }
  );

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.register),
      exhaustMap(({ email, password, name, role }) =>
        this.authService.register(email, password, name, role).pipe(
          map(({ user, token }) => {
            // Save to localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            return AuthActions.registerSuccess({ user, token });
          }),
          catchError((error) =>
            of(AuthActions.registerFailure({ error: error.message }))
          )
        )
      )
    )
  );

  registerSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.registerSuccess),
        tap(() => {
          this.router.navigate(['/verify-email']);
        })
      ),
    { dispatch: false }
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      exhaustMap(() =>
        this.authService.logout().pipe(
          map(() => {
            // Clear localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            return AuthActions.logoutSuccess();
          }),
          catchError(() => {
            // Even if logout fails on server, clear local storage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            return of(AuthActions.logoutSuccess());
          })
        )
      )
    )
  );

  logoutSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logoutSuccess),
        tap(() => {
          this.router.navigate(['/login']);
        })
      ),
    { dispatch: false }
  );

  refreshUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.refreshUser),
      exhaustMap(() =>
        this.authService.getProfile().pipe(
          map((user) => {
            // Update user in localStorage
            localStorage.setItem('user', JSON.stringify(user));
            return AuthActions.refreshUserSuccess({ user });
          }),
          catchError((error) =>
            of(AuthActions.refreshUserFailure({ error: error.message }))
          )
        )
      )
    )
  );

  loadAuthFromStorage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loadAuthFromStorage),
      map(() => {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');

        if (token && userStr) {
          const user = JSON.parse(userStr);
          return AuthActions.loginSuccess({ user, token });
        }

        return AuthActions.logoutSuccess();
      })
    )
  );
}
```

**Step 7: Configure NgRx in app.config.ts**

Modify `angular-app/src/app/app.config.ts`:
```typescript
import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { routes } from './app.routes';
import { authReducer } from './core/store/auth/auth.reducer';
import { AuthEffects } from './core/store/auth/auth.effects';
import { authInterceptor } from './core/auth/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimations(),
    provideStore({
      auth: authReducer,
    }),
    provideEffects([AuthEffects]),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
    }),
  ],
};
```

**Step 8: Create store index file**

Create `angular-app/src/app/core/store/index.ts`:
```typescript
import { AuthState } from './auth/auth.state';

export interface AppState {
  auth: AuthState;
}

export * from './auth/auth.actions';
export * from './auth/auth.selectors';
export * from './auth/auth.state';
```

**Step 9: Commit**

Run:
```bash
git add angular-app/src/app/core/store angular-app/src/app/app.config.ts
git commit -m "feat: setup NgRx store with auth state management"
```

---

### Task 2: Create Real-time WebSocket Service

**Goal:** Implement Laravel Echo + Pusher integration for real-time notifications and updates

**Files:**
- Create: `angular-app/src/app/core/services/websocket.service.ts`
- Create: `angular-app/src/app/core/models/notification.model.ts`
- Install: `laravel-echo`, `pusher-js`

**Step 1: Install dependencies**

Run:
```bash
cd angular-app
npm install laravel-echo pusher-js
```

**Step 2: Create notification model**

Create `angular-app/src/app/core/models/notification.model.ts`:
```typescript
export interface Notification {
  id: string;
  type: 'lead' | 'message' | 'assignment' | 'system';
  title: string;
  message: string;
  data?: any;
  read: boolean;
  created_at: string;
}

export interface NotificationEvent {
  notification: Notification;
}
```

**Step 3: Create WebSocket service**

Create `angular-app/src/app/core/services/websocket.service.ts`:
```typescript
import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { environment } from '../../../environments/environment';
import { Notification } from '../models/notification.model';

declare global {
  interface Window {
    Pusher: any;
    Echo: Echo;
  }
}

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private echo: Echo | null = null;
  private connected$ = new BehaviorSubject<boolean>(false);
  private notifications$ = new Subject<Notification>();
  private leadUpdates$ = new Subject<any>();
  private dashboardUpdates$ = new Subject<any>();

  constructor() {}

  /**
   * Initialize Echo connection with user token
   */
  connect(token: string): void {
    if (this.echo) {
      this.disconnect();
    }

    // Setup Pusher
    window.Pusher = Pusher;

    // Initialize Echo
    this.echo = new Echo({
      broadcaster: 'pusher',
      key: environment.pusher.key,
      cluster: environment.pusher.cluster,
      wsHost: environment.pusher.wsHost,
      wsPort: environment.pusher.wsPort,
      wssPort: environment.pusher.wssPort,
      forceTLS: environment.pusher.forceTLS,
      encrypted: environment.pusher.encrypted,
      disableStats: true,
      enabledTransports: ['ws', 'wss'],
      authEndpoint: `${environment.apiUrl}/broadcasting/auth`,
      auth: {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      },
    });

    window.Echo = this.echo;
    this.connected$.next(true);
  }

  /**
   * Disconnect Echo
   */
  disconnect(): void {
    if (this.echo) {
      this.echo.disconnect();
      this.echo = null;
      this.connected$.next(false);
    }
  }

  /**
   * Check if connected
   */
  isConnected(): Observable<boolean> {
    return this.connected$.asObservable();
  }

  /**
   * Subscribe to user notifications
   */
  subscribeToNotifications(userId: number): Observable<Notification> {
    if (!this.echo) {
      throw new Error('Echo not initialized. Call connect() first.');
    }

    this.echo
      .private(`App.Models.User.${userId}`)
      .notification((notification: Notification) => {
        this.notifications$.next(notification);
      });

    return this.notifications$.asObservable();
  }

  /**
   * Subscribe to lead updates
   */
  subscribeToLeadUpdates(userId: number): Observable<any> {
    if (!this.echo) {
      throw new Error('Echo not initialized. Call connect() first.');
    }

    this.echo
      .private(`leads.${userId}`)
      .listen('.lead.updated', (event: any) => {
        this.leadUpdates$.next(event);
      })
      .listen('.lead.assigned', (event: any) => {
        this.leadUpdates$.next(event);
      });

    return this.leadUpdates$.asObservable();
  }

  /**
   * Subscribe to dashboard updates
   */
  subscribeToDashboardUpdates(userId: number): Observable<any> {
    if (!this.echo) {
      throw new Error('Echo not initialized. Call connect() first.');
    }

    this.echo
      .private(`dashboard.${userId}`)
      .listen('.dashboard.updated', (event: any) => {
        this.dashboardUpdates$.next(event);
      });

    return this.dashboardUpdates$.asObservable();
  }

  /**
   * Leave a channel
   */
  leaveChannel(channelName: string): void {
    if (this.echo) {
      this.echo.leave(channelName);
    }
  }

  /**
   * Join a public channel
   */
  joinPublicChannel(channelName: string): any {
    if (!this.echo) {
      throw new Error('Echo not initialized. Call connect() first.');
    }
    return this.echo.channel(channelName);
  }

  /**
   * Join a private channel
   */
  joinPrivateChannel(channelName: string): any {
    if (!this.echo) {
      throw new Error('Echo not initialized. Call connect() first.');
    }
    return this.echo.private(channelName);
  }

  /**
   * Join a presence channel
   */
  joinPresenceChannel(channelName: string): any {
    if (!this.echo) {
      throw new Error('Echo not initialized. Call connect() first.');
    }
    return this.echo.join(channelName);
  }
}
```

**Step 4: Add Pusher config to environment**

Modify `angular-app/src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000/api',
  pusher: {
    key: process.env['PUSHER_APP_KEY'] || 'your-pusher-key',
    cluster: process.env['PUSHER_APP_CLUSTER'] || 'mt1',
    wsHost: process.env['PUSHER_HOST'] || 'localhost',
    wsPort: parseInt(process.env['PUSHER_PORT'] || '6001'),
    wssPort: parseInt(process.env['PUSHER_PORT'] || '6001'),
    forceTLS: false,
    encrypted: false,
  },
};
```

**Step 5: Initialize WebSocket on auth success**

Modify `angular-app/src/app/core/store/auth/auth.effects.ts` to add WebSocket initialization:
```typescript
import { WebSocketService } from '../../services/websocket.service';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router,
    private websocket: WebSocketService // Add this
  ) {}

  // Add this new effect
  initializeWebSocket$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(({ token, user }) => {
          this.websocket.connect(token);
          this.websocket.subscribeToNotifications(user.id).subscribe();
          this.websocket.subscribeToLeadUpdates(user.id).subscribe();
          this.websocket.subscribeToDashboardUpdates(user.id).subscribe();
        })
      ),
    { dispatch: false }
  );

  // Add this new effect
  disconnectWebSocket$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logoutSuccess),
        tap(() => {
          this.websocket.disconnect();
        })
      ),
    { dispatch: false }
  );

  // ... rest of the effects
}
```

**Step 6: Commit**

Run:
```bash
git add angular-app/src/app/core/services/websocket.service.ts angular-app/src/app/core/models/notification.model.ts angular-app/src/environments
git commit -m "feat: implement WebSocket service with Laravel Echo and Pusher"
```

---

### Task 3: Update Auth Components to Use NgRx Store

**Goal:** Refactor login and register components to use NgRx store instead of service directly

**Files:**
- Modify: `angular-app/src/app/features/auth/login/login.component.ts`
- Modify: `angular-app/src/app/features/auth/register/register.component.ts`

**Step 1: Update login component**

Modify `angular-app/src/app/features/auth/login/login.component.ts`:
```typescript
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as AuthActions from '../../../core/store/auth/auth.actions';
import * as AuthSelectors from '../../../core/store/auth/auth.selectors';
import { AppState } from '../../../core/store';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isLoading$: Observable<boolean>;
  error$: Observable<string | null>;

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>
  ) {
    this.isLoading$ = this.store.select(AuthSelectors.selectIsLoading);
    this.error$ = this.store.select(AuthSelectors.selectAuthError);
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.store.dispatch(AuthActions.login({ email, password }));
    }
  }
}
```

**Step 2: Update register component**

Modify `angular-app/src/app/features/auth/register/register.component.ts`:
```typescript
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as AuthActions from '../../../core/store/auth/auth.actions';
import * as AuthSelectors from '../../../core/store/auth/auth.selectors';
import { AppState } from '../../../core/store';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  isLoading$: Observable<boolean>;
  error$: Observable<string | null>;

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>
  ) {
    this.isLoading$ = this.store.select(AuthSelectors.selectIsLoading);
    this.error$ = this.store.select(AuthSelectors.selectAuthError);
  }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      password_confirmation: ['', [Validators.required]],
      role: ['owner', [Validators.required]],
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('password_confirmation')?.value
      ? null : { mismatch: true };
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const { email, password, name, role } = this.registerForm.value;
      this.store.dispatch(AuthActions.register({ email, password, name, role }));
    }
  }
}
```

**Step 3: Update app initialization to load auth from storage**

Modify `angular-app/src/app/app.component.ts`:
```typescript
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import * as AuthActions from './core/store/auth/auth.actions';
import { AppState } from './core/store';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'angular-app';

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    // Load auth state from localStorage on app init
    this.store.dispatch(AuthActions.loadAuthFromStorage());
  }
}
```

**Step 4: Commit**

Run:
```bash
git add angular-app/src/app/features/auth angular-app/src/app/app.component.ts
git commit -m "feat: integrate auth components with NgRx store"
```

---

### Task 4: Implement Route Guards with NgRx

**Goal:** Create route guards that use NgRx store for authentication and role-based access control

**Files:**
- Create: `angular-app/src/app/core/guards/auth.guard.ts`
- Create: `angular-app/src/app/core/guards/role.guard.ts`
- Modify: `angular-app/src/app/app.routes.ts`

**Step 1: Create auth guard**

Create `angular-app/src/app/core/guards/auth.guard.ts`:
```typescript
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, take } from 'rxjs/operators';
import { AppState } from '../store';
import * as AuthSelectors from '../store/auth/auth.selectors';

export const authGuard: CanActivateFn = () => {
  const store = inject(Store<AppState>);
  const router = inject(Router);

  return store.select(AuthSelectors.selectIsAuthenticated).pipe(
    take(1),
    map(isAuthenticated => {
      if (isAuthenticated) {
        return true;
      }

      return router.createUrlTree(['/login']);
    })
  );
};
```

**Step 2: Create role guard factory**

Create `angular-app/src/app/core/guards/role.guard.ts`:
```typescript
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, take } from 'rxjs/operators';
import { AppState } from '../store';
import * as AuthSelectors from '../store/auth/auth.selectors';

export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return () => {
    const store = inject(Store<AppState>);
    const router = inject(Router);

    return store.select(AuthSelectors.selectUser).pipe(
      take(1),
      map(user => {
        if (user && allowedRoles.includes(user.role)) {
          return true;
        }

        // Redirect to appropriate dashboard or login
        if (!user) {
          return router.createUrlTree(['/login']);
        }

        // Redirect to their proper dashboard
        if (user.role === 'admin') {
          return router.createUrlTree(['/admin']);
        } else if (user.role === 'owner') {
          return router.createUrlTree(['/owner']);
        } else if (user.role === 'property-manager') {
          return router.createUrlTree(['/property-manager']);
        }

        return router.createUrlTree(['/']);
      })
    );
  };
};
```

**Step 3: Update routes with guards**

Modify `angular-app/src/app/app.routes.ts`:
```typescript
import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/public/home/home.component').then(m => m.HomeComponent),
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent),
  },
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard(['admin'])],
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES),
  },
  {
    path: 'owner',
    canActivate: [authGuard, roleGuard(['owner'])],
    loadChildren: () => import('./features/dashboard/owner/owner.routes').then(m => m.OWNER_ROUTES),
  },
  {
    path: 'property-manager',
    canActivate: [authGuard, roleGuard(['property-manager'])],
    loadChildren: () => import('./features/dashboard/pm/pm.routes').then(m => m.PM_ROUTES),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
```

**Step 4: Create route module files for lazy loading**

Create `angular-app/src/app/features/admin/admin.routes.ts`:
```typescript
import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
  },
  {
    path: 'users',
    loadComponent: () => import('./users/users.component').then(m => m.UsersComponent),
  },
  {
    path: 'analytics',
    loadComponent: () => import('./analytics/analytics.component').then(m => m.AnalyticsComponent),
  },
  // Add more admin routes
];
```

Create `angular-app/src/app/features/dashboard/owner/owner.routes.ts`:
```typescript
import { Routes } from '@angular/router';

export const OWNER_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
  },
  {
    path: 'leads',
    loadComponent: () => import('./leads/leads.component').then(m => m.LeadsComponent),
  },
  {
    path: 'calculations',
    loadComponent: () => import('./calculations/calculations.component').then(m => m.CalculationsComponent),
  },
  // Add more owner routes
];
```

Create `angular-app/src/app/features/dashboard/pm/pm.routes.ts`:
```typescript
import { Routes } from '@angular/router';

export const PM_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
  },
  {
    path: 'leads',
    loadComponent: () => import('./leads/leads.component').then(m => m.LeadsComponent),
  },
  {
    path: 'preferences',
    loadComponent: () => import('./preferences/preferences.component').then(m => m.PreferencesComponent),
  },
  {
    path: 'insights',
    loadComponent: () => import('./insights/insights.component').then(m => m.InsightsComponent),
  },
  // Add more PM routes
];
```

**Step 5: Commit**

Run:
```bash
git add angular-app/src/app/core/guards angular-app/src/app/app.routes.ts angular-app/src/app/features
git commit -m "feat: implement route guards with NgRx for auth and RBAC"
```

---

## Phase 2: Core Features (Week 3-5)

### Task 5: Lead Management State (NgRx)

**Goal:** Create NgRx state management for leads with full CRUD operations

**Files:**
- Create: `angular-app/src/app/core/store/leads/leads.actions.ts`
- Create: `angular-app/src/app/core/store/leads/leads.reducer.ts`
- Create: `angular-app/src/app/core/store/leads/leads.selectors.ts`
- Create: `angular-app/src/app/core/store/leads/leads.effects.ts`
- Create: `angular-app/src/app/core/store/leads/leads.state.ts`
- Create: `angular-app/src/app/core/models/lead.model.ts`
- Modify: `angular-app/src/app/app.config.ts`

**Step 1: Create lead models**

Create `angular-app/src/app/core/models/lead.model.ts`:
```typescript
export interface Lead {
  id: number;
  property_address: string;
  city: string;
  state: string;
  zip_code: string;
  property_type: string;
  bedrooms: number;
  bathrooms: number;
  square_footage: number;
  desired_monthly_rent: number;
  owner_id: number;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  latitude?: number;
  longitude?: number;
  created_at: string;
  updated_at: string;
  owner?: {
    id: number;
    name: string;
    email: string;
  };
  assignments?: LeadAssignment[];
}

export interface LeadAssignment {
  id: number;
  lead_id: number;
  pm_id: number;
  status: 'pending' | 'accepted' | 'declined';
  available_at: string;
  property_manager?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface LeadPreferences {
  property_types: string[];
  min_bedrooms: number;
  max_bedrooms: number;
  min_bathrooms: number;
  max_bathrooms: number;
  min_square_footage: number;
  max_square_footage: number;
  service_areas: ServiceArea[];
}

export interface ServiceArea {
  city: string;
  state: string;
  radius_miles: number;
  latitude: number;
  longitude: number;
}
```

**Step 2: Create leads state**

Create `angular-app/src/app/core/store/leads/leads.state.ts`:
```typescript
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Lead } from '../../models/lead.model';

export interface LeadsState extends EntityState<Lead> {
  selectedLeadId: number | null;
  loading: boolean;
  error: string | null;
  filters: {
    status?: string;
    propertyType?: string;
    searchTerm?: string;
  };
}

export const leadsAdapter: EntityAdapter<Lead> = createEntityAdapter<Lead>();

export const initialLeadsState: LeadsState = leadsAdapter.getInitialState({
  selectedLeadId: null,
  loading: false,
  error: null,
  filters: {},
});
```

**Step 3: Create leads actions**

Create `angular-app/src/app/core/store/leads/leads.actions.ts`:
```typescript
import { createAction, props } from '@ngrx/store';
import { Lead, LeadAssignment } from '../../models/lead.model';

// Load Leads
export const loadLeads = createAction('[Leads] Load Leads');

export const loadLeadsSuccess = createAction(
  '[Leads] Load Leads Success',
  props<{ leads: Lead[] }>()
);

export const loadLeadsFailure = createAction(
  '[Leads] Load Leads Failure',
  props<{ error: string }>()
);

// Load Single Lead
export const loadLead = createAction(
  '[Leads] Load Lead',
  props<{ id: number }>()
);

export const loadLeadSuccess = createAction(
  '[Leads] Load Lead Success',
  props<{ lead: Lead }>()
);

export const loadLeadFailure = createAction(
  '[Leads] Load Lead Failure',
  props<{ error: string }>()
);

// Create Lead
export const createLead = createAction(
  '[Leads] Create Lead',
  props<{ lead: Partial<Lead> }>()
);

export const createLeadSuccess = createAction(
  '[Leads] Create Lead Success',
  props<{ lead: Lead }>()
);

export const createLeadFailure = createAction(
  '[Leads] Create Lead Failure',
  props<{ error: string }>()
);

// Update Lead
export const updateLead = createAction(
  '[Leads] Update Lead',
  props<{ id: number; changes: Partial<Lead> }>()
);

export const updateLeadSuccess = createAction(
  '[Leads] Update Lead Success',
  props<{ lead: Lead }>()
);

export const updateLeadFailure = createAction(
  '[Leads] Update Lead Failure',
  props<{ error: string }>()
);

// Delete Lead
export const deleteLead = createAction(
  '[Leads] Delete Lead',
  props<{ id: number }>()
);

export const deleteLeadSuccess = createAction(
  '[Leads] Delete Lead Success',
  props<{ id: number }>()
);

export const deleteLeadFailure = createAction(
  '[Leads] Delete Lead Failure',
  props<{ error: string }>()
);

// Select Lead
export const selectLead = createAction(
  '[Leads] Select Lead',
  props<{ id: number }>()
);

// Filter Leads
export const filterLeads = createAction(
  '[Leads] Filter Leads',
  props<{ filters: any }>()
);

// Respond to Lead
export const respondToLead = createAction(
  '[Leads] Respond to Lead',
  props<{ leadId: number; response: any }>()
);

export const respondToLeadSuccess = createAction(
  '[Leads] Respond to Lead Success',
  props<{ assignment: LeadAssignment }>()
);

export const respondToLeadFailure = createAction(
  '[Leads] Respond to Lead Failure',
  props<{ error: string }>()
);

// Real-time lead update
export const leadUpdatedRealtime = createAction(
  '[Leads] Lead Updated Realtime',
  props<{ lead: Lead }>()
);

// Real-time lead assigned
export const leadAssignedRealtime = createAction(
  '[Leads] Lead Assigned Realtime',
  props<{ assignment: LeadAssignment }>()
);
```

**Step 4: Create leads reducer**

Create `angular-app/src/app/core/store/leads/leads.reducer.ts`:
```typescript
import { createReducer, on } from '@ngrx/store';
import { leadsAdapter, initialLeadsState } from './leads.state';
import * as LeadsActions from './leads.actions';

export const leadsReducer = createReducer(
  initialLeadsState,

  // Load Leads
  on(LeadsActions.loadLeads, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(LeadsActions.loadLeadsSuccess, (state, { leads }) =>
    leadsAdapter.setAll(leads, {
      ...state,
      loading: false,
    })
  ),

  on(LeadsActions.loadLeadsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Load Single Lead
  on(LeadsActions.loadLead, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(LeadsActions.loadLeadSuccess, (state, { lead }) =>
    leadsAdapter.upsertOne(lead, {
      ...state,
      loading: false,
    })
  ),

  on(LeadsActions.loadLeadFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Create Lead
  on(LeadsActions.createLead, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(LeadsActions.createLeadSuccess, (state, { lead }) =>
    leadsAdapter.addOne(lead, {
      ...state,
      loading: false,
    })
  ),

  on(LeadsActions.createLeadFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Update Lead
  on(LeadsActions.updateLead, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(LeadsActions.updateLeadSuccess, (state, { lead }) =>
    leadsAdapter.updateOne(
      { id: lead.id, changes: lead },
      {
        ...state,
        loading: false,
      }
    )
  ),

  on(LeadsActions.updateLeadFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Delete Lead
  on(LeadsActions.deleteLead, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(LeadsActions.deleteLeadSuccess, (state, { id }) =>
    leadsAdapter.removeOne(id, {
      ...state,
      loading: false,
    })
  ),

  on(LeadsActions.deleteLeadFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Select Lead
  on(LeadsActions.selectLead, (state, { id }) => ({
    ...state,
    selectedLeadId: id,
  })),

  // Filter Leads
  on(LeadsActions.filterLeads, (state, { filters }) => ({
    ...state,
    filters,
  })),

  // Real-time updates
  on(LeadsActions.leadUpdatedRealtime, (state, { lead }) =>
    leadsAdapter.updateOne(
      { id: lead.id, changes: lead },
      state
    )
  ),

  on(LeadsActions.leadAssignedRealtime, (state, { assignment }) => {
    // Update the lead with the new assignment
    const lead = state.entities[assignment.lead_id];
    if (lead) {
      const assignments = lead.assignments || [];
      return leadsAdapter.updateOne(
        {
          id: assignment.lead_id,
          changes: {
            assignments: [...assignments, assignment],
          },
        },
        state
      );
    }
    return state;
  })
);
```

**Step 5: Create leads selectors**

Create `angular-app/src/app/core/store/leads/leads.selectors.ts`:
```typescript
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { leadsAdapter, LeadsState } from './leads.state';

export const selectLeadsState = createFeatureSelector<LeadsState>('leads');

const { selectAll, selectEntities, selectIds, selectTotal } = leadsAdapter.getSelectors();

export const selectAllLeads = createSelector(selectLeadsState, selectAll);

export const selectLeadEntities = createSelector(selectLeadsState, selectEntities);

export const selectLeadIds = createSelector(selectLeadsState, selectIds);

export const selectLeadsTotal = createSelector(selectLeadsState, selectTotal);

export const selectLeadsLoading = createSelector(
  selectLeadsState,
  (state) => state.loading
);

export const selectLeadsError = createSelector(
  selectLeadsState,
  (state) => state.error
);

export const selectSelectedLeadId = createSelector(
  selectLeadsState,
  (state) => state.selectedLeadId
);

export const selectSelectedLead = createSelector(
  selectLeadEntities,
  selectSelectedLeadId,
  (entities, selectedId) => (selectedId ? entities[selectedId] : null)
);

export const selectLeadsFilters = createSelector(
  selectLeadsState,
  (state) => state.filters
);

export const selectFilteredLeads = createSelector(
  selectAllLeads,
  selectLeadsFilters,
  (leads, filters) => {
    let filtered = leads;

    if (filters.status) {
      filtered = filtered.filter(lead => lead.status === filters.status);
    }

    if (filters.propertyType) {
      filtered = filtered.filter(lead => lead.property_type === filters.propertyType);
    }

    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(lead =>
        lead.property_address.toLowerCase().includes(term) ||
        lead.city.toLowerCase().includes(term) ||
        lead.state.toLowerCase().includes(term)
      );
    }

    return filtered;
  }
);

export const selectLeadsByStatus = (status: string) =>
  createSelector(selectAllLeads, (leads) =>
    leads.filter(lead => lead.status === status)
  );

export const selectNewLeads = createSelector(
  selectAllLeads,
  (leads) => leads.filter(lead => lead.status === 'new')
);

export const selectContactedLeads = createSelector(
  selectAllLeads,
  (leads) => leads.filter(lead => lead.status === 'contacted')
);

export const selectQualifiedLeads = createSelector(
  selectAllLeads,
  (leads) => leads.filter(lead => lead.status === 'qualified')
);

export const selectConvertedLeads = createSelector(
  selectAllLeads,
  (leads) => leads.filter(lead => lead.status === 'converted')
);
```

**Step 6: Create leads effects**

Create `angular-app/src/app/core/store/leads/leads.effects.ts`:
```typescript
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, exhaustMap, mergeMap } from 'rxjs/operators';
import { LeadsService } from '../../services/leads.service';
import * as LeadsActions from './leads.actions';

@Injectable()
export class LeadsEffects {
  constructor(
    private actions$: Actions,
    private leadsService: LeadsService
  ) {}

  loadLeads$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LeadsActions.loadLeads),
      exhaustMap(() =>
        this.leadsService.getLeads().pipe(
          map((leads) => LeadsActions.loadLeadsSuccess({ leads })),
          catchError((error) =>
            of(LeadsActions.loadLeadsFailure({ error: error.message }))
          )
        )
      )
    )
  );

  loadLead$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LeadsActions.loadLead),
      mergeMap(({ id }) =>
        this.leadsService.getLead(id).pipe(
          map((lead) => LeadsActions.loadLeadSuccess({ lead })),
          catchError((error) =>
            of(LeadsActions.loadLeadFailure({ error: error.message }))
          )
        )
      )
    )
  );

  createLead$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LeadsActions.createLead),
      exhaustMap(({ lead }) =>
        this.leadsService.createLead(lead).pipe(
          map((newLead) => LeadsActions.createLeadSuccess({ lead: newLead })),
          catchError((error) =>
            of(LeadsActions.createLeadFailure({ error: error.message }))
          )
        )
      )
    )
  );

  updateLead$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LeadsActions.updateLead),
      exhaustMap(({ id, changes }) =>
        this.leadsService.updateLead(id, changes).pipe(
          map((lead) => LeadsActions.updateLeadSuccess({ lead })),
          catchError((error) =>
            of(LeadsActions.updateLeadFailure({ error: error.message }))
          )
        )
      )
    )
  );

  deleteLead$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LeadsActions.deleteLead),
      exhaustMap(({ id }) =>
        this.leadsService.deleteLead(id).pipe(
          map(() => LeadsActions.deleteLeadSuccess({ id })),
          catchError((error) =>
            of(LeadsActions.deleteLeadFailure({ error: error.message }))
          )
        )
      )
    )
  );

  respondToLead$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LeadsActions.respondToLead),
      exhaustMap(({ leadId, response }) =>
        this.leadsService.respondToLead(leadId, response).pipe(
          map((assignment) => LeadsActions.respondToLeadSuccess({ assignment })),
          catchError((error) =>
            of(LeadsActions.respondToLeadFailure({ error: error.message }))
          )
        )
      )
    )
  );
}
```

**Step 7: Add leads reducer to app config**

Modify `angular-app/src/app/app.config.ts`:
```typescript
import { leadsReducer } from './core/store/leads/leads.reducer';
import { LeadsEffects } from './core/store/leads/leads.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    // ... existing providers
    provideStore({
      auth: authReducer,
      leads: leadsReducer, // Add this
    }),
    provideEffects([AuthEffects, LeadsEffects]), // Add LeadsEffects
    // ... rest
  ],
};
```

**Step 8: Update store index**

Modify `angular-app/src/app/core/store/index.ts`:
```typescript
import { AuthState } from './auth/auth.state';
import { LeadsState } from './leads/leads.state';

export interface AppState {
  auth: AuthState;
  leads: LeadsState;
}

export * from './auth/auth.actions';
export * from './auth/auth.selectors';
export * from './auth/auth.state';

export * from './leads/leads.actions';
export * from './leads/leads.selectors';
export * from './leads/leads.state';
```

**Step 9: Commit**

Run:
```bash
git add angular-app/src/app/core/store/leads angular-app/src/app/core/models/lead.model.ts angular-app/src/app/app.config.ts angular-app/src/app/core/store/index.ts
git commit -m "feat: implement leads state management with NgRx"
```

---

### Task 6: Calculator Components with Save Functionality

**Goal:** Implement ROI calculator with save to backend functionality

**Files:**
- Create: `angular-app/src/app/features/public/calculators/roi/roi-calculator.component.ts`
- Create: `angular-app/src/app/features/public/calculators/roi/roi-calculator.component.html`
- Create: `angular-app/src/app/core/store/calculations/calculations.actions.ts`
- Create: `angular-app/src/app/core/store/calculations/calculations.reducer.ts`
- Create: `angular-app/src/app/core/store/calculations/calculations.selectors.ts`
- Create: `angular-app/src/app/core/store/calculations/calculations.effects.ts`
- Create: `angular-app/src/app/core/models/calculation.model.ts`

**Step 1: Create calculation models**

Create `angular-app/src/app/core/models/calculation.model.ts`:
```typescript
export interface Calculation {
  id: number;
  user_id: number;
  calculator_type: 'roi' | 'mortgage' | 'rent-estimate' | 'property-management-fee' | 'rehab-cost';
  inputs: Record<string, any>;
  results: Record<string, any>;
  name?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ROIInputs {
  purchasePrice: number;
  closingCosts: number;
  rehabCosts: number;
  monthlyRent: number;
  vacancy: number;
  propertyManagementFee: number;
  maintenance: number;
  insurance: number;
  propertyTaxes: number;
  hoa: number;
  utilities: number;
  downPayment: number;
  loanInterestRate: number;
  loanTerm: number;
}

export interface ROIResults {
  totalInvestment: number;
  loanAmount: number;
  monthlyMortgage: number;
  grossMonthlyIncome: number;
  totalMonthlyExpenses: number;
  netMonthlyIncome: number;
  annualCashFlow: number;
  cashOnCashReturn: number;
  capRate: number;
  grossRentMultiplier: number;
}
```

**Step 2: Create ROI calculator component**

Create `angular-app/src/app/features/public/calculators/roi/roi-calculator.component.ts`:
```typescript
import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ROIInputs, ROIResults } from '../../../../core/models/calculation.model';
import * as CalculationsActions from '../../../../core/store/calculations/calculations.actions';
import * as AuthSelectors from '../../../../core/store/auth/auth.selectors';
import { AppState } from '../../../../core/store';

@Component({
  selector: 'app-roi-calculator',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './roi-calculator.component.html',
  styleUrls: ['./roi-calculator.component.css']
})
export class RoiCalculatorComponent implements OnInit {
  calculatorForm!: FormGroup;
  isAuthenticated$: Observable<boolean>;

  results = signal<ROIResults | null>(null);
  showSaveDialog = signal(false);

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>
  ) {
    this.isAuthenticated$ = this.store.select(AuthSelectors.selectIsAuthenticated);
  }

  ngOnInit(): void {
    this.calculatorForm = this.fb.group({
      purchasePrice: [300000, [Validators.required, Validators.min(0)]],
      closingCosts: [9000, [Validators.required, Validators.min(0)]],
      rehabCosts: [20000, [Validators.required, Validators.min(0)]],
      monthlyRent: [2500, [Validators.required, Validators.min(0)]],
      vacancy: [5, [Validators.required, Validators.min(0), Validators.max(100)]],
      propertyManagementFee: [10, [Validators.required, Validators.min(0), Validators.max(100)]],
      maintenance: [150, [Validators.required, Validators.min(0)]],
      insurance: [100, [Validators.required, Validators.min(0)]],
      propertyTaxes: [250, [Validators.required, Validators.min(0)]],
      hoa: [0, [Validators.min(0)]],
      utilities: [0, [Validators.min(0)]],
      downPayment: [20, [Validators.required, Validators.min(0), Validators.max(100)]],
      loanInterestRate: [7, [Validators.required, Validators.min(0)]],
      loanTerm: [30, [Validators.required, Validators.min(1)]],
    });

    // Calculate on form changes
    this.calculatorForm.valueChanges.subscribe(() => {
      this.calculate();
    });

    // Initial calculation
    this.calculate();
  }

  calculate(): void {
    if (this.calculatorForm.invalid) {
      return;
    }

    const inputs: ROIInputs = this.calculatorForm.value;

    // Total investment
    const totalInvestment =
      inputs.purchasePrice +
      inputs.closingCosts +
      inputs.rehabCosts;

    // Loan calculations
    const downPaymentAmount = inputs.purchasePrice * (inputs.downPayment / 100);
    const loanAmount = inputs.purchasePrice - downPaymentAmount;
    const monthlyInterestRate = inputs.loanInterestRate / 100 / 12;
    const numberOfPayments = inputs.loanTerm * 12;

    const monthlyMortgage =
      loanAmount *
      (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) /
      (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);

    // Income calculations
    const grossMonthlyIncome = inputs.monthlyRent;
    const vacancyLoss = grossMonthlyIncome * (inputs.vacancy / 100);
    const effectiveIncome = grossMonthlyIncome - vacancyLoss;

    // Expense calculations
    const pmFee = grossMonthlyIncome * (inputs.propertyManagementFee / 100);
    const totalMonthlyExpenses =
      monthlyMortgage +
      pmFee +
      inputs.maintenance +
      inputs.insurance +
      inputs.propertyTaxes +
      inputs.hoa +
      inputs.utilities;

    // Cash flow
    const netMonthlyIncome = effectiveIncome - totalMonthlyExpenses;
    const annualCashFlow = netMonthlyIncome * 12;

    // Returns
    const cashInvested = downPaymentAmount + inputs.closingCosts + inputs.rehabCosts;
    const cashOnCashReturn = (annualCashFlow / cashInvested) * 100;

    // Cap rate
    const annualNetOperatingIncome =
      grossMonthlyIncome * 12 -
      (pmFee + inputs.maintenance + inputs.insurance + inputs.propertyTaxes + inputs.hoa + inputs.utilities) * 12;
    const capRate = (annualNetOperatingIncome / inputs.purchasePrice) * 100;

    // GRM
    const grossRentMultiplier = inputs.purchasePrice / (grossMonthlyIncome * 12);

    this.results.set({
      totalInvestment,
      loanAmount,
      monthlyMortgage,
      grossMonthlyIncome,
      totalMonthlyExpenses,
      netMonthlyIncome,
      annualCashFlow,
      cashOnCashReturn,
      capRate,
      grossRentMultiplier,
    });
  }

  saveCalculation(): void {
    const inputs: ROIInputs = this.calculatorForm.value;
    const results = this.results();

    if (!results) {
      return;
    }

    this.store.dispatch(
      CalculationsActions.createCalculation({
        calculation: {
          calculator_type: 'roi',
          inputs,
          results,
          name: `ROI Calculation - ${new Date().toLocaleDateString()}`,
        },
      })
    );

    this.showSaveDialog.set(true);
    setTimeout(() => this.showSaveDialog.set(false), 3000);
  }

  reset(): void {
    this.calculatorForm.reset({
      purchasePrice: 300000,
      closingCosts: 9000,
      rehabCosts: 20000,
      monthlyRent: 2500,
      vacancy: 5,
      propertyManagementFee: 10,
      maintenance: 150,
      insurance: 100,
      propertyTaxes: 250,
      hoa: 0,
      utilities: 0,
      downPayment: 20,
      loanInterestRate: 7,
      loanTerm: 30,
    });
  }
}
```

**Step 3: Create calculations state (similar to leads)**

Create calculation actions, reducer, selectors, and effects following the same pattern as Task 5 (leads state).

**Step 4: Commit**

Run:
```bash
git add angular-app/src/app/features/public/calculators angular-app/src/app/core/store/calculations angular-app/src/app/core/models/calculation.model.ts
git commit -m "feat: implement ROI calculator with save functionality"
```

---

## Phase 3: Advanced Features (Week 6-8)

### Task 7: Google Maps Integration

**Goal:** Integrate Google Maps for property visualization and address autocomplete

**Files:**
- Create: `angular-app/src/app/shared/components/google-map/google-map.component.ts`
- Create: `angular-app/src/app/shared/components/address-autocomplete/address-autocomplete.component.ts`
- Install: `@angular/google-maps`

**Step 1: Install Google Maps**

Run:
```bash
cd angular-app
npm install @angular/google-maps
```

**Step 2: Add Google Maps script to index.html**

Modify `angular-app/src/index.html`:
```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Propertifi</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" type="image/x-icon" href="favicon.ico">
  <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&libraries=places"></script>
</head>
<body>
  <app-root></app-root>
</body>
</html>
```

**Step 3: Create Google Map component**

Create `angular-app/src/app/shared/components/google-map/google-map.component.ts`:
```typescript
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleMapsModule, MapInfoWindow, MapMarker } from '@angular/google-maps';

export interface MapMarkerData {
  position: google.maps.LatLngLiteral;
  label?: string;
  title?: string;
  info?: string;
}

@Component({
  selector: 'app-google-map',
  standalone: true,
  imports: [CommonModule, GoogleMapsModule],
  template: `
    <google-map
      [height]="height"
      [width]="width"
      [center]="center"
      [zoom]="zoom"
      [options]="mapOptions"
    >
      @for (marker of markers; track marker.position) {
        <map-marker
          [position]="marker.position"
          [label]="marker.label"
          [title]="marker.title"
          (mapClick)="openInfoWindow(markerElem, marker)"
          #markerElem
        />
      }
      <map-info-window>{{ infoContent }}</map-info-window>
    </google-map>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class GoogleMapComponent implements OnInit {
  @Input() height = '400px';
  @Input() width = '100%';
  @Input() center: google.maps.LatLngLiteral = { lat: 39.8283, lng: -98.5795 }; // US center
  @Input() zoom = 4;
  @Input() markers: MapMarkerData[] = [];

  @ViewChild(MapInfoWindow) infoWindow!: MapInfoWindow;

  mapOptions: google.maps.MapOptions = {
    mapTypeId: 'roadmap',
    zoomControl: true,
    scrollwheel: true,
    disableDoubleClickZoom: false,
    maxZoom: 20,
    minZoom: 2,
  };

  infoContent = '';

  ngOnInit(): void {
    // If we have markers, center on the first one and zoom in
    if (this.markers.length > 0) {
      this.center = this.markers[0].position;
      this.zoom = 12;
    }
  }

  openInfoWindow(marker: MapMarker, markerData: MapMarkerData): void {
    this.infoContent = markerData.info || markerData.title || '';
    this.infoWindow.open(marker);
  }
}
```

**Step 4: Create address autocomplete component**

Create `angular-app/src/app/shared/components/address-autocomplete/address-autocomplete.component.ts`:
```typescript
import { Component, Output, EventEmitter, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface AddressResult {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  latitude: number;
  longitude: number;
  formattedAddress: string;
}

@Component({
  selector: 'app-address-autocomplete',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="relative">
      <input
        #addressInput
        type="text"
        [(ngModel)]="value"
        [placeholder]="placeholder"
        [class]="inputClass"
        (focus)="onFocus()"
      />
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class AddressAutocompleteComponent implements OnInit {
  @Input() placeholder = 'Enter address...';
  @Input() inputClass = 'w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500';
  @Output() addressSelected = new EventEmitter<AddressResult>();

  @ViewChild('addressInput', { static: true }) addressInput!: ElementRef<HTMLInputElement>;

  value = '';
  private autocomplete!: google.maps.places.Autocomplete;

  ngOnInit(): void {
    this.initAutocomplete();
  }

  private initAutocomplete(): void {
    const options: google.maps.places.AutocompleteOptions = {
      types: ['address'],
      componentRestrictions: { country: 'us' },
      fields: ['address_components', 'geometry', 'formatted_address'],
    };

    this.autocomplete = new google.maps.places.Autocomplete(
      this.addressInput.nativeElement,
      options
    );

    this.autocomplete.addListener('place_changed', () => {
      this.onPlaceChanged();
    });
  }

  private onPlaceChanged(): void {
    const place = this.autocomplete.getPlace();

    if (!place.geometry || !place.geometry.location) {
      return;
    }

    const addressComponents = place.address_components || [];

    let streetNumber = '';
    let route = '';
    let city = '';
    let state = '';
    let zipCode = '';

    addressComponents.forEach((component) => {
      const types = component.types;

      if (types.includes('street_number')) {
        streetNumber = component.long_name;
      }
      if (types.includes('route')) {
        route = component.long_name;
      }
      if (types.includes('locality')) {
        city = component.long_name;
      }
      if (types.includes('administrative_area_level_1')) {
        state = component.short_name;
      }
      if (types.includes('postal_code')) {
        zipCode = component.long_name;
      }
    });

    const result: AddressResult = {
      address: `${streetNumber} ${route}`.trim(),
      city,
      state,
      zipCode,
      latitude: place.geometry.location.lat(),
      longitude: place.geometry.location.lng(),
      formattedAddress: place.formatted_address || '',
    };

    this.addressSelected.emit(result);
  }

  onFocus(): void {
    // Clear on focus for better UX
    this.value = '';
  }
}
```

**Step 5: Commit**

Run:
```bash
git add angular-app/src/app/shared/components angular-app/src/index.html
git commit -m "feat: implement Google Maps integration with autocomplete"
```

---

### Task 8: Analytics Dashboard with Chart.js

**Goal:** Create analytics dashboard with charts for property managers and admins

**Files:**
- Create: `angular-app/src/app/features/dashboard/pm/insights/insights.component.ts`
- Install: `chart.js`, `ng2-charts`

**Step 1: Install Chart.js**

Run:
```bash
cd angular-app
npm install chart.js ng2-charts
```

**Step 2: Create insights component**

Create `angular-app/src/app/features/dashboard/pm/insights/insights.component.ts`:
```typescript
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AnalyticsService } from '../../../../core/services/analytics.service';

@Component({
  selector: 'app-insights',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold mb-6">Analytics & Insights</h1>

      <!-- Lead Conversion Chart -->
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <h2 class="text-xl font-semibold mb-4">Lead Conversion Rate</h2>
        <canvas baseChart
          [data]="conversionChartData"
          [options]="conversionChartOptions"
          [type]="'line'">
        </canvas>
      </div>

      <!-- Lead Status Distribution -->
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <h2 class="text-xl font-semibold mb-4">Lead Status Distribution</h2>
        <canvas baseChart
          [data]="statusChartData"
          [options]="statusChartOptions"
          [type]="'doughnut'">
        </canvas>
      </div>

      <!-- Monthly Revenue -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-4">Monthly Revenue Trend</h2>
        <canvas baseChart
          [data]="revenueChartData"
          [options]="revenueChartOptions"
          [type]="'bar'">
        </canvas>
      </div>
    </div>
  `,
  styles: [`
    canvas {
      max-height: 400px;
    }
  `]
})
export class InsightsComponent implements OnInit {
  // Line chart for conversion
  conversionChartData: ChartConfiguration['data'] = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [12, 19, 15, 25, 22, 30],
        label: 'Conversion Rate (%)',
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  conversionChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  };

  // Doughnut chart for status
  statusChartData: ChartConfiguration['data'] = {
    labels: ['New', 'Contacted', 'Qualified', 'Converted', 'Lost'],
    datasets: [
      {
        data: [15, 25, 20, 30, 10],
        backgroundColor: [
          '#3b82f6',
          '#8b5cf6',
          '#ec4899',
          '#10b981',
          '#f59e0b',
        ],
      },
    ],
  };

  statusChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'right',
      },
    },
  };

  // Bar chart for revenue
  revenueChartData: ChartConfiguration['data'] = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [5000, 6500, 7200, 8100, 7800, 9200],
        label: 'Revenue ($)',
        backgroundColor: '#10b981',
      },
    ],
  };

  revenueChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  constructor(
    private analyticsService: AnalyticsService
  ) {}

  ngOnInit(): void {
    // Load real analytics data
    this.loadAnalytics();
  }

  loadAnalytics(): void {
    // Implementation to load real data from API
    // This would use the analytics service and update the chart data
  }
}
```

**Step 3: Commit**

Run:
```bash
git add angular-app/src/app/features/dashboard/pm/insights
git commit -m "feat: implement analytics dashboard with Chart.js"
```

---

### Task 9: PDF Generation Service

**Goal:** Create service to generate PDF reports using jsPDF

**Files:**
- Create: `angular-app/src/app/core/services/pdf.service.ts`
- Install: `jspdf`, `jspdf-autotable`

**Step 1: Install jsPDF**

Run:
```bash
cd angular-app
npm install jspdf jspdf-autotable
npm install --save-dev @types/jspdf
```

**Step 2: Create PDF service**

Create `angular-app/src/app/core/services/pdf.service.ts`:
```typescript
import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Lead } from '../models/lead.model';
import { Calculation, ROIResults } from '../models/calculation.model';

@Injectable({
  providedIn: 'root'
})
export class PdfService {
  /**
   * Generate PDF report for a lead
   */
  generateLeadReport(lead: Lead): void {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(20);
    doc.text('Lead Report', 14, 22);

    // Property Details
    doc.setFontSize(12);
    doc.text('Property Details', 14, 35);

    autoTable(doc, {
      startY: 40,
      head: [['Field', 'Value']],
      body: [
        ['Address', lead.property_address],
        ['City', lead.city],
        ['State', lead.state],
        ['ZIP Code', lead.zip_code],
        ['Property Type', lead.property_type],
        ['Bedrooms', lead.bedrooms.toString()],
        ['Bathrooms', lead.bathrooms.toString()],
        ['Square Footage', lead.square_footage.toString()],
        ['Desired Rent', `$${lead.desired_monthly_rent.toLocaleString()}`],
        ['Status', lead.status],
      ],
    });

    // Owner Information
    if (lead.owner) {
      doc.text('Owner Information', 14, (doc as any).lastAutoTable.finalY + 15);

      autoTable(doc, {
        startY: (doc as any).lastAutoTable.finalY + 20,
        head: [['Field', 'Value']],
        body: [
          ['Name', lead.owner.name],
          ['Email', lead.owner.email],
        ],
      });
    }

    // Save
    doc.save(`lead-${lead.id}-report.pdf`);
  }

  /**
   * Generate PDF report for ROI calculation
   */
  generateROIReport(inputs: any, results: ROIResults): void {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(20);
    doc.text('ROI Analysis Report', 14, 22);

    // Date
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 30);

    // Investment Summary
    doc.setFontSize(14);
    doc.text('Investment Summary', 14, 45);

    autoTable(doc, {
      startY: 50,
      head: [['Metric', 'Value']],
      body: [
        ['Purchase Price', `$${inputs.purchasePrice.toLocaleString()}`],
        ['Closing Costs', `$${inputs.closingCosts.toLocaleString()}`],
        ['Rehab Costs', `$${inputs.rehabCosts.toLocaleString()}`],
        ['Total Investment', `$${results.totalInvestment.toLocaleString()}`],
        ['Down Payment', `${inputs.downPayment}%`],
        ['Loan Amount', `$${results.loanAmount.toLocaleString()}`],
      ],
    });

    // Cash Flow Analysis
    doc.text('Cash Flow Analysis', 14, (doc as any).lastAutoTable.finalY + 15);

    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 20,
      head: [['Metric', 'Value']],
      body: [
        ['Monthly Rent', `$${inputs.monthlyRent.toLocaleString()}`],
        ['Monthly Mortgage', `$${results.monthlyMortgage.toFixed(2)}`],
        ['Total Monthly Expenses', `$${results.totalMonthlyExpenses.toFixed(2)}`],
        ['Net Monthly Income', `$${results.netMonthlyIncome.toFixed(2)}`],
        ['Annual Cash Flow', `$${results.annualCashFlow.toFixed(2)}`],
      ],
    });

    // Returns
    doc.text('Return Metrics', 14, (doc as any).lastAutoTable.finalY + 15);

    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 20,
      head: [['Metric', 'Value']],
      body: [
        ['Cash on Cash Return', `${results.cashOnCashReturn.toFixed(2)}%`],
        ['Cap Rate', `${results.capRate.toFixed(2)}%`],
        ['Gross Rent Multiplier', results.grossRentMultiplier.toFixed(2)],
      ],
    });

    // Save
    doc.save(`roi-analysis-${Date.now()}.pdf`);
  }

  /**
   * Generate leads summary report
   */
  generateLeadsSummaryReport(leads: Lead[]): void {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text('Leads Summary Report', 14, 22);

    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 30);
    doc.text(`Total Leads: ${leads.length}`, 14, 36);

    autoTable(doc, {
      startY: 45,
      head: [['Address', 'City', 'Status', 'Rent', 'Type']],
      body: leads.map(lead => [
        lead.property_address,
        lead.city,
        lead.status,
        `$${lead.desired_monthly_rent.toLocaleString()}`,
        lead.property_type,
      ]),
    });

    doc.save(`leads-summary-${Date.now()}.pdf`);
  }
}
```

**Step 3: Commit**

Run:
```bash
git add angular-app/src/app/core/services/pdf.service.ts
git commit -m "feat: implement PDF generation service with jsPDF"
```

---

## Testing Strategy

### Unit Testing

Each component, service, and NgRx piece should have corresponding test files:

- **Components**: Test user interactions, template rendering, and integration with store
- **Services**: Test API calls with mocked HTTP client
- **NgRx**: Test reducers (pure functions), effects (with marbles), and selectors

### E2E Testing

Use Playwright to test critical user journeys:

1. User registration and login
2. Creating and managing leads
3. Using calculators and saving results
4. PM preferences and lead matching
5. Real-time notifications

---

## Migration Execution Checklist

### Phase 1 Checklist
- [ ] NgRx store infrastructure setup
- [ ] Auth state with localStorage persistence
- [ ] WebSocket service with Laravel Echo
- [ ] Route guards (auth + role-based)
- [ ] Update auth components to use store

### Phase 2 Checklist
- [ ] Leads NgRx state management
- [ ] Lead CRUD operations
- [ ] Real-time lead updates integration
- [ ] ROI calculator component
- [ ] Calculations state management
- [ ] Save calculation functionality

### Phase 3 Checklist
- [ ] Google Maps component
- [ ] Address autocomplete
- [ ] Analytics dashboard with Chart.js
- [ ] PDF generation service
- [ ] Export features (leads, calculations)

### Final Integration
- [ ] Connect all real-time events
- [ ] Test RBAC across all routes
- [ ] Verify WebSocket reconnection logic
- [ ] End-to-end testing
- [ ] Performance optimization
- [ ] Documentation update

---

## Plan Execution Options

Plan complete and saved to `docs/plans/2025-12-06-angular-nextjs-migration.md`.

**Two execution options:**

**1. Subagent-Driven (this session)** - I dispatch fresh subagent per task, review between tasks, fast iteration

**2. Parallel Session (separate)** - Open new session with executing-plans, batch execution with checkpoints

**Which approach?**

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { UiInputComponent } from '../../../shared/components/ui-input/ui-input.component';
import { UiButtonComponent } from '../../../shared/components/ui-button/ui-button.component';
import { UiCardComponent } from '../../../shared/components/ui-card/ui-card.component';
import * as AuthActions from '../../../core/store/auth/auth.actions';
import { selectIsLoading, selectAuthError } from '../../../core/store/auth/auth.selectors';

/**
 * Login Component
 *
 * Handles user authentication via NgRx store.
 * Dispatches login actions and subscribes to auth state for loading/error states.
 *
 * @example
 * // Usage in routing
 * { path: 'login', component: LoginComponent }
 */
@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink, UiInputComponent, UiButtonComponent, UiCardComponent],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent {
    private fb = inject(FormBuilder);
    private store = inject(Store);

    /**
     * Login form with email and password validation
     */
    loginForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]]
    });

    /**
     * Observable indicating if authentication is in progress
     * Used to show loading spinner and disable submit button
     */
    isLoading$: Observable<boolean> = this.store.select(selectIsLoading);

    /**
     * Observable containing current authentication error message
     * Displayed to user when login fails
     */
    errorMessage$: Observable<string | null> = this.store.select(selectAuthError);

    /**
     * Handle form submission
     *
     * Validates form and dispatches login action to NgRx store.
     * The auth effects will handle the actual API call, navigation, and error handling.
     */
    onSubmit(): void {
        if (this.loginForm.valid) {
            const { email, password } = this.loginForm.value;

            if (email && password) {
                // Dispatch login action - effects will handle the rest
                this.store.dispatch(AuthActions.login({ email, password }));
            }
        }
    }
}

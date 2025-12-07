import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { UiCardComponent } from '../../../shared/components/ui-card/ui-card.component';
import { UiInputComponent } from '../../../shared/components/ui-input/ui-input.component';
import { UiButtonComponent } from '../../../shared/components/ui-button/ui-button.component';
import * as AuthActions from '../../../core/store/auth/auth.actions';
import { selectIsLoading, selectAuthError } from '../../../core/store/auth/auth.selectors';

/**
 * Register Component
 *
 * Handles user registration via NgRx store.
 * Dispatches register actions and subscribes to auth state for loading/error states.
 * Includes client-side password confirmation validation.
 *
 * @example
 * // Usage in routing
 * { path: 'register', component: RegisterComponent }
 */
@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink, UiCardComponent, UiInputComponent, UiButtonComponent],
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
    private fb = inject(FormBuilder);
    private store = inject(Store);

    /**
     * Registration form with validation
     * - name: required
     * - email: required and valid email format
     * - password: required, minimum 8 characters
     * - password_confirmation: required, must match password
     */
    registerForm = this.fb.group({
        name: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        password_confirmation: ['', [Validators.required]]
    });

    /**
     * Client-side validation error message
     * Used for password mismatch validation before submission
     */
    clientError = signal('');

    /**
     * Observable indicating if registration is in progress
     * Used to show loading spinner and disable submit button
     */
    isLoading$: Observable<boolean> = this.store.select(selectIsLoading);

    /**
     * Observable containing current authentication error from backend
     * Displayed to user when registration fails
     */
    serverError$: Observable<string | null> = this.store.select(selectAuthError);

    /**
     * Handle form submission
     *
     * Validates form including password confirmation match,
     * then dispatches register action to NgRx store.
     * The auth effects will handle the API call, navigation, and error handling.
     */
    onSubmit(): void {
        if (this.registerForm.valid) {
            this.clientError.set('');
            const { name, email, password, password_confirmation } = this.registerForm.value;

            if (name && email && password && password_confirmation) {
                // Client-side password confirmation validation
                if (password !== password_confirmation) {
                    this.clientError.set('Passwords do not match');
                    return;
                }

                // Dispatch register action - effects will handle the rest
                // userType is not currently captured in the form, defaulting to 'owner'
                // TODO: Add user type selection to registration form
                this.store.dispatch(AuthActions.register({
                    name,
                    email,
                    password,
                    userType: 'owner'
                }));
            }
        }
    }
}

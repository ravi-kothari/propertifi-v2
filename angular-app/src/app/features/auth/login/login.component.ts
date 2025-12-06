import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { UiInputComponent } from '../../../shared/components/ui-input/ui-input.component';
import { UiButtonComponent } from '../../../shared/components/ui-button/ui-button.component';
import { UiCardComponent } from '../../../shared/components/ui-card/ui-card.component';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink, UiInputComponent, UiButtonComponent, UiCardComponent],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);

    loginForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]]
    });

    errorMessage = signal('');
    isLoading = this.authService.isLoading;

    onSubmit(): void {
        if (this.loginForm.valid) {
            this.errorMessage.set('');
            const { email, password } = this.loginForm.value;

            if (email && password) {
                this.authService.login({ email, password }).subscribe({
                    error: (err) => {
                        this.errorMessage.set('Invalid email or password');
                        console.error(err);
                    }
                });
            }
        }
    }
}

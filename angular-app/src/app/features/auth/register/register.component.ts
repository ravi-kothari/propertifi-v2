import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { UiCardComponent } from '../../../shared/components/ui-card/ui-card.component';
import { UiInputComponent } from '../../../shared/components/ui-input/ui-input.component';
import { UiButtonComponent } from '../../../shared/components/ui-button/ui-button.component';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink, UiCardComponent, UiInputComponent, UiButtonComponent],
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);

    registerForm = this.fb.group({
        name: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        password_confirmation: ['', [Validators.required]]
    });

    error = '';
    isLoading = this.authService.isLoading;

    onSubmit(): void {
        if (this.registerForm.valid) {
            this.error = '';
            const { name, email, password, password_confirmation } = this.registerForm.value;

            if (name && email && password && password_confirmation) {
                if (password !== password_confirmation) {
                    this.error = 'Passwords do not match';
                    return;
                }

                this.authService.register({ name, email, password, password_confirmation }).subscribe({
                    error: (err) => {
                        this.error = 'Registration failed. Please try again.';
                        console.error(err);
                    }
                });
            }
        }
    }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UiButtonComponent } from '../../../shared/components/ui-button/ui-button.component';
import { UiInputComponent } from '../../../shared/components/ui-input/ui-input.component';

@Component({
    selector: 'app-contact',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, UiButtonComponent, UiInputComponent],
    templateUrl: './contact.component.html'
})
export class ContactComponent {
    contactForm: FormGroup;
    isSubmitting = false;
    submitted = false;

    constructor(private fb: FormBuilder) {
        this.contactForm = this.fb.group({
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            subject: ['', Validators.required],
            message: ['', Validators.required]
        });
    }

    onSubmit() {
        if (this.contactForm.valid) {
            this.isSubmitting = true;
            // Simulate API call
            setTimeout(() => {
                this.isSubmitting = false;
                this.submitted = true;
                this.contactForm.reset();
            }, 1500);
        } else {
            this.contactForm.markAllAsTouched();
        }
    }
}

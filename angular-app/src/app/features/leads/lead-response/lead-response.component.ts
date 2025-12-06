import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { LeadService } from '../../../core/services/lead.service';
import { ResponseType } from '../../../core/models/lead.model';

@Component({
    selector: 'app-lead-response',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './lead-response.component.html'
})
export class LeadResponseComponent {
    @Input({ required: true }) leadId!: number;
    @Output() responseSubmitted = new EventEmitter<void>();

    private fb = inject(FormBuilder);
    private leadService = inject(LeadService);

    responseForm = this.fb.group({
        response_type: ['contact_info' as ResponseType, [Validators.required]],
        message: ['', [Validators.required, Validators.minLength(10)]]
    });

    isLoading = false;
    error = '';

    onSubmit(): void {
        if (this.responseForm.valid) {
            this.isLoading = true;
            this.error = '';
            const { response_type, message } = this.responseForm.value;

            if (response_type && message) {
                this.leadService.submitResponse(this.leadId, { response_type, message }).subscribe({
                    next: () => {
                        this.isLoading = false;
                        this.responseSubmitted.emit();
                        this.responseForm.reset({ response_type: 'contact_info' });
                    },
                    error: (err) => {
                        this.isLoading = false;
                        this.error = 'Failed to submit response. Please try again.';
                        console.error(err);
                    }
                });
            }
        }
    }
}

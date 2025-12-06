import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CalculatorService } from '../../../../core/services/calculator.service';
import { MortgageResult } from '../../../../core/models/calculator.model';
import { UiButtonComponent } from '../../../../shared/components/ui-button/ui-button.component';

@Component({
    selector: 'app-mortgage-calculator',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, UiButtonComponent],
    templateUrl: './mortgage-calculator.component.html'
})
export class MortgageCalculatorComponent {
    mortgageForm: FormGroup;
    result: MortgageResult | null = null;
    loading = false;

    constructor(
        private fb: FormBuilder,
        private calculatorService: CalculatorService
    ) {
        this.mortgageForm = this.fb.group({
            loanAmount: [300000, [Validators.required, Validators.min(0)]],
            interestRate: [6.5, [Validators.required, Validators.min(0)]],
            loanTerm: [30, [Validators.required, Validators.min(1)]]
        });
    }

    calculate() {
        if (this.mortgageForm.valid) {
            this.loading = true;
            this.calculatorService.calculateMortgage(this.mortgageForm.value).subscribe({
                next: (res: MortgageResult) => {
                    this.result = res;
                    this.loading = false;
                },
                error: (err: unknown) => {
                    console.error('Error calculating mortgage', err);
                    this.loading = false;
                }
            });
        }
    }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CalculatorService } from '../../../../core/services/calculator.service';
import { RoiResult } from '../../../../core/models/calculator.model';
import { UiButtonComponent } from '../../../../shared/components/ui-button/ui-button.component';

@Component({
    selector: 'app-roi-calculator',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, UiButtonComponent],
    templateUrl: './roi-calculator.component.html'
})
export class RoiCalculatorComponent {
    roiForm: FormGroup;
    result: RoiResult | null = null;
    loading = false;

    constructor(
        private fb: FormBuilder,
        private calculatorService: CalculatorService
    ) {
        this.roiForm = this.fb.group({
            purchasePrice: [300000, [Validators.required, Validators.min(0)]],
            downPayment: [60000, [Validators.required, Validators.min(0)]],
            interestRate: [6.5, [Validators.required, Validators.min(0)]],
            loanTerm: [30, [Validators.required, Validators.min(1)]],
            monthlyRent: [2500, [Validators.required, Validators.min(0)]],
            propertyTax: [3600, [Validators.required, Validators.min(0)]],
            insurance: [1200, [Validators.required, Validators.min(0)]],
            maintenance: [1000, [Validators.required, Validators.min(0)]],
            vacancyRate: [5, [Validators.required, Validators.min(0), Validators.max(100)]],
            managementFee: [10, [Validators.required, Validators.min(0), Validators.max(100)]]
        });
    }

    calculate() {
        if (this.roiForm.valid) {
            this.loading = true;
            this.calculatorService.calculateRoi(this.roiForm.value).subscribe({
                next: (res: RoiResult) => {
                    this.result = res;
                    this.loading = false;
                },
                error: (err: unknown) => {
                    console.error('Error calculating ROI', err);
                    this.loading = false;
                }
            });
        }
    }
}

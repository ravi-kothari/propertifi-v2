import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UiButtonComponent } from '../../../../shared/components/ui-button/ui-button.component';
import { UiInputComponent } from '../../../../shared/components/ui-input/ui-input.component';
import { UiCardComponent } from '../../../../shared/components/ui-card/ui-card.component';

@Component({
    selector: 'app-rent-vs-buy',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, UiButtonComponent, UiInputComponent, UiCardComponent],
    templateUrl: './rent-vs-buy.component.html'
})
export class RentVsBuyComponent {
    calculatorForm: FormGroup;
    result: {
        rentCost: number;
        buyCost: number;
        savings: number;
        recommendation: 'rent' | 'buy';
    } | null = null;

    constructor(private fb: FormBuilder) {
        this.calculatorForm = this.fb.group({
            homePrice: [500000, [Validators.required, Validators.min(0)]],
            monthlyRent: [2500, [Validators.required, Validators.min(0)]],
            years: [5, [Validators.required, Validators.min(1)]],
            interestRate: [6.5, [Validators.required, Validators.min(0)]]
        });
    }

    calculate() {
        if (this.calculatorForm.valid) {
            const { homePrice, monthlyRent, years, interestRate } = this.calculatorForm.value;

            // Simplified calculation for demo purposes
            // In a real app, this would be more complex or call the backend API
            const totalRentCost = monthlyRent * 12 * years;

            // Buying costs: Down payment (20%) + Mortgage payments + Maintenance (1%/yr) - Appreciation (3%/yr)
            const downPayment = homePrice * 0.2;
            const loanAmount = homePrice - downPayment;
            const monthlyRate = interestRate / 100 / 12;
            const numPayments = 30 * 12; // 30 year fixed
            const mortgagePayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);

            const totalMortgagePayments = mortgagePayment * 12 * years;
            const maintenance = homePrice * 0.01 * years;
            const appreciation = homePrice * Math.pow(1.03, years) - homePrice;
            const buyingCost = downPayment + totalMortgagePayments + maintenance - appreciation;

            this.result = {
                rentCost: Math.round(totalRentCost),
                buyCost: Math.round(buyingCost),
                savings: Math.round(Math.abs(totalRentCost - buyingCost)),
                recommendation: totalRentCost > buyingCost ? 'buy' : 'rent'
            };
        }
    }
}

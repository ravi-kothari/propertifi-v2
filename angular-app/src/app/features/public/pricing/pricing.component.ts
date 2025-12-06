import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UiButtonComponent } from '../../../shared/components/ui-button/ui-button.component';

@Component({
    selector: 'app-pricing',
    standalone: true,
    imports: [CommonModule, RouterModule, UiButtonComponent],
    templateUrl: './pricing.component.html'
})
export class PricingComponent {
    tiers: {
        name: string;
        price: number;
        description: string;
        features: string[];
        cta: string;
        variant: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
        mostPopular?: boolean;
    }[] = [
            {
                name: 'Basic',
                price: 29,
                description: 'Essential tools for small property managers.',
                features: [
                    'Up to 50 units',
                    'Basic tenant screening',
                    'Maintenance requests',
                    'Online rent collection'
                ],
                cta: 'Start Free Trial',
                variant: 'secondary'
            },
            {
                name: 'Pro',
                price: 79,
                description: 'Advanced features for growing portfolios.',
                features: [
                    'Up to 200 units',
                    'Advanced screening & reports',
                    'Vendor management',
                    'Owner portal',
                    'Accounting integration'
                ],
                cta: 'Get Started',
                variant: 'primary',
                mostPopular: true
            },
            {
                name: 'Enterprise',
                price: 199,
                description: 'Complete solution for large agencies.',
                features: [
                    'Unlimited units',
                    'Custom branding',
                    'API access',
                    'Dedicated support',
                    'Advanced analytics'
                ],
                cta: 'Contact Sales',
                variant: 'secondary'
            }
        ];
}

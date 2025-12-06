import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UiButtonComponent } from '../../../shared/components/ui-button/ui-button.component';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
    selector: 'app-public-layout',
    standalone: true,
    imports: [CommonModule, RouterModule, UiButtonComponent],
    templateUrl: './public-layout.component.html',
    animations: [
        trigger('slideDown', [
            transition(':enter', [
                style({ transform: 'translateY(-10px)', opacity: 0 }),
                animate('200ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
            ]),
            transition(':leave', [
                animate('150ms ease-in', style({ transform: 'translateY(-10px)', opacity: 0 }))
            ])
        ])
    ]
})
export class PublicLayoutComponent {
    isMobileMenuOpen = false;

    toggleMobileMenu() {
        this.isMobileMenuOpen = !this.isMobileMenuOpen;
    }
}

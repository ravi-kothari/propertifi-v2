import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
    selector: 'app-ui-button',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './ui-button.component.html'
})
/**
 * A reusable button component with various styles and sizes.
 * Includes loading state, disabled state, and ripple effects.
 *
 * @example
 * <app-ui-button variant="primary" size="lg" (onClick)="submit()">Submit</app-ui-button>
 */
export class UiButtonComponent {
    /** Visual style variant */
    @Input() variant: ButtonVariant = 'primary';

    /** Size of the button */
    @Input() size: ButtonSize = 'md';

    /** Whether to show a loading spinner */
    @Input() loading = false;

    /** Whether the button is disabled */
    @Input() disabled = false;

    /** HTML button type */
    @Input() type: 'button' | 'submit' | 'reset' = 'button';

    /** Whether the button should take full width */
    @Input() fullWidth = false;

    /** Accessible label for the button (required for icon-only buttons) */
    @Input() ariaLabel = '';

    /** Event emitted when button is clicked */
    @Output() onClick = new EventEmitter<Event>();

    get classes(): string {
        const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95';

        const sizeClasses = {
            sm: 'px-3 py-1.5 text-xs rounded-md',
            md: 'px-4 py-2 text-sm rounded-lg',
            lg: 'px-6 py-3 text-base rounded-xl'
        };

        const variantClasses = {
            primary: 'bg-primary hover:bg-primary-dark text-white focus:ring-primary',
            secondary: 'bg-secondary hover:bg-secondary-dark text-white focus:ring-secondary',
            outline: 'border-2 border-primary text-primary hover:bg-primary-light/10 focus:ring-primary',
            ghost: 'text-primary hover:bg-primary-light/10 focus:ring-primary',
            danger: 'bg-error hover:bg-red-600 text-white focus:ring-error',
            success: 'bg-success hover:bg-success-dark text-white focus:ring-success'
        };

        const widthClass = this.fullWidth ? 'w-full' : '';

        return `${baseClasses} ${sizeClasses[this.size]} ${variantClasses[this.variant]} ${widthClass}`;
    }

    handleClick(event: Event) {
        if (!this.loading && !this.disabled) {
            this.onClick.emit(event);
        }
    }
}

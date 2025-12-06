import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-ui-card',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div [class]="classes">
      <ng-content></ng-content>
    </div>
  `
})
/**
 * A reusable card component with premium styling options.
 * Supports glassmorphism, hover effects, and custom padding.
 *
 * @example
 * <app-ui-card [hover]="true" [glass]="true">Content</app-ui-card>
 */
export class UiCardComponent {
    /** Whether to enable hover effects (lift and shadow) */
    @Input() hover = false;

    /** Padding class (default: 'p-6') */
    @Input() padding = 'p-6';

    /** Whether to apply glassmorphism effect */
    @Input() glass = false;

    get classes(): string {
        const baseClasses = 'rounded-xl transition-all duration-300 border border-border';
        const bgClasses = this.glass
            ? 'bg-white/80 backdrop-blur-md shadow-glass'
            : 'bg-white shadow-sm';

        const hoverClasses = this.hover
            ? 'hover:shadow-lg hover:-translate-y-1 hover:border-primary/20'
            : '';

        return `${baseClasses} ${bgClasses} ${this.padding} ${hoverClasses}`;
    }
}

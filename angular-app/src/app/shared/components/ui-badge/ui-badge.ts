import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'primary';
export type BadgeSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-ui-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ui-badge.html',
  styleUrl: './ui-badge.scss'
})
/**
 * A reusable badge component for status indicators and labels.
 * Supports various semantic variants (success, warning, error, etc.) and sizes.
 *
 * @example
 * <app-ui-badge variant="success" size="sm">Active</app-ui-badge>
 */
export class UiBadgeComponent {
  /** Semantic variant of the badge */
  @Input() variant: BadgeVariant = 'neutral';

  /** Size of the badge */
  @Input() size: BadgeSize = 'md';

  /** Whether the badge should be fully rounded (pill shape) */
  @Input() rounded: boolean = true;

  get classes(): string {
    const baseClasses = 'inline-flex items-center font-medium transition-colors duration-200';
    const roundedClass = this.rounded ? 'rounded-full' : 'rounded-md';

    let variantClasses = '';
    switch (this.variant) {
      case 'success':
        variantClasses = 'bg-success-light text-success-dark border border-success/20';
        break;
      case 'warning':
        variantClasses = 'bg-warning-light text-warning-dark border border-warning/20';
        break;
      case 'error':
        variantClasses = 'bg-error-light text-error-dark border border-error/20';
        break;
      case 'info':
        variantClasses = 'bg-blue-50 text-blue-700 border border-blue-200';
        break;
      case 'primary':
        variantClasses = 'bg-primary-50 text-primary-700 border border-primary-200';
        break;
      case 'neutral':
      default:
        variantClasses = 'bg-gray-100 text-gray-700 border border-gray-200';
        break;
    }

    let sizeClasses = '';
    switch (this.size) {
      case 'sm':
        sizeClasses = 'px-2 py-0.5 text-xs';
        break;
      case 'lg':
        sizeClasses = 'px-3 py-1 text-sm';
        break;
      case 'md':
      default:
        sizeClasses = 'px-2.5 py-0.5 text-xs';
        break;
    }

    return `${baseClasses} ${roundedClass} ${variantClasses} ${sizeClasses}`;
  }
}

import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ui-score-ring',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ui-score-ring.html',
  styleUrl: './ui-score-ring.scss'
})
/**
 * A circular progress ring component to visualize scores.
 * Automatically adjusts color based on score value (Green > 80, Yellow > 50, Red < 50).
 *
 * @example
 * <app-ui-score-ring [score]="85" size="lg"></app-ui-score-ring>
 */
export class UiScoreRingComponent implements OnChanges {
  /** Score value (0-100) */
  @Input() score: number = 0;

  /** Size of the ring */
  @Input() size: 'sm' | 'md' | 'lg' = 'md';

  radius = 18;
  circumference = 2 * Math.PI * this.radius;
  strokeDashoffset = this.circumference;

  get colorClass(): string {
    if (this.score >= 80) return 'text-success';
    if (this.score >= 50) return 'text-warning';
    return 'text-error';
  }

  get sizeClass(): string {
    switch (this.size) {
      case 'sm': return 'w-8 h-8 text-xs';
      case 'lg': return 'w-16 h-16 text-lg';
      case 'md':
      default: return 'w-12 h-12 text-sm';
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['score']) {
      this.updateProgress();
    }
  }

  private updateProgress(): void {
    const progress = Math.min(Math.max(this.score, 0), 100);
    this.strokeDashoffset = this.circumference - (progress / 100) * this.circumference;
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-owner-home',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="bg-white shadow rounded-lg p-6">
      <h2 class="text-2xl font-bold mb-4">Welcome, Owner!</h2>
      <p class="text-gray-600">This is your dashboard overview.</p>
    </div>
  `
})
export class OwnerHomeComponent { }

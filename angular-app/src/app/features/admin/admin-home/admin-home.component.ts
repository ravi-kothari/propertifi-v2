import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-admin-home',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="bg-white shadow rounded-lg p-6">
      <h2 class="text-2xl font-bold mb-4">Admin Dashboard</h2>
      <p class="text-gray-600">System overview and statistics.</p>
    </div>
  `
})
export class AdminHomeComponent { }

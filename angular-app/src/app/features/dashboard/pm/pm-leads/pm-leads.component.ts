import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LeadService } from '../../../../core/services/lead.service';
import { PmService } from '../../../../core/services/pm.service';
import { Observable } from 'rxjs';
import { LeadWithAssignment } from '../../../../core/models/lead.model';
import { LeadScore } from '../../../../core/models/pm.model';
import { LeadCardComponent } from '../../../../shared/components/lead-card/lead-card.component';

@Component({
  selector: 'app-pm-leads',
  standalone: true,
  imports: [CommonModule, LeadCardComponent],
  template: `
    <div class="space-y-6">
      <!-- Page Header -->
      <div>
        <h1 class="text-2xl font-bold text-gray-900 flex items-center gap-2">
          Leads
          <span class="inline-flex items-center gap-1 px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            AI-Powered
          </span>
        </h1>
        <p class="text-sm text-gray-600 mt-1">
          Manage and track your property leads
        </p>
      </div>

      <!-- Filters -->
      <div class="bg-white border border-gray-200 rounded-lg p-4">
        <div class="flex flex-col lg:flex-row gap-4">
          <div class="flex-1">
            <div class="relative">
              <input
                type="text"
                placeholder="Search leads by name, email, city..."
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                (input)="onSearch($event)"
              >
              <div class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div class="flex gap-2">
            <select
              class="pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
              (change)="onStatusFilter($event)"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="pending">Pending</option>
              <option value="contacted">Contacted</option>
              <option value="completed">Completed</option>
            </select>

            <select
              class="pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
              (change)="onTypeFilter($event)"
            >
              <option value="all">All Types</option>
              <option value="residential">Residential</option>
              <option value="multi_family">Multi Family</option>
              <option value="commercial">Commercial</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Leads List -->
      <div class="grid grid-cols-1 gap-6" *ngIf="leads$ | async as response">
        <app-lead-card
          *ngFor="let lead of response.data"
          [lead]="lead"
          [score]="scores[lead.id]"
          (click)="onViewDetails(lead.id)"
          class="cursor-pointer block"
        ></app-lead-card>
        
        <div *ngIf="response.data.length === 0" class="text-center py-12 bg-white border border-gray-200 rounded-lg">
          <p class="text-gray-500">No leads found matching your filters.</p>
        </div>
      </div>
    </div>
    `
})
export class PmLeadsComponent {
  private leadService = inject(LeadService);
  private router = inject(Router);
  private pmService = inject(PmService);
  leads$ = this.leadService.getLeads();
  scores: { [key: number]: any } = {};

  constructor() {
    this.pmService.getLeadScores().subscribe((response: { data: LeadScore[] }) => {
      response.data.forEach((score: LeadScore) => {
        this.scores[score.lead_id] = score;
      });
    });
  }

  onViewDetails(leadId: number): void {
    this.router.navigate(['/dashboard/pm/leads', leadId]);
  }

  onSearch(event: Event): void {
    const query = (event.target as HTMLInputElement).value;
    // TODO: Implement search logic with service
  }

  onStatusFilter(event: Event): void {
    const status = (event.target as HTMLSelectElement).value;
    // TODO: Implement status filter with service
  }

  onTypeFilter(event: Event): void {
    const type = (event.target as HTMLSelectElement).value;
    // TODO: Implement type filter with service
  }
}

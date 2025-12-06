import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UiCardComponent } from '../../../../shared/components/ui-card/ui-card.component';
import { UiBadgeComponent } from '../../../../shared/components/ui-badge/ui-badge';
import { PmService } from '../../../../core/services/pm.service';
import { MarketInsight } from '../../../../core/models/pm.model';

@Component({
  selector: 'app-pm-home',
  standalone: true,
  imports: [CommonModule, UiCardComponent, UiBadgeComponent, RouterLink],
  template: `
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex items-start justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Welcome back!</h1>
          <p class="text-gray-600 mt-1">Here's what's happening with your properties today.</p>
        </div>
        <app-ui-badge variant="neutral" size="md" [rounded]="true">Free Tier</app-ui-badge>
      </div>

      <!-- KPI Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <app-ui-card class="hover:shadow-md transition-shadow">
          <div class="p-6">
            <div class="flex items-start justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">New Leads (24h)</p>
                <h3 class="text-2xl font-bold text-gray-900 mt-2">12</h3>
                <p class="text-sm mt-2 flex items-center gap-1 text-green-600">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  +15% vs last period
                </p>
              </div>
              <div class="p-3 rounded-lg bg-green-50">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
          </div>
        </app-ui-card>

        <app-ui-card class="hover:shadow-md transition-shadow">
          <div class="p-6">
            <div class="flex items-start justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">Tours Scheduled</p>
                <h3 class="text-2xl font-bold text-gray-900 mt-2">8</h3>
                <p class="text-sm mt-2 flex items-center gap-1 text-green-600">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  +20% vs last period
                </p>
              </div>
              <div class="p-3 rounded-lg bg-green-50">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
        </app-ui-card>

        <app-ui-card class="hover:shadow-md transition-shadow">
          <div class="p-6">
            <div class="flex items-start justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">Applications</p>
                <h3 class="text-2xl font-bold text-gray-900 mt-2">5</h3>
                <p class="text-sm mt-2 flex items-center gap-1 text-green-600">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  +25% vs last period
                </p>
              </div>
              <div class="p-3 rounded-lg bg-green-50">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </app-ui-card>

        <app-ui-card class="hover:shadow-md transition-shadow">
          <div class="p-6">
            <div class="flex items-start justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">Avg Response Time</p>
                <h3 class="text-2xl font-bold text-gray-900 mt-2">2.4h</h3>
                <p class="text-sm mt-2 flex items-center gap-1 text-green-600">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  -10% vs last period
                </p>
              </div>
              <div class="p-3 rounded-lg bg-green-50">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </app-ui-card>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Lead Funnel -->
        <div class="lg:col-span-2">
            <app-ui-card>
                <div class="p-6">
                    <div class="flex items-center justify-between mb-6">
                        <h2 class="text-lg font-semibold text-gray-900">Lead Pipeline</h2>
                        <a routerLink="/dashboard/pm/leads" class="text-sm text-indigo-600 hover:text-indigo-700 font-medium cursor-pointer">
                            View all leads →
                        </a>
                    </div>

                    <div class="space-y-3">
                        <div class="relative">
                            <div class="flex items-center justify-between mb-1">
                                <span class="text-sm font-medium text-gray-700">New Inquiries</span>
                                <span class="text-sm font-bold text-gray-900">45</span>
                            </div>
                            <div class="h-12 bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-lg flex items-center px-4 text-white font-medium w-full">
                                100% Conversion
                            </div>
                        </div>

                        <div class="relative">
                            <div class="flex items-center justify-between mb-1">
                                <span class="text-sm font-medium text-gray-700">Contacted</span>
                                <span class="text-sm font-bold text-gray-900">38</span>
                            </div>
                            <div class="h-12 bg-gradient-to-r from-blue-500 to-blue-400 rounded-lg flex items-center px-4 text-white font-medium" style="width: 84%">
                                84% Conversion
                            </div>
                        </div>

                        <div class="relative">
                            <div class="flex items-center justify-between mb-1">
                                <span class="text-sm font-medium text-gray-700">Tour Scheduled</span>
                                <span class="text-sm font-bold text-gray-900">28</span>
                            </div>
                            <div class="h-12 bg-gradient-to-r from-purple-500 to-purple-400 rounded-lg flex items-center px-4 text-white font-medium" style="width: 62%">
                                62% Conversion
                            </div>
                        </div>

                        <div class="relative">
                            <div class="flex items-center justify-between mb-1">
                                <span class="text-sm font-medium text-gray-700">Application Submitted</span>
                                <span class="text-sm font-bold text-gray-900">18</span>
                            </div>
                            <div class="h-12 bg-gradient-to-r from-green-500 to-green-400 rounded-lg flex items-center px-4 text-white font-medium" style="width: 40%">
                                40% Conversion
                            </div>
                        </div>

                        <div class="relative">
                            <div class="flex items-center justify-between mb-1">
                                <span class="text-sm font-medium text-gray-700">Lease Signed</span>
                                <span class="text-sm font-bold text-gray-900">12</span>
                            </div>
                            <div class="h-12 bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-lg flex items-center px-4 text-white font-medium" style="width: 27%">
                                27% Conversion
                            </div>
                        </div>
                    </div>

                    <div class="mt-6 p-4 bg-gray-50 rounded-lg">
                        <div class="flex items-center justify-between">
                            <span class="text-sm font-medium text-gray-700">Overall Lead-to-Lease Conversion Rate</span>
                            <span class="text-lg font-bold text-indigo-600">26.7%</span>
                        </div>
                    </div>
                </div>
            </app-ui-card>
        </div>

        <!-- Recent Activity -->
        <div class="space-y-6">
            <app-ui-card>
                <div class="p-6">
                    <h2 class="text-lg font-semibold text-gray-900 mb-4">Market Insights</h2>
                    <div class="space-y-4">
                        <div *ngFor="let insight of marketInsights" class="flex items-start gap-3">
                            <div [ngClass]="{
                                'bg-green-100 text-green-600': insight.trend === 'up',
                                'bg-red-100 text-red-600': insight.trend === 'down',
                                'bg-gray-100 text-gray-600': insight.trend === 'stable'
                            }" class="p-2 rounded-lg">
                                <svg *ngIf="insight.trend === 'up'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                                <svg *ngIf="insight.trend === 'down'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                                </svg>
                                <svg *ngIf="insight.trend === 'stable'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14" />
                                </svg>
                            </div>
                            <div>
                                <p class="text-sm font-medium text-gray-900">{{ insight.metric }}</p>
                                <p class="text-xs text-gray-500 mt-1">{{ insight.description }}</p>
                                <p class="text-sm font-bold mt-1" [ngClass]="{
                                    'text-green-600': insight.trend === 'up',
                                    'text-red-600': insight.trend === 'down',
                                    'text-gray-600': insight.trend === 'stable'
                                }">
                                    {{ insight.percentage > 0 ? '+' : '' }}{{ insight.percentage }}%
                                </p>
                            </div>
                        </div>
                        <div *ngIf="marketInsights.length === 0" class="text-center py-4 text-gray-500 text-sm">
                            No insights available yet.
                        </div>
                    </div>
                </div>
            </app-ui-card>

            <app-ui-card>
                <div class="p-6">
                    <h2 class="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
                    <div class="space-y-1 divide-y divide-gray-100">
                        <div class="flex items-start gap-3 py-3">
                            <div class="h-2 w-2 rounded-full mt-2 bg-blue-500"></div>
                            <div class="flex-1 min-w-0">
                                <p class="text-sm font-medium text-gray-900">New Lead Received</p>
                                <p class="text-sm text-gray-500 mt-0.5">123 Main St, Austin TX</p>
                            </div>
                            <span class="text-xs text-gray-400">5m ago</span>
                        </div>
                        <div class="flex items-start gap-3 py-3">
                            <div class="h-2 w-2 rounded-full mt-2 bg-purple-500"></div>
                            <div class="flex-1 min-w-0">
                                <p class="text-sm font-medium text-gray-900">Tour Scheduled</p>
                                <p class="text-sm text-gray-500 mt-0.5">Sarah Johnson - Tomorrow 2PM</p>
                            </div>
                            <span class="text-xs text-gray-400">1h ago</span>
                        </div>
                        <div class="flex items-start gap-3 py-3">
                            <div class="h-2 w-2 rounded-full mt-2 bg-green-500"></div>
                            <div class="flex-1 min-w-0">
                                <p class="text-sm font-medium text-gray-900">Application Submitted</p>
                                <p class="text-sm text-gray-500 mt-0.5">456 Oak Ave - John Doe</p>
                            </div>
                            <span class="text-xs text-gray-400">2h ago</span>
                        </div>
                    </div>
                </div>
            </app-ui-card>
        </div>
      </div>
    </div>
  `
})
export class PmHomeComponent {
  private pmService = inject(PmService);
  marketInsights: MarketInsight[] = [];

  ngOnInit() {
    this.pmService.getMarketInsights().subscribe(response => {
      this.marketInsights = response.data;
    });
  }
}

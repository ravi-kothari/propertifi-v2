import { Routes } from '@angular/router';
import { PmLayoutComponent } from './pm-layout/pm-layout.component';
import { PmHomeComponent } from './pm-home/pm-home.component';

export const PM_ROUTES: Routes = [
    {
        path: '',
        component: PmLayoutComponent,
        children: [
            { path: '', component: PmHomeComponent },
            {
                path: 'leads',
                loadComponent: () => import('./pm-leads/pm-leads.component').then(m => m.PmLeadsComponent)
            },
            {
                path: 'leads/:id',
                loadComponent: () => import('../../leads/lead-detail/lead-detail.component').then(m => m.LeadDetailComponent)
            },
            {
                path: 'properties',
                loadComponent: () => import('./properties/pm-properties.component').then(m => m.PmPropertiesComponent)
            }
        ]
    }
];

import { Routes } from '@angular/router';
import { OwnerLayoutComponent } from './owner-layout/owner-layout.component';
import { OwnerHomeComponent } from './owner-home/owner-home.component';

export const OWNER_ROUTES: Routes = [
    {
        path: '',
        component: OwnerLayoutComponent,
        children: [
            { path: '', component: OwnerHomeComponent },
            {
                path: 'leads',
                loadComponent: () => import('./owner-leads/owner-leads.component').then(m => m.OwnerLeadsComponent)
            },
            {
                path: 'bookmarks',
                loadComponent: () => import('./bookmarks/bookmarks.component').then(m => m.OwnerBookmarksComponent)
            },
            {
                path: 'calculations',
                loadComponent: () => import('./saved-calculations/saved-calculations.component').then(m => m.SavedCalculationsComponent)
            }
        ]
    }
];

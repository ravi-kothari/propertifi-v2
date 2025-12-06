import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { AdminHomeComponent } from './admin-home/admin-home.component';

export const ADMIN_ROUTES: Routes = [
    {
        path: '',
        component: AdminLayoutComponent,
        children: [
            { path: '', component: AdminHomeComponent },
            {
                path: 'users',
                loadComponent: () => import('./users/user-list/user-list.component').then(m => m.UserListComponent)
            },
            {
                path: 'analytics',
                loadComponent: () => import('./analytics/admin-analytics.component').then(m => m.AdminAnalyticsComponent)
            },
            {
                path: 'cms',
                loadComponent: () => import('./cms/admin-cms.component').then(m => m.AdminCmsComponent)
            },
            {
                path: '',
                redirectTo: 'users',
                pathMatch: 'full'
            }
        ]
    }
];

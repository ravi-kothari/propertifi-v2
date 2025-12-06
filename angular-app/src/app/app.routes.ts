import { Routes } from '@angular/router';
import { guestGuard } from './core/auth/guest.guard';
import { authGuard } from './core/auth/auth.guard';
import { roleGuard } from './core/auth/role.guard';

export const routes: Routes = [
    {
        path: 'auth',
        canActivate: [guestGuard],
        children: [
            {
                path: 'login',
                loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent),
                data: { animation: 'LoginPage' }
            },
            {
                path: 'register',
                loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent),
                data: { animation: 'RegisterPage' }
            },
            { path: '', redirectTo: 'login', pathMatch: 'full' }
        ]
    },
    {
        path: 'dashboard/owner',
        canActivate: [authGuard, roleGuard(['owner'])],
        loadChildren: () => import('./features/dashboard/owner/owner.routes').then(m => m.OWNER_ROUTES),
        data: { animation: 'OwnerDashboard' }
    },
    {
        path: 'dashboard/pm',
        canActivate: [authGuard, roleGuard(['pm'])],
        loadChildren: () => import('./features/dashboard/pm/pm.routes').then(m => m.PM_ROUTES),
        data: { animation: 'PmDashboard' }
    },
    {
        path: 'admin',
        canActivate: [authGuard, roleGuard(['admin'])],
        loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES),
        data: { animation: 'AdminDashboard' }
    },
    {
        path: '',
        loadComponent: () => import('./features/public/public-layout/public-layout.component').then(m => m.PublicLayoutComponent),
        children: [
            {
                path: '',
                loadComponent: () => import('./features/public/home/home.component').then(m => m.HomeComponent),
                data: { animation: 'HomePage' }
            },
            {
                path: 'about',
                loadComponent: () => import('./features/public/about/about.component').then(m => m.AboutComponent),
                data: { animation: 'AboutPage' }
            },
            {
                path: 'services',
                loadComponent: () => import('./features/public/services/services.component').then(m => m.ServicesComponent),
                data: { animation: 'ServicesPage' }
            },
            {
                path: 'blog',
                loadComponent: () => import('./features/public/blog/blog-list/blog-list.component').then(m => m.BlogListComponent),
                data: { animation: 'BlogListPage' }
            },
            {
                path: 'calculators/roi',
                loadComponent: () => import('./features/public/calculators/roi-calculator/roi-calculator.component').then(m => m.RoiCalculatorComponent),
                data: { animation: 'RoiCalculatorPage' }
            },
            {
                path: 'calculators/mortgage',
                loadComponent: () => import('./features/public/calculators/mortgage-calculator/mortgage-calculator.component').then(m => m.MortgageCalculatorComponent),
                data: { animation: 'MortgageCalculatorPage' }
            },
            {
                path: 'calculators/rent-vs-buy',
                loadComponent: () => import('./features/public/calculators/rent-vs-buy/rent-vs-buy.component').then(m => m.RentVsBuyComponent),
                data: { animation: 'RentVsBuyPage' }
            },
            {
                path: 'marketplace',
                loadComponent: () => import('./features/public/marketplace/marketplace.component').then(m => m.MarketplaceComponent),
                data: { animation: 'MarketplacePage' }
            },
            {
                path: 'resources',
                loadComponent: () => import('./features/public/resources/resources.component').then(m => m.ResourcesComponent),
                data: { animation: 'ResourcesPage' }
            },
            {
                path: 'contact',
                loadComponent: () => import('./features/public/contact/contact.component').then(m => m.ContactComponent),
                data: { animation: 'ContactPage' }
            },
            {
                path: 'pricing',
                loadComponent: () => import('./features/public/pricing/pricing.component').then(m => m.PricingComponent),
                data: { animation: 'PricingPage' }
            },
            {
                path: 'faq',
                loadComponent: () => import('./features/public/faq/faq.component').then(m => m.FaqComponent),
                data: { animation: 'FaqPage' }
            },
            {
                path: 'privacy',
                loadComponent: () => import('./features/public/legal/privacy/privacy.component').then(m => m.PrivacyComponent),
                data: { animation: 'PrivacyPage' }
            },
            {
                path: 'terms',
                loadComponent: () => import('./features/public/legal/terms/terms.component').then(m => m.TermsComponent),
                data: { animation: 'TermsPage' }
            }
        ]
    },
    // Fallback route
    {
        path: '**',
        redirectTo: ''
    }
];

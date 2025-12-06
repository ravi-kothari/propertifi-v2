import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UiButtonComponent } from '../../../shared/components/ui-button/ui-button.component';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, RouterModule, UiButtonComponent],
    templateUrl: './home.component.html'
})
export class HomeComponent {
    trustedBy = [
        { name: 'Tuple', logo: 'https://tailwindui.com/img/logos/tuple-logo-gray-400.svg' },
        { name: 'Mirage', logo: 'https://tailwindui.com/img/logos/mirage-logo-gray-400.svg' },
        { name: 'StaticKit', logo: 'https://tailwindui.com/img/logos/statickit-logo-gray-400.svg' },
        { name: 'Transistor', logo: 'https://tailwindui.com/img/logos/transistor-logo-gray-400.svg' },
        { name: 'Workcation', logo: 'https://tailwindui.com/img/logos/workcation-logo-gray-400.svg' }
    ];

    testimonials = [
        {
            content: "Propertifi transformed how we manage our portfolio. The AI matching is a game-changer.",
            author: "Sarah Thompson",
            role: "Property Owner",
            image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
        },
        {
            content: "As a property manager, the quality of leads I get here is unmatched. Highly recommended.",
            author: "David Chen",
            role: "Property Manager",
            image: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
        }
    ];

    steps = [
        {
            title: 'Create Account',
            description: 'Sign up as an owner or manager in minutes.',
            icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
        },
        {
            title: 'Set Preferences',
            description: 'Tell us about your property or service area.',
            icon: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4'
        },
        {
            title: 'Get Matched',
            description: 'Our AI connects you with the perfect match.',
            icon: 'M13 10V3L4 14h7v7l9-11h-7z'
        }
    ];
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UiCardComponent } from '../../../shared/components/ui-card/ui-card.component';
import { UiButtonComponent } from '../../../shared/components/ui-button/ui-button.component';
import { UiInputComponent } from '../../../shared/components/ui-input/ui-input.component';
import { UiBadgeComponent } from '../../../shared/components/ui-badge/ui-badge';

interface PropertyManager {
    id: number;
    name: string;
    company: string;
    location: string;
    rating: number;
    reviews: number;
    specialties: string[];
    image: string;
}

@Component({
    selector: 'app-marketplace',
    standalone: true,
    imports: [CommonModule, FormsModule, UiCardComponent, UiButtonComponent, UiInputComponent, UiBadgeComponent],
    templateUrl: './marketplace.component.html'
})
export class MarketplaceComponent {
    searchQuery = '';
    managers: PropertyManager[] = [
        {
            id: 1,
            name: 'Alice Johnson',
            company: 'Prestige Management',
            location: 'Los Angeles, CA',
            rating: 4.9,
            reviews: 124,
            specialties: ['Residential', 'Luxury'],
            image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
        },
        {
            id: 2,
            name: 'Robert Smith',
            company: 'Urban Living Props',
            location: 'New York, NY',
            rating: 4.7,
            reviews: 89,
            specialties: ['Commercial', 'Multi-family'],
            image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
        },
        {
            id: 3,
            name: 'Sarah Davis',
            company: 'Coastal Realty',
            location: 'Miami, FL',
            rating: 4.8,
            reviews: 56,
            specialties: ['Vacation Rentals', 'Residential'],
            image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
        }
    ];

    get filteredManagers() {
        return this.managers.filter(m =>
            m.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            m.company.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            m.location.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
    }
}

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { PmService } from '../../../../core/services/pm.service';
import { Property, PropertyStats } from '../../../../core/models/pm.model';
import { UiCardComponent } from '../../../../shared/components/ui-card/ui-card.component';
import { UiButtonComponent } from '../../../../shared/components/ui-button/ui-button.component';
import { UiBadgeComponent, BadgeVariant } from '../../../../shared/components/ui-badge/ui-badge';
import { debounceTime, distinctUntilChanged, combineLatest, startWith, map } from 'rxjs';

@Component({
    selector: 'app-pm-properties',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        UiCardComponent,
        UiButtonComponent,
        UiBadgeComponent
    ],
    templateUrl: './pm-properties.component.html'
})
export class PmPropertiesComponent implements OnInit {
    private pmService = inject(PmService);

    properties: Property[] = [];
    filteredProperties: Property[] = [];

    searchControl = new FormControl('');
    typeFilterControl = new FormControl('all');
    statusFilterControl = new FormControl('all');

    stats: PropertyStats = {
        total: 0,
        totalUnits: 0,
        totalOccupied: 0,
        avgOccupancy: 0
    };

    // Mock data for initial display until API is ready
    private mockProperties: Property[] = [
        {
            id: 1,
            name: 'Sunset Apartments',
            address: '456 Oak Street',
            city: 'Austin',
            state: 'TX',
            zip: '78701',
            type: 'residential',
            units: 50,
            occupied: 47,
            price: 1200,
            status: 'active',
        },
        {
            id: 2,
            name: 'Downtown Lofts',
            address: '123 Main Street',
            city: 'Los Angeles',
            state: 'CA',
            zip: '90015',
            type: 'multi_family',
            units: 100,
            occupied: 95,
            price: 1800,
            status: 'active',
        },
        {
            id: 3,
            name: 'Maple Grove Complex',
            address: '789 Pine Boulevard',
            city: 'San Francisco',
            state: 'CA',
            zip: '94102',
            type: 'residential',
            units: 25,
            occupied: 20,
            price: 2200,
            status: 'active',
        },
        {
            id: 4,
            name: 'Harbor View Towers',
            address: '321 Beach Avenue',
            city: 'Miami',
            state: 'FL',
            zip: '33139',
            type: 'multi_family',
            units: 75,
            occupied: 68,
            price: 1600,
            status: 'active',
        },
    ];

    ngOnInit() {
        // Initialize with mock data
        this.properties = this.mockProperties;
        this.updateStats();

        // Setup filters
        combineLatest([
            this.searchControl.valueChanges.pipe(startWith(''), debounceTime(300), distinctUntilChanged()),
            this.typeFilterControl.valueChanges.pipe(startWith('all')),
            this.statusFilterControl.valueChanges.pipe(startWith('all'))
        ]).subscribe(([search, type, status]) => {
            this.filterProperties(search || '', type || 'all', status || 'all');
        });

        // TODO: Replace with API call when backend is ready
        /*
        this.pmService.getProperties().subscribe(response => {
            this.properties = response.data;
            this.updateStats();
            this.filterProperties(
                this.searchControl.value || '',
                this.typeFilterControl.value || 'all',
                this.statusFilterControl.value || 'all'
            );
        });
        */
    }

    filterProperties(search: string, type: string, status: string) {
        this.filteredProperties = this.properties.filter(property => {
            const matchesSearch = !search ||
                property.name.toLowerCase().includes(search.toLowerCase()) ||
                property.city.toLowerCase().includes(search.toLowerCase()) ||
                property.address.toLowerCase().includes(search.toLowerCase());

            const matchesType = type === 'all' || property.type === type;
            const matchesStatus = status === 'all' || property.status === status;

            return matchesSearch && matchesType && matchesStatus;
        });
    }

    updateStats() {
        const total = this.properties.length;
        const totalUnits = this.properties.reduce((sum, p) => sum + p.units, 0);
        const totalOccupied = this.properties.reduce((sum, p) => sum + p.occupied, 0);
        const avgOccupancy = totalUnits > 0 ? Math.round((totalOccupied / totalUnits) * 100) : 0;

        this.stats = {
            total,
            totalUnits,
            totalOccupied,
            avgOccupancy
        };
    }

    getOccupancyRate(property: Property): number {
        return Math.round((property.occupied / property.units) * 100);
    }

    getOccupancyColor(percentage: number): string {
        if (percentage >= 90) return 'text-green-600';
        if (percentage >= 70) return 'text-yellow-600';
        return 'text-red-600';
    }

    getStatusVariant(status: string): BadgeVariant {
        switch (status) {
            case 'active': return 'success';
            case 'inactive': return 'neutral';
            case 'pending': return 'warning';
            default: return 'neutral';
        }
    }

    clearFilters() {
        this.searchControl.setValue('');
        this.typeFilterControl.setValue('all');
        this.statusFilterControl.setValue('all');
    }
}

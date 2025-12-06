export interface Property {
    id: number;
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    type: 'residential' | 'multi_family' | 'commercial';
    units: number;
    occupied: number;
    price: number;
    status: 'active' | 'inactive' | 'pending';
}

export interface PropertyStats {
    total: number;
    totalUnits: number;
    totalOccupied: number;
    avgOccupancy: number;
}

export interface PropertyResponse {
    data: Property[];
    meta?: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

export interface MarketInsight {
    trend: 'up' | 'down' | 'stable';
    percentage: number;
    description: string;
    metric: string;
}

export interface LeadScore {
    lead_id: number;
    score: number;
    factors: string[];
    category: 'hot' | 'warm' | 'cold';
}

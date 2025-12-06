/**
 * TypeScript interfaces for Rehab Cost Estimator
 */

export type RoomType = 'kitchen' | 'bathroom' | 'bedroom' | 'living' | 'dining' | 'basement' | 'exterior';
export type RehabScope = 'cosmetic' | 'moderate' | 'extensive' | 'gut-rehab';
export type FinishQuality = 'budget' | 'mid-grade' | 'high-end' | 'luxury';

export interface RoomRehab {
  type: RoomType;
  scope: RehabScope;
  squareFeet: number;
  quality: FinishQuality;
  items: {
    flooring: boolean;
    paint: boolean;
    fixtures: boolean;
    cabinets: boolean;
    countertops: boolean;
    appliances: boolean;
    lighting: boolean;
    plumbing: boolean;
    electrical: boolean;
  };
}

export interface RehabInputs {
  propertySquareFeet: number;
  propertyAge: number;
  rooms: RoomRehab[];
  structural: {
    roof: boolean;
    hvac: boolean;
    windows: boolean;
    siding: boolean;
    foundation: boolean;
  };
  location: {
    city: string;
    state: string;
  };
}

export interface CostBreakdown {
  category: string;
  laborCost: number;
  materialCost: number;
  totalCost: number;
  description: string;
}

export interface RehabResults {
  totalCost: {
    low: number;
    mid: number;
    high: number;
  };
  costPerSqft: {
    low: number;
    mid: number;
    high: number;
  };
  breakdown: CostBreakdown[];
  timeline: {
    estimatedDays: number;
    estimatedWeeks: number;
  };
  recommendations: string[];
  contingency: number; // 10-20% of total
}

export const defaultRehabInputs: RehabInputs = {
  propertySquareFeet: 1500,
  propertyAge: 30,
  rooms: [],
  structural: {
    roof: false,
    hvac: false,
    windows: false,
    siding: false,
    foundation: false,
  },
  location: {
    city: '',
    state: '',
  },
};

// Cost per sqft by scope and quality
export const COST_MATRIX: Record<RehabScope, Record<FinishQuality, { min: number; max: number }>> = {
  'cosmetic': {
    'budget': { min: 15, max: 25 },
    'mid-grade': { min: 25, max: 40 },
    'high-end': { min: 40, max: 60 },
    'luxury': { min: 60, max: 100 },
  },
  'moderate': {
    'budget': { min: 40, max: 60 },
    'mid-grade': { min: 60, max: 90 },
    'high-end': { min: 90, max: 130 },
    'luxury': { min: 130, max: 180 },
  },
  'extensive': {
    'budget': { min: 80, max: 120 },
    'mid-grade': { min: 120, max: 170 },
    'high-end': { min: 170, max: 230 },
    'luxury': { min: 230, max: 300 },
  },
  'gut-rehab': {
    'budget': { min: 100, max: 150 },
    'mid-grade': { min: 150, max: 200 },
    'high-end': { min: 200, max: 280 },
    'luxury': { min: 280, max: 400 },
  },
};

// Major system costs
export const STRUCTURAL_COSTS = {
  roof: { min: 8000, max: 15000, perSqft: 5 },
  hvac: { min: 5000, max: 12000, flat: true },
  windows: { min: 500, max: 1200, perWindow: true },
  siding: { min: 8000, max: 18000, perSqft: 8 },
  foundation: { min: 10000, max: 30000, flat: true },
};

/**
 * TypeScript interfaces for Rent Estimate Calculator
 */

export type PropertyType = 'single-family' | 'multi-family' | 'condo' | 'townhouse' | 'apartment';
export type PropertyCondition = 'excellent' | 'good' | 'average' | 'fair' | 'poor';

export interface RentEstimateInputs {
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  propertyType: PropertyType;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  condition: PropertyCondition;
  amenities: {
    parking: boolean;
    laundry: boolean;
    petFriendly: boolean;
    furnished: boolean;
    yardPatio: boolean;
    updatedKitchen: boolean;
    updatedBath: boolean;
    airConditioning: boolean;
  };
}

export interface RentComparable {
  address: string;
  beds: number;
  baths: number;
  sqft: number;
  rent: number;
  distance: number; // miles
  similarity: number; // 0-100%
}

export interface RentEstimateResults {
  estimatedRent: {
    low: number;
    mid: number;
    high: number;
  };
  pricePerSqft: {
    low: number;
    mid: number;
    high: number;
  };
  marketTrends: {
    yoyChange: number; // % year over year
    trend: 'rising' | 'stable' | 'declining';
    medianRent: number;
  };
  comparables: RentComparable[];
  recommendations: string[];
  confidence: number; // 0-100%
}

export interface RentEstimateCalculatorState {
  inputs: RentEstimateInputs;
  results: RentEstimateResults | null;
}

// Default values
export const defaultRentEstimateInputs: RentEstimateInputs = {
  address: {
    street: '',
    city: '',
    state: '',
    zipCode: '',
  },
  propertyType: 'single-family',
  bedrooms: 3,
  bathrooms: 2,
  squareFeet: 1500,
  condition: 'good',
  amenities: {
    parking: false,
    laundry: false,
    petFriendly: false,
    furnished: false,
    yardPatio: false,
    updatedKitchen: false,
    updatedBath: false,
    airConditioning: false,
  },
};

// Base rent by property type and bedrooms (national averages - can be location-adjusted)
export const BASE_RENT_MATRIX: Record<PropertyType, Record<number, number>> = {
  'single-family': {
    1: 1200,
    2: 1500,
    3: 1800,
    4: 2200,
    5: 2600,
  },
  'multi-family': {
    1: 1000,
    2: 1300,
    3: 1600,
    4: 1900,
    5: 2200,
  },
  'condo': {
    1: 1300,
    2: 1600,
    3: 1900,
    4: 2300,
    5: 2700,
  },
  'townhouse': {
    1: 1150,
    2: 1450,
    3: 1750,
    4: 2100,
    5: 2500,
  },
  'apartment': {
    1: 1100,
    2: 1400,
    3: 1700,
    4: 2000,
    5: 2400,
  },
};

// Condition multipliers
export const CONDITION_MULTIPLIERS: Record<PropertyCondition, number> = {
  excellent: 1.15,
  good: 1.05,
  average: 1.0,
  fair: 0.93,
  poor: 0.85,
};

// Amenity value additions (monthly $)
export const AMENITY_VALUES = {
  parking: 50,
  laundry: 30,
  petFriendly: 25,
  furnished: 200,
  yardPatio: 75,
  updatedKitchen: 100,
  updatedBath: 75,
  airConditioning: 50,
};

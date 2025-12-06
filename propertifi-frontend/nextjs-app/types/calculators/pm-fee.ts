/**
 * TypeScript interfaces for Property Management Fee Calculator
 */

export type PropertyType = 'single-family' | 'multi-family' | 'condo' | 'townhouse';
export type FeeStructure = 'percentage' | 'flat' | 'hybrid';

export interface PMFeeInputs {
  propertyType: PropertyType;
  monthlyRent: number;
  numberOfUnits: number;
  location: {
    city: string;
    state: string;
  };
}

export interface FeeEstimate {
  structure: FeeStructure;
  percentageFee?: number;  // % of rent
  flatFee?: number;         // fixed monthly amount
  monthlyFee: number;       // calculated monthly fee
  annualFee: number;        // calculated annual fee
  description: string;
}

export interface PMFeeResults {
  estimates: FeeEstimate[];
  marketAverage: {
    percentageFee: number;
    monthlyDollarAmount: number;
  };
  totalMonthlyIncome: number;
  totalAnnualIncome: number;
  recommendations: string[];
  typicalServices: string[];
}

export interface PMFeeCalculatorState {
  inputs: PMFeeInputs;
  results: PMFeeResults | null;
}

// Default values
export const defaultPMFeeInputs: PMFeeInputs = {
  propertyType: 'single-family',
  monthlyRent: 2000,
  numberOfUnits: 1,
  location: {
    city: '',
    state: '',
  },
};

// Market averages by property type (these can be made dynamic later)
export const MARKET_AVERAGES: Record<PropertyType, number> = {
  'single-family': 10,    // 10% of rent
  'multi-family': 8,      // 8% of rent
  'condo': 10,            // 10% of rent
  'townhouse': 10,        // 10% of rent
};

// Typical services included
export const TYPICAL_SERVICES = [
  'Tenant screening and placement',
  'Rent collection and accounting',
  'Maintenance coordination',
  'Property inspections',
  'Lease enforcement',
  'Monthly financial reports',
  '24/7 emergency response',
  'Legal compliance and evictions',
];

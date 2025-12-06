/**
 * TypeScript interfaces for Advanced ROI Calculator
 */

export interface LoanDetails {
  purchasePrice: number;
  downPayment: number;          // $ amount
  downPaymentPercent: number;   // Calculated from downPayment
  loanAmount: number;            // Calculated: purchasePrice - downPayment
  interestRate: number;          // % annual
  loanTerm: number;              // years (typically 15 or 30)
  loanPoints: number;            // % of loan amount
  closingCosts: number;          // $
}

export interface Expenses {
  propertyTaxes: number;         // Annual $
  propertyTaxIncreaseRate: number; // Annual %
  homeInsurance: number;         // Annual $
  landlordInsurance: number;     // Annual $
  hoaFees: number;              // Monthly $
  propertyManagementFee: number; // % of rent
  maintenanceReserve: number;    // % of rent
  vacancyRate: number;           // %
  capexReserve: number;          // Monthly $
}

export interface Income {
  monthlyRent: number;           // $
  annualRentIncrease: number;    // %
  otherIncome: number;           // Monthly $ (laundry, parking, etc.)
}

export interface ProjectionSettings {
  analysisYears: number;         // 5, 10, 20, or 30
  propertyAppreciation: number;  // Annual %
}

export interface CalculatedMetrics {
  // Monthly metrics
  monthlyMortgage: number;
  totalMonthlyExpenses: number;
  grossMonthlyIncome: number;
  netMonthlyCashFlow: number;

  // Annual metrics
  annualCashFlow: number;
  annualNOI: number;
  annualDebtService: number;

  // Key ratios
  cashOnCashReturn: number;      // %
  capRate: number;               // %
  dscr: number;                  // Debt Service Coverage Ratio
  irr: number;                   // Internal Rate of Return %

  // Investment summary
  totalCashInvested: number;     // Down payment + closing costs + points

  // Projections
  yearlyProjections: YearlyProjection[];
}

export interface YearlyProjection {
  year: number;
  grossIncome: number;
  operatingExpenses: number;
  noi: number;                   // Net Operating Income
  debtService: number;
  cashFlow: number;
  cumulativeCashFlow: number;
  loanBalance: number;
  propertyValue: number;
  equity: number;
  totalReturn: number;           // Cash + equity - initial investment
  roi: number;                   // % return on initial investment
}

export interface MonthlyBreakdown {
  month: string;
  income: number;
  expenses: number;
  mortgage: number;
  netCashFlow: number;
}

export interface CalculatorState {
  loanDetails: LoanDetails;
  expenses: Expenses;
  income: Income;
  settings: ProjectionSettings;
  results: CalculatedMetrics | null;
  isSaved: boolean;
  savedId?: string;
  savedName?: string;
}

// Default values for new calculator
export const defaultLoanDetails: LoanDetails = {
  purchasePrice: 400000,
  downPayment: 80000,
  downPaymentPercent: 20,
  loanAmount: 320000,
  interestRate: 6.5,
  loanTerm: 30,
  loanPoints: 0,
  closingCosts: 10000,
};

export const defaultExpenses: Expenses = {
  propertyTaxes: 5000,
  propertyTaxIncreaseRate: 2,
  homeInsurance: 1200,
  landlordInsurance: 800,
  hoaFees: 0,
  propertyManagementFee: 10,
  maintenanceReserve: 5,
  vacancyRate: 5,
  capexReserve: 200,
};

export const defaultIncome: Income = {
  monthlyRent: 3000,
  annualRentIncrease: 3,
  otherIncome: 0,
};

export const defaultSettings: ProjectionSettings = {
  analysisYears: 30,
  propertyAppreciation: 3,
};

export const defaultCalculatorState: CalculatorState = {
  loanDetails: defaultLoanDetails,
  expenses: defaultExpenses,
  income: defaultIncome,
  settings: defaultSettings,
  results: null,
  isSaved: false,
};

/**
 * Main calculation engine for ROI Calculator
 * Orchestrates all financial calculations
 */

import {
  CalculatorState,
  CalculatedMetrics,
  YearlyProjection,
  MonthlyBreakdown,
  LoanDetails,
  Expenses,
  Income,
  ProjectionSettings,
} from '@/types/calculators/roi';

import {
  calculateMortgagePayment,
  calculateCashOnCash,
  calculateCapRate,
  calculateNOI,
  calculateDSCR,
  calculateIRR,
  calculateRemainingBalance,
  round2,
} from './financialFormulas';

/**
 * Main calculation function
 * Takes calculator state and returns all calculated metrics
 */
export function calculateROI(state: CalculatorState): CalculatedMetrics {
  const { loanDetails, expenses, income, settings } = state;

  // Calculate monthly mortgage payment
  const monthlyMortgage = calculateMortgagePayment(
    loanDetails.loanAmount,
    loanDetails.interestRate,
    loanDetails.loanTerm
  );

  // Calculate monthly income (after vacancy)
  const effectiveMonthlyRent = income.monthlyRent * (1 - expenses.vacancyRate / 100);
  const grossMonthlyIncome = effectiveMonthlyRent + income.otherIncome;

  // Calculate monthly operating expenses (excludes mortgage)
  const monthlyPropertyTax = expenses.propertyTaxes / 12;
  const monthlyInsurance = (expenses.homeInsurance + expenses.landlordInsurance) / 12;
  const monthlyPMFee = income.monthlyRent * (expenses.propertyManagementFee / 100);
  const monthlyMaintenance = income.monthlyRent * (expenses.maintenanceReserve / 100);

  const totalMonthlyExpenses =
    monthlyPropertyTax +
    monthlyInsurance +
    expenses.hoaFees +
    monthlyPMFee +
    monthlyMaintenance +
    expenses.capexReserve;

  // Calculate monthly cash flow
  const netMonthlyCashFlow = grossMonthlyIncome - totalMonthlyExpenses - monthlyMortgage;

  // Calculate annual metrics
  const annualCashFlow = netMonthlyCashFlow * 12;
  const annualGrossIncome = grossMonthlyIncome * 12;
  const annualOperatingExpenses = totalMonthlyExpenses * 12;
  const annualNOI = calculateNOI(annualGrossIncome, annualOperatingExpenses);
  const annualDebtService = monthlyMortgage * 12;

  // Calculate total cash invested
  const totalCashInvested =
    loanDetails.downPayment +
    loanDetails.closingCosts +
    (loanDetails.loanAmount * loanDetails.loanPoints / 100);

  // Calculate key ratios
  const cashOnCashReturn = calculateCashOnCash(annualCashFlow, totalCashInvested);
  const capRate = calculateCapRate(annualNOI, loanDetails.purchasePrice);
  const dscr = calculateDSCR(annualNOI, annualDebtService);

  // Generate yearly projections
  const yearlyProjections = generateYearlyProjections(
    loanDetails,
    expenses,
    income,
    settings,
    monthlyMortgage,
    totalCashInvested
  );

  // Calculate IRR from projections
  const cashFlows = [-totalCashInvested]; // Initial investment (negative)
  yearlyProjections.forEach((projection) => {
    cashFlows.push(projection.cashFlow);
  });
  // Add final year equity as final cash flow
  if (yearlyProjections.length > 0) {
    const lastYear = yearlyProjections[yearlyProjections.length - 1];
    cashFlows[cashFlows.length - 1] += lastYear.equity;
  }
  const irr = calculateIRR(cashFlows);

  return {
    monthlyMortgage: round2(monthlyMortgage),
    totalMonthlyExpenses: round2(totalMonthlyExpenses),
    grossMonthlyIncome: round2(grossMonthlyIncome),
    netMonthlyCashFlow: round2(netMonthlyCashFlow),
    annualCashFlow: round2(annualCashFlow),
    annualNOI: round2(annualNOI),
    annualDebtService: round2(annualDebtService),
    cashOnCashReturn: round2(cashOnCashReturn),
    capRate: round2(capRate),
    dscr: round2(dscr),
    irr: round2(irr),
    totalCashInvested: round2(totalCashInvested),
    yearlyProjections,
  };
}

/**
 * Generate year-by-year projections
 */
function generateYearlyProjections(
  loanDetails: LoanDetails,
  expenses: Expenses,
  income: Income,
  settings: ProjectionSettings,
  monthlyMortgage: number,
  totalCashInvested: number
): YearlyProjection[] {
  const projections: YearlyProjection[] = [];

  let currentRent = income.monthlyRent;
  let currentPropertyValue = loanDetails.purchasePrice;
  let currentPropertyTaxes = expenses.propertyTaxes;
  let cumulativeCashFlow = 0;

  for (let year = 1; year <= settings.analysisYears; year++) {
    // Calculate income for this year (accounting for rent increases)
    if (year > 1) {
      currentRent *= (1 + income.annualRentIncrease / 100);
    }

    const effectiveAnnualRent = currentRent * 12 * (1 - expenses.vacancyRate / 100);
    const grossIncome = effectiveAnnualRent + (income.otherIncome * 12);

    // Calculate expenses for this year (accounting for tax increases)
    if (year > 1) {
      currentPropertyTaxes *= (1 + expenses.propertyTaxIncreaseRate / 100);
      currentPropertyValue *= (1 + settings.propertyAppreciation / 100);
    }

    const annualInsurance = expenses.homeInsurance + expenses.landlordInsurance;
    const annualHOA = expenses.hoaFees * 12;
    const annualPMFee = currentRent * 12 * (expenses.propertyManagementFee / 100);
    const annualMaintenance = currentRent * 12 * (expenses.maintenanceReserve / 100);
    const annualCapEx = expenses.capexReserve * 12;

    const operatingExpenses =
      currentPropertyTaxes +
      annualInsurance +
      annualHOA +
      annualPMFee +
      annualMaintenance +
      annualCapEx;

    const noi = grossIncome - operatingExpenses;
    const debtService = monthlyMortgage * 12;
    const cashFlow = noi - debtService;

    cumulativeCashFlow += cashFlow;

    // Calculate remaining loan balance
    const monthsPaid = year * 12;
    const loanBalance = calculateRemainingBalance(
      loanDetails.loanAmount,
      loanDetails.interestRate,
      loanDetails.loanTerm,
      monthsPaid
    );

    const equity = currentPropertyValue - loanBalance;
    const totalReturn = cumulativeCashFlow + equity - totalCashInvested;
    const roi = totalCashInvested > 0 ? (totalReturn / totalCashInvested) * 100 : 0;

    projections.push({
      year,
      grossIncome: round2(grossIncome),
      operatingExpenses: round2(operatingExpenses),
      noi: round2(noi),
      debtService: round2(debtService),
      cashFlow: round2(cashFlow),
      cumulativeCashFlow: round2(cumulativeCashFlow),
      loanBalance: round2(loanBalance),
      propertyValue: round2(currentPropertyValue),
      equity: round2(equity),
      totalReturn: round2(totalReturn),
      roi: round2(roi),
    });
  }

  return projections;
}

/**
 * Generate month-by-month breakdown for first year
 */
export function generateMonthlyBreakdown(state: CalculatorState): MonthlyBreakdown[] {
  const { loanDetails, expenses, income } = state;

  const monthlyMortgage = calculateMortgagePayment(
    loanDetails.loanAmount,
    loanDetails.interestRate,
    loanDetails.loanTerm
  );

  const effectiveMonthlyRent = income.monthlyRent * (1 - expenses.vacancyRate / 100);
  const grossMonthlyIncome = effectiveMonthlyRent + income.otherIncome;

  const monthlyPropertyTax = expenses.propertyTaxes / 12;
  const monthlyInsurance = (expenses.homeInsurance + expenses.landlordInsurance) / 12;
  const monthlyPMFee = income.monthlyRent * (expenses.propertyManagementFee / 100);
  const monthlyMaintenance = income.monthlyRent * (expenses.maintenanceReserve / 100);

  const totalMonthlyExpenses =
    monthlyPropertyTax +
    monthlyInsurance +
    expenses.hoaFees +
    monthlyPMFee +
    monthlyMaintenance +
    expenses.capexReserve;

  const netCashFlow = grossMonthlyIncome - totalMonthlyExpenses - monthlyMortgage;

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return months.map((month) => ({
    month,
    income: round2(grossMonthlyIncome),
    expenses: round2(totalMonthlyExpenses),
    mortgage: round2(monthlyMortgage),
    netCashFlow: round2(netCashFlow),
  }));
}

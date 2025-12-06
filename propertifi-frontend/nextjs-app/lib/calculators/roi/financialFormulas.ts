/**
 * Pure financial calculation functions
 * All formulas are unit-testable and side-effect free
 */

/**
 * Calculate monthly mortgage payment (Principal & Interest)
 * Formula: M = P * [r(1+r)^n] / [(1+r)^n - 1]
 *
 * @param principal - Loan amount
 * @param annualRate - Annual interest rate (as percentage, e.g., 6.5)
 * @param years - Loan term in years
 * @returns Monthly payment amount
 */
export function calculateMortgagePayment(
  principal: number,
  annualRate: number,
  years: number
): number {
  if (principal <= 0 || years <= 0) return 0;

  const monthlyRate = annualRate / 100 / 12;
  const numPayments = years * 12;

  // Handle 0% interest rate edge case
  if (monthlyRate === 0) {
    return principal / numPayments;
  }

  const payment = principal *
    (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
    (Math.pow(1 + monthlyRate, numPayments) - 1);

  return payment;
}

/**
 * Calculate Cash-on-Cash Return
 * Formula: (Annual Cash Flow / Total Cash Invested) * 100
 *
 * @param annualCashFlow - Net cash flow for the year
 * @param totalInvested - Total cash invested (down payment + closing costs)
 * @returns Cash-on-Cash return as percentage
 */
export function calculateCashOnCash(
  annualCashFlow: number,
  totalInvested: number
): number {
  if (totalInvested === 0) return 0;
  return (annualCashFlow / totalInvested) * 100;
}

/**
 * Calculate Capitalization Rate (Cap Rate)
 * Formula: (NOI / Property Value) * 100
 *
 * @param noi - Net Operating Income (annual)
 * @param propertyValue - Current property value
 * @returns Cap rate as percentage
 */
export function calculateCapRate(
  noi: number,
  propertyValue: number
): number {
  if (propertyValue === 0) return 0;
  return (noi / propertyValue) * 100;
}

/**
 * Calculate Net Operating Income (NOI)
 * Formula: Gross Income - Operating Expenses
 * Note: Excludes debt service (mortgage payments)
 *
 * @param grossIncome - Total rental income (after vacancy)
 * @param operatingExpenses - All expenses except mortgage
 * @returns Net Operating Income
 */
export function calculateNOI(
  grossIncome: number,
  operatingExpenses: number
): number {
  return grossIncome - operatingExpenses;
}

/**
 * Calculate Debt Service Coverage Ratio (DSCR)
 * Formula: NOI / Annual Debt Service
 *
 * @param noi - Net Operating Income (annual)
 * @param annualDebtService - Annual mortgage payments
 * @returns DSCR ratio (1.25+ is generally considered good)
 */
export function calculateDSCR(
  noi: number,
  annualDebtService: number
): number {
  if (annualDebtService === 0) return 0;
  return noi / annualDebtService;
}

/**
 * Calculate Internal Rate of Return (IRR)
 * Uses Newton-Raphson method for iterative approximation
 *
 * @param cashFlows - Array of cash flows (negative for investments, positive for returns)
 * @param initialGuess - Starting guess for IRR (default 0.1 = 10%)
 * @returns IRR as percentage
 */
export function calculateIRR(
  cashFlows: number[],
  initialGuess: number = 0.1
): number {
  if (cashFlows.length < 2) return 0;

  const maxIterations = 100;
  const tolerance = 0.00001;
  let rate = initialGuess;

  for (let i = 0; i < maxIterations; i++) {
    let npv = 0;
    let derivative = 0;

    for (let j = 0; j < cashFlows.length; j++) {
      npv += cashFlows[j] / Math.pow(1 + rate, j);
      derivative -= (j * cashFlows[j]) / Math.pow(1 + rate, j + 1);
    }

    if (Math.abs(derivative) < tolerance) break;

    const newRate = rate - npv / derivative;

    if (Math.abs(newRate - rate) < tolerance) {
      return newRate * 100; // Return as percentage
    }

    rate = newRate;

    // Prevent invalid rates
    if (rate < -0.99) rate = -0.99;
    if (rate > 10) rate = 10; // Cap at 1000% to prevent overflow
  }

  return rate * 100;
}

/**
 * Calculate remaining loan balance at a specific point in time
 *
 * @param principal - Original loan amount
 * @param annualRate - Annual interest rate (as percentage)
 * @param years - Loan term in years
 * @param monthsPaid - Number of months already paid
 * @returns Remaining loan balance
 */
export function calculateRemainingBalance(
  principal: number,
  annualRate: number,
  years: number,
  monthsPaid: number
): number {
  if (principal <= 0 || years <= 0) return 0;

  const monthlyPayment = calculateMortgagePayment(principal, annualRate, years);
  const monthlyRate = annualRate / 100 / 12;
  const totalPayments = years * 12;
  const paymentsRemaining = totalPayments - monthsPaid;

  if (paymentsRemaining <= 0) return 0;
  if (monthlyRate === 0) return principal - (monthlyPayment * monthsPaid);

  const remainingBalance = monthlyPayment *
    (Math.pow(1 + monthlyRate, paymentsRemaining) - 1) /
    (monthlyRate * Math.pow(1 + monthlyRate, paymentsRemaining));

  return Math.max(0, remainingBalance);
}

/**
 * Round to 2 decimal places
 */
export function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

/**
 * Format currency for display
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Format percentage for display
 */
export function formatPercent(value: number, decimals: number = 2): string {
  return value.toFixed(decimals) + '%';
}

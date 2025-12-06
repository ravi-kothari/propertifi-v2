# Week 2-3: Advanced ROI Calculator Implementation Plan

**Timeline:** 10-12 days (Weeks 2-3)
**Priority:** 🔴 CRITICAL - Foundation for calculator-driven traffic strategy
**Status:** Ready to Start

---

## Executive Summary

Week 2-3 focuses on building the Advanced ROI Calculator V2 - a comprehensive, production-ready calculator that will:
- Drive 400%+ organic traffic growth
- Achieve 40% calculator-to-account conversion rate
- Generate 600+ qualified leads per month (from calculator users)
- Establish foundation for entire calculator hub strategy

---

## Technical Specification

### Component Architecture

```
app/(marketing)/calculators/roi/
├── page.tsx                          # Main calculator page
├── components/
│   ├── CalculatorForm.tsx           # Main form container
│   ├── LoanDetailsSection.tsx       # Loan inputs
│   ├── ExpenseSection.tsx           # Expense inputs
│   ├── IncomeSection.tsx            # Income inputs
│   ├── ProjectionSettings.tsx       # Timeline settings
│   ├── ResultsSummary.tsx           # Key metrics display
│   ├── CashFlowTable.tsx            # Monthly breakdown
│   ├── ProjectionChart.tsx          # Visualizations
│   ├── SaveCalculationModal.tsx     # Account creation integration
│   └── PDFExport.tsx                # PDF generation
├── utils/
│   ├── calculations.ts              # Core calculation engine
│   ├── financialFormulas.ts         # Financial math functions
│   └── pdfGenerator.ts              # PDF creation logic
└── types/
    └── calculator.ts                # TypeScript interfaces
```

---

## Data Models (TypeScript Interfaces)

```typescript
// types/calculator.ts

export interface LoanDetails {
  purchasePrice: number;
  downPayment: number;          // $ amount
  downPaymentPercent: number;   // Calculated
  loanAmount: number;            // Calculated
  interestRate: number;          // % annual
  loanTerm: number;              // years
  loanPoints: number;            // %
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
  monthlyMortgage: number;
  totalMonthlyExpenses: number;
  grossMonthlyIncome: number;
  netMonthlyCashFlow: number;
  annualCashFlow: number;
  cashOnCashReturn: number;      // %
  capRate: number;               // %
  noi: number;                   // Net Operating Income
  dscr: number;                  // Debt Service Coverage Ratio
  irr: number;                   // Internal Rate of Return
  totalCashInvested: number;
  yearlyProjections: YearlyProjection[];
}

export interface YearlyProjection {
  year: number;
  grossIncome: number;
  expenses: number;
  noi: number;
  debtService: number;
  cashFlow: number;
  cumulativeCashFlow: number;
  loanBalance: number;
  propertyValue: number;
  equity: number;
  totalReturn: number;          // Cash + equity
}

export interface CalculatorState {
  loanDetails: LoanDetails;
  expenses: Expenses;
  income: Income;
  settings: ProjectionSettings;
  results?: CalculatedMetrics;
  isSaved: boolean;
  savedId?: string;
}
```

---

## Core Financial Formulas

```typescript
// utils/financialFormulas.ts

/**
 * Calculate monthly mortgage payment (P&I)
 * Formula: M = P * [r(1+r)^n] / [(1+r)^n - 1]
 */
export function calculateMortgagePayment(
  principal: number,
  annualRate: number,
  years: number
): number {
  const monthlyRate = annualRate / 100 / 12;
  const numPayments = years * 12;

  if (monthlyRate === 0) return principal / numPayments;

  const payment = principal *
    (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
    (Math.pow(1 + monthlyRate, numPayments) - 1);

  return payment;
}

/**
 * Calculate Cash-on-Cash Return
 * Formula: Annual Cash Flow / Total Cash Invested * 100
 */
export function calculateCashOnCash(
  annualCashFlow: number,
  totalInvested: number
): number {
  if (totalInvested === 0) return 0;
  return (annualCashFlow / totalInvested) * 100;
}

/**
 * Calculate Cap Rate
 * Formula: NOI / Property Value * 100
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
 * Formula: Gross Income - Operating Expenses (excludes debt service)
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
 */
export function calculateDSCR(
  noi: number,
  annualDebtService: number
): number {
  if (annualDebtService === 0) return 0;
  return noi / annualDebtService;
}

/**
 * Calculate IRR (Internal Rate of Return)
 * Uses Newton-Raphson method for iterative approximation
 */
export function calculateIRR(
  cashFlows: number[],
  initialGuess: number = 0.1
): number {
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

    const newRate = rate - npv / derivative;

    if (Math.abs(newRate - rate) < tolerance) {
      return newRate * 100; // Return as percentage
    }

    rate = newRate;
  }

  return rate * 100;
}

/**
 * Generate yearly projections
 */
export function generateProjections(
  state: CalculatorState
): YearlyProjection[] {
  const projections: YearlyProjection[] = [];
  const { loanDetails, expenses, income, settings } = state;

  let currentRent = income.monthlyRent;
  let currentPropertyValue = loanDetails.purchasePrice;
  let remainingLoanBalance = loanDetails.loanAmount;
  let cumulativeCashFlow = 0;

  const monthlyPayment = calculateMortgagePayment(
    loanDetails.loanAmount,
    loanDetails.interestRate,
    loanDetails.loanTerm
  );

  for (let year = 1; year <= settings.analysisYears; year++) {
    // Income
    const grossAnnualIncome = currentRent * 12 *
      (1 - expenses.vacancyRate / 100);

    // Operating Expenses (excludes debt service)
    const annualExpenses =
      expenses.propertyTaxes * Math.pow(1 + expenses.propertyTaxIncreaseRate / 100, year - 1) +
      expenses.homeInsurance +
      expenses.landlordInsurance +
      (expenses.hoaFees * 12) +
      (currentRent * 12 * expenses.propertyManagementFee / 100) +
      (currentRent * 12 * expenses.maintenanceReserve / 100) +
      (expenses.capexReserve * 12);

    const noi = grossAnnualIncome - annualExpenses;
    const annualDebtService = monthlyPayment * 12;
    const annualCashFlow = noi - annualDebtService;

    cumulativeCashFlow += annualCashFlow;

    // Update for next year
    currentRent *= (1 + income.annualRentIncrease / 100);
    currentPropertyValue *= (1 + settings.propertyAppreciation / 100);

    // Simplified loan balance calculation
    const monthlyRate = loanDetails.interestRate / 100 / 12;
    const paymentsRemaining = (loanDetails.loanTerm * 12) - (year * 12);
    if (paymentsRemaining > 0 && monthlyRate > 0) {
      remainingLoanBalance = monthlyPayment *
        (Math.pow(1 + monthlyRate, paymentsRemaining) - 1) /
        (monthlyRate * Math.pow(1 + monthlyRate, paymentsRemaining));
    } else {
      remainingLoanBalance = 0;
    }

    const equity = currentPropertyValue - remainingLoanBalance;
    const totalReturn = cumulativeCashFlow + equity - loanDetails.downPayment;

    projections.push({
      year,
      grossIncome: grossAnnualIncome,
      expenses: annualExpenses,
      noi,
      debtService: annualDebtService,
      cashFlow: annualCashFlow,
      cumulativeCashFlow,
      loanBalance: remainingLoanBalance,
      propertyValue: currentPropertyValue,
      equity,
      totalReturn,
    });
  }

  return projections;
}
```

---

## Implementation Phases

### Phase 1: Core Calculator (Days 1-4) - MVP

**Goal:** Basic working calculator with all inputs and key outputs

**Tasks:**
1. Create file structure and base components
2. Implement form with React Hook Form
3. Build calculation engine (all formulas)
4. Create basic results display (key metrics)
5. Add input validation
6. Mobile responsive styling

**Deliverables:**
- ✅ Working calculator with all inputs
- ✅ Accurate calculations (unit tested)
- ✅ Key metrics displayed (cash flow, ROI, cap rate)
- ✅ Mobile responsive

**Testing:**
- Unit tests for all financial formulas
- Manual testing with sample properties
- Validation edge cases (zero values, negative numbers)

---

### Phase 2: Visualizations & Projections (Days 5-7)

**Goal:** Add charts, tables, and long-term projections

**Tasks:**
1. Implement yearly projections table
2. Add Chart.js visualizations
   - Cash flow over time (line chart)
   - Equity buildup (area chart)
   - Income vs expenses (bar chart)
3. Create timeline selector (5, 10, 20, 30 years)
4. Add monthly breakdown table
5. Polish UI/UX with animations

**Deliverables:**
- ✅ Interactive charts
- ✅ Yearly projections table
- ✅ Monthly cash flow breakdown
- ✅ Timeline selector

---

### Phase 3: Save & Account Integration (Days 8-9)

**Goal:** Enable saving calculations with account creation

**Tasks:**
1. Create backend API endpoints
   - `POST /api/calculations` - Save calculation
   - `GET /api/calculations/:id` - Load calculation
   - `GET /api/calculations` - List user's calculations
2. Build SaveCalculationModal component
3. Integrate with existing auth system
4. Add "Load saved calculation" feature
5. Connect to account creation flow

**Deliverables:**
- ✅ Save calculation button
- ✅ Account creation modal (if not logged in)
- ✅ Saved calculations accessible from dashboard
- ✅ Pre-fill calculator from saved data

**Backend Schema:**
```sql
CREATE TABLE saved_calculations (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  name VARCHAR(255),
  calculator_type ENUM('roi', 'brrrr', 'fix-flip') DEFAULT 'roi',
  data JSON NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

---

### Phase 4: PDF Export & Polish (Days 10-12)

**Goal:** PDF generation and final polish

**Tasks:**
1. Implement PDF export using jsPDF
   - Header with Propertifi branding
   - All input parameters
   - Key metrics summary
   - Charts/visualizations
   - Yearly projections table
   - Footer with disclaimer
2. Add "Get Matched with PM" CTA
3. SEO optimization (meta tags, structured data)
4. Final QA and bug fixes
5. Performance optimization

**Deliverables:**
- ✅ PDF export functionality
- ✅ Branded, professional PDF output
- ✅ CTA integration
- ✅ SEO optimized
- ✅ Production-ready

---

## File Structure

```
propertifi-frontend/nextjs-app/
├── app/
│   └── (marketing)/
│       └── calculators/
│           └── roi/
│               ├── page.tsx                    # Main page
│               ├── layout.tsx                  # Calculator layout
│               └── components/
│                   ├── CalculatorForm.tsx
│                   ├── sections/
│                   │   ├── LoanDetailsSection.tsx
│                   │   ├── ExpenseSection.tsx
│                   │   ├── IncomeSection.tsx
│                   │   └── ProjectionSettings.tsx
│                   ├── results/
│                   │   ├── ResultsSummary.tsx
│                   │   ├── CashFlowTable.tsx
│                   │   ├── ProjectionChart.tsx
│                   │   └── MonthlyBreakdown.tsx
│                   ├── modals/
│                   │   └── SaveCalculationModal.tsx
│                   └── PDFExport.tsx
│
├── lib/
│   └── calculators/
│       └── roi/
│           ├── calculations.ts          # Main calculation engine
│           ├── financialFormulas.ts     # Pure math functions
│           ├── pdfGenerator.ts          # PDF creation
│           └── api.ts                   # API calls
│
├── types/
│   └── calculators/
│       └── roi.ts                       # TypeScript interfaces
│
└── components/
    └── calculators/
        └── shared/
            ├── NumericInput.tsx         # Reusable input
            ├── PercentInput.tsx         # % input with icon
            ├── CurrencyInput.tsx        # $ input with formatting
            └── InfoTooltip.tsx          # Already exists
```

---

## Backend API Endpoints

```php
// routes/api.php

Route::middleware(['auth:sanctum'])->group(function () {
    // Saved calculations
    Route::get('/calculations', [CalculationController::class, 'index']);
    Route::post('/calculations', [CalculationController::class, 'store']);
    Route::get('/calculations/{id}', [CalculationController::class, 'show']);
    Route::put('/calculations/{id}', [CalculationController::class, 'update']);
    Route::delete('/calculations/{id}', [CalculationController::class, 'destroy']);
});
```

```php
// app/Http/Controllers/Api/CalculationController.php

class CalculationController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'calculator_type' => 'required|in:roi,brrrr,fix-flip',
            'data' => 'required|json',
        ]);

        $calculation = SavedCalculation::create([
            'user_id' => $request->user()->id,
            'name' => $validated['name'],
            'calculator_type' => $validated['calculator_type'],
            'data' => $validated['data'],
        ]);

        return response()->json($calculation, 201);
    }

    public function index(Request $request)
    {
        $calculations = SavedCalculation::where('user_id', $request->user()->id)
            ->orderBy('updated_at', 'desc')
            ->get();

        return response()->json($calculations);
    }

    // ... other CRUD methods
}
```

---

## Key Dependencies

Already installed:
- ✅ `jspdf` - PDF generation
- ✅ `chart.js` - Charts
- ✅ `react-chartjs-2` - React wrapper for Chart.js
- ✅ `framer-motion` - Animations
- ✅ `react-hook-form` - Form management

Need to install:
- `financial` - Financial calculations helper (or write from scratch)

```bash
npm install financial
```

---

## Testing Strategy

### Unit Tests
```typescript
// lib/calculators/roi/__tests__/financialFormulas.test.ts

describe('Financial Formulas', () => {
  describe('calculateMortgagePayment', () => {
    it('calculates correct monthly payment', () => {
      const payment = calculateMortgagePayment(400000, 6.5, 30);
      expect(payment).toBeCloseTo(2528.27, 2);
    });

    it('handles zero interest rate', () => {
      const payment = calculateMortgagePayment(360000, 0, 30);
      expect(payment).toBe(1000);
    });
  });

  describe('calculateCashOnCash', () => {
    it('calculates correct percentage', () => {
      const coc = calculateCashOnCash(12000, 100000);
      expect(coc).toBe(12);
    });

    it('handles zero investment', () => {
      const coc = calculateCashOnCash(12000, 0);
      expect(coc).toBe(0);
    });
  });

  // ... more tests for each formula
});
```

### Integration Tests
- Test full calculation flow with sample data
- Test save/load functionality
- Test PDF generation
- Test chart rendering

### Manual QA Checklist
- [ ] All inputs accept valid ranges
- [ ] Validation prevents invalid inputs
- [ ] Calculations match manual verification
- [ ] Charts display correctly
- [ ] PDF exports properly
- [ ] Save/load works
- [ ] Mobile responsive
- [ ] Account creation flow works
- [ ] Cross-browser testing (Chrome, Safari, Firefox)

---

## Success Metrics (Week 2-3)

### Technical Metrics
- [ ] All unit tests pass (100% coverage on formulas)
- [ ] Page load time < 2 seconds
- [ ] Lighthouse score > 90
- [ ] Zero critical bugs in production

### Product Metrics (to track after launch)
- Calculator completion rate: 60%+ target
- Account creation from calculator: 40%+ target
- Calculator → Lead conversion: 20%+ target
- User satisfaction: 4.5/5.0+ target

---

## Risk Mitigation

### Technical Risks
1. **Complex IRR calculation** - Use proven library or simplified approximation
2. **PDF generation performance** - Generate on client-side, limit to reasonable page count
3. **Chart rendering issues** - Test on various devices, have fallback tables

### Product Risks
1. **Too complex for users** - Start with simple mode, add "Advanced" toggle
2. **Low completion rate** - Add autosave, allow returning to incomplete calculations
3. **Inaccurate calculations** - Extensive testing, add disclaimers, get CPA review

---

## Next Steps After Week 2-3

Once ROI calculator is complete:
- **Week 4:** BRRRR Calculator (reuse architecture)
- **Week 5:** Fix & Flip Calculator
- **Week 6:** Calculator hub landing page
- **Week 7-8:** SEO optimization and content marketing
- **Month 3:** Analytics review and iteration

---

**Document Owner:** Development Team
**Last Updated:** 2025-11-25
**Status:** Ready to Begin
**Estimated Completion:** 2025-12-08 (12 working days)

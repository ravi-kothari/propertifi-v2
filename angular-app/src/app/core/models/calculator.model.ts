export interface RoiInput {
    purchasePrice: number;
    downPayment: number;
    interestRate: number;
    loanTerm: number;
    monthlyRent: number;
    propertyTax: number;
    insurance: number;
    maintenance: number;
    vacancyRate: number;
    managementFee: number;
}

export interface RoiResult {
    monthlyIncome: number;
    monthlyExpenses: number;
    cashFlow: number;
    cashOnCashRoi: number;
    capRate: number;
    totalInvestment: number;
}

export interface MortgageInput {
    loanAmount: number;
    interestRate: number;
    loanTerm: number;
}

export interface MortgageResult {
    monthlyPayment: number;
    totalPayment: number;
    totalInterest: number;
}

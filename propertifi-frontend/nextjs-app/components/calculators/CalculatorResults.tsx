
"use client";

interface ResultsProps {
  results: {
    annualROI: number;
    monthlyCashFlow: number;
    annualCashFlow: number;
    capRate: number;
    cashOnCashReturn: number;
    totalInvestment: number;
  } | null;
}

export function CalculatorResults({ results }: ResultsProps) {
  if (!results) {
    return <p>Enter your property details to see the results.</p>;
  }

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

  const formatPercent = (value: number) => `${(value * 100).toFixed(2)}%`;

  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-semibold">Annual ROI</h4>
        <p className="text-2xl font-bold text-green-600">{formatPercent(results.annualROI)}</p>
      </div>
      <div>
        <h4 className="font-semibold">Monthly Cash Flow</h4>
        <p className="text-lg">{formatCurrency(results.monthlyCashFlow)}</p>
      </div>
      <div>
        <h4 className="font-semibold">Annual Cash Flow</h4>
        <p className="text-lg">{formatCurrency(results.annualCashFlow)}</p>
      </div>
      <div>
        <h4 className="font-semibold">Cap Rate</h4>
        <p className="text-lg">{formatPercent(results.capRate)}</p>
      </div>
      <div>
        <h4 className="font-semibold">Cash on Cash Return</h4>
        <p className="text-lg">{formatPercent(results.cashOnCashReturn)}</p>
      </div>
      <div>
        <h4 className="font-semibold">Total Investment</h4>
        <p className="text-lg">{formatCurrency(results.totalInvestment)}</p>
      </div>
    </div>
  );
}

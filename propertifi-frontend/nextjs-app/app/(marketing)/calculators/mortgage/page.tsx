import MortgageCalculator from '@/components/calculators/MortgageCalculator';

export const metadata = {
  title: 'Mortgage Calculator | Propertifi',
  description: 'Calculate your estimated monthly mortgage payments including principal, interest, taxes, and insurance (PITI).',
};

export default function MortgageCalculatorPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mortgage Calculator</h1>
        <p className="text-gray-600">
          Estimate your monthly mortgage payments with our easy-to-use PITI calculator. 
          Factor in interest, taxes, insurance, and HOA fees to see your true monthly cost.
        </p>
      </div>
      
      <MortgageCalculator />
    </div>
  );
}

import BRRRRCalculator from '@/components/calculators/BRRRRCalculator';

export const metadata = {
  title: 'BRRRR Calculator | Propertifi',
  description: 'Analyze Buy, Rehab, Rent, Refinance, Repeat real estate deals. Calculate cash on cash return, equity captured, and infinite returns.',
};

export default function BRRRRCalculatorPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">BRRRR Calculator</h1>
        <p className="text-gray-600">
          Master the BRRRR strategy (Buy, Rehab, Rent, Refinance, Repeat). 
          Determine how much cash you can pull out during refinance and calculate your "Infinite Returns".
        </p>
      </div>
      
      <BRRRRCalculator />
    </div>
  );
}

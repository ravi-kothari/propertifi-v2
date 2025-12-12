import STRCalculator from '@/components/calculators/STRCalculator';

export const metadata = {
  title: 'Airbnb / Short-Term Rental Calculator | Propertifi',
  description: 'Analyze potential profits from Airbnb, Vrbo, or short-term rentals vs traditional long-term leasing.',
};

export default function STRCalculatorPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Airbnb / STR Profitability Calculator</h1>
        <p className="text-gray-600">
          Thinking about turning your property into a short-term rental? Compare potential Airbnb/Vrbo income 
          against traditional long-term leasing to see which strategy yields higher cash flow.
        </p>
      </div>
      
      <STRCalculator />
    </div>
  );
}

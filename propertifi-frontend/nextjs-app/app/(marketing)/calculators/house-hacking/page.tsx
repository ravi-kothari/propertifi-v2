import HouseHackingCalculator from '@/components/calculators/HouseHackingCalculator';

export const metadata = {
  title: 'House Hacking Calculator | Propertifi',
  description: 'Calculate your net housing cost when house hacking a duplex, triplex, or fourplex. See if you can live for free!',
};

export default function HouseHackingCalculatorPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">House Hacking Calculator</h1>
        <p className="text-gray-600">
          House hacking is one of the most powerful ways to build wealth. 
          Use this calculator to see how much of your mortgage can be covered by renting out other units in your property.
        </p>
      </div>
      
      <HouseHackingCalculator />
    </div>
  );
}

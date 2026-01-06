import LeaseBuyoutCalculator from '@/components/calculators/LeaseBuyoutCalculator';

export const metadata = {
  title: 'Lease Buyout Calculator | Propertifi',
  description: 'Determine a fair price for early lease termination. Calculate tenant savings and landlord break-even costs.',
};

export default function LeaseBuyoutCalculatorPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Lease Buyout Calculator</h1>
        <p className="text-gray-600">
          Need to break a lease early? Use this calculator to find a fair buyout price that works 
          for both the landlord (covering vacancy costs) and the tenant (saving on remaining rent).
        </p>
      </div>
      
      <LeaseBuyoutCalculator />
    </div>
  );
}

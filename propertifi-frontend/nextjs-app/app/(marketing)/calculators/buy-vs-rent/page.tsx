import BuyVsRentCalculator from '@/components/calculators/BuyVsRentCalculator';

export const metadata = {
  title: 'Buy vs. Rent Calculator | Propertifi',
  description: 'Compare the financial impact of buying a home versus renting over time. Factor in appreciation, rent increases, and opportunity costs.',
};

export default function BuyVsRentCalculatorPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Buy vs. Rent Calculator</h1>
        <p className="text-gray-600">
          Should you buy or rent? Use our advanced calculator to compare the total cost of ownership vs. renting 
          over time, factoring in home equity, market appreciation, and investment returns.
        </p>
      </div>
      
      <BuyVsRentCalculator />
    </div>
  );
}

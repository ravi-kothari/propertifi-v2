import DepreciationCalculator from '@/components/calculators/DepreciationCalculator';

export const metadata = {
  title: 'Depreciation Calculator | Propertifi',
  description: 'Calculate annual tax depreciation deductions for residential or commercial rental properties.',
};

export default function DepreciationCalculatorPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Depreciation Calculator</h1>
        <p className="text-gray-600">
          Maximize your tax benefits by calculating the annual depreciation deduction for your investment property. 
          Supports both residential (27.5 years) and commercial (39 years) recovery periods.
        </p>
      </div>
      
      <DepreciationCalculator />
    </div>
  );
}

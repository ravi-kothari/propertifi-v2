import SecurityDepositCalculator from '@/components/calculators/SecurityDepositCalculator';

export const metadata = {
  title: 'Security Deposit Calculator | Propertifi',
  description: 'Calculate lawful security deposit deductions and refunds. Generate professional itemized statements for tenants.',
};

export default function SecurityDepositCalculatorPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Security Deposit Refund Calculator</h1>
        <p className="text-gray-600">
          Simplify your move-out process. Calculate interest, track deductions for cleaning or repairs, 
          and generate a clear, itemized refund statement for your tenants.
        </p>
      </div>
      
      <SecurityDepositCalculator />
    </div>
  );
}

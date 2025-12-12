import Exchange1031Calculator from '@/components/calculators/Exchange1031Calculator';

export const metadata = {
  title: '1031 Exchange Calculator | Propertifi',
  description: 'Calculate your potential capital gains tax liability and determine the reinvestment requirements to defer taxes in a 1031 exchange.',
};

export default function Exchange1031CalculatorPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">1031 Exchange Calculator</h1>
        <p className="text-gray-600">
          Planning to sell an investment property? Use this calculator to estimate your capital gains tax liability 
          and see exactly how much you need to reinvest to defer 100% of your taxes.
        </p>
      </div>
      
      <Exchange1031Calculator />
    </div>
  );
}

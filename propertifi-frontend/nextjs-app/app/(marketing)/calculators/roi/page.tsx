
import ROICalculator from "@/components/calculators/ROICalculator";

export default function ROICalculatorPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-heading text-3xl font-bold text-slate-900 mb-4">ROI Calculator</h1>
      <p className="text-lg text-slate-600 mb-8">Calculate the return on investment for your rental property.</p>
      <ROICalculator />
    </div>
  );
}

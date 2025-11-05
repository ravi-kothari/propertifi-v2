export default function CalculatorForm({ onFormChange }) {
  return (
    <form className="mr-4">
      <h3 className="font-semibold">Inputs</h3>
      <div className="mt-2">
        <label htmlFor="purchasePrice" className="block text-sm font-medium text-gray-700">Purchase Price</label>
        <input type="number" id="purchasePrice" name="purchasePrice" onChange={onFormChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md" />
      </div>
      <div className="mt-2">
        <label htmlFor="downPayment" className="block text-sm font-medium text-gray-700">Down Payment</label>
        <input type="number" id="downPayment" name="downPayment" onChange={onFormChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md" />
      </div>
      <div className="mt-2">
        <label htmlFor="monthlyRent" className="block text-sm font-medium text-gray-700">Monthly Rent</label>
        <input type="number" id="monthlyRent" name="monthlyRent" onChange={onFormChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md" />
      </div>
      <div className="mt-2">
        <label htmlFor="monthlyExpenses" className="block text-sm font-medium text-gray-700">Monthly Expenses</label>
        <input type="number" id="monthlyExpenses" name="monthlyExpenses" onChange={onFormChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md" />
      </div>
    </form>
  );
}
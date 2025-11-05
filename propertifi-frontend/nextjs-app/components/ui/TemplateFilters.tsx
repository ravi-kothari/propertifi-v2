export default function TemplateFilters({ onStateChange }) {
  const states = ['All', 'California', 'Texas', 'Florida']; // Hardcoded for now

  return (
    <div className="mr-4">
      <h3 className="font-semibold">Filters</h3>
      <div className="mt-2">
        <label htmlFor="state-filter" className="block text-sm font-medium text-gray-700">State</label>
        <select
          id="state-filter"
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          onChange={(e) => onStateChange(e.target.value)}
        >
          {states.map(state => (
            <option key={state} value={state}>{state}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
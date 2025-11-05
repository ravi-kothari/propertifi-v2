
export function LeadFilters() {
  return (
    <div className="flex space-x-4 mb-4">
      <input type="text" placeholder="Search leads..." className="border p-2 rounded" />
      <select className="border p-2 rounded">
        <option>All Statuses</option>
        <option>New</option>
        <option>Viewed</option>
        <option>Responded</option>
      </select>
    </div>
  );
}

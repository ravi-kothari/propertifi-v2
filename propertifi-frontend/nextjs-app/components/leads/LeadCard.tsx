import { Lead } from '@/types/leads';

interface LeadCardProps {
  lead: Lead;
  onClick: () => void;
}

export function LeadCard({ lead, onClick }: LeadCardProps) {
  const statusColors = {
    new: 'bg-green-100 text-green-700',
    viewed: 'bg-blue-100 text-blue-700',
    contacted: 'bg-purple-100 text-purple-700',
    qualified: 'bg-yellow-100 text-yellow-700',
    closed: 'bg-gray-100 text-gray-700',
    archived: 'bg-gray-100 text-gray-700',
  };

  return (
    <div
      onClick={onClick}
      className="block cursor-pointer rounded-lg bg-white p-4 shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all"
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-base font-semibold text-gray-900">{lead.property_type}</h3>
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusColors[lead.status]}`}>
          {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
        </span>
      </div>
      <p className="text-sm text-gray-600">{lead.street_address}</p>
      <p className="text-sm text-gray-500">{lead.city}, {lead.state} {lead.zip_code}</p>

      {lead.number_of_units && (
        <p className="mt-2 text-xs text-gray-500">
          {lead.number_of_units} {lead.number_of_units === 1 ? 'unit' : 'units'}
        </p>
      )}

      <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
        <span>{lead.full_name}</span>
        <span>{new Date(lead.created_at).toLocaleDateString()}</span>
      </div>
    </div>
  );
}

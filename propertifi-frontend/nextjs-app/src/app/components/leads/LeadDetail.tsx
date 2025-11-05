
import React, { useEffect } from 'react';
import ResponseForm from './ResponseForm';
import ResponseHistory from './ResponseHistory';
import { useTrackView } from '@/app/hooks/useTrackView';
import { useAuth } from '@/app/hooks/useAuth';

interface LeadDetailProps {
  lead: any; // Replace with a proper lead type
  onClose: () => void;
}

const LeadDetail: React.FC<LeadDetailProps> = ({ lead, onClose }) => {
  const { user } = useAuth();
  const trackViewMutation = useTrackView();

  useEffect(() => {
    if (lead) {
      // @ts-ignore
      trackViewMutation.mutate({ pmId: user.id, leadId: lead.id });
    }
  }, [lead]);

  if (!lead) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg w-1/2">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{lead.property_address}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">&times;</button>
        </div>
        <p><strong>Status:</strong> {lead.status}</p>
        <p><strong>Client Name:</strong> {lead.client_name}</p>
        <p><strong>Client Email:</strong> {lead.client_email}</p>
        <hr className="my-4" />
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-2">Respond to Lead</h3>
            <ResponseForm leadId={lead.id} />
          </div>
          <div>
            <ResponseHistory leadId={lead.id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDetail;

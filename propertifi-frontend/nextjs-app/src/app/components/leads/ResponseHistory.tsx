
'use client';

import React from 'react';
import { useLeadResponses } from '@/app/hooks/useLeadResponses';

const ResponseHistory = ({ leadId }: { leadId: string }) => {
  const { data: responses, isLoading, isError } = useLeadResponses(leadId);

  if (isLoading) return <div>Loading response history...</div>;
  if (isError) return <div>Error loading response history.</div>;

  return (
    <div>
      <h3 className="text-xl font-semibold mb-2">Response History</h3>
      <div className="space-y-4">
        {responses && responses.map((response: any) => (
          <div key={response.id} className="bg-gray-100 p-4 rounded-lg">
            <p className="font-semibold">{response.response_type}</p>
            <p>{response.message}</p>
            <p className="text-sm text-gray-500">{new Date(response.created_at).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResponseHistory;

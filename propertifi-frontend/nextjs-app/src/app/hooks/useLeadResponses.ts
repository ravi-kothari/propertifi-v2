
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/app/lib/api';

const fetchLeadResponses = async (leadId: string) => {
  const { data } = await apiClient.get(`/leads/${leadId}/responses`);
  return data;
};

export const useLeadResponses = (leadId: string) => {
  return useQuery({
    queryKey: ['leadResponses', leadId],
    queryFn: () => fetchLeadResponses(leadId),
    enabled: !!leadId,
  });
};

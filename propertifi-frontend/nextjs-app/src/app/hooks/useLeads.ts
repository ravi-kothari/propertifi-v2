
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';

const fetchLeads = async (pmId: string) => {
  const { data } = await apiClient.get(`/property-managers/${pmId}/leads`);
  return data;
};

export const useLeads = (pmId: string) => {
  return useQuery({
    queryKey: ['leads', pmId],
    queryFn: () => fetchLeads(pmId),
  });
};


import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/app/lib/api';

const trackView = async ({ pmId, leadId }: { pmId: string; leadId: string }) => {
  const { data } = await apiClient.post(`/property-managers/${pmId}/leads/${leadId}/view`);
  return data;
};

export const useTrackView = () => {
  return useMutation({ mutationFn: trackView });
};


import { useMutation } from '@tanstack/react-query';
import { apiClient, queryClient } from '@/app/lib/api';

const submitResponse = async (responseData: any) => {
  const { data } = await apiClient.post('/responses', responseData);
  return data;
};

export const useLeadResponse = () => {
  return useMutation({
    mutationFn: submitResponse,
    onSuccess: () => {
      // Invalidate leads query to refetch
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      // Show success toast
    },
    onError: () => {
      // Show error toast
    },
  });
};

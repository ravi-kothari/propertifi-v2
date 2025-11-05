
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/app/lib/api';

const fetchTemplates = async () => {
  const { data } = await apiClient.get('/templates');
  return data;
};

export const useTemplates = () => {
  return useQuery({
    queryKey: ['templates'],
    queryFn: fetchTemplates,
  });
};

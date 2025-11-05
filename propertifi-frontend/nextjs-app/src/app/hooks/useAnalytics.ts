
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/app/lib/api';

const fetchAnalyticsDashboard = async (pmId: string) => {
  const { data } = await apiClient.get(`/analytics/dashboard?pmId=${pmId}`);
  return data;
};

const fetchConversionFunnel = async (pmId: string) => {
  const { data } = await apiClient.get(`/analytics/funnel?pmId=${pmId}`);
  return data;
};

const fetchTimeSeries = async (pmId: string) => {
  const { data } = await apiClient.get(`/analytics/time-series?pmId=${pmId}`);
  return data;
};

export const useAnalytics = (pmId: string) => {
  const dashboardQuery = useQuery({
    queryKey: ['analyticsDashboard', pmId],
    queryFn: () => fetchAnalyticsDashboard(pmId),
    enabled: !!pmId,
  });

  const funnelQuery = useQuery({
    queryKey: ['conversionFunnel', pmId],
    queryFn: () => fetchConversionFunnel(pmId),
    enabled: !!pmId,
  });

  const timeSeriesQuery = useQuery({
    queryKey: ['timeSeries', pmId],
    queryFn: () => fetchTimeSeries(pmId),
    enabled: !!pmId,
  });

  return {
    dashboardQuery,
    funnelQuery,
    timeSeriesQuery,
  };
};

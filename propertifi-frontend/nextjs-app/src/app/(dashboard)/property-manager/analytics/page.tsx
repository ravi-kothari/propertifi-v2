
'use client';

import React from 'react';
import { useAuth } from '@/app/hooks/useAuth';
import { useAnalytics } from '@/app/hooks/useAnalytics';
import MetricsCard from '@/app/components/analytics/MetricsCard';
import ConversionFunnel from '@/app/components/analytics/ConversionFunnel';
import ResponseRateChart from '@/app/components/analytics/ResponseRateChart';
import { LoadingSpinner } from '@/app/components/ui/LoadingSpinner';

const AnalyticsPage = () => {
  const { user } = useAuth();
  // @ts-ignore
  const { dashboardQuery, funnelQuery, timeSeriesQuery } = useAnalytics(user.id);

  if (dashboardQuery.isLoading || funnelQuery.isLoading || timeSeriesQuery.isLoading) return <LoadingSpinner />;
  if (dashboardQuery.isError || funnelQuery.isError || timeSeriesQuery.isError) return <div>Error loading analytics.</div>;

  const chartData = {
    labels: timeSeriesQuery.data?.labels || [],
    datasets: [
      {
        label: 'Response Rate',
        data: timeSeriesQuery.data?.response_rate || [],
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Analytics Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <MetricsCard title="Total Leads" value={dashboardQuery.data?.total_leads} />
        <MetricsCard title="Response Rate" value={`${dashboardQuery.data?.response_rate}%`} />
        <MetricsCard title="Average Response Time" value={`${dashboardQuery.data?.avg_response_time} hours`} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ConversionFunnel data={funnelQuery.data} />
        <div className="bg-white shadow-lg rounded-lg p-6">
          <ResponseRateChart data={chartData} />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;

'use client';

import { useState, useEffect } from 'react';
import MetricsCard from '@/components/ui/MetricsCard';

// Note: metadata export is not supported in client components
// Move metadata to layout.tsx if needed

export default function AnalyticsPage() {
  const [stats, setStats] = useState({
    totalLeads: 1234,
    conversionRate: 12.5,
    avgResponseTime: 2.3,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prevStats => ({
        totalLeads: prevStats.totalLeads + Math.floor(Math.random() * 5),
        conversionRate: prevStats.conversionRate + (Math.random() - 0.5) * 0.1,
        avgResponseTime: prevStats.avgResponseTime + (Math.random() - 0.5) * 0.05,
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Analytics Dashboard</h1>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <MetricsCard
            title="Total Leads"
            value={stats.totalLeads}
            comparisonValue={1100}
            comparisonText="vs. previous 30 days"
          />
          <MetricsCard
            title="Conversion Rate"
            value={stats.conversionRate}
            comparisonValue={10.2}
            comparisonText="vs. previous 30 days"
          />
          <MetricsCard
            title="Average Response Time"
            value={stats.avgResponseTime}
            comparisonValue={3.1}
            comparisonText="vs. previous 30 days"
          />
        </div>
      </div>
    </div>
  );
}
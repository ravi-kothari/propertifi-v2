'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useAnalyticsDashboard } from '@/hooks/useAnalytics';
import StatCard, { StatCardSkeleton } from './StatCard';
import LineChart, { LineChartSkeleton } from './LineChart';
import BarChart, { BarChartSkeleton } from './BarChart';
import DonutChart, { DonutChartSkeleton } from './DonutChart';
import type { AnalyticsFilters } from '@/types/analytics';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Download, TrendingUp, TrendingDown, Target, Clock, Users, DollarSign } from 'lucide-react';

export default function AnalyticsDashboard() {
  const params = useParams();
  const pmId = params?.id as string;

  const [filters, setFilters] = useState<AnalyticsFilters>({
    date_range: 'month',
  });

  const { data: analytics, isLoading, error } = useAnalyticsDashboard(pmId, filters);

  // Handle date range change
  const handleDateRangeChange = (range: AnalyticsFilters['date_range']) => {
    setFilters({ ...filters, date_range: range });
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          Failed to load analytics data. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics & Reports</h1>
          <p className="text-sm text-gray-600 mt-1">
            Track performance metrics and gain insights into your property management business
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={filters.date_range} onValueChange={(value) => handleDateRangeChange(value as AnalyticsFilters['date_range'])}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last 7 Days</SelectItem>
              <SelectItem value="month">Last 30 Days</SelectItem>
              <SelectItem value="quarter">Last 90 Days</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics - Top Row */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
      ) : analytics ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Leads"
            value={analytics.lead_metrics.total_leads}
            subtitle={`${analytics.lead_metrics.new_leads} new this period`}
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
            color="blue"
          />

          <StatCard
            title="Conversion Rate"
            value={`${analytics.lead_metrics.conversion_rate.toFixed(1)}%`}
            subtitle="Lead to close ratio"
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            }
            trend={{
              value: Math.abs(analytics.performance_metrics.week_over_week_change),
              label: 'vs last week',
              direction: analytics.performance_metrics.week_over_week_change > 0 ? 'up' : analytics.performance_metrics.week_over_week_change < 0 ? 'down' : 'neutral'
            }}
            color="green"
          />

          <StatCard
            title="Avg Response Time"
            value={`${analytics.lead_metrics.average_response_time.toFixed(1)}h`}
            subtitle="Time to first response"
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            color="purple"
          />

          <StatCard
            title="Total Responses"
            value={analytics.response_metrics.total_responses}
            subtitle={`${analytics.response_metrics.response_rate.toFixed(1)}% response rate`}
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            }
            color="yellow"
          />
        </div>
      ) : null}

      {/* Charts - Middle Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leads Over Time */}
        {isLoading ? (
          <LineChartSkeleton height={300} />
        ) : analytics?.leads_over_time ? (
          <LineChart
            data={analytics.leads_over_time}
            title="Leads Over Time"
            height={300}
            color="#4F46E5"
          />
        ) : null}

        {/* Leads by Status */}
        {isLoading ? (
          <BarChartSkeleton height={300} />
        ) : analytics?.leads_by_status ? (
          <BarChart
            data={analytics.leads_by_status.map(item => ({
              label: item.status,
              value: item.count
            }))}
            title="Leads by Status"
            height={300}
          />
        ) : null}
      </div>

      {/* Bottom Row Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leads by Source */}
        {isLoading ? (
          <DonutChartSkeleton size={300} />
        ) : analytics?.leads_by_source ? (
          <DonutChart
            data={analytics.leads_by_source.map(item => ({
              label: item.source,
              value: item.count,
              percentage: item.percentage
            }))}
            title="Leads by Source"
            size={300}
          />
        ) : null}

        {/* Response Breakdown */}
        {isLoading ? (
          <DonutChartSkeleton size={300} />
        ) : analytics?.response_metrics ? (
          <DonutChart
            data={[
              { label: 'Contact Info', value: analytics.response_metrics.contact_info_responses, percentage: (analytics.response_metrics.contact_info_responses / analytics.response_metrics.total_responses) * 100 },
              { label: 'Availability', value: analytics.response_metrics.availability_responses, percentage: (analytics.response_metrics.availability_responses / analytics.response_metrics.total_responses) * 100 },
              { label: 'Price Quote', value: analytics.response_metrics.price_quote_responses, percentage: (analytics.response_metrics.price_quote_responses / analytics.response_metrics.total_responses) * 100 },
              { label: 'Declined', value: analytics.response_metrics.decline_responses, percentage: (analytics.response_metrics.decline_responses / analytics.response_metrics.total_responses) * 100 },
            ].filter(item => item.value > 0)}
            title="Responses by Type"
            size={300}
          />
        ) : null}
      </div>

      {/* Additional Stats - Bottom Section */}
      {!isLoading && analytics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Qualified Leads"
            value={analytics.lead_metrics.qualified_leads}
            subtitle={`${((analytics.lead_metrics.qualified_leads / analytics.lead_metrics.total_leads) * 100).toFixed(1)}% of total`}
            color="green"
          />

          <StatCard
            title="Closed Leads"
            value={analytics.lead_metrics.closed_leads}
            subtitle={`${analytics.lead_metrics.archived_leads} archived`}
            color="blue"
          />

          <StatCard
            title="Overall Response Rate"
            value={`${analytics.response_metrics.response_rate.toFixed(1)}%`}
            subtitle="Of all leads received"
            color="purple"
          />
        </div>
      )}

      {/* AI-Powered Insights */}
      {!isLoading && analytics && (
        <Card>
          <CardHeader>
            <CardTitle>AI-Powered Insights</CardTitle>
            <CardDescription>Recommendations based on your performance data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.lead_metrics.conversion_rate > 30 && (
                <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Strong Conversion Performance</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Your conversion rate of {analytics.lead_metrics.conversion_rate.toFixed(1)}% is above industry average.
                      Keep maintaining your current response strategies.
                    </p>
                  </div>
                </div>
              )}

              {analytics.lead_metrics.average_response_time > 3 && (
                <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Clock className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Response Time Opportunity</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Your average response time of {analytics.lead_metrics.average_response_time.toFixed(1)} hours could be improved.
                      Faster responses typically lead to {((1 - analytics.lead_metrics.average_response_time / 10) * 20).toFixed(0)}% higher conversion rates.
                    </p>
                  </div>
                </div>
              )}

              {analytics.lead_metrics.new_leads > 0 && (
                <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Lead Volume Trending</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      You've received {analytics.lead_metrics.new_leads} new leads this period.
                      {analytics.performance_metrics.week_over_week_change > 0
                        ? ' This represents positive growth - consider scaling your marketing efforts.'
                        : ' Focus on lead quality and conversion optimization.'}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Target className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Engagement Optimization</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    With a {analytics.response_metrics.response_rate.toFixed(1)}% response rate,
                    there's opportunity to engage with {(100 - analytics.response_metrics.response_rate).toFixed(1)}% more leads.
                    Consider implementing automated follow-up sequences.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Performance Summary Table */}
      {!isLoading && analytics && (
        <Card>
          <CardHeader>
            <CardTitle>Performance Summary</CardTitle>
            <CardDescription>Detailed breakdown of key metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Metric</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">Value</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">Trend</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr className="hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">Total Leads</td>
                    <td className="py-3 px-4 text-sm text-right text-gray-700">{analytics.lead_metrics.total_leads}</td>
                    <td className="py-3 px-4 text-sm text-right">
                      <span className={`inline-flex items-center gap-1 ${analytics.performance_metrics.week_over_week_change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {analytics.performance_metrics.week_over_week_change > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        {analytics.performance_metrics.week_over_week_change > 0 ? 'up' : 'down'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-right">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Active
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">Conversion Rate</td>
                    <td className="py-3 px-4 text-sm text-right text-gray-700">{analytics.lead_metrics.conversion_rate.toFixed(1)}%</td>
                    <td className="py-3 px-4 text-sm text-right">
                      <span className="inline-flex items-center gap-1 text-gray-500">
                        <span className="text-xs">-</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-right">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        analytics.lead_metrics.conversion_rate >= 30 ? 'bg-green-100 text-green-800' :
                        analytics.lead_metrics.conversion_rate >= 20 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {analytics.lead_metrics.conversion_rate >= 30 ? 'Excellent' :
                         analytics.lead_metrics.conversion_rate >= 20 ? 'Good' : 'Needs Improvement'}
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">Avg Response Time</td>
                    <td className="py-3 px-4 text-sm text-right text-gray-700">{analytics.lead_metrics.average_response_time.toFixed(1)}h</td>
                    <td className="py-3 px-4 text-sm text-right">
                      <span className="inline-flex items-center gap-1 text-gray-500">
                        <span className="text-xs">-</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-right">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        analytics.lead_metrics.average_response_time <= 2 ? 'bg-green-100 text-green-800' :
                        analytics.lead_metrics.average_response_time <= 4 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {analytics.lead_metrics.average_response_time <= 2 ? 'Excellent' :
                         analytics.lead_metrics.average_response_time <= 4 ? 'Good' : 'Slow'}
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">Response Rate</td>
                    <td className="py-3 px-4 text-sm text-right text-gray-700">{analytics.response_metrics.response_rate.toFixed(1)}%</td>
                    <td className="py-3 px-4 text-sm text-right">
                      <span className="inline-flex items-center gap-1 text-gray-600">
                        Stable
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-right">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        analytics.response_metrics.response_rate >= 80 ? 'bg-green-100 text-green-800' :
                        analytics.response_metrics.response_rate >= 60 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {analytics.response_metrics.response_rate >= 80 ? 'Excellent' :
                         analytics.response_metrics.response_rate >= 60 ? 'Good' : 'Low'}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

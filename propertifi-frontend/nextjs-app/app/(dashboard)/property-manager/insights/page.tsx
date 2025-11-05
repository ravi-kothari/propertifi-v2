'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, TrendingUp, TrendingDown, Target, Zap, MapPin, Building, Award, AlertCircle } from 'lucide-react';

interface MarketInsights {
  period: string;
  propertyTypeTrends: Record<string, number>;
  hotZipCodes: Record<string, { count: number; avg_units: number }>;
  avgScoresByType: Record<string, { count: number; avg_score: number }>;
  yourPerformance: {
    leads_received: number;
    leads_won: number;
    conversion_rate: number;
    avg_response_time_minutes: number;
  };
  marketComparison: {
    your_conversion_rate: number;
    market_avg_conversion_rate: number;
    your_response_time: number;
    market_avg_response_time: number;
  };
  insights: Array<{
    type: string;
    title: string;
    message: string;
  }>;
}

async function fetchMarketInsights(): Promise<MarketInsights> {
  const response = await fetch('/api/v1/market-insights', {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch market insights');
  }

  return response.json();
}

export default function MarketInsightsPage() {
  const { data: insights, isLoading, error } = useQuery<MarketInsights>({
    queryKey: ['market-insights'],
    queryFn: fetchMarketInsights,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Failed to load market insights. Please try again.</p>
      </div>
    );
  }

  if (!insights) return null;

  const {
    yourPerformance,
    marketComparison,
    propertyTypeTrends,
    hotZipCodes,
    avgScoresByType,
    insights: actionableInsights,
  } = insights;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Market Insights</h1>
        <p className="text-gray-600 mt-2">
          AI-powered analytics and market trends for {insights.period.toLowerCase()}
        </p>
      </div>

      {/* Actionable Insights */}
      {actionableInsights && actionableInsights.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {actionableInsights.map((insight, index) => {
            const Icon = insight.type === 'positive' ? Award :
                        insight.type === 'improvement' ? AlertCircle :
                        Target;

            const colorClass = insight.type === 'positive' ? 'bg-green-50 border-green-200' :
                              insight.type === 'improvement' ? 'bg-yellow-50 border-yellow-200' :
                              'bg-blue-50 border-blue-200';

            const iconClass = insight.type === 'positive' ? 'text-green-600' :
                             insight.type === 'improvement' ? 'text-yellow-600' :
                             'text-blue-600';

            return (
              <Card key={index} className={`${colorClass} border-2`}>
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-3">
                    <Icon className={`h-6 w-6 ${iconClass} mt-1`} />
                    <div>
                      <h3 className="font-semibold text-sm">{insight.title}</h3>
                      <p className="text-sm text-gray-700 mt-1">{insight.message}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Performance Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Leads Received</CardDescription>
            <CardTitle className="text-3xl">{yourPerformance.leads_received}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Conversion Rate</CardDescription>
            <CardTitle className="text-3xl flex items-center gap-2">
              {yourPerformance.conversion_rate}%
              {marketComparison.your_conversion_rate > marketComparison.market_avg_conversion_rate ? (
                <TrendingUp className="h-6 w-6 text-green-600" />
              ) : (
                <TrendingDown className="h-6 w-6 text-red-600" />
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Market avg: {marketComparison.market_avg_conversion_rate}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Avg Response Time</CardDescription>
            <CardTitle className="text-3xl flex items-center gap-2">
              {Math.round(yourPerformance.avg_response_time_minutes)}m
              {marketComparison.your_response_time < marketComparison.market_avg_response_time ? (
                <Zap className="h-6 w-6 text-green-600" />
              ) : null}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Market avg: {marketComparison.market_avg_response_time}m
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Leads Won</CardDescription>
            <CardTitle className="text-3xl text-green-600">
              {yourPerformance.leads_won}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">Closed deals</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Property Type Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5 text-indigo-600" />
              Trending Property Types
            </CardTitle>
            <CardDescription>Most common property types in the market</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(propertyTypeTrends).map(([type, count]) => {
              const avgScore = avgScoresByType[type]?.avg_score || 0;
              return (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-32">
                      <span className="text-sm font-medium capitalize">{type.replace('_', ' ')}</span>
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-indigo-600 h-2 rounded-full"
                        style={{
                          width: `${(count / Math.max(...Object.values(propertyTypeTrends))) * 100}%`
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Badge variant={avgScore >= 70 ? 'default' : 'secondary'}>
                      {avgScore}% match
                    </Badge>
                    <span className="text-sm text-gray-600">{count} leads</span>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Hot ZIP Codes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-red-600" />
              Hot Service Areas
            </CardTitle>
            <CardDescription>Most active ZIP codes in your service area</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(hotZipCodes).length > 0 ? (
              Object.entries(hotZipCodes).map(([zip, data]) => (
                <div key={zip} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-lg">{zip}</p>
                    <p className="text-sm text-gray-600">
                      Avg {Math.round(data.avg_units)} units
                    </p>
                  </div>
                  <Badge className="bg-red-100 text-red-700 border-red-200">
                    🔥 {data.count} leads
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">
                No activity in your service area yet
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* AI Recommendations */}
      <Card className="border-2 border-indigo-200 bg-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-indigo-600" />
            AI Recommendations
          </CardTitle>
          <CardDescription>Data-driven suggestions to improve your performance</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-indigo-600 mt-1">•</span>
              <span className="text-sm">
                Enable email notifications for instant lead alerts and faster response times
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-600 mt-1">•</span>
              <span className="text-sm">
                Focus on {Object.entries(avgScoresByType).sort((a, b) => b[1].avg_score - a[1].avg_score)[0]?.[0] || 'high-scoring'} properties for better matches
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-600 mt-1">•</span>
              <span className="text-sm">
                Consider expanding your service area to include more active ZIP codes
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-600 mt-1">•</span>
              <span className="text-sm">
                Upgrade to Premium tier for 24-hour exclusivity on new leads
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

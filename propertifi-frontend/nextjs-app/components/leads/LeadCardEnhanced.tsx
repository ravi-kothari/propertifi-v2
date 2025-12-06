import { Lead, LeadWithAssignment } from '@/types/leads';
import { Zap, TrendingUp, Star, CheckCircle, MapPin, Target } from 'lucide-react';

interface LeadScore {
  score: number;
  tier: string;
  badge: {
    text: string;
    color: string;
    priority: string;
  };
  reasons?: string[];
}

interface LeadCardEnhancedProps {
  lead: Lead | LeadWithAssignment;
  onClick: () => void;
  score?: LeadScore;
  isLoading?: boolean;
}

export function LeadCardEnhanced({ lead, onClick, score, isLoading }: LeadCardEnhancedProps) {
  // Type guard to check if lead has assignment data
  const hasAssignmentData = (lead: Lead | LeadWithAssignment): lead is LeadWithAssignment => {
    return 'match_score' in lead;
  };

  const statusColors: Record<string, string> = {
    new: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    viewed: 'bg-blue-100 text-blue-700',
    contacted: 'bg-purple-100 text-purple-700',
    responded: 'bg-indigo-100 text-indigo-700',
    qualified: 'bg-emerald-100 text-emerald-700',
    completed: 'bg-teal-100 text-teal-700',
    closed: 'bg-gray-100 text-gray-700',
    archived: 'bg-gray-100 text-gray-700',
  };

  // Get status color with fallback
  const getStatusColor = (status: string | undefined) => {
    if (!status) return 'bg-gray-100 text-gray-600';
    return statusColors[status] || 'bg-gray-100 text-gray-600';
  };

  // Get match score color
  const getMatchScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-blue-600 bg-blue-50';
    if (score >= 40) return 'text-yellow-600 bg-yellow-50';
    return 'text-gray-600 bg-gray-50';
  };

  // Score tier colors
  const getScoreBadgeStyles = (tier: string) => {
    switch (tier) {
      case 'excellent':
        return 'bg-gradient-to-r from-red-500 to-orange-500 text-white border-none';
      case 'good':
        return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white border-none';
      case 'fair':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-300';
    }
  };

  const getScoreIcon = (tier: string) => {
    switch (tier) {
      case 'excellent':
        return <Zap className="h-3 w-3" />;
      case 'good':
        return <Star className="h-3 w-3" />;
      case 'fair':
        return <TrendingUp className="h-3 w-3" />;
      default:
        return <CheckCircle className="h-3 w-3" />;
    }
  };

  return (
    <div
      onClick={onClick}
      className="block cursor-pointer rounded-lg bg-white p-4 shadow-sm border border-gray-200 hover:shadow-md hover:border-indigo-300 transition-all relative overflow-hidden"
    >
      {/* AI Score Badge - Top Right */}
      {score && (
        <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
          <div
            className={`
              inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold
              shadow-sm border
              ${getScoreBadgeStyles(score.tier)}
            `}
          >
            {getScoreIcon(score.tier)}
            <span>{score.badge.text}</span>
          </div>

          {/* Score Number */}
          <div className="flex items-center gap-1 bg-white px-2 py-0.5 rounded-full shadow-sm border border-gray-200">
            <span className="text-xs font-semibold text-gray-700">{score.score}</span>
            <span className="text-xs text-gray-500">/100</span>
          </div>
        </div>
      )}

      {/* Only show loading state briefly - don't show gray placeholder if no score exists */}

      {/* Content */}
      <div className="flex justify-between items-start mb-2 pr-24">
        <h3 className="text-base font-semibold text-gray-900 capitalize">
          {lead.property_type?.replace('_', ' ')}
        </h3>
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
          {lead.status ? lead.status.charAt(0).toUpperCase() + lead.status.slice(1) : 'Unknown'}
        </span>
      </div>

      <p className="text-sm text-gray-600">{lead.street_address}</p>
      <p className="text-sm text-gray-500">{lead.city}, {lead.state} {lead.zip_code}</p>

      <div className="mt-2 flex flex-wrap items-center gap-2">
        {lead.number_of_units && (
          <div className="inline-flex items-center gap-1 text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">
            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span>{lead.number_of_units} {lead.number_of_units === 1 ? 'unit' : 'units'}</span>
          </div>
        )}

        {/* Match Score - Only for LeadWithAssignment */}
        {hasAssignmentData(lead) && (
          <div className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded ${getMatchScoreColor(lead.match_score)}`}>
            <Target className="h-3 w-3" />
            <span>{Math.round(lead.match_score)}% Match</span>
          </div>
        )}

        {/* Distance - Only for LeadWithAssignment */}
        {hasAssignmentData(lead) && lead.distance_miles !== null && (
          <div className="inline-flex items-center gap-1 text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">
            <MapPin className="h-3 w-3" />
            <span>{lead.distance_miles.toFixed(1)} mi away</span>
          </div>
        )}
      </div>

      {/* AI Reasons (if high score) */}
      {score && score.score >= 70 && score.reasons && score.reasons.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs font-medium text-gray-700 mb-1">Why this is a great match:</p>
          <ul className="text-xs text-gray-600 space-y-0.5">
            {score.reasons.slice(0, 2).map((reason, index) => (
              <li key={index} className="flex items-start gap-1">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
        <span className="font-medium">{lead.full_name}</span>
        <span>{new Date(lead.created_at).toLocaleDateString()}</span>
      </div>

      {/* Priority Indicator for High-Value Leads */}
      {score && score.tier === 'excellent' && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500"></div>
      )}
    </div>
  );
}

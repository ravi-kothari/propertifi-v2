'use client';

import { motion } from 'framer-motion';
import { format } from 'date-fns';
import {
  MapPinIcon,
  HomeIcon,
  CalendarIcon,
  UserGroupIcon,
  EyeIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';
import { Lead, LeadStatus, PropertyType } from '@/types/owner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface LeadCardProps {
  lead: Lead;
  onViewDetails?: (lead: Lead) => void;
}

const statusColors: Record<LeadStatus, string> = {
  new: 'bg-blue-100 text-blue-700 border-blue-200',
  matched: 'bg-green-100 text-green-700 border-green-200',
  contacted: 'bg-purple-100 text-purple-700 border-purple-200',
  closed: 'bg-gray-100 text-gray-700 border-gray-200',
};

const statusLabels: Record<LeadStatus, string> = {
  new: 'New',
  matched: 'Matched',
  contacted: 'Contacted',
  closed: 'Closed',
};

const propertyTypeLabels: Record<PropertyType, string> = {
  single_family: 'Single Family',
  multi_family: 'Multi Family',
  apartment: 'Apartment',
  condo: 'Condo',
  townhouse: 'Townhouse',
  commercial: 'Commercial',
};

export function LeadCard({ lead, onViewDetails }: LeadCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-shadow duration-200"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Badge className={statusColors[lead.status]}>
              {statusLabels[lead.status]}
            </Badge>
            <span className="text-xs text-gray-500">
              #{lead.confirmation_number}
            </span>
          </div>
          <h3 className="font-semibold text-lg text-gray-900 mb-1">
            {lead.property_address}
          </h3>
          <div className="flex items-center text-sm text-gray-600">
            <MapPinIcon className="h-4 w-4 mr-1" />
            {lead.property_city}, {lead.property_state} {lead.property_zip}
          </div>
        </div>
      </div>

      {/* Property Details */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <HomeIcon className="h-4 w-4 mr-2 text-gray-400" />
          <span>{propertyTypeLabels[lead.property_type]}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <UserGroupIcon className="h-4 w-4 mr-2 text-gray-400" />
          <span>{lead.matched_managers_count} Matches</span>
        </div>
        {typeof lead.views_count !== 'undefined' && (
          <div className="flex items-center text-sm text-gray-600">
            <EyeIcon className="h-4 w-4 mr-2 text-gray-400" />
            <span>{lead.views_count} Views</span>
          </div>
        )}
        {typeof lead.responses_count !== 'undefined' && (
          <div className="flex items-center text-sm text-gray-600">
            <ChatBubbleLeftRightIcon className="h-4 w-4 mr-2 text-gray-400" />
            <span>{lead.responses_count} Responses</span>
          </div>
        )}
      </div>

      {/* Property Stats */}
      {(lead.bedrooms || lead.bathrooms || lead.square_footage) && (
        <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
          {lead.bedrooms && <span>{lead.bedrooms} bd</span>}
          {lead.bathrooms && <span>{lead.bathrooms} ba</span>}
          {lead.square_footage && <span>{lead.square_footage.toLocaleString()} sq ft</span>}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center text-xs text-gray-500">
          <CalendarIcon className="h-4 w-4 mr-1" />
          {format(new Date(lead.created_at), 'MMM dd, yyyy')}
        </div>
        {onViewDetails && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => onViewDetails(lead)}
          >
            View Details
          </Button>
        )}
      </div>
    </motion.div>
  );
}

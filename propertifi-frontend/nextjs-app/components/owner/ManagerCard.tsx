'use client';

import { motion } from 'framer-motion';
import {
  EnvelopeIcon,
  PhoneIcon,
  GlobeAltIcon,
  MapPinIcon,
  StarIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { Bookmark, PropertyManager } from '@/types/owner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ManagerCardProps {
  bookmark: Bookmark;
  onRemove?: (bookmarkId: number) => void;
  onContact?: (manager: PropertyManager) => void;
}

export function ManagerCard({ bookmark, onRemove, onContact }: ManagerCardProps) {
  const { property_manager: manager } = bookmark;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-shadow duration-200"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-bold text-lg text-gray-900 mb-1">
            {manager.company_name}
          </h3>
          {manager.contact_name && (
            <p className="text-sm text-gray-600 mb-2">
              Contact: {manager.contact_name}
            </p>
          )}
          {manager.rating && (
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => {
                const filled = i < Math.floor(manager.rating || 0);
                const Icon = filled ? StarIconSolid : StarIcon;
                return (
                  <Icon
                    key={i}
                    className={`h-4 w-4 ${
                      filled ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  />
                );
              })}
              {manager.review_count && (
                <span className="text-xs text-gray-500 ml-1">
                  ({manager.review_count} reviews)
                </span>
              )}
            </div>
          )}
        </div>
        {onRemove && (
          <Button
            size="sm"
            variant="ghost"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => onRemove(bookmark.id)}
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Location */}
      {(manager.city || manager.state) && (
        <div className="flex items-center text-sm text-gray-600 mb-3">
          <MapPinIcon className="h-4 w-4 mr-2 text-gray-400" />
          {manager.city}, {manager.state}
        </div>
      )}

      {/* Services */}
      {manager.services && manager.services.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-medium text-gray-700 mb-2">Services:</p>
          <div className="flex flex-wrap gap-2">
            {manager.services.slice(0, 3).map((service, index) => (
              <Badge key={index} variant="default" className="text-xs">
                {service}
              </Badge>
            ))}
            {manager.services.length > 3 && (
              <Badge variant="default" className="text-xs">
                +{manager.services.length - 3} more
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Description */}
      {manager.description && (
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {manager.description}
        </p>
      )}

      {/* Contact Actions */}
      <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
        {manager.email && (
          <Button
            size="sm"
            variant="outline"
            className="flex-1"
            onClick={() => window.location.href = `mailto:${manager.email}`}
          >
            <EnvelopeIcon className="h-4 w-4 mr-1" />
            Email
          </Button>
        )}
        {manager.phone && (
          <Button
            size="sm"
            variant="outline"
            className="flex-1"
            onClick={() => window.location.href = `tel:${manager.phone}`}
          >
            <PhoneIcon className="h-4 w-4 mr-1" />
            Call
          </Button>
        )}
        {manager.website && (
          <Button
            size="sm"
            variant="outline"
            className="flex-1"
            onClick={() => window.open(manager.website, '_blank')}
          >
            <GlobeAltIcon className="h-4 w-4 mr-1" />
            Website
          </Button>
        )}
      </div>

      {/* Notes */}
      {bookmark.notes && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs font-medium text-gray-700 mb-1">Your Notes:</p>
          <p className="text-sm text-gray-600">{bookmark.notes}</p>
        </div>
      )}
    </motion.div>
  );
}

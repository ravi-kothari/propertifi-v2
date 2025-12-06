'use client';

import { motion } from 'framer-motion';
import { format } from 'date-fns';
import {
  ClipboardDocumentListIcon,
  BookmarkIcon,
  CalculatorIcon,
  UserGroupIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import { RecentActivity as Activity } from '@/types/owner';
import Link from 'next/link';

interface RecentActivityProps {
  activities: Activity[];
}

const activityIcons = {
  lead_created: ClipboardDocumentListIcon,
  manager_matched: UserGroupIcon,
  bookmark_added: BookmarkIcon,
  calculation_saved: CalculatorIcon,
};

const activityColors = {
  lead_created: 'bg-blue-100 text-blue-600',
  manager_matched: 'bg-green-100 text-green-600',
  bookmark_added: 'bg-purple-100 text-purple-600',
  calculation_saved: 'bg-orange-100 text-orange-600',
};

export function RecentActivity({ activities }: RecentActivityProps) {
  if (activities.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No recent activity</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {activities.map((activity, index) => {
        const Icon = activityIcons[activity.type];
        const colorClass = activityColors[activity.type];

        return (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="flex items-start gap-4 p-4 bg-white rounded-lg border border-gray-100 hover:shadow-md transition-shadow duration-200"
          >
            <div className={`p-2 rounded-lg ${colorClass} flex-shrink-0`}>
              <Icon className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 mb-1">{activity.title}</p>
              <p className="text-sm text-gray-600 mb-1">{activity.description}</p>
              <p className="text-xs text-gray-500">
                {format(new Date(activity.timestamp), 'MMM dd, yyyy h:mm a')}
              </p>
            </div>
            {activity.link && (
              <Link
                href={activity.link}
                className="flex-shrink-0 text-primary-600 hover:text-primary-700"
              >
                <ChevronRightIcon className="h-5 w-5" />
              </Link>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

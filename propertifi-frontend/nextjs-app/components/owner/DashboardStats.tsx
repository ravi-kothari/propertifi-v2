'use client';

import { motion } from 'framer-motion';
import {
  ClipboardDocumentListIcon,
  EyeIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { DashboardStats as Stats } from '@/types/owner';

interface DashboardStatsProps {
  stats: Stats;
}

const statCards = [
  {
    key: 'total_leads',
    label: 'Total Leads',
    icon: ClipboardDocumentListIcon,
    color: 'bg-blue-500',
    lightBg: 'bg-blue-50',
    lightColor: 'text-blue-600',
  },
  {
    key: 'active_leads',
    label: 'Active Leads',
    icon: CheckCircleIcon,
    color: 'bg-green-500',
    lightBg: 'bg-green-50',
    lightColor: 'text-green-600',
  },
  {
    key: 'total_views',
    label: 'Total Views',
    icon: EyeIcon,
    color: 'bg-purple-500',
    lightBg: 'bg-purple-50',
    lightColor: 'text-purple-600',
  },
  {
    key: 'total_responses',
    label: 'Manager Responses',
    icon: ChatBubbleLeftRightIcon,
    color: 'bg-orange-500',
    lightBg: 'bg-orange-50',
    lightColor: 'text-orange-600',
  },
];

export function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((card, index) => {
        const Icon = card.icon;
        const value = stats[card.key as keyof Stats] || 0;

        return (
          <motion.div
            key={card.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {card.label}
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {value}
                  </p>
                </div>
                <div className={`${card.lightBg} p-3 rounded-lg`}>
                  <Icon className={`h-6 w-6 ${card.lightColor}`} />
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

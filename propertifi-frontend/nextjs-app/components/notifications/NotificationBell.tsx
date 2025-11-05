'use client';

import { useState } from 'react';
import { Bell, X, Check, TrendingUp } from 'lucide-react';
import { useWebSocket } from '@/components/providers/WebSocketProvider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';

export function NotificationBell() {
  const { notifications, unreadCount, markAsRead, clearAll, isConnected } = useWebSocket();
  const [isOpen, setIsOpen] = useState(false);

  const getScoreBadgeColor = (tier: string) => {
    switch (tier) {
      case 'excellent':
        return 'bg-gradient-to-r from-red-500 to-orange-500 text-white';
      case 'good':
        return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white';
      case 'fair':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          title="Notifications"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-600 text-xs text-white flex items-center justify-center font-semibold">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
          {isConnected && (
            <span className="absolute -bottom-1 -right-1 h-2 w-2 rounded-full bg-green-500 border border-white" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-lg">Notifications</h3>
            {isConnected && (
              <Badge variant="secondary" className="text-xs">
                <span className="h-2 w-2 rounded-full bg-green-500 mr-1" />
                Live
              </Badge>
            )}
          </div>
          {notifications.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAll}
              className="text-xs text-gray-600 hover:text-gray-900"
            >
              Clear all
            </Button>
          )}
        </div>

        <ScrollArea className="h-[400px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Bell className="h-12 w-12 text-gray-300 mb-3" />
              <p className="text-gray-500 text-sm">No new notifications</p>
              <p className="text-gray-400 text-xs mt-1">
                You'll be notified when new leads arrive
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification, index) => (
                <div
                  key={index}
                  className="p-4 hover:bg-gray-50 transition-colors cursor-pointer relative"
                  onClick={() => {
                    markAsRead(index);
                    // Could navigate to the lead detail page here
                  }}
                >
                  {/* High-value indicator */}
                  {notification.score.tier === 'excellent' && (
                    <div className="absolute top-2 right-2">
                      <TrendingUp className="h-4 w-4 text-red-500" />
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${getScoreBadgeColor(notification.score.tier)}`}>
                      <span className="text-xs font-bold">{notification.score.score}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-gray-900 mb-1">
                        {notification.notification.title}
                      </p>
                      <p className="text-sm text-gray-600 mb-2">
                        {notification.notification.message}
                      </p>

                      {/* Lead details */}
                      <div className="space-y-1 text-xs text-gray-500">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Property Type:</span>
                          <span className="capitalize">{notification.lead.property_type.replace('_', ' ')}</span>
                        </div>
                        {notification.lead.number_of_units && (
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Units:</span>
                            <span>{notification.lead.number_of_units}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Contact:</span>
                          <span>{notification.lead.full_name}</span>
                        </div>
                      </div>

                      {/* AI Score Badge */}
                      <div className="mt-2">
                        <Badge className={`text-xs ${getScoreBadgeColor(notification.score.tier)}`}>
                          {notification.score.badge.text}
                        </Badge>
                      </div>

                      {/* Timestamp */}
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(notification.lead.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {notifications.length > 0 && (
          <div className="p-3 border-t bg-gray-50">
            <Button
              variant="link"
              size="sm"
              className="w-full text-xs text-indigo-600"
              onClick={() => {
                // Navigate to leads page
                window.location.href = '/property-manager';
              }}
            >
              View all leads →
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

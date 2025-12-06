'use client';

import { useState } from 'react';
import { Bell, X, Check, TrendingUp, MapPin, Building2, CheckCheck } from 'lucide-react';
import { useWebSocket } from '@/components/providers/WebSocketProvider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useRouter } from 'next/navigation';

export function NotificationBell() {
  const {
    notifications,
    dbNotifications,
    unreadCount,
    markAsRead,
    markDbNotificationAsRead,
    markAllDbNotificationsAsRead,
    clearAll,
    isConnected,
    refreshNotifications,
  } = useWebSocket();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

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
              <Badge variant="default" className="text-xs">
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
          {dbNotifications.length === 0 && notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Bell className="h-12 w-12 text-gray-300 mb-3" />
              <p className="text-gray-500 text-sm">No new notifications</p>
              <p className="text-gray-400 text-xs mt-1">
                You'll be notified when new leads arrive
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {/* Database notifications (persistent) */}
              {dbNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer relative ${
                    !notification.read_at ? 'bg-indigo-50/50' : ''
                  }`}
                  onClick={async () => {
                    if (!notification.read_at) {
                      await markDbNotificationAsRead(notification.id);
                    }
                    router.push(`/property-manager/leads?lead=${notification.data.lead_id}`);
                    setIsOpen(false);
                  }}
                >
                  {/* Unread indicator */}
                  {!notification.read_at && (
                    <div className="absolute top-4 right-4">
                      <span className="h-2 w-2 rounded-full bg-indigo-600 block" />
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white">
                      <span className="text-xs font-bold">{Math.round(notification.data.match_score)}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-gray-900 mb-1">
                        {notification.data.title}
                      </p>
                      <p className="text-sm text-gray-600 mb-2">
                        {notification.data.message}
                      </p>

                      {/* Lead details */}
                      <div className="space-y-1 text-xs text-gray-500">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-3 w-3" />
                          <span className="capitalize">{notification.data.property_type?.replace('_', ' ')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3 w-3" />
                          <span>{notification.data.location}</span>
                          {notification.data.distance_miles && (
                            <span className="text-gray-400">
                              ({notification.data.distance_miles.toFixed(1)} mi)
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Match Score Badge */}
                      <div className="mt-2 flex items-center gap-2">
                        <Badge className="text-xs bg-indigo-100 text-indigo-700">
                          {notification.data.match_score}% Match
                        </Badge>
                        {notification.read_at && (
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <Check className="h-3 w-3" /> Read
                          </span>
                        )}
                      </div>

                      {/* Timestamp */}
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(notification.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Real-time WebSocket notifications */}
              {notifications.map((notification, index) => (
                <div
                  key={`ws-${index}`}
                  className="p-4 hover:bg-gray-50 transition-colors cursor-pointer relative bg-green-50/50"
                  onClick={() => {
                    markAsRead(index);
                    router.push('/property-manager/leads');
                    setIsOpen(false);
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
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-sm text-gray-900">
                          {notification.notification.title}
                        </p>
                        <Badge variant="default" className="text-xs bg-green-100 text-green-700">
                          Live
                        </Badge>
                      </div>
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

        {(notifications.length > 0 || dbNotifications.length > 0) && (
          <div className="p-3 border-t bg-gray-50 space-y-2">
            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs"
                onClick={async () => {
                  await markAllDbNotificationsAsRead();
                  clearAll();
                }}
              >
                <CheckCheck className="h-3 w-3 mr-2" />
                Mark all as read
              </Button>
            )}
            <Button
              variant="link"
              size="sm"
              className="w-full text-xs text-indigo-600"
              onClick={() => {
                router.push('/property-manager/leads');
                setIsOpen(false);
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

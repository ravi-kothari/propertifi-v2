'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { initializeEcho, getEcho, disconnectEcho } from '@/lib/echo';
import { useToast } from '@/components/ui/use-toast';
import { useQueryClient } from '@tanstack/react-query';

interface LeadNotification {
  lead: {
    id: number;
    user_lead_id: number;
    property_type: string;
    street_address: string;
    city: string;
    state: string;
    zip_code: string;
    number_of_units: number;
    full_name: string;
    created_at: string;
    status: string;
  };
  score: {
    score: number;
    tier: string;
    badge: {
      text: string;
      color: string;
      priority: string;
    };
    reasons?: string[];
  };
  notification: {
    title: string;
    message: string;
    priority: string;
  };
}

interface WebSocketContextType {
  isConnected: boolean;
  notifications: LeadNotification[];
  unreadCount: number;
  markAsRead: (notificationId: number) => void;
  clearAll: () => void;
}

const WebSocketContext = createContext<WebSocketContextType>({
  isConnected: false,
  notifications: [],
  unreadCount: 0,
  markAsRead: () => {},
  clearAll: () => {},
});

export function useWebSocket() {
  return useContext(WebSocketContext);
}

interface WebSocketProviderProps {
  children: ReactNode;
  userId?: number;
}

export function WebSocketProvider({ children, userId }: WebSocketProviderProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState<LeadNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    if (!token || !userId) {
      return;
    }

    // Initialize Echo
    const echo = initializeEcho(token);

    if (!echo) {
      return;
    }

    // Listen to the private channel for this PM
    const channel = echo.private(`property-manager.${userId}`);

    channel.listen('.lead.distributed', (data: LeadNotification) => {
      console.log('Received lead notification:', data);

      // Add to notifications list
      setNotifications((prev) => [data, ...prev]);
      setUnreadCount((prev) => prev + 1);

      // Show toast notification
      const isHighValue = data.score.tier === 'excellent';
      toast({
        title: data.notification.title,
        description: (
          <div className="space-y-1">
            <p>{data.notification.message}</p>
            {data.score && (
              <p className="text-sm font-semibold">
                AI Match Score: {data.score.score}/100 - {data.score.badge.text}
              </p>
            )}
          </div>
        ),
        duration: isHighValue ? 10000 : 5000,
      });

      // Refresh lead queries to show new lead
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['lead-scores'] });

      // Play notification sound for high-value leads
      if (isHighValue && typeof window !== 'undefined') {
        try {
          const audio = new Audio('/notification.mp3');
          audio.play().catch(() => {
            // Ignore audio errors
          });
        } catch (e) {
          // Ignore
        }
      }
    });

    // Connection state listeners
    channel.subscribed(() => {
      console.log('Connected to WebSocket channel');
      setIsConnected(true);
    });

    channel.error((error: any) => {
      console.error('WebSocket channel error:', error);
      setIsConnected(false);
    });

    // Cleanup
    return () => {
      channel.stopListening('.lead.distributed');
      disconnectEcho();
      setIsConnected(false);
    };
  }, [userId, toast, queryClient]);

  const markAsRead = (notificationId: number) => {
    setNotifications((prev) =>
      prev.map((n, index) =>
        index === notificationId ? { ...n, read: true } : n
      )
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const clearAll = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  const value: WebSocketContextType = {
    isConnected,
    notifications,
    unreadCount,
    markAsRead,
    clearAll,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
}

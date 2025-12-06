/**
 * Notifications API Client
 * Handles all notification-related API calls for property managers
 */

// Use the API URL from env - backend routes already have /api prefix in routes/api.php
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/api';

export interface Notification {
  id: string;
  type: string;
  data: {
    type: string;
    lead_id: number;
    assignment_id: number;
    title: string;
    message: string;
    property_type: string;
    location: string;
    match_score: number;
    distance_miles: number | null;
  };
  read_at: string | null;
  created_at: string;
}

export interface NotificationsResponse {
  success: boolean;
  data: Notification[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    unread_count: number;
  };
}

export interface UnreadCountResponse {
  success: boolean;
  data: {
    unread_count: number;
  };
}

/**
 * Get auth headers
 */
function getAuthHeaders(): HeadersInit {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
}

/**
 * Fetch all notifications
 */
export async function getNotifications(params?: {
  page?: number;
  per_page?: number;
  unread_only?: boolean;
}): Promise<NotificationsResponse> {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', String(params.page));
  if (params?.per_page) queryParams.append('per_page', String(params.per_page));
  if (params?.unread_only) queryParams.append('unread_only', 'true');

  const url = `${API_BASE_URL}/pm/notifications${queryParams.toString() ? `?${queryParams}` : ''}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch notifications: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get unread notification count
 */
export async function getUnreadCount(): Promise<number> {
  const url = `${API_BASE_URL}/pm/notifications/unread-count`;

  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch unread count: ${response.statusText}`);
  }

  const data: UnreadCountResponse = await response.json();
  return data.data.unread_count;
}

/**
 * Mark a notification as read
 */
export async function markNotificationAsRead(id: string): Promise<void> {
  const url = `${API_BASE_URL}/pm/notifications/${id}/read`;

  const response = await fetch(url, {
    method: 'POST',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Failed to mark notification as read: ${response.statusText}`);
  }
}

/**
 * Mark all notifications as read
 */
export async function markAllNotificationsAsRead(): Promise<void> {
  const url = `${API_BASE_URL}/pm/notifications/mark-all-read`;

  const response = await fetch(url, {
    method: 'POST',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Failed to mark all notifications as read: ${response.statusText}`);
  }
}

/**
 * Delete a notification
 */
export async function deleteNotification(id: string): Promise<void> {
  const url = `${API_BASE_URL}/pm/notifications/${id}`;

  const response = await fetch(url, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Failed to delete notification: ${response.statusText}`);
  }
}

/**
 * Clear all read notifications
 */
export async function clearReadNotifications(): Promise<void> {
  const url = `${API_BASE_URL}/pm/notifications/clear-read`;

  const response = await fetch(url, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Failed to clear read notifications: ${response.statusText}`);
  }
}

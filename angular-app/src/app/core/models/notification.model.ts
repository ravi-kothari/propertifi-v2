/**
 * Represents a user notification in the system.
 *
 * Notifications are real-time messages delivered via WebSocket connections
 * and can be of various types including lead updates, system messages, etc.
 */
export interface Notification {
  /**
   * Unique identifier for the notification
   */
  id: string;

  /**
   * Type of notification - determines icon, styling, and handling logic
   */
  type: 'lead' | 'message' | 'assignment' | 'system';

  /**
   * Short title/heading for the notification
   */
  title: string;

  /**
   * Detailed notification message content
   */
  message: string;

  /**
   * Optional additional data payload specific to notification type
   * - For 'lead': contains lead details
   * - For 'assignment': contains assignment info
   * - For 'message': contains message thread data
   */
  data?: any;

  /**
   * Whether the user has read/acknowledged this notification
   */
  read: boolean;

  /**
   * ISO 8601 timestamp when notification was created
   */
  created_at: string;
}

/**
 * WebSocket event wrapper for notifications
 *
 * When notifications are broadcast via Laravel Echo/Pusher,
 * they arrive wrapped in this event structure
 */
export interface NotificationEvent {
  /**
   * The notification payload
   */
  notification: Notification;
}

import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { environment } from '../../../environments/environment';
import { Notification } from '../models/notification.model';

/**
 * Extend Window interface to include Pusher and Echo globals
 * Required for Laravel Echo integration
 */
declare global {
  interface Window {
    Pusher: any;
    Echo: any;
  }
}

/**
 * WebSocket Service for real-time communication using Laravel Echo and Pusher
 *
 * This service provides a centralized interface for managing WebSocket connections
 * and subscribing to real-time events in the application. It integrates with
 * Laravel Broadcasting on the backend via Pusher protocol.
 *
 * @example
 * ```typescript
 * // In a component or service
 * constructor(private websocket: WebSocketService) {}
 *
 * ngOnInit() {
 *   // Connect with user token
 *   this.websocket.connect(userToken);
 *
 *   // Subscribe to notifications
 *   this.websocket.subscribeToNotifications(userId)
 *     .subscribe(notification => {
 *       console.log('New notification:', notification);
 *     });
 * }
 *
 * ngOnDestroy() {
 *   this.websocket.disconnect();
 * }
 * ```
 *
 * @remarks
 * - Connection must be established before subscribing to channels
 * - The service automatically sets up Pusher as the global broadcaster
 * - All subscriptions should be properly cleaned up on component destruction
 */
@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  /**
   * Laravel Echo instance for managing WebSocket connections
   * Null when not connected
   */
  private echo: any = null;

  /**
   * Observable stream indicating connection status
   * Emits true when connected, false when disconnected
   */
  private connected$ = new BehaviorSubject<boolean>(false);

  /**
   * Subject for broadcasting incoming notifications to subscribers
   */
  private notifications$ = new Subject<Notification>();

  /**
   * Subject for broadcasting lead update events to subscribers
   */
  private leadUpdates$ = new Subject<any>();

  /**
   * Subject for broadcasting dashboard update events to subscribers
   */
  private dashboardUpdates$ = new Subject<any>();

  constructor() {}

  /**
   * Initialize Echo connection with user authentication token
   *
   * Sets up Pusher broadcaster and establishes authenticated WebSocket connection
   * to Laravel backend. If already connected, disconnects first.
   *
   * @param token - JWT authentication token for the current user
   *
   * @example
   * ```typescript
   * this.websocket.connect('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
   * ```
   *
   * @remarks
   * - Disconnects existing connection before establishing new one
   * - Sets window.Pusher and window.Echo globals
   * - Uses bearer token authentication for Laravel Broadcasting
   */
  connect(token: string): void {
    if (this.echo) {
      this.disconnect();
    }

    // Setup Pusher as global broadcaster
    window.Pusher = Pusher;

    // Initialize Echo with Pusher configuration
    this.echo = new Echo({
      broadcaster: 'pusher',
      key: environment.pusher.key,
      cluster: environment.pusher.cluster,
      wsHost: environment.pusher.wsHost,
      wsPort: environment.pusher.wsPort,
      wssPort: environment.pusher.wssPort,
      forceTLS: environment.pusher.forceTLS,
      encrypted: environment.pusher.encrypted,
      disableStats: true,
      enabledTransports: ['ws', 'wss'],
      authEndpoint: `${environment.apiUrl}/broadcasting/auth`,
      auth: {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      },
    });

    window.Echo = this.echo;
    this.connected$.next(true);
  }

  /**
   * Disconnect from WebSocket server
   *
   * Cleanly closes Echo connection and cleans up resources.
   * Sets connection status to false.
   *
   * @example
   * ```typescript
   * ngOnDestroy() {
   *   this.websocket.disconnect();
   * }
   * ```
   */
  disconnect(): void {
    if (this.echo) {
      this.echo.disconnect();
      this.echo = null;
      this.connected$.next(false);
    }
  }

  /**
   * Get observable stream of connection status
   *
   * @returns Observable that emits true when connected, false when disconnected
   *
   * @example
   * ```typescript
   * this.websocket.isConnected().subscribe(connected => {
   *   if (connected) {
   *     console.log('WebSocket connected');
   *   }
   * });
   * ```
   */
  isConnected(): Observable<boolean> {
    return this.connected$.asObservable();
  }

  /**
   * Subscribe to user-specific notifications via private channel
   *
   * Listens to Laravel's notification broadcasting on a private channel
   * scoped to the specific user ID.
   *
   * @param userId - The ID of the user to subscribe notifications for
   * @returns Observable stream of incoming notifications
   * @throws Error if Echo is not initialized
   *
   * @example
   * ```typescript
   * this.websocket.subscribeToNotifications(42)
   *   .subscribe(notification => {
   *     this.showNotification(notification);
   *   });
   * ```
   *
   * @remarks
   * Channel name format: `App.Models.User.{userId}`
   * This is Laravel's default notification channel naming
   */
  subscribeToNotifications(userId: number): Observable<Notification> {
    if (!this.echo) {
      throw new Error('Echo not initialized. Call connect() first.');
    }

    this.echo
      .private(`App.Models.User.${userId}`)
      .notification((notification: Notification) => {
        this.notifications$.next(notification);
      });

    return this.notifications$.asObservable();
  }

  /**
   * Subscribe to lead-related updates for a specific user
   *
   * Listens to lead update and assignment events on a private channel.
   *
   * @param userId - The ID of the user to subscribe lead updates for
   * @returns Observable stream of lead update events
   * @throws Error if Echo is not initialized
   *
   * @example
   * ```typescript
   * this.websocket.subscribeToLeadUpdates(42)
   *   .subscribe(event => {
   *     if (event.type === 'lead.updated') {
   *       this.refreshLead(event.lead);
   *     }
   *   });
   * ```
   *
   * @remarks
   * Listens for two event types:
   * - `.lead.updated` - When lead data is modified
   * - `.lead.assigned` - When lead is assigned to user
   */
  subscribeToLeadUpdates(userId: number): Observable<any> {
    if (!this.echo) {
      throw new Error('Echo not initialized. Call connect() first.');
    }

    this.echo
      .private(`leads.${userId}`)
      .listen('.lead.updated', (event: any) => {
        this.leadUpdates$.next(event);
      })
      .listen('.lead.assigned', (event: any) => {
        this.leadUpdates$.next(event);
      });

    return this.leadUpdates$.asObservable();
  }

  /**
   * Subscribe to dashboard analytics updates for a specific user
   *
   * Receives real-time updates when dashboard metrics change.
   *
   * @param userId - The ID of the user to subscribe dashboard updates for
   * @returns Observable stream of dashboard update events
   * @throws Error if Echo is not initialized
   *
   * @example
   * ```typescript
   * this.websocket.subscribeToDashboardUpdates(42)
   *   .subscribe(event => {
   *     this.updateDashboardMetrics(event.metrics);
   *   });
   * ```
   *
   * @remarks
   * Listens for `.dashboard.updated` events on private channel
   */
  subscribeToDashboardUpdates(userId: number): Observable<any> {
    if (!this.echo) {
      throw new Error('Echo not initialized. Call connect() first.');
    }

    this.echo
      .private(`dashboard.${userId}`)
      .listen('.dashboard.updated', (event: any) => {
        this.dashboardUpdates$.next(event);
      });

    return this.dashboardUpdates$.asObservable();
  }

  /**
   * Leave/unsubscribe from a specific channel
   *
   * Cleans up subscriptions for the specified channel to prevent memory leaks.
   *
   * @param channelName - Name of the channel to leave
   *
   * @example
   * ```typescript
   * // When leaving a component
   * ngOnDestroy() {
   *   this.websocket.leaveChannel('leads.42');
   * }
   * ```
   *
   * @remarks
   * Should be called when components are destroyed to prevent memory leaks
   */
  leaveChannel(channelName: string): void {
    if (this.echo) {
      this.echo.leave(channelName);
    }
  }

  /**
   * Join a public channel
   *
   * Public channels don't require authentication and are accessible to all users.
   *
   * @param channelName - Name of the public channel to join
   * @returns Echo channel instance for method chaining
   * @throws Error if Echo is not initialized
   *
   * @example
   * ```typescript
   * this.websocket.joinPublicChannel('announcements')
   *   .listen('.announcement', (event) => {
   *     console.log('New announcement:', event);
   *   });
   * ```
   */
  joinPublicChannel(channelName: string): any {
    if (!this.echo) {
      throw new Error('Echo not initialized. Call connect() first.');
    }
    return this.echo.channel(channelName);
  }

  /**
   * Join a private channel
   *
   * Private channels require authentication and are user-specific.
   * Laravel will verify user has access via broadcasting auth endpoint.
   *
   * @param channelName - Name of the private channel to join
   * @returns Echo channel instance for method chaining
   * @throws Error if Echo is not initialized
   *
   * @example
   * ```typescript
   * this.websocket.joinPrivateChannel('orders.42')
   *   .listen('.order.shipped', (event) => {
   *     this.notifyOrderShipped(event.order);
   *   });
   * ```
   *
   * @remarks
   * Backend must authorize channel access via broadcasting/auth endpoint
   */
  joinPrivateChannel(channelName: string): any {
    if (!this.echo) {
      throw new Error('Echo not initialized. Call connect() first.');
    }
    return this.echo.private(channelName);
  }

  /**
   * Join a presence channel
   *
   * Presence channels track which users are subscribed and provide
   * join/leave notifications. Useful for chat rooms, collaborative editing, etc.
   *
   * @param channelName - Name of the presence channel to join
   * @returns Echo channel instance for method chaining
   * @throws Error if Echo is not initialized
   *
   * @example
   * ```typescript
   * this.websocket.joinPresenceChannel('chat.room.1')
   *   .here((users) => {
   *     console.log('Currently in room:', users);
   *   })
   *   .joining((user) => {
   *     console.log('User joined:', user);
   *   })
   *   .leaving((user) => {
   *     console.log('User left:', user);
   *   });
   * ```
   *
   * @remarks
   * - Backend must implement presence channel authorization
   * - Returns list of currently present users
   * - Broadcasts join/leave events to all channel members
   */
  joinPresenceChannel(channelName: string): any {
    if (!this.echo) {
      throw new Error('Echo not initialized. Call connect() first.');
    }
    return this.echo.join(channelName);
  }
}

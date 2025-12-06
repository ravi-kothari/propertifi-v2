import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Notification } from '../models/notification.model';
import { environment } from '../../../environments/environment';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// Fix for 'Pusher is not defined' error when using laravel-echo
(window as any).Pusher = Pusher;

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private http = inject(HttpClient);
    private echo: Echo<any> | undefined;

    // Signal to hold real-time notifications
    realtimeNotifications = signal<Notification[]>([]);

    constructor() {
        this.initEcho();
    }

    private initEcho() {
        this.echo = new Echo({
            broadcaster: 'pusher',
            key: environment.pusher.key,
            cluster: environment.pusher.cluster,
            wsHost: environment.pusher.wsHost,
            wsPort: environment.pusher.wsPort,
            forceTLS: environment.pusher.forceTLS,
            disableStats: environment.pusher.disableStats,
            enabledTransports: ['ws', 'wss']
        });
    }

    listenForUserNotifications(userId: number) {
        if (!this.echo) return;

        this.echo.private(`App.Models.User.${userId}`)
            .notification((notification: any) => {
                console.log('New Notification:', notification);
                // Add new notification to the signal
                this.realtimeNotifications.update(current => [notification, ...current]);
            });
    }

    getNotifications(): Observable<Notification[]> {
        return this.http.get<Notification[]>(`/api/notifications`);
    }

    markAsRead(id: string): Observable<any> {
        return this.http.put(`/api/notifications/${id}/read`, {});
    }

    markAllAsRead(): Observable<any> {
        return this.http.put(`/api/notifications/read-all`, {});
    }
}

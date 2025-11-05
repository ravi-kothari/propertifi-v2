import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// Make Pusher available globally for Laravel Echo
if (typeof window !== 'undefined') {
  (window as any).Pusher = Pusher;
}

let echoInstance: Echo | null = null;

export function initializeEcho(token: string | null): Echo | null {
  if (typeof window === 'undefined') {
    return null; // Server-side, don't initialize
  }

  if (!token) {
    return null;
  }

  if (echoInstance) {
    return echoInstance;
  }

  const pusherKey = process.env.NEXT_PUBLIC_PUSHER_APP_KEY || 'local';
  const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER || 'mt1';
  const wsHost = process.env.NEXT_PUBLIC_WS_HOST || 'localhost';
  const wsPort = parseInt(process.env.NEXT_PUBLIC_WS_PORT || '6001');
  const forceTLS = process.env.NEXT_PUBLIC_WS_FORCE_TLS === 'true';
  const useLocalWebSocket = process.env.NEXT_PUBLIC_USE_LOCAL_WEBSOCKET === 'true';

  echoInstance = new Echo({
    broadcaster: 'pusher',
    key: pusherKey,
    cluster: pusherCluster,
    forceTLS: forceTLS,
    encrypted: !useLocalWebSocket,
    ...(useLocalWebSocket && {
      wsHost: wsHost,
      wsPort: wsPort,
      wssPort: wsPort,
      disableStats: true,
      enabledTransports: ['ws', 'wss'],
    }),
    auth: {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    },
    authEndpoint: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001/api'}/broadcasting/auth`,
  });

  return echoInstance;
}

export function getEcho(): Echo | null {
  return echoInstance;
}

export function disconnectEcho(): void {
  if (echoInstance) {
    echoInstance.disconnect();
    echoInstance = null;
  }
}

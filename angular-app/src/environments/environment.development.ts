export const environment = {
    production: false,
    apiUrl: 'http://localhost:8000',
    wsUrl: 'ws://localhost:6001',
    pusher: {
        key: 'app-key',
        cluster: 'mt1',
        wsHost: 'localhost',
        wsPort: 6001,
        wssPort: 6001,
        forceTLS: false,
        encrypted: false,
        disableStats: true,
    },
    googleMapsApiKey: 'YOUR_API_KEY_HERE'
};

import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst, StaleWhileRevalidate, CacheFirst } from 'workbox-strategies';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import CONFIG from './utils/config';

precacheAndRoute(self.__WB_MANIFEST);

registerRoute(
  ({ url }) => url.href.startsWith(CONFIG.API_BASE_URL),
  new NetworkFirst({
    cacheName: 'story-api-cache',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
    ],
  }),
);

registerRoute(
  ({ request }) => request.destination === 'image',
  new StaleWhileRevalidate({ cacheName: 'story-image-cache' }),
);

registerRoute(
  ({ url }) => url.href.includes('maptiler.com'),
  new CacheFirst({ cacheName: 'maptiler-cache' }),
);

self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push Received.');

  let data;
  try {
    data = event.data.json();
  } catch (e) {
    console.error('[Service Worker] Push event data is not valid JSON.', e);
    data = {
      title: 'Notifikasi Baru',
      options: {
        body: 'Anda memiliki pesan baru dari Story App.',
        icon: '/icons/icon-192x192.png',
      },
    };
  }
  
  const { title, options } = data;

  event.waitUntil(
    self.registration.showNotification(title, {
        ...options, 
        icon: options.icon || '/icons/icon-192x192.png', 
        badge: options.badge || '/icons/icon-72x72.png', 
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification click Received.');
  
  event.notification.close();

  event.waitUntil(
    clients.openWindow('/#/home')
  );
});
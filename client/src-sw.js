// import
import { offlineFallback, warmStrategyCache } from 'workbox-recipes';
import { CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { registerRoute } from 'workbox-routing';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { ExpirationPlugin } from 'workbox-expiration';
import { precacheAndRoute } from 'workbox-precaching';

// Precache assets generated by webpack
precacheAndRoute(self.__WB_MANIFEST);

// Create a cache-first strategy for page navigation requests
const pageCache = new CacheFirst({
  cacheName: 'page-cache',
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
    new ExpirationPlugin({
      maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
    }),
  ],
});

// Warm up the cache with the main pages
warmStrategyCache({
  urls: ['/index.html', '/'],
  strategy: pageCache,
});

// Register the route for navigation requests to use the cache-first strategy
registerRoute(({ request }) => request.mode === 'navigate', pageCache);

// Implement asset caching with a stale-while-revalidate strategy
registerRoute(
  ({ request }) => ['style', 'script', 'worker'].includes(request.destination),
  new StaleWhileRevalidate({
    cacheName: 'asset-cache',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);


// Implement offline fallback for HTML pages
offlineFallback({
  pageFallback: '/index.html',
});

// Simple service worker for caching API responses
const CACHE_NAME = 'g3-category-cache-v1';
const API_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Cache API responses
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // Only cache GET requests to Supabase API
  if (event.request.method === 'GET' && url.hostname.includes('supabase')) {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache => {
        return cache.match(event.request).then(cachedResponse => {
          if (cachedResponse) {
            const cachedTime = new Date(cachedResponse.headers.get('sw-cached-time'));
            const now = new Date();
            
            // Return cached response if it's still fresh
            if (now - cachedTime < API_CACHE_DURATION) {
              return cachedResponse;
            }
          }
          
          // Fetch fresh data
          return fetch(event.request).then(response => {
            if (response.status === 200) {
              const responseClone = response.clone();
              const headers = new Headers(responseClone.headers);
              headers.set('sw-cached-time', new Date().toISOString());
              
              const cachedResponse = new Response(responseClone.body, {
                status: responseClone.status,
                statusText: responseClone.statusText,
                headers: headers
              });
              
              cache.put(event.request, cachedResponse);
            }
            return response;
          });
        });
      })
    );
  }
});

// Clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
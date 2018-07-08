/**
 * Service Worker file.
 */
let staticCacheName = 'restaurant-cache-v1';

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(staticCacheName).then( cache => {
            return cache.addAll([
                '/',
                'css/styles.css',
                'js/dbhelper.js',
                'js/main.js',
                'js/restaurant_info.js',
                'img/',
                'data/restaurants.json',
            ]);
        })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then( cacheNames => {
            return Promise.all(
                cacheNames.filter( cacheName => {
                    return cacheName.startsWith('restaurant-') && cacheName != staticCacheName;
                }).map( cacheName => {
                    return caches.delete(cacheName);
                })    
            );
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then( response => {
            if (response) return response;
            return fetch(event.request).then( res => {
              return caches.open(staticCacheName).then( cache => {
                  cache.put(event.request.url, res.clone());   
                  return res; 
                })
            })
        })
    );
});

self.addEventListener('message', event => {
    if (event.data.action === 'skipWaiting') {
       self.skipWaiting();
    }
});
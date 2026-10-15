// Cambiamos el nombre de la caché para forzar la eliminación de la versión antigua
const CACHE_NAME = 'dieta-pwa-v2-force-update';

self.addEventListener('install', (event) => {
  self.skipWaiting(); // Obliga al Service Worker nuevo a activarse de inmediato
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          // Borra absolutamente todas las cachés anteriores (v1)
          if (cache !== CACHE_NAME) {
            console.log('Borrando caché antigua:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Estrategia Network-First: Intenta descargar de internet primero, si falla usa caché
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        return response;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});

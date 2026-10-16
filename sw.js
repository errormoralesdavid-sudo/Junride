const CACHE_NAME = 'junride-local-v45';

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './manifest.json',
  './logo.png',
  './carro.png',
  './moto.png',
  './puesto.png',
  './carga.png',
  './pasajero.png',
  './chofer.png',
  './btn-off.png',
  './btn-on.png',
  './chat.png',
  './cartera.png',
  './bdv.png',
  './zinli.png',
  './binance.png',
  './flyer-madrugada.png',
  './flyer-alerta.png',
  './nivel1.png',
  './nivel2.png',
  './nivel3.png',
  './nivel4.png',
  './nivel5.png',
  './nivel6.png'
];

// Instalación y guardado de imágenes locales en caché
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.allSettled(
        ASSETS_TO_CACHE.map((url) => cache.add(url))
      );
    })
  );
});

// Limpieza de versiones viejas de caché
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Estrategia: Red primero para archivos de código, Caché primero para imágenes locales
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Para tus imágenes .png locales: sirve desde caché rápido y actualiza en segundo plano
  if (url.origin === self.location.origin && url.pathname.endsWith('.png')) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
          });
          return networkResponse;
        }).catch(() => cachedResponse);

        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // Para HTML, CSS y JS: intenta red primero para tener siempre la última versión, y si no hay señal usa caché
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (url.origin === self.location.origin) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      })
      .catch(() => caches.match(event.request))
  );
});

/**
 * PixelPlay - Service Worker v1.0
 * Provides robust offline functionality and cache management.
 */

const CACHE_NAME = 'pixelplay-v1-static';

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './404.html',
  './manifest.webmanifest',
  './assets/favicon.svg',

  // CSS
  './css/reset.css',
  './css/variables.css',
  './css/base.css',
  './css/layout.css',
  './css/components.css',
  './css/navigation.css',
  './css/home.css',
  './css/library.css',
  './css/game-shell.css',
  './css/games.css',
  './css/achievements.css',
  './css/settings.css',
  './css/themes.css',
  './css/responsive.css',
  './css/accessibility.css',

  // Core JS & App
  './js/app.js',
  './js/constants.js',
  './js/event-bus.js',
  './js/game-registry.js',
  './js/game-lifecycle.js',
  './js/routes.js',
  './js/router.js',

  // Core Services & Utils
  './js/core/logger.js',
  './js/core/clock.js',
  './js/core/error-handler.js',
  './js/core/storage-schema.js',
  './js/core/migration.js',
  './js/core/storage.js',
  './js/utils/dom.js',
  './js/utils/random.js',
  './js/utils/format.js',
  './js/utils/validation.js',
  './js/utils/accessibility.js',
  './js/utils/input-manager.js',

  // Services
  './js/services/audio.js',
  './js/services/theme-manager.js',
  './js/services/notification.js',
  './js/services/favorites.js',
  './js/services/recent-games.js',
  './js/services/statistics.js',
  './js/services/achievements.js',
  './js/services/daily-challenge.js',

  // Components
  './js/components/header.js',
  './js/components/navigation.js',
  './js/components/game-card.js',
  './js/components/modal.js',
  './js/components/toast.js',
  './js/components/dialog.js',
  './js/components/empty-state.js',
  './js/components/loading-state.js',

  // Pages
  './js/pages/home.js',
  './js/pages/game-library.js',
  './js/pages/game-player.js',
  './js/pages/daily-challenge-page.js',
  './js/pages/achievements-page.js',
  './js/pages/statistics-page.js',
  './js/pages/settings-page.js',
  './js/pages/not-found.js',

  // Games
  './js/games/snake/index.js',
  './js/games/snake/rules.js',
  './js/games/snake/styles.css',

  './js/games/2048/index.js',
  './js/games/2048/rules.js',
  './js/games/2048/styles.css',

  './js/games/brick-breaker/index.js',
  './js/games/brick-breaker/rules.js',
  './js/games/brick-breaker/styles.css',

  './js/games/memory-match/index.js',
  './js/games/memory-match/rules.js',
  './js/games/memory-match/styles.css',

  './js/games/tic-tac-toe/index.js',
  './js/games/tic-tac-toe/rules.js',
  './js/games/tic-tac-toe/styles.css',

  './js/games/reaction-rush/index.js',
  './js/games/reaction-rush/rules.js',
  './js/games/reaction-rush/styles.css',

  './js/games/sequence-master/index.js',
  './js/games/sequence-master/rules.js',
  './js/games/sequence-master/styles.css',

  './js/games/endless-runner/index.js',
  './js/games/endless-runner/rules.js',
  './js/games/endless-runner/styles.css'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request)
          .then((networkResponse) => {
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }

            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });

            return networkResponse;
          })
          .catch(() => {
            // Offline fallback for HTML navigation requests
            if (event.request.mode === 'navigate') {
              return caches.match('./index.html');
            }
          });
      })
  );
});

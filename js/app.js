/**
 * PixelPlay - Main Application Entry Point
 */

import { errorHandler } from './core/error-handler.js';
import { themeManager } from './services/theme-manager.js';
import { createHeader } from './components/header.js';
import { router } from './router.js';
import { $, createElement } from './utils/dom.js';
import { initAccessibility } from './utils/accessibility.js';
import { logger } from './core/logger.js';
import { notification } from './services/notification.js';

function registerServiceWorker() {
  if ('serviceWorker' in navigator && (window.location.protocol === 'https:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js')
        .then((reg) => {
          logger.info('Service Worker registered with scope:', reg.scope);

          reg.addEventListener('updatefound', () => {
            const installing = reg.installing;
            if (installing) {
              installing.addEventListener('statechange', () => {
                if (installing.state === 'installed' && navigator.serviceWorker.controller) {
                  notification.info('PixelPlay updated in background. Refresh to view latest version.');
                }
              });
            }
          });
        })
        .catch((err) => {
          logger.warn('Service Worker registration skipped or failed:', err);
        });
    });
  }
}

function initFooter() {
  return createElement('footer', { className: 'site-footer' }, [
    createElement('div', { className: 'footer-content' }, [
      createElement('div', { className: 'footer-links' }, [
        createElement('a', { href: '#/', text: 'Home' }),
        createElement('a', { href: '#/games', text: 'Games' }),
        createElement('a', { href: '#/daily', text: 'Daily Challenge' }),
        createElement('a', { href: '#/achievements', text: 'Achievements' }),
        createElement('a', { href: '#/statistics', text: 'Statistics' }),
        createElement('a', { href: '#/settings', text: 'Settings' })
      ]),
      createElement('p', {
        text: 'PixelPlay v1.0 • Built with 100% Vanilla HTML5, CSS3 & Modern JavaScript. No trackers, no accounts, offline capable.'
      })
    ])
  ]);
}

function bootstrap() {
  logger.info('Bootstrapping PixelPlay v1.0...');

  // Initialize global error monitoring
  errorHandler.init();

  // Initialize theme
  themeManager.init();

  // Initialize accessibility live announcer
  initAccessibility();

  // Build shell structure
  const appRoot = $('#app');
  if (!appRoot) {
    console.error('Root #app container not found.');
    return;
  }

  // Skip link
  const skipLink = createElement('a', {
    href: '#main-content',
    className: 'skip-link',
    text: 'Skip to main content'
  });
  document.body.insertBefore(skipLink, appRoot);

  // Header
  const header = createHeader();
  appRoot.appendChild(header);

  // Main container
  const main = createElement('main', {
    id: 'main-content',
    className: 'main-content',
    tabIndex: -1
  });
  appRoot.appendChild(main);

  // Footer
  const footer = initFooter();
  appRoot.appendChild(footer);

  // Initialize Hash Router
  router.init(main);

  // Register Service Worker for offline play
  registerServiceWorker();

  logger.info('PixelPlay ready!');
}

document.addEventListener('DOMContentLoaded', bootstrap);

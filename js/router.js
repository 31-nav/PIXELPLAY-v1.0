/**
 * PixelPlay - Client-Side Hash Router
 */

import { matchRoute } from './routes.js';
import { updateActiveNavLink } from './components/navigation.js';
import { gameLifecycle } from './game-lifecycle.js';
import { announce } from './utils/accessibility.js';
import { eventBus } from './event-bus.js';
import { EVENTS } from './constants.js';

class Router {
  constructor() {
    this.container = null;
    this.currentHash = '';
  }

  init(containerElement) {
    this.container = containerElement;

    window.addEventListener('hashchange', () => {
      this.handleRoute();
    });

    // Initial navigation
    if (!window.location.hash) {
      window.location.hash = '#/';
    } else {
      this.handleRoute();
    }
  }

  async handleRoute() {
    const hash = window.location.hash || '#/';
    this.currentHash = hash;

    // 1. Destroy any active game session before page swap
    gameLifecycle.destroy();

    // 2. Resolve matching route
    const match = matchRoute(hash);

    // 3. Update Document Title
    document.title = match.title;

    // 4. Update Header Nav link highlights
    updateActiveNavLink(hash.split('?')[0]);

    // 5. Render target page
    try {
      await match.handler(this.container);
      window.scrollTo(0, 0);
      announce(`Navigated to ${match.title}`);
      eventBus.emit(EVENTS.ROUTE_CHANGED, { hash, title: match.title });
    } catch (err) {
      console.error('[Router] Error rendering route:', err);
    }
  }

  navigate(hash) {
    window.location.hash = hash;
  }
}

export const router = new Router();

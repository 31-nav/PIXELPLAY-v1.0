/**
 * PixelPlay - 404 Not Found Page
 */

import { createElement } from '../utils/dom.js';

export function renderNotFoundPage(container) {
  const page = createElement('div', { className: 'empty-state', style: 'padding: 4rem 1rem;' }, [
    createElement('div', { className: 'empty-state-icon', text: '👾' }),
    createElement('h1', { className: 'empty-state-title', text: 'Page Not Found' }),
    createElement('p', {
      className: 'empty-state-desc',
      text: "The page or game you're looking for doesn't exist or has been moved."
    }),
    createElement('a', {
      href: '#/',
      className: 'btn btn-primary',
      text: 'Return to Homepage'
    })
  ]);

  container.appendChild(page);
}

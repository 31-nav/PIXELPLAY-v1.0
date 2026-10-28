/**
 * PixelPlay - Loading State Spinner Component
 */

import { createElement } from '../utils/dom.js';

export function createLoadingState(message = 'Loading game module...') {
  return createElement('div', { className: 'empty-state' }, [
    createElement('div', { className: 'loading-spinner', 'aria-hidden': 'true' }),
    createElement('p', {
      className: 'empty-state-desc',
      style: 'margin-top: 1rem;',
      text: message
    })
  ]);
}

/**
 * PixelPlay - Empty State Component
 */

import { createElement } from '../utils/dom.js';

export function createEmptyState({ icon = '🎮', title = 'No Games Found', description = 'Try adjusting your search or filters.', action = null }) {
  const children = [
    createElement('div', { className: 'empty-state-icon', text: icon }),
    createElement('h3', { className: 'empty-state-title', text: title }),
    createElement('p', { className: 'empty-state-desc', text: description })
  ];

  if (action && action.label && action.onClick) {
    children.push(createElement('button', {
      className: 'btn btn-primary',
      text: action.label,
      onClick: action.onClick
    }));
  }

  return createElement('div', { className: 'empty-state' }, children);
}

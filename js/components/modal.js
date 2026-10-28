/**
 * PixelPlay - Accessible Modal Component
 */

import { createElement, empty } from '../utils/dom.js';
import { trapFocus } from '../utils/accessibility.js';

export function createModal({ title = '', content = null, footerButtons = [], onClose = null }) {
  let releaseTrap = null;

  const overlay = createElement('div', {
    className: 'modal-overlay',
    role: 'dialog',
    'aria-modal': 'true',
    'aria-labelledby': 'modal-title'
  });

  const card = createElement('div', { className: 'modal-card' });

  // Header
  const header = createElement('div', { className: 'modal-header' }, [
    createElement('h2', { id: 'modal-title', className: 'modal-title', text: title }),
    createElement('button', {
      className: 'btn-icon btn-ghost',
      'aria-label': 'Close dialog',
      text: '✕',
      onClick: () => close()
    })
  ]);
  card.appendChild(header);

  // Body
  const body = createElement('div', { className: 'modal-body' });
  if (typeof content === 'string') {
    body.textContent = content;
  } else if (content instanceof Node) {
    body.appendChild(content);
  }
  card.appendChild(body);

  // Footer
  if (footerButtons.length > 0) {
    const footer = createElement('div', { className: 'modal-footer' });
    footerButtons.forEach((btnConfig) => {
      const btn = createElement('button', {
        className: `btn ${btnConfig.variant || 'btn-outline'}`,
        text: btnConfig.label,
        onClick: () => {
          if (btnConfig.onClick) btnConfig.onClick();
          if (btnConfig.closeOnClick !== false) close();
        }
      });
      footer.appendChild(btn);
    });
    card.appendChild(footer);
  }

  overlay.appendChild(card);

  function handleKeyDown(e) {
    if (e.key === 'Escape') close();
  }

  function open() {
    document.body.appendChild(overlay);
    requestAnimationFrame(() => {
      overlay.classList.add('open');
      releaseTrap = trapFocus(card);
      window.addEventListener('keydown', handleKeyDown);
    });
  }

  function close() {
    overlay.classList.remove('open');
    window.removeEventListener('keydown', handleKeyDown);
    if (releaseTrap) releaseTrap();
    setTimeout(() => {
      if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
      if (onClose) onClose();
    }, 250);
  }

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });

  return { open, close, overlay };
}

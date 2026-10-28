/**
 * PixelPlay - Accessibility Utilities & Screen Reader Announcer
 */

let liveRegion = null;
let previousFocusedElement = null;

export function initAccessibility() {
  if (!liveRegion) {
    liveRegion = document.createElement('div');
    liveRegion.id = 'a11y-live-announcer';
    liveRegion.className = 'sr-only';
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    document.body.appendChild(liveRegion);
  }
}

/**
 * Announce dynamic message to screen readers
 * @param {string} message 
 */
export function announce(message) {
  if (!liveRegion) initAccessibility();
  if (liveRegion) {
    liveRegion.textContent = '';
    // slight delay for assistive tech detection
    setTimeout(() => {
      liveRegion.textContent = message;
    }, 50);
  }
}

/**
 * Save current focus and trap focus within modal container
 * @param {HTMLElement} container 
 * @returns {Function} Function to release focus trap
 */
export function trapFocus(container) {
  previousFocusedElement = document.activeElement;

  const focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(', ');

  const focusableElements = Array.from(container.querySelectorAll(focusableSelectors));
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  if (firstFocusable) {
    firstFocusable.focus();
  }

  function handleKeyDown(e) {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      if (document.activeElement === firstFocusable) {
        lastFocusable.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        firstFocusable.focus();
        e.preventDefault();
      }
    }
  }

  container.addEventListener('keydown', handleKeyDown);

  return function releaseFocus() {
    container.removeEventListener('keydown', handleKeyDown);
    if (previousFocusedElement && typeof previousFocusedElement.focus === 'function') {
      previousFocusedElement.focus();
    }
  };
}

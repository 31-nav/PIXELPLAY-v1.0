/**
 * PixelPlay - Site Header Component
 */

import { createElement } from '../utils/dom.js';
import { createNavigation } from './navigation.js';
import { themeManager } from '../services/theme-manager.js';
import { eventBus } from '../event-bus.js';
import { EVENTS } from '../constants.js';

export function createHeader() {
  const header = createElement('header', { className: 'site-header' });
  const container = createElement('div', { className: 'header-container' });

  // Brand Logo Link
  const brand = createElement('a', {
    href: '#/',
    className: 'brand-link',
    'aria-label': 'PixelPlay Home'
  }, [
    createElement('div', { className: 'brand-logo-icon', text: 'P' }),
    createElement('span', { className: 'brand-text', text: 'PixelPlay' })
  ]);
  container.appendChild(brand);

  // Navigation Links
  const navMenu = createNavigation();
  container.appendChild(navMenu);

  // Actions (Offline Badge, Theme Toggle, Mobile Hamburger)
  const actions = createElement('div', { className: 'nav-actions' });

  // Offline indicator badge
  const offlineBadge = createElement('div', {
    className: 'offline-badge',
    title: 'Offline ready via Service Worker caching'
  }, [
    createElement('span', { className: 'status-dot' }),
    createElement('span', { className: 'status-text', text: navigator.onLine ? 'Offline Ready' : 'Offline Mode' })
  ]);

  window.addEventListener('online', () => {
    offlineBadge.classList.remove('offline-mode');
    offlineBadge.querySelector('.status-text').textContent = 'Offline Ready';
  });
  window.addEventListener('offline', () => {
    offlineBadge.classList.add('offline-mode');
    offlineBadge.querySelector('.status-text').textContent = 'Offline Mode';
  });
  actions.appendChild(offlineBadge);

  // Theme Toggle Button
  const themeBtn = createElement('button', {
    className: 'theme-toggle-btn',
    'aria-label': 'Toggle color theme',
    onClick: () => {
      themeManager.toggleTheme();
    }
  }, [
    createElement('span', { className: 'theme-icon-light', text: '☀️' }),
    createElement('span', { className: 'theme-icon-dark', text: '🌙' })
  ]);
  actions.appendChild(themeBtn);

  // Mobile Hamburger Toggle
  const mobileToggle = createElement('button', {
    className: 'mobile-menu-btn btn-ghost',
    'aria-label': 'Toggle navigation menu',
    'aria-expanded': 'false',
    text: '☰',
    onClick: () => {
      const isOpen = navMenu.classList.toggle('mobile-open');
      mobileToggle.setAttribute('aria-expanded', String(isOpen));
      mobileToggle.textContent = isOpen ? '✕' : '☰';
    }
  });
  actions.appendChild(mobileToggle);

  // Close mobile nav on link click
  navMenu.addEventListener('click', (e) => {
    if (e.target.closest('a')) {
      navMenu.classList.remove('mobile-open');
      mobileToggle.setAttribute('aria-expanded', 'false');
      mobileToggle.textContent = '☰';
    }
  });

  container.appendChild(actions);
  header.appendChild(container);
  return header;
}

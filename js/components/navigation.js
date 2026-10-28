/**
 * PixelPlay - Navigation Menu Component
 */

import { createElement } from '../utils/dom.js';

export const NAV_LINKS = [
  { href: '#/', label: 'Home', icon: '🏠' },
  { href: '#/games', label: 'Games', icon: '🎮' },
  { href: '#/daily', label: 'Daily Challenge', icon: '📅' },
  { href: '#/achievements', label: 'Achievements', icon: '🏆' },
  { href: '#/statistics', label: 'Statistics', icon: '📊' },
  { href: '#/settings', label: 'Settings', icon: '⚙️' }
];

export function createNavigation() {
  const nav = createElement('nav', {
    className: 'nav-menu',
    id: 'primary-nav',
    'aria-label': 'Main Navigation'
  });

  NAV_LINKS.forEach((item) => {
    const link = createElement('a', {
      href: item.href,
      className: 'nav-link',
      text: `${item.icon} ${item.label}`,
      dataset: { path: item.href.slice(1) }
    });
    nav.appendChild(link);
  });

  return nav;
}

export function updateActiveNavLink(currentHash) {
  const links = document.querySelectorAll('.nav-link');
  links.forEach((link) => {
    const href = link.getAttribute('href');
    if (href === currentHash || (href === '#/games' && currentHash.startsWith('#/play/'))) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

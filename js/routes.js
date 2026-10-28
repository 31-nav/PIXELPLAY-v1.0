/**
 * PixelPlay - Central Route Table Definition
 */

import { renderHomePage } from './pages/home.js';
import { renderGameLibraryPage } from './pages/game-library.js';
import { renderGamePlayerPage } from './pages/game-player.js';
import { renderDailyChallengePage } from './pages/daily-challenge-page.js';
import { renderAchievementsPage } from './pages/achievements-page.js';
import { renderStatisticsPage } from './pages/statistics-page.js';
import { renderSettingsPage } from './pages/settings-page.js';
import { renderNotFoundPage } from './pages/not-found.js';
import { getGameById } from './game-registry.js';

export const ROUTES = [
  {
    path: '#/',
    title: 'PixelPlay • Small games. Big fun.',
    handler: (container) => renderHomePage(container)
  },
  {
    path: '#/games',
    title: 'Game Library • PixelPlay',
    handler: (container) => renderGameLibraryPage(container)
  },
  {
    path: '#/daily',
    title: 'Daily Challenge • PixelPlay',
    handler: (container) => renderDailyChallengePage(container)
  },
  {
    path: '#/achievements',
    title: 'Achievements • PixelPlay',
    handler: (container) => renderAchievementsPage(container)
  },
  {
    path: '#/statistics',
    title: 'Personal Statistics • PixelPlay',
    handler: (container) => renderStatisticsPage(container)
  },
  {
    path: '#/settings',
    title: 'Settings • PixelPlay',
    handler: (container) => renderSettingsPage(container)
  }
];

/**
 * Resolve dynamic route handler based on hash
 * @param {string} hash 
 * @returns {{ handler: Function, title: string }}
 */
export function matchRoute(hash) {
  // Normalize empty or # hash to #/
  const cleanHash = (!hash || hash === '#' || hash === '') ? '#/' : hash.split('?')[0];

  // Static route match
  const staticMatch = ROUTES.find(r => r.path === cleanHash);
  if (staticMatch) {
    return staticMatch;
  }

  // Dynamic game route match: #/play/:gameId
  if (cleanHash.startsWith('#/play/')) {
    const gameId = cleanHash.replace('#/play/', '').trim();
    const game = getGameById(gameId);
    const isDaily = hash.includes('daily=true');

    return {
      title: game ? `Play ${game.name} • PixelPlay` : 'Play Game • PixelPlay',
      handler: (container) => renderGamePlayerPage(container, gameId, isDaily)
    };
  }

  // Not Found
  return {
    title: 'Page Not Found • PixelPlay',
    handler: (container) => renderNotFoundPage(container)
  };
}

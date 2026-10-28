/**
 * PixelPlay - Home Page View
 */

import { createElement, empty } from '../utils/dom.js';
import { GAME_REGISTRY, getGameById } from '../game-registry.js';
import { createGameCard } from '../components/game-card.js';
import { dailyChallenge } from '../services/daily-challenge.js';
import { statistics } from '../services/statistics.js';
import { achievements } from '../services/achievements.js';
import { recentGames } from '../services/recent-games.js';
import { favorites } from '../services/favorites.js';

export function renderHomePage(container) {
  empty(container);

  const homeWrapper = createElement('div', { className: 'home-page' });

  // 1. Hero Section
  const hero = createElement('section', { className: 'hero-section' }, [
    createElement('div', { className: 'hero-badge' }, [
      createElement('span', { className: 'badge badge-primary', text: '⚡ PixelPlay v1.0 • Offline Ready' })
    ]),
    createElement('h1', { className: 'hero-title' }, [
      document.createTextNode('Small games. '),
      createElement('span', { className: 'hero-highlight', text: 'Big fun.' })
    ]),
    createElement('p', {
      className: 'hero-subtitle',
      text: 'Instant browser mini-games. No accounts, no paywalls, zero trackers. Pure arcade, puzzle, reflex, and strategy joy playable anytime, anywhere.'
    }),
    createElement('div', { className: 'hero-cta-group' }, [
      createElement('a', { href: '#/games', className: 'btn btn-lg btn-primary', text: '🎮 Browse All Games' }),
      createElement('a', { href: '#/daily', className: 'btn btn-lg btn-outline', text: '📅 Daily Challenge' })
    ])
  ]);
  homeWrapper.appendChild(hero);

  // 2. Daily Challenge Banner
  const today = dailyChallenge.getTodayChallenge();
  const challengeGame = getGameById(today.gameId);
  if (challengeGame) {
    const banner = createElement('section', { className: 'daily-banner-card' }, [
      createElement('div', { className: 'daily-banner-info' }, [
        createElement('div', { className: 'daily-banner-tag', text: `Today's Daily Challenge • ${today.date}` }),
        createElement('h2', { className: 'daily-banner-game', text: `${challengeGame.icon} ${challengeGame.name}` }),
        createElement('p', { className: 'daily-banner-desc', text: today.rules.description })
      ]),
      createElement('div', { className: 'daily-banner-action' }, [
        createElement('a', {
          href: `#/play/${today.gameId}?daily=true`,
          className: 'btn btn-secondary',
          text: today.completed ? '✓ Completed Today (Replay)' : 'Play Challenge'
        })
      ])
    ]);
    homeWrapper.appendChild(banner);
  }

  // 3. Quick Stats Grid
  const summary = statistics.getOverallSummary();
  const achProgress = achievements.getProgress();

  const statsSection = createElement('section', { className: 'quick-stats-grid' }, [
    createElement('div', { className: 'stat-card' }, [
      createElement('span', { className: 'stat-label', text: 'Total Sessions' }),
      createElement('span', { className: 'stat-value', text: summary.totalSessions.toString() })
    ]),
    createElement('div', { className: 'stat-card' }, [
      createElement('span', { className: 'stat-label', text: 'Games Played' }),
      createElement('span', { className: 'stat-value', text: `${summary.uniqueGamesPlayed} / 8` })
    ]),
    createElement('div', { className: 'stat-card' }, [
      createElement('span', { className: 'stat-label', text: 'Achievements' }),
      createElement('span', { className: 'stat-value', text: `${achProgress.unlockedCount} / ${achProgress.total}` })
    ]),
    createElement('div', { className: 'stat-card' }, [
      createElement('span', { className: 'stat-label', text: 'Daily Streak' }),
      createElement('span', { className: 'stat-value', text: `${today.streak} Days` })
    ])
  ]);
  homeWrapper.appendChild(statsSection);

  // 4. Recently Played Row (if any)
  const recents = recentGames.getAll();
  if (recents.length > 0) {
    const recentGamesHeader = createElement('div', { className: 'home-section-header' }, [
      createElement('h2', { className: 'home-section-title', text: '🕒 Continue Playing' })
    ]);
    homeWrapper.appendChild(recentGamesHeader);

    const recentsGrid = createElement('div', { className: 'games-grid' });
    recents.slice(0, 4).forEach((id) => {
      const g = getGameById(id);
      if (g) recentsGrid.appendChild(createGameCard(g));
    });
    homeWrapper.appendChild(recentsGrid);
  }

  // 5. Featured Game Library Grid
  const libraryHeader = createElement('div', { className: 'home-section-header' }, [
    createElement('h2', { className: 'home-section-title', text: '🔥 All 8 Games' }),
    createElement('a', { href: '#/games', className: 'btn btn-sm btn-ghost', text: 'View Library →' })
  ]);
  homeWrapper.appendChild(libraryHeader);

  const allGrid = createElement('div', { className: 'games-grid' });
  GAME_REGISTRY.forEach((g) => {
    allGrid.appendChild(createGameCard(g));
  });
  homeWrapper.appendChild(allGrid);

  container.appendChild(homeWrapper);
}

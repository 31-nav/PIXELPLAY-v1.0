/**
 * PixelPlay - Personal Statistics Page View
 */

import { createElement, empty } from '../utils/dom.js';
import { statistics } from '../services/statistics.js';
import { GAME_REGISTRY } from '../game-registry.js';
import { formatDuration } from '../utils/format.js';

export function renderStatisticsPage(container) {
  empty(container);

  const summary = statistics.getOverallSummary();
  const page = createElement('div', { className: 'statistics-page' });

  // Header
  const header = createElement('div', { className: 'home-section-header', style: 'margin-top: 0;' }, [
    createElement('h1', { className: 'home-section-title', text: '📊 Personal Statistics' }),
    createElement('p', {
      className: 'header-desc',
      text: 'Lifetime records and session metrics saved exclusively on this device.'
    })
  ]);
  page.appendChild(header);

  // Quick Stats Summary
  const statsSummary = createElement('div', { className: 'quick-stats-grid' }, [
    createElement('div', { className: 'stat-card' }, [
      createElement('span', { className: 'stat-label', text: 'Total Game Sessions' }),
      createElement('span', { className: 'stat-value', text: summary.totalSessions.toString() })
    ]),
    createElement('div', { className: 'stat-card' }, [
      createElement('span', { className: 'stat-label', text: 'Unique Titles Played' }),
      createElement('span', { className: 'stat-value', text: `${summary.uniqueGamesPlayed} / 8` })
    ]),
    createElement('div', { className: 'stat-card' }, [
      createElement('span', { className: 'stat-label', text: 'Total Play Time' }),
      createElement('span', { className: 'stat-value', text: formatDuration(summary.totalPlayTimeSeconds) })
    ])
  ]);
  page.appendChild(statsSummary);

  // Per-Game Detail Cards
  const detailHeader = createElement('div', { className: 'home-section-header' }, [
    createElement('h2', { className: 'home-section-title', text: '🎮 Per-Game Breakdown' })
  ]);
  page.appendChild(detailHeader);

  const grid = createElement('div', { className: 'games-grid' });

  GAME_REGISTRY.forEach((game) => {
    const s = statistics.getGameStats(game.id);

    let recordDisplay = 'No score yet';
    if (game.id === 'reaction-rush' && s.highScore > 0) {
      recordDisplay = `${s.highScore} ms (Peak Reflex)`;
    } else if (game.id === 'memory-match' && s.bestTime !== null) {
      recordDisplay = `${(s.bestTime / 1000).toFixed(1)}s (Best Time)`;
    } else if (game.id === 'sequence-master' && s.highScore > 0) {
      recordDisplay = `Level ${Math.floor(s.highScore / 10) + 1}`;
    } else if (game.id === 'endless-runner' && s.highScore > 0) {
      recordDisplay = `${s.highScore} meters`;
    } else if (s.highScore > 0) {
      recordDisplay = `${s.highScore.toLocaleString()} pts`;
    }

    const card = createElement('div', { className: 'settings-section', style: 'padding: 1.25rem;' }, [
      createElement('h3', {
        className: 'settings-section-title',
        style: 'font-size: 1.1rem; margin-bottom: 0.75rem;',
        text: `${game.icon} ${game.name}`
      }),
      createElement('div', { className: 'setting-item', style: 'padding: 0.4rem 0;' }, [
        createElement('span', { className: 'setting-hint', text: 'Sessions Played' }),
        createElement('strong', { text: String(s.playCount || 0) })
      ]),
      createElement('div', { className: 'setting-item', style: 'padding: 0.4rem 0;' }, [
        createElement('span', { className: 'setting-hint', text: 'Personal Record' }),
        createElement('strong', { style: 'color: var(--color-secondary);', text: recordDisplay })
      ]),
      createElement('div', { className: 'setting-item', style: 'padding: 0.4rem 0;' }, [
        createElement('span', { className: 'setting-hint', text: 'Time In-Game' }),
        createElement('strong', { text: formatDuration(s.totalPlayTimeSeconds || 0) })
      ])
    ]);

    grid.appendChild(card);
  });

  page.appendChild(grid);

  // Local-only Notice
  const disclaimer = createElement('p', {
    style: 'margin-top: 2rem; font-size: 0.8rem; color: var(--color-text-muted); text-align: center;',
    text: 'Notice: Statistics are stored in local browser storage (LocalStorage) on this device and are not synced with an online account or cloud database.'
  });
  page.appendChild(disclaimer);

  container.appendChild(page);
}

/**
 * PixelPlay - Reusable Game Card Component
 */

import { createElement } from '../utils/dom.js';
import { favorites } from '../services/favorites.js';
import { statistics } from '../services/statistics.js';
import { CATEGORY_LABELS } from '../constants.js';

export function createGameCard(game) {
  const isFav = favorites.isFavorite(game.id);
  const stats = statistics.getGameStats(game.id);

  const card = createElement('article', {
    className: 'game-card',
    dataset: { id: game.id, category: game.category }
  });

  // Card Banner
  const banner = createElement('div', { className: 'game-card-banner' }, [
    createElement('div', {
      className: 'game-card-icon-svg',
      style: 'font-size: 3.5rem; text-align: center;',
      text: game.icon
    })
  ]);

  // Favorite button
  const favBtn = createElement('button', {
    className: `game-card-favorite-btn ${isFav ? 'favorited' : ''}`,
    'aria-label': isFav ? `Remove ${game.name} from favorites` : `Add ${game.name} to favorites`,
    text: isFav ? '❤️' : '🤍',
    onClick: (e) => {
      e.stopPropagation();
      const nextFav = favorites.toggle(game.id);
      favBtn.classList.toggle('favorited', nextFav);
      favBtn.textContent = nextFav ? '❤️' : '🤍';
      favBtn.setAttribute('aria-label', nextFav ? `Remove ${game.name} from favorites` : `Add ${game.name} to favorites`);
    }
  });
  banner.appendChild(favBtn);
  card.appendChild(banner);

  // Content
  const content = createElement('div', { className: 'game-card-content' });

  const metaRow = createElement('div', { className: 'game-card-meta' }, [
    createElement('span', {
      className: 'badge badge-primary',
      text: CATEGORY_LABELS[game.category] || game.category
    }),
    createElement('span', {
      className: 'badge badge-neutral',
      text: game.difficulty.toUpperCase()
    })
  ]);
  content.appendChild(metaRow);

  const title = createElement('h3', { className: 'game-card-title', text: game.name });
  const desc = createElement('p', { className: 'game-card-desc', text: game.tagline });
  content.appendChild(title);
  content.appendChild(desc);

  // Footer: Best record & Play Button
  let bestDisplay = 'No record yet';
  if (game.id === 'reaction-rush' && stats.highScore > 0) {
    bestDisplay = `Best: <strong>${stats.highScore} ms</strong>`;
  } else if (game.id === 'memory-match' && stats.bestTime !== null) {
    bestDisplay = `Best: <strong>${(stats.bestTime / 1000).toFixed(1)}s</strong>`;
  } else if (stats.highScore > 0) {
    bestDisplay = `Best: <strong>${stats.highScore.toLocaleString()}</strong>`;
  }

  const footer = createElement('div', { className: 'game-card-footer' }, [
    createElement('div', { className: 'game-card-best', html: bestDisplay }),
    createElement('a', {
      href: `#/play/${game.id}`,
      className: 'btn btn-sm btn-primary',
      text: 'Play'
    })
  ]);
  content.appendChild(footer);

  card.appendChild(content);
  return card;
}

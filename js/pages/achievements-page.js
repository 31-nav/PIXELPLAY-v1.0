/**
 * PixelPlay - Achievements Page View
 */

import { createElement, empty } from '../utils/dom.js';
import { achievements } from '../services/achievements.js';
import { formatDate } from '../utils/format.js';

export function renderAchievementsPage(container) {
  empty(container);

  const list = achievements.getAll();
  const progress = achievements.getProgress();

  const page = createElement('div', { className: 'achievements-page' });

  // Header
  const header = createElement('div', { className: 'achievements-header' }, [
    createElement('div', {}, [
      createElement('h1', { className: 'home-section-title', text: '🏆 Achievements' }),
      createElement('p', {
        className: 'header-desc',
        text: 'Conquer challenges, set personal records, and unlock all 16 badges.'
      })
    ])
  ]);
  page.appendChild(header);

  // Overall Progress Card
  const progressCard = createElement('div', { className: 'achievements-progress-card' }, [
    createElement('div', { style: 'display: flex; justify-content: space-between; align-items: center;' }, [
      createElement('strong', { text: `Total Unlocked: ${progress.unlockedCount} of ${progress.total}` }),
      createElement('span', { className: 'badge badge-primary', text: `${progress.percentage}% Complete` })
    ]),
    createElement('div', { className: 'progress-bar-container' }, [
      createElement('div', {
        className: 'progress-bar-fill',
        style: `width: ${progress.percentage}%;`
      })
    ])
  ]);
  page.appendChild(progressCard);

  // 16 Badges Grid
  const grid = createElement('div', { className: 'achievements-grid' });

  list.forEach((ach) => {
    const card = createElement('div', {
      className: `achievement-card ${ach.unlocked ? 'unlocked' : 'locked'}`
    }, [
      createElement('div', { className: 'achievement-badge-icon', text: ach.icon }),
      createElement('div', { className: 'achievement-info' }, [
        createElement('h3', { className: 'achievement-title', text: ach.title }),
        createElement('p', { className: 'achievement-desc', text: ach.description }),
        createElement('div', {
          className: 'achievement-date',
          text: ach.unlocked ? `Unlocked: ${formatDate(ach.unlockedAt)}` : '🔒 Locked'
        })
      ])
    ]);
    grid.appendChild(card);
  });

  page.appendChild(grid);
  container.appendChild(page);
}

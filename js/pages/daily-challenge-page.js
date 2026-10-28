/**
 * PixelPlay - Daily Challenge Page View
 */

import { createElement, empty } from '../utils/dom.js';
import { dailyChallenge } from '../services/daily-challenge.js';
import { getGameById } from '../game-registry.js';
import { Clock } from '../core/clock.js';

export function renderDailyChallengePage(container) {
  empty(container);

  const today = dailyChallenge.getTodayChallenge();
  const game = getGameById(today.gameId);

  const page = createElement('div', { className: 'daily-page' });

  // Header
  const header = createElement('div', { className: 'home-section-header', style: 'margin-top: 0;' }, [
    createElement('h1', { className: 'home-section-title', text: '📅 Daily Challenge' }),
    createElement('p', {
      className: 'header-desc',
      text: 'One featured deterministic challenge rotates every midnight UTC. Build your daily streak!'
    })
  ]);
  page.appendChild(header);

  // Challenge Card
  if (game) {
    const card = createElement('div', {
      className: 'daily-banner-card',
      style: 'margin-bottom: 2rem;'
    }, [
      createElement('div', { className: 'daily-banner-info' }, [
        createElement('div', {
          className: 'daily-banner-tag',
          text: `UTC Date: ${today.date} • Challenge Version 1`
        }),
        createElement('h2', {
          className: 'daily-banner-game',
          text: `${game.icon} ${game.name}`
        }),
        createElement('p', {
          className: 'daily-banner-desc',
          style: 'font-size: 1.1rem; margin-bottom: 1rem;',
          text: today.rules.description
        }),
        createElement('div', { style: 'display: flex; gap: 0.5rem; align-items: center;' }, [
          createElement('span', {
            className: `badge ${today.completed ? 'badge-secondary' : 'badge-warning'}`,
            text: today.completed ? '✓ Completed for Today' : '⏳ Pending Completion'
          }),
          createElement('span', {
            className: 'badge badge-primary',
            text: `🔥 ${today.streak} Day Streak`
          })
        ])
      ]),
      createElement('div', { className: 'daily-banner-action' }, [
        createElement('a', {
          href: `#/play/${today.gameId}?daily=true`,
          className: 'btn btn-lg btn-secondary',
          text: today.completed ? 'Replay Challenge' : 'Start Daily Challenge'
        })
      ])
    ]);
    page.appendChild(card);
  }

  // Information & Notes
  const infoCard = createElement('div', { className: 'settings-section' }, [
    createElement('h3', { className: 'settings-section-title', text: 'ℹ️ About the Daily Challenge' }),
    createElement('p', {
      className: 'settings-section-desc',
      text: 'Daily challenges use deterministic pseudo-random number seeds calculated from the current UTC calendar date. All players on the same UTC date experience the exact same obstacle patterns, card distributions, and targets. Progress is stored strictly in your local device browser.'
    })
  ]);
  page.appendChild(infoCard);

  container.appendChild(page);
}

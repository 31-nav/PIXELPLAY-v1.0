/**
 * PixelPlay - Memory Match Game Module
 */

import {
  DIFFICULTIES,
  createDeck,
  areCardsMatching,
  isDeckCompleted
} from './rules.js';
import { createElement, empty } from '../../utils/dom.js';
import { formatDuration } from '../../utils/format.js';
import { Clock } from '../../core/clock.js';

export function createGame(context) {
  const { rootElement, rng, audio, onScoreUpdate, onGameWin } = context;

  let difficulty = DIFFICULTIES.MEDIUM;
  let cards = [];
  let flippedCards = [];
  let isResolvingMismatch = false;

  let moves = 0;
  let matchesFound = 0;
  let startTime = null;
  let elapsedTime = 0;
  let timerId = null;

  let boardElement = null;
  let hudMovesElement = null;
  let hudTimeElement = null;

  function init() {
    empty(rootElement);
    const container = createElement('div', { className: 'memory-container' });

    // HUD
    const hud = createElement('div', { className: 'memory-hud' });
    hudMovesElement = createElement('span', { html: 'Moves: <strong>0</strong>' });
    hudTimeElement = createElement('span', { html: 'Time: <strong>00:00</strong>' });
    hud.appendChild(hudMovesElement);
    hud.appendChild(hudTimeElement);
    container.appendChild(hud);

    // Board
    boardElement = createElement('div', {
      className: `memory-board grid-4x4`,
      role: 'grid',
      'aria-label': 'Memory Matrix Card Board'
    });
    container.appendChild(boardElement);
    rootElement.appendChild(container);

    resetState();
  }

  function resetState() {
    if (timerId) clearInterval(timerId);
    moves = 0;
    matchesFound = 0;
    flippedCards = [];
    isResolvingMismatch = false;
    startTime = null;
    elapsedTime = 0;

    cards = createDeck(difficulty.pairs, rng);
    updateHUD();
    renderBoard();
    onScoreUpdate(0);
  }

  function startTimer() {
    if (!startTime) {
      startTime = Clock.now();
      timerId = setInterval(() => {
        elapsedTime = Math.floor((Clock.now() - startTime) / 1000);
        updateHUD();
      }, 500);
    }
  }

  function updateHUD() {
    if (hudMovesElement) {
      hudMovesElement.innerHTML = `Moves: <strong>${moves}</strong>`;
    }
    if (hudTimeElement) {
      hudTimeElement.innerHTML = `Time: <strong>${formatDuration(elapsedTime)}</strong>`;
    }
  }

  function handleCardClick(card, cardEl) {
    if (isResolvingMismatch) return;
    if (card.matched || card.flipped) return;

    startTimer();
    audio.playClick();

    card.flipped = true;
    cardEl.classList.add('flipped');
    flippedCards.push({ card, cardEl });

    if (flippedCards.length === 2) {
      moves += 1;
      updateHUD();
      checkForMatch();
    }
  }

  function checkForMatch() {
    const [first, second] = flippedCards;
    isResolvingMismatch = true;

    if (areCardsMatching(first.card, second.card)) {
      audio.playMatch();
      first.card.matched = true;
      second.card.matched = true;
      first.cardEl.classList.add('matched');
      second.cardEl.classList.add('matched');
      matchesFound += 1;

      // Score formula: points based on fewer moves and faster time
      const score = Math.max(10, 1000 - moves * 15 - elapsedTime * 5);
      onScoreUpdate(score);

      flippedCards = [];
      isResolvingMismatch = false;

      if (isDeckCompleted(cards)) {
        handleVictory(score);
      }
    } else {
      audio.playMismatch();
      setTimeout(() => {
        first.card.flipped = false;
        second.card.flipped = false;
        first.cardEl.classList.remove('flipped');
        second.cardEl.classList.remove('flipped');
        flippedCards = [];
        isResolvingMismatch = false;
      }, 700);
    }
  }

  function handleVictory(score) {
    if (timerId) clearInterval(timerId);
    const totalTimeMs = Math.round(Clock.now() - startTime);
    audio.playVictory();
    onGameWin({
      score,
      moves,
      timeMs: totalTimeMs,
      difficulty: difficulty.id
    });
  }

  function renderBoard() {
    if (!boardElement) return;
    empty(boardElement);

    cards.forEach((card) => {
      const cardEl = createElement('button', {
        className: 'memory-card',
        role: 'gridcell',
        'aria-label': `Hidden card`
      }, [
        createElement('div', { className: 'memory-card-face memory-card-back', text: '?' }),
        createElement('div', { className: 'memory-card-face memory-card-front', text: card.symbol })
      ]);

      cardEl.addEventListener('click', () => handleCardClick(card, cardEl));
      boardElement.appendChild(cardEl);
    });
  }

  return {
    async mount() {
      init();
    },
    start() {
      // Event/click driven
    },
    pause() {
      if (timerId) clearInterval(timerId);
    },
    resume() {
      if (startTime) {
        timerId = setInterval(() => {
          elapsedTime = Math.floor((Clock.now() - startTime) / 1000);
          updateHUD();
        }, 500);
      }
    },
    reset() {
      resetState();
    },
    destroy() {
      if (timerId) clearInterval(timerId);
      empty(rootElement);
    }
  };
}

export default createGame;

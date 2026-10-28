/**
 * PixelPlay - Reaction Rush Game Module
 */

import {
  MIN_DELAY_MS,
  MAX_DELAY_MS,
  TOTAL_ROUNDS,
  STATES,
  getRandomDelay,
  calculateAverage,
  getBestTime
} from './rules.js';
import { createElement, empty } from '../../utils/dom.js';
import { Clock } from '../../core/clock.js';
import { InputManager } from '../../utils/input-manager.js';

export function createGame(context) {
  const { rootElement, rng, audio, onScoreUpdate, onGameOver, onGameWin } = context;

  let state = STATES.IDLE;
  let rounds = [];
  let timeoutId = null;
  let promptTime = 0;
  let boxElement = null;
  let dotsElement = null;
  let inputManager = null;

  function init() {
    empty(rootElement);
    const container = createElement('div', { className: 'reaction-container' });

    // Round indicator dots
    dotsElement = createElement('div', { className: 'reaction-round-dots' });
    for (let i = 0; i < TOTAL_ROUNDS; i++) {
      dotsElement.appendChild(createElement('div', { className: 'round-dot' }));
    }
    container.appendChild(dotsElement);

    // Interactive Box
    boxElement = createElement('div', {
      className: 'reaction-box state-idle',
      tabIndex: 0,
      role: 'button',
      'aria-label': 'Reaction Testing Surface'
    });
    boxElement.addEventListener('pointerdown', handleClick);
    container.appendChild(boxElement);
    rootElement.appendChild(container);

    inputManager = new InputManager(window);
    inputManager.bindKey(['Space'], () => handleClick());

    resetState();
  }

  function resetState() {
    if (timeoutId) clearTimeout(timeoutId);
    state = STATES.IDLE;
    rounds = [];
    promptTime = 0;
    updateDots();
    renderBox('Reaction Rush', 'Click or tap anywhere here to start Round 1', STATES.IDLE);
    onScoreUpdate(0);
  }

  function updateDots() {
    if (!dotsElement) return;
    const dots = dotsElement.querySelectorAll('.round-dot');
    dots.forEach((dot, idx) => {
      dot.className = `round-dot ${idx < rounds.length ? 'completed' : ''}`;
    });
  }

  function renderBox(title, subtitle, stateClass) {
    if (!boxElement) return;
    boxElement.className = `reaction-box state-${stateClass}`;
    empty(boxElement);
    boxElement.appendChild(createElement('div', { className: 'reaction-heading', text: title }));
    boxElement.appendChild(createElement('div', { className: 'reaction-subheading', text: subtitle }));
  }

  function handleClick() {
    if (state === STATES.IDLE || state === STATES.EARLY || state === STATES.RESULT) {
      startWaiting();
    } else if (state === STATES.WAITING) {
      handleEarly();
    } else if (state === STATES.READY) {
      handleSuccess();
    }
  }

  function startWaiting() {
    state = STATES.WAITING;
    audio.playClick();
    renderBox('Wait for GREEN...', 'Do not click until the screen turns green!', STATES.WAITING);

    const delay = getRandomDelay(MIN_DELAY_MS, MAX_DELAY_MS, rng);
    timeoutId = setTimeout(() => {
      state = STATES.READY;
      promptTime = Clock.now();
      audio.playTone(880, 'sine', 0.15); // High beep
      renderBox('CLICK NOW!', 'Click as fast as you can!', STATES.READY);
    }, delay);
  }

  function handleEarly() {
    if (timeoutId) clearTimeout(timeoutId);
    state = STATES.EARLY;
    audio.playMismatch();
    renderBox('Too Early!', 'You clicked before green! Click to try this round again.', STATES.EARLY);
  }

  function handleSuccess() {
    const reactionTime = Math.round(Clock.now() - promptTime);
    state = STATES.RESULT;
    audio.playPop();
    rounds.push(reactionTime);
    updateDots();

    const best = getBestTime(rounds);
    onScoreUpdate(best);

    if (rounds.length < TOTAL_ROUNDS) {
      renderBox(`${reactionTime} ms`, `Round ${rounds.length}/${TOTAL_ROUNDS} complete. Click to continue.`, STATES.RESULT);
    } else {
      finishGame();
    }
  }

  function finishGame() {
    state = STATES.COMPLETE;
    const avg = calculateAverage(rounds);
    const best = getBestTime(rounds);

    audio.playVictory();
    renderBox(`${best} ms Peak`, `5-Round Average: ${avg} ms. Click to play again!`, STATES.RESULT);

    onGameWin({
      score: best,
      timeMs: best,
      averageMs: avg,
      rounds
    });
    onGameOver({
      score: best,
      timeMs: best,
      averageMs: avg
    });
  }

  return {
    async mount() {
      init();
    },
    start() {},
    pause() {
      if (timeoutId) clearTimeout(timeoutId);
    },
    resume() {},
    reset() {
      resetState();
    },
    destroy() {
      if (timeoutId) clearTimeout(timeoutId);
      if (inputManager) inputManager.destroy();
      empty(rootElement);
    }
  };
}

export default createGame;

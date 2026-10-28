/**
 * PixelPlay - Sequence Master Game Module
 */

import { PADS, getNextStep, validateStep } from './rules.js';
import { createElement, empty } from '../../utils/dom.js';
import { InputManager } from '../../utils/input-manager.js';

export function createGame(context) {
  const { rootElement, rng, audio, onScoreUpdate, onGameOver, onGameWin } = context;

  let sequence = [];
  let userStep = 0;
  let isPlayingSequence = false;
  let isGameOver = false;
  let boardElement = null;
  let statusElement = null;
  let inputManager = null;
  let padElements = [];
  let playbackTimeouts = [];

  function init() {
    empty(rootElement);
    const container = createElement('div', { className: 'sequence-container' });

    statusElement = createElement('div', {
      className: 'sequence-status',
      text: 'Press Start to Begin'
    });
    container.appendChild(statusElement);

    boardElement = createElement('div', {
      className: 'sequence-board',
      role: 'group',
      'aria-label': 'Sequence Pads'
    });

    padElements = [];
    PADS.forEach((pad) => {
      const padEl = createElement('button', {
        className: `sequence-pad pad-${pad.color}`,
        dataset: { id: pad.id },
        'aria-label': `${pad.name} pad (Key ${pad.key})`
      });
      padEl.addEventListener('click', () => handlePadPress(pad.id));
      padElements.push(padEl);
      boardElement.appendChild(padEl);
    });

    container.appendChild(boardElement);
    rootElement.appendChild(container);

    inputManager = new InputManager(window);
    inputManager.bindKey(['Digit1', 'Numpad1'], () => handlePadPress(0));
    inputManager.bindKey(['Digit2', 'Numpad2'], () => handlePadPress(1));
    inputManager.bindKey(['Digit3', 'Numpad3'], () => handlePadPress(2));
    inputManager.bindKey(['Digit4', 'Numpad4'], () => handlePadPress(3));

    resetState();
  }

  function resetState() {
    clearAllTimeouts();
    sequence = [];
    userStep = 0;
    isPlayingSequence = false;
    isGameOver = false;
    onScoreUpdate(0);
    updateStatus('Memorize the pattern!');
    advanceLevel();
  }

  function updateStatus(text) {
    if (statusElement) statusElement.textContent = text;
  }

  function clearAllTimeouts() {
    playbackTimeouts.forEach(t => clearTimeout(t));
    playbackTimeouts = [];
  }

  function advanceLevel() {
    sequence.push(getNextStep(rng));
    userStep = 0;
    onScoreUpdate(sequence.length - 1);
    playSequence();
  }

  function playSequence() {
    isPlayingSequence = true;
    updateStatus(`Level ${sequence.length}: Watch & Listen...`);

    let delay = 600;
    sequence.forEach((padId, index) => {
      const t1 = setTimeout(() => {
        flashPad(padId);
      }, delay);
      playbackTimeouts.push(t1);
      delay += 550;
    });

    const tEnd = setTimeout(() => {
      isPlayingSequence = false;
      updateStatus(`Your turn! (Level ${sequence.length})`);
    }, delay);
    playbackTimeouts.push(tEnd);
  }

  function flashPad(padId) {
    const el = padElements[padId];
    if (el) {
      el.classList.add('active');
      audio.playPad(padId);
      setTimeout(() => {
        el.classList.remove('active');
      }, 300);
    }
  }

  function handlePadPress(padId) {
    if (isPlayingSequence || isGameOver) return;

    flashPad(padId);

    const isValid = validateStep(sequence, userStep, padId);

    if (isValid) {
      userStep += 1;
      if (userStep === sequence.length) {
        // Round completed successfully!
        const currentScore = sequence.length;
        onScoreUpdate(currentScore);
        audio.playPop();

        if (currentScore >= 10) {
          onGameWin({ level: currentScore, score: currentScore * 10 });
        }

        updateStatus('Correct! Next level incoming...');
        const t = setTimeout(() => {
          advanceLevel();
        }, 900);
        playbackTimeouts.push(t);
      }
    } else {
      handleGameOver();
    }
  }

  function handleGameOver() {
    isGameOver = true;
    audio.playGameOver();
    updateStatus(`Game Over! You reached Level ${sequence.length}`);
    onGameOver({
      score: (sequence.length - 1) * 10,
      level: sequence.length
    });
  }

  return {
    async mount() {
      init();
    },
    start() {},
    pause() {
      clearAllTimeouts();
    },
    resume() {
      if (!isGameOver && isPlayingSequence) {
        playSequence();
      }
    },
    reset() {
      resetState();
    },
    destroy() {
      clearAllTimeouts();
      if (inputManager) inputManager.destroy();
      empty(rootElement);
    }
  };
}

export default createGame;

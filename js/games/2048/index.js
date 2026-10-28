/**
 * PixelPlay - 2048 Game Module
 */

import {
  BOARD_SIZE,
  createEmptyBoard,
  spawnRandomTile,
  moveBoard,
  hasWinningTile,
  isGameOver
} from './rules.js';
import { createElement, empty } from '../../utils/dom.js';
import { InputManager } from '../../utils/input-manager.js';

export function createGame(context) {
  const { rootElement, rng, audio, onScoreUpdate, onGameOver, onGameWin } = context;

  let board = createEmptyBoard();
  let score = 0;
  let hasWon = false;
  let keepPlayingAfterWin = false;
  let boardElement = null;
  let inputManager = null;

  function init() {
    empty(rootElement);
    const container = createElement('div', { className: 'game-2048-container' });
    boardElement = createElement('div', {
      className: 'game-2048-board',
      role: 'grid',
      'aria-label': '2048 Game Grid'
    });
    container.appendChild(boardElement);
    rootElement.appendChild(container);

    inputManager = new InputManager(window);
    inputManager.bindKey(['ArrowUp', 'KeyW'], () => handleMove('up'));
    inputManager.bindKey(['ArrowDown', 'KeyS'], () => handleMove('down'));
    inputManager.bindKey(['ArrowLeft', 'KeyA'], () => handleMove('left'));
    inputManager.bindKey(['ArrowRight', 'KeyD'], () => handleMove('right'));

    inputManager.onSwipe((dir) => {
      handleMove(dir);
    });

    resetState();
  }

  function resetState() {
    board = createEmptyBoard();
    score = 0;
    hasWon = false;
    keepPlayingAfterWin = false;
    spawnRandomTile(board, rng);
    spawnRandomTile(board, rng);
    onScoreUpdate(score);
    render();
  }

  function handleMove(direction) {
    const { newBoard, scoreGained, moved } = moveBoard(board, direction);
    if (!moved) return;

    board = newBoard;
    score += scoreGained;
    onScoreUpdate(score);

    if (scoreGained > 0) {
      audio.playMatch();
    } else {
      audio.playClick();
    }

    spawnRandomTile(board, rng);
    render();

    // Check Win
    if (!hasWon && hasWinningTile(board, 2048)) {
      hasWon = true;
      audio.playVictory();
      onGameWin({ score });
    }

    // Check Game Over
    if (isGameOver(board)) {
      audio.playGameOver();
      onGameOver({ score });
    }
  }

  function render() {
    if (!boardElement) return;
    empty(boardElement);

    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        const val = board[r][c];
        const cell = createElement('div', {
          className: 'game-2048-cell',
          dataset: { value: val },
          text: val > 0 ? String(val) : '',
          role: 'gridcell'
        });
        boardElement.appendChild(cell);
      }
    }
  }

  return {
    async mount() {
      init();
    },
    start() {
      // 2048 is turn/event-driven
    },
    pause() {
      // Nothing ongoing
    },
    resume() {
      // Nothing ongoing
    },
    reset() {
      resetState();
    },
    destroy() {
      if (inputManager) inputManager.destroy();
      empty(rootElement);
    }
  };
}

export default createGame;

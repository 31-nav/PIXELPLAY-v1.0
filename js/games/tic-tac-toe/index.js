/**
 * PixelPlay - Tic-Tac-Toe Game Module
 */

import {
  PLAYER_X,
  PLAYER_O,
  createEmptyBoard,
  checkWinner,
  getBestMoveMinimax,
  getRandomMove
} from './rules.js';
import { createElement, empty } from '../../utils/dom.js';

export function createGame(context) {
  const { rootElement, audio, onGameOver, onGameWin } = context;

  let board = createEmptyBoard();
  let currentPlayer = PLAYER_X;
  let isAgainstComputer = true;
  let computerDifficulty = 'hard'; // 'easy' or 'hard'
  let isGameOver = false;

  let boardElement = null;
  let statusElement = null;
  let aiTimeoutId = null;

  function init() {
    empty(rootElement);
    const container = createElement('div', { className: 'ttt-container' });

    // Mode Toggle
    const modeRow = createElement('div', { className: 'ttt-mode-select' }, [
      createElement('button', {
        className: 'btn btn-sm btn-primary',
        text: 'vs Computer (AI)',
        onClick: () => setMode(true)
      }),
      createElement('button', {
        className: 'btn btn-sm btn-outline',
        text: 'Local 2 Players',
        onClick: () => setMode(false)
      })
    ]);
    container.appendChild(modeRow);

    // Status
    statusElement = createElement('div', {
      className: 'ttt-status',
      text: "Player X's Turn"
    });
    container.appendChild(statusElement);

    // Board
    boardElement = createElement('div', {
      className: 'ttt-board',
      role: 'grid',
      'aria-label': 'Tic-Tac-Toe 3x3 Grid'
    });
    container.appendChild(boardElement);
    rootElement.appendChild(container);

    resetState();
  }

  function setMode(againstAi) {
    isAgainstComputer = againstAi;
    resetState();
  }

  function resetState() {
    if (aiTimeoutId) clearTimeout(aiTimeoutId);
    board = createEmptyBoard();
    currentPlayer = PLAYER_X;
    isGameOver = false;
    updateStatus("Player X's Turn");
    renderBoard();
  }

  function updateStatus(text) {
    if (statusElement) {
      statusElement.textContent = text;
    }
  }

  function handleCellClick(index) {
    if (isGameOver || board[index]) return;
    if (isAgainstComputer && currentPlayer === PLAYER_O) return;

    makeMove(index, currentPlayer);

    if (!isGameOver && isAgainstComputer && currentPlayer === PLAYER_O) {
      updateStatus('Computer is thinking...');
      aiTimeoutId = setTimeout(() => {
        const aiMove = computerDifficulty === 'hard'
          ? getBestMoveMinimax(board, PLAYER_O)
          : getRandomMove(board);
        if (aiMove !== -1) {
          makeMove(aiMove, PLAYER_O);
        }
      }, 250);
    }
  }

  function makeMove(index, player) {
    board[index] = player;
    audio.playClick();
    renderBoard();

    const outcome = checkWinner(board);

    if (outcome.winner) {
      isGameOver = true;
      highlightWinningCells(outcome.line);
      audio.playVictory();
      updateStatus(`Player ${outcome.winner} Wins!`);

      if (isAgainstComputer) {
        if (outcome.winner === PLAYER_X) {
          onGameWin({ winner: PLAYER_X, againstComputer: true });
        } else {
          onGameOver({ winner: PLAYER_O, score: 0 });
        }
      } else {
        onGameWin({ winner: outcome.winner, againstComputer: false });
      }
    } else if (outcome.isDraw) {
      isGameOver = true;
      audio.playPop();
      updateStatus("It's a Draw!");
      onGameOver({ draw: true, score: 0 });
    } else {
      currentPlayer = player === PLAYER_X ? PLAYER_O : PLAYER_X;
      updateStatus(`Player ${currentPlayer}'s Turn`);
    }
  }

  function highlightWinningCells(line) {
    if (!line || !boardElement) return;
    const cells = boardElement.querySelectorAll('.ttt-cell');
    line.forEach((idx) => {
      if (cells[idx]) cells[idx].classList.add('winner');
    });
  }

  function renderBoard() {
    if (!boardElement) return;
    empty(boardElement);

    for (let i = 0; i < 9; i++) {
      const val = board[i];
      const cell = createElement('button', {
        className: `ttt-cell ${val === 'X' ? 'cell-x' : val === 'O' ? 'cell-o' : ''}`,
        text: val || '',
        disabled: !!val || isGameOver,
        role: 'gridcell',
        'aria-label': `Cell ${i + 1}, ${val ? 'marked with ' + val : 'empty'}`
      });

      cell.addEventListener('click', () => handleCellClick(i));
      boardElement.appendChild(cell);
    }
  }

  return {
    async mount() {
      init();
    },
    start() {},
    pause() {},
    resume() {},
    reset() {
      resetState();
    },
    destroy() {
      if (aiTimeoutId) clearTimeout(aiTimeoutId);
      empty(rootElement);
    }
  };
}

export default createGame;

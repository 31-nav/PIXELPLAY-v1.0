/**
 * PixelPlay - Tic-Tac-Toe Rules & Minimax AI
 */

export const PLAYER_X = 'X';
export const PLAYER_O = 'O';

export const WINNING_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6]             // Diagonals
];

export function createEmptyBoard() {
  return Array(9).fill(null);
}

/**
 * Check winner
 * @param {Array<string|null>} board 
 * @returns {{ winner: string|null, line: number[]|null, isDraw: boolean }}
 */
export function checkWinner(board) {
  for (const line of WINNING_LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line, isDraw: false };
    }
  }

  const isFull = board.every(cell => cell !== null);
  return { winner: null, line: null, isDraw: isFull };
}

/**
 * Minimax algorithm for unbeatable AI
 */
export function getBestMoveMinimax(board, aiPlayer = PLAYER_O) {
  const humanPlayer = aiPlayer === PLAYER_O ? PLAYER_X : PLAYER_O;

  function minimax(currentBoard, depth, isMaximizing) {
    const outcome = checkWinner(currentBoard);
    if (outcome.winner === aiPlayer) return 10 - depth;
    if (outcome.winner === humanPlayer) return depth - 10;
    if (outcome.isDraw) return 0;

    if (isMaximizing) {
      let maxEval = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (!currentBoard[i]) {
          currentBoard[i] = aiPlayer;
          const evaluation = minimax(currentBoard, depth + 1, false);
          currentBoard[i] = null;
          maxEval = Math.max(maxEval, evaluation);
        }
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (let i = 0; i < 9; i++) {
        if (!currentBoard[i]) {
          currentBoard[i] = humanPlayer;
          const evaluation = minimax(currentBoard, depth + 1, true);
          currentBoard[i] = null;
          minEval = Math.min(minEval, evaluation);
        }
      }
      return minEval;
    }
  }

  let bestMove = -1;
  let bestValue = -Infinity;

  for (let i = 0; i < 9; i++) {
    if (!board[i]) {
      board[i] = aiPlayer;
      const moveValue = minimax(board, 0, false);
      board[i] = null;
      if (moveValue > bestValue) {
        bestValue = moveValue;
        bestMove = i;
      }
    }
  }

  return bestMove;
}

export function getRandomMove(board) {
  const available = [];
  for (let i = 0; i < 9; i++) {
    if (!board[i]) available.push(i);
  }
  if (available.length === 0) return -1;
  return available[Math.floor(Math.random() * available.length)];
}

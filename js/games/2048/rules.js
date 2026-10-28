/**
 * PixelPlay - 2048 Game Rules & Matrix Merge Logic
 */

export const BOARD_SIZE = 4;

export function createEmptyBoard(size = BOARD_SIZE) {
  return Array.from({ length: size }, () => Array(size).fill(0));
}

export function getEmptyCells(board) {
  const emptyCells = [];
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[r].length; c++) {
      if (board[r][c] === 0) {
        emptyCells.push({ r, c });
      }
    }
  }
  return emptyCells;
}

export function spawnRandomTile(board, rng = null) {
  const empties = getEmptyCells(board);
  if (empties.length === 0) return null;

  const randIndex = rng 
    ? Math.floor(rng.next() * empties.length) 
    : Math.floor(Math.random() * empties.length);
  const { r, c } = empties[randIndex];

  // 90% chance of 2, 10% chance of 4
  const randVal = rng ? rng.next() : Math.random();
  const value = randVal < 0.9 ? 2 : 4;
  board[r][c] = value;
  return { r, c, value };
}

/**
 * Slide and merge a single 1D row/column towards the left.
 * Guarantees that each tile can merge at most ONCE per slide.
 * @param {number[]} line 
 * @returns {{ line: number[], score: number, moved: boolean }}
 */
export function slideAndMergeLine(line) {
  const nonZeros = line.filter(v => v !== 0);
  const result = [];
  let scoreGained = 0;
  let i = 0;

  while (i < nonZeros.length) {
    if (i + 1 < nonZeros.length && nonZeros[i] === nonZeros[i + 1]) {
      const mergedVal = nonZeros[i] * 2;
      result.push(mergedVal);
      scoreGained += mergedVal;
      i += 2; // skip both merged tiles
    } else {
      result.push(nonZeros[i]);
      i += 1;
    }
  }

  while (result.length < line.length) {
    result.push(0);
  }

  const moved = result.some((val, idx) => val !== line[idx]);
  return { line: result, score: scoreGained, moved };
}

/**
 * Move the 4x4 matrix in a direction: 'left', 'right', 'up', 'down'
 * @param {number[][]} board 
 * @param {'left'|'right'|'up'|'down'} direction 
 * @returns {{ newBoard: number[][], scoreGained: number, moved: boolean }}
 */
export function moveBoard(board, direction) {
  const size = board.length;
  let newBoard = createEmptyBoard(size);
  let totalScoreGained = 0;
  let anyMoved = false;

  if (direction === 'left') {
    for (let r = 0; r < size; r++) {
      const res = slideAndMergeLine(board[r]);
      newBoard[r] = res.line;
      totalScoreGained += res.score;
      if (res.moved) anyMoved = true;
    }
  } else if (direction === 'right') {
    for (let r = 0; r < size; r++) {
      const reversed = [...board[r]].reverse();
      const res = slideAndMergeLine(reversed);
      newBoard[r] = res.line.reverse();
      totalScoreGained += res.score;
      if (res.moved) anyMoved = true;
    }
  } else if (direction === 'up') {
    for (let c = 0; c < size; c++) {
      const column = [board[0][c], board[1][c], board[2][c], board[3][c]];
      const res = slideAndMergeLine(column);
      for (let r = 0; r < size; r++) {
        newBoard[r][c] = res.line[r];
      }
      totalScoreGained += res.score;
      if (res.moved) anyMoved = true;
    }
  } else if (direction === 'down') {
    for (let c = 0; c < size; c++) {
      const column = [board[3][c], board[2][c], board[1][c], board[0][c]];
      const res = slideAndMergeLine(column);
      const reversedResult = res.line.reverse();
      for (let r = 0; r < size; r++) {
        newBoard[r][c] = reversedResult[r];
      }
      totalScoreGained += res.score;
      if (res.moved) anyMoved = true;
    }
  }

  return { newBoard, scoreGained: totalScoreGained, moved: anyMoved };
}

export function hasWinningTile(board, winValue = 2048) {
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[r].length; c++) {
      if (board[r][c] >= winValue) return true;
    }
  }
  return false;
}

export function isGameOver(board) {
  // Empty cell exists?
  if (getEmptyCells(board).length > 0) return false;

  const size = board.length;
  // Check horizontal and vertical adjacent matches
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const val = board[r][c];
      if (c + 1 < size && board[r][c + 1] === val) return false;
      if (r + 1 < size && board[r + 1][c] === val) return false;
    }
  }
  return true;
}

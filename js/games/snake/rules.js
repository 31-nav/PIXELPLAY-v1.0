/**
 * PixelPlay - Snake Game Rules & Pure Logic
 */

export const GRID_SIZE = 20;
export const INITIAL_SPEED_MS = 140;
export const MIN_SPEED_MS = 60;
export const SPEED_STEP_MS = 4;

export const DIRECTIONS = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 }
};

export function isOppositeDirection(dirA, dirB) {
  return dirA.x + dirB.x === 0 && dirA.y + dirB.y === 0;
}

export function createInitialSnake() {
  return [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 }
  ];
}

export function spawnFood(snake, gridSize = GRID_SIZE, rng = null) {
  const occupied = new Set(snake.map(seg => `${seg.x},${seg.y}`));
  const available = [];

  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      if (!occupied.has(`${x},${y}`)) {
        available.push({ x, y });
      }
    }
  }

  if (available.length === 0) return null;

  const index = rng 
    ? Math.floor(rng.next() * available.length)
    : Math.floor(Math.random() * available.length);

  return available[index];
}

export function checkCollision(head, snakeBody, gridSize = GRID_SIZE) {
  // Wall collision
  if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) {
    return true;
  }
  // Self collision
  for (const segment of snakeBody) {
    if (segment.x === head.x && segment.y === head.y) {
      return true;
    }
  }
  return false;
}

export function calculateSpeed(score) {
  return Math.max(MIN_SPEED_MS, INITIAL_SPEED_MS - score * SPEED_STEP_MS);
}

/**
 * PixelPlay - Brick Breaker Rules & Physics Calculations
 */

export const CANVAS_WIDTH = 480;
export const CANVAS_HEIGHT = 420;

export const PADDLE_WIDTH = 84;
export const PADDLE_HEIGHT = 12;
export const BALL_RADIUS = 6;
export const INITIAL_LIVES = 3;

export const BRICK_ROWS = 5;
export const BRICK_COLS = 8;
export const BRICK_HEIGHT = 16;
export const BRICK_PADDING = 6;
export const BRICK_OFFSET_TOP = 40;
export const BRICK_OFFSET_LEFT = 20;

export const ROW_COLORS = [
  '#FF6B6B', // Red
  '#FFB347', // Orange
  '#FFE66D', // Yellow
  '#42E8B4', // Mint Green
  '#7867FF'  // Violet
];

export const ROW_SCORES = [50, 40, 30, 20, 10];

export function createBricks(rows = BRICK_ROWS, cols = BRICK_COLS) {
  const bricks = [];
  for (let r = 0; r < rows; r++) {
    bricks[r] = [];
    for (let c = 0; c < cols; c++) {
      bricks[r][c] = {
        status: 1,
        color: ROW_COLORS[r % ROW_COLORS.length],
        points: ROW_SCORES[r % ROW_SCORES.length]
      };
    }
  }
  return bricks;
}

/**
 * Check if all bricks in layout are cleared
 * @param {Array<Array<{status: number}>>} bricks 
 * @returns {boolean}
 */
export function areAllBricksDestroyed(bricks) {
  for (let r = 0; r < bricks.length; r++) {
    for (let c = 0; c < bricks[r].length; c++) {
      if (bricks[r][c].status === 1) return false;
    }
  }
  return true;
}

/**
 * Calculate reflection angle when ball hits paddle
 * @param {number} ballX 
 * @param {number} paddleX 
 * @param {number} paddleWidth 
 * @returns {{ dx: number, dy: number }}
 */
export function calculatePaddleBounce(ballX, paddleX, paddleWidth, speed = 4) {
  // Hit offset from -1 (left edge) to 1 (right edge)
  const relativeIntersect = (ballX - (paddleX + paddleWidth / 2)) / (paddleWidth / 2);
  const clamped = Math.max(-0.9, Math.min(0.9, relativeIntersect));
  const maxBounceAngle = (5 * Math.PI) / 12; // 75 degrees
  const bounceAngle = clamped * maxBounceAngle;

  return {
    dx: speed * Math.sin(bounceAngle),
    dy: -speed * Math.cos(bounceAngle)
  };
}

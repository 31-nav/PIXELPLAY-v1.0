/**
 * PixelPlay - Endless Runner ("Cyber Dash") Rules & Physics
 */

export const CANVAS_WIDTH = 640;
export const CANVAS_HEIGHT = 320;
export const GROUND_Y = 270;

export const GRAVITY = 0.65;
export const JUMP_FORCE = -11.5;

export const PLAYER_WIDTH = 26;
export const PLAYER_HEIGHT = 38;

export const INITIAL_SPEED = 4.5;
export const MAX_SPEED = 11.0;
export const SPEED_ACCELERATION = 0.0008;

export function checkAABBCollision(rectA, rectB) {
  return (
    rectA.x < rectB.x + rectB.width &&
    rectA.x + rectA.width > rectB.x &&
    rectA.y < rectB.y + rectB.height &&
    rectA.y + rectA.height > rectB.y
  );
}

export function spawnObstacle(canvasWidth = CANVAS_WIDTH, rng = null) {
  const types = [
    { width: 20, height: 32, type: 'spike', color: '#FF6B6B' },
    { width: 34, height: 42, type: 'block', color: '#FFB347' },
    { width: 44, height: 28, type: 'barrier', color: '#7867FF' }
  ];

  const idx = rng
    ? Math.floor(rng.next() * types.length)
    : Math.floor(Math.random() * types.length);

  const chosen = types[idx];
  return {
    x: canvasWidth,
    y: GROUND_Y - chosen.height,
    width: chosen.width,
    height: chosen.height,
    type: chosen.type,
    color: chosen.color
  };
}

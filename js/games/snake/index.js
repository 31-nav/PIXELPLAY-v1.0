/**
 * PixelPlay - Snake Game Module
 */

import {
  GRID_SIZE,
  DIRECTIONS,
  isOppositeDirection,
  createInitialSnake,
  spawnFood,
  checkCollision,
  calculateSpeed
} from './rules.js';
import { createElement, empty } from '../../utils/dom.js';
import { InputManager } from '../../utils/input-manager.js';

export function createGame(context) {
  const { rootElement, rng, audio, onScoreUpdate, onGameOver } = context;

  let canvas = null;
  let ctx = null;
  let inputManager = null;
  let timerId = null;

  let snake = [];
  let direction = DIRECTIONS.RIGHT;
  let nextDirection = DIRECTIONS.RIGHT;
  let food = null;
  let score = 0;
  let isRunning = false;
  let isPaused = false;

  const CANVAS_RESOLUTION = 400;
  const CELL_SIZE = CANVAS_RESOLUTION / GRID_SIZE;

  function init() {
    empty(rootElement);
    const container = createElement('div', { className: 'snake-container' });
    canvas = createElement('canvas', {
      className: 'snake-canvas',
      width: CANVAS_RESOLUTION,
      height: CANVAS_RESOLUTION
    });
    container.appendChild(canvas);
    rootElement.appendChild(container);

    ctx = canvas.getContext('2d');

    // Input bindings
    inputManager = new InputManager(window);
    inputManager.bindKey(['ArrowUp', 'KeyW'], () => setDirection(DIRECTIONS.UP));
    inputManager.bindKey(['ArrowDown', 'KeyS'], () => setDirection(DIRECTIONS.DOWN));
    inputManager.bindKey(['ArrowLeft', 'KeyA'], () => setDirection(DIRECTIONS.LEFT));
    inputManager.bindKey(['ArrowRight', 'KeyD'], () => setDirection(DIRECTIONS.RIGHT));

    inputManager.onSwipe((dir) => {
      if (dir === 'up') setDirection(DIRECTIONS.UP);
      if (dir === 'down') setDirection(DIRECTIONS.DOWN);
      if (dir === 'left') setDirection(DIRECTIONS.LEFT);
      if (dir === 'right') setDirection(DIRECTIONS.RIGHT);
    });

    resetState();
    render();
  }

  function resetState() {
    snake = createInitialSnake();
    direction = DIRECTIONS.RIGHT;
    nextDirection = DIRECTIONS.RIGHT;
    score = 0;
    isRunning = false;
    isPaused = false;
    food = spawnFood(snake, GRID_SIZE, rng);
    onScoreUpdate(score);
  }

  function setDirection(newDir) {
    if (!isRunning || isPaused) return;
    if (!isOppositeDirection(direction, newDir)) {
      nextDirection = newDir;
    }
  }

  function tick() {
    if (!isRunning || isPaused) return;

    direction = nextDirection;
    const head = {
      x: snake[0].x + direction.x,
      y: snake[0].y + direction.y
    };

    // Check collisions
    if (checkCollision(head, snake, GRID_SIZE)) {
      handleDeath();
      return;
    }

    snake.unshift(head);

    // Food consumed?
    if (food && head.x === food.x && head.y === food.y) {
      score += 10;
      audio.playEat();
      onScoreUpdate(score);
      food = spawnFood(snake, GRID_SIZE, rng);
    } else {
      snake.pop();
    }

    render();

    // Schedule next frame with dynamic speed
    const currentSpeed = calculateSpeed(score);
    timerId = setTimeout(tick, currentSpeed);
  }

  function handleDeath() {
    isRunning = false;
    audio.playGameOver();
    onGameOver({ score });
    render(true);
  }

  function render(isGameOver = false) {
    if (!ctx) return;

    // Clear background
    ctx.fillStyle = '#0E0D18';
    ctx.fillRect(0, 0, CANVAS_RESOLUTION, CANVAS_RESOLUTION);

    // Subtle grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL_SIZE, 0);
      ctx.lineTo(i * CELL_SIZE, CANVAS_RESOLUTION);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i * CELL_SIZE);
      ctx.lineTo(CANVAS_RESOLUTION, i * CELL_SIZE);
      ctx.stroke();
    }

    // Render Food
    if (food) {
      ctx.fillStyle = '#FF6B6B';
      ctx.shadowColor = '#FF6B6B';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      const fx = food.x * CELL_SIZE + CELL_SIZE / 2;
      const fy = food.y * CELL_SIZE + CELL_SIZE / 2;
      ctx.arc(fx, fy, CELL_SIZE / 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // Render Snake Body
    snake.forEach((seg, index) => {
      const isHead = index === 0;
      ctx.fillStyle = isHead ? '#42E8B4' : '#2CD6A0';
      if (isGameOver) ctx.fillStyle = '#FF6B6B';

      ctx.shadowColor = isHead ? '#42E8B4' : '#2CD6A0';
      ctx.shadowBlur = isHead ? 10 : 4;

      const px = seg.x * CELL_SIZE + 1.5;
      const py = seg.y * CELL_SIZE + 1.5;
      const pSize = CELL_SIZE - 3;
      const radius = isHead ? 6 : 3;

      ctx.beginPath();
      ctx.roundRect(px, py, pSize, pSize, radius);
      ctx.fill();
      ctx.shadowBlur = 0;
    });
  }

  return {
    async mount() {
      init();
    },
    start() {
      if (!isRunning) {
        isRunning = true;
        isPaused = false;
        tick();
      }
    },
    pause() {
      isPaused = true;
      if (timerId) clearTimeout(timerId);
    },
    resume() {
      if (isRunning && isPaused) {
        isPaused = false;
        tick();
      }
    },
    reset() {
      if (timerId) clearTimeout(timerId);
      resetState();
      isRunning = true;
      tick();
    },
    destroy() {
      isRunning = false;
      isPaused = false;
      if (timerId) clearTimeout(timerId);
      if (inputManager) inputManager.destroy();
      empty(rootElement);
    }
  };
}

export default createGame;

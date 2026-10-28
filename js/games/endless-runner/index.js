/**
 * PixelPlay - Endless Runner ("Cyber Dash") Game Module
 */

import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  GROUND_Y,
  GRAVITY,
  JUMP_FORCE,
  PLAYER_WIDTH,
  PLAYER_HEIGHT,
  INITIAL_SPEED,
  MAX_SPEED,
  SPEED_ACCELERATION,
  checkAABBCollision,
  spawnObstacle
} from './rules.js';
import { createElement, empty } from '../../utils/dom.js';
import { InputManager } from '../../utils/input-manager.js';

export function createGame(context) {
  const { rootElement, rng, audio, onScoreUpdate, onGameOver } = context;

  let canvas = null;
  let ctx = null;
  let animFrameId = null;
  let inputManager = null;

  // Player state
  let playerX = 60;
  let playerY = GROUND_Y - PLAYER_HEIGHT;
  let vy = 0;
  let isGrounded = true;

  // World state
  let speed = INITIAL_SPEED;
  let distance = 0;
  let obstacles = [];
  let nextObstacleTimer = 80;
  let isRunning = false;
  let isPaused = false;
  let groundOffset = 0;

  function init() {
    empty(rootElement);
    const container = createElement('div', { className: 'runner-container' });
    canvas = createElement('canvas', {
      className: 'runner-canvas',
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT
    });
    container.appendChild(canvas);
    rootElement.appendChild(container);

    ctx = canvas.getContext('2d');

    inputManager = new InputManager(window);
    inputManager.bindKey(['Space', 'ArrowUp', 'KeyW'], () => jump());

    canvas.addEventListener('pointerdown', () => jump());

    resetState();
    render();
  }

  function resetState() {
    playerY = GROUND_Y - PLAYER_HEIGHT;
    vy = 0;
    isGrounded = true;
    speed = INITIAL_SPEED;
    distance = 0;
    obstacles = [];
    nextObstacleTimer = 90;
    groundOffset = 0;
    onScoreUpdate(0);
  }

  function jump() {
    if (!isRunning || isPaused) return;
    if (isGrounded) {
      vy = JUMP_FORCE;
      isGrounded = false;
      audio.playJump();
    }
  }

  function loop() {
    if (!isRunning || isPaused) return;

    update();
    render();

    animFrameId = requestAnimationFrame(loop);
  }

  function update() {
    // Player physics
    vy += GRAVITY;
    playerY += vy;

    if (playerY >= GROUND_Y - PLAYER_HEIGHT) {
      playerY = GROUND_Y - PLAYER_HEIGHT;
      vy = 0;
      isGrounded = true;
    }

    // World progression
    distance += speed * 0.05;
    speed = Math.min(MAX_SPEED, speed + SPEED_ACCELERATION);
    groundOffset = (groundOffset + speed) % 40;
    onScoreUpdate(Math.floor(distance));

    // Spawn obstacles
    nextObstacleTimer -= 1;
    if (nextObstacleTimer <= 0) {
      obstacles.push(spawnObstacle(CANVAS_WIDTH, rng));
      // Random gap between obstacles
      const gapBonus = rng ? Math.floor(rng.next() * 50) : Math.floor(Math.random() * 50);
      nextObstacleTimer = Math.max(50, Math.floor(130 - speed * 4) + gapBonus);
    }

    // Update & check obstacles
    const playerRect = {
      x: playerX + 3,
      y: playerY + 3,
      width: PLAYER_WIDTH - 6,
      height: PLAYER_HEIGHT - 6
    };

    for (let i = obstacles.length - 1; i >= 0; i--) {
      const obs = obstacles[i];
      obs.x -= speed;

      // Collision check
      if (checkAABBCollision(playerRect, obs)) {
        handleDeath();
        return;
      }

      // Despawn offscreen
      if (obs.x + obs.width < 0) {
        obstacles.splice(i, 1);
      }
    }
  }

  function handleDeath() {
    isRunning = false;
    audio.playHit();
    audio.playGameOver();
    const finalDistance = Math.floor(distance);
    onGameOver({
      score: finalDistance,
      distance: finalDistance
    });
  }

  function render() {
    if (!ctx) return;

    // Clear background
    ctx.fillStyle = '#0B0A14';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Neon grid background lines
    ctx.strokeStyle = 'rgba(120, 103, 255, 0.08)';
    ctx.lineWidth = 1;
    for (let x = -groundOffset; x < CANVAS_WIDTH; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, GROUND_Y);
      ctx.stroke();
    }

    // Draw Ground Line
    ctx.strokeStyle = '#42E8B4';
    ctx.lineWidth = 3;
    ctx.shadowColor = '#42E8B4';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.moveTo(0, GROUND_Y);
    ctx.lineTo(CANVAS_WIDTH, GROUND_Y);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Draw Obstacles
    obstacles.forEach((obs) => {
      ctx.fillStyle = obs.color;
      ctx.shadowColor = obs.color;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      if (obs.type === 'spike') {
        ctx.moveTo(obs.x, GROUND_Y);
        ctx.lineTo(obs.x + obs.width / 2, obs.y);
        ctx.lineTo(obs.x + obs.width, GROUND_Y);
        ctx.closePath();
      } else {
        ctx.roundRect(obs.x, obs.y, obs.width, obs.height, 4);
      }
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    // Draw Player Runner
    ctx.fillStyle = '#7867FF';
    ctx.shadowColor = '#7867FF';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.roundRect(playerX, playerY, PLAYER_WIDTH, PLAYER_HEIGHT, 6);
    ctx.fill();

    // Eye visor
    ctx.fillStyle = '#42E8B4';
    ctx.fillRect(playerX + PLAYER_WIDTH - 9, playerY + 8, 6, 4);
    ctx.shadowBlur = 0;

    // HUD distance
    ctx.fillStyle = '#F5F5FA';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText(`${Math.floor(distance)} m`, CANVAS_WIDTH - 70, 30);
  }

  return {
    async mount() {
      init();
    },
    start() {
      if (!isRunning) {
        isRunning = true;
        isPaused = false;
        loop();
      }
    },
    pause() {
      isPaused = true;
      if (animFrameId) cancelAnimationFrame(animFrameId);
    },
    resume() {
      if (isRunning && isPaused) {
        isPaused = false;
        loop();
      }
    },
    reset() {
      if (animFrameId) cancelAnimationFrame(animFrameId);
      resetState();
      isRunning = true;
      isPaused = false;
      loop();
    },
    destroy() {
      isRunning = false;
      isPaused = false;
      if (animFrameId) cancelAnimationFrame(animFrameId);
      if (inputManager) inputManager.destroy();
      empty(rootElement);
    }
  };
}

export default createGame;

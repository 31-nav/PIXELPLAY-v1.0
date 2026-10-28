/**
 * PixelPlay - Brick Breaker Game Module
 */

import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  PADDLE_WIDTH,
  PADDLE_HEIGHT,
  BALL_RADIUS,
  INITIAL_LIVES,
  BRICK_ROWS,
  BRICK_COLS,
  BRICK_HEIGHT,
  BRICK_PADDING,
  BRICK_OFFSET_TOP,
  BRICK_OFFSET_LEFT,
  createBricks,
  areAllBricksDestroyed,
  calculatePaddleBounce
} from './rules.js';
import { createElement, empty } from '../../utils/dom.js';
import { InputManager } from '../../utils/input-manager.js';

export function createGame(context) {
  const { rootElement, audio, onScoreUpdate, onGameOver, onGameWin } = context;

  let canvas = null;
  let ctx = null;
  let animFrameId = null;
  let inputManager = null;

  let paddleX = (CANVAS_WIDTH - PADDLE_WIDTH) / 2;
  let ballX = CANVAS_WIDTH / 2;
  let ballY = CANVAS_HEIGHT - 35;
  let ballSpeed = 4.5;
  let dx = 3;
  let dy = -3.5;

  let bricks = [];
  let score = 0;
  let lives = INITIAL_LIVES;
  let level = 1;
  let isRunning = false;
  let isPaused = false;
  let isBallLaunched = false;

  let rightPressed = false;
  let leftPressed = false;

  const brickWidth = Math.floor(
    (CANVAS_WIDTH - (BRICK_OFFSET_LEFT * 2) - ((BRICK_COLS - 1) * BRICK_PADDING)) / BRICK_COLS
  );

  function init() {
    empty(rootElement);
    const container = createElement('div', { className: 'brick-breaker-container' });
    canvas = createElement('canvas', {
      className: 'brick-canvas',
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT
    });
    container.appendChild(canvas);
    rootElement.appendChild(container);

    ctx = canvas.getContext('2d');

    // Controls
    inputManager = new InputManager(window);
    inputManager.bindKey(['ArrowRight', 'KeyD'], () => { rightPressed = true; });
    inputManager.bindKey(['ArrowLeft', 'KeyA'], () => { leftPressed = true; });
    inputManager.bindKey(['Space'], () => {
      if (!isBallLaunched) isBallLaunched = true;
    });

    window.addEventListener('keyup', handleKeyUp);

    // Mouse and Touch control for paddle
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('click', () => {
      if (!isBallLaunched) isBallLaunched = true;
    });

    resetState();
    render();
  }

  function handleKeyUp(e) {
    if (e.key === 'ArrowRight' || e.code === 'KeyD') rightPressed = false;
    if (e.key === 'ArrowLeft' || e.code === 'KeyA') leftPressed = false;
  }

  function handleMouseMove(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = CANVAS_WIDTH / rect.width;
    const clientX = (e.clientX - rect.left) * scaleX;
    paddleX = Math.max(0, Math.min(CANVAS_WIDTH - PADDLE_WIDTH, clientX - PADDLE_WIDTH / 2));
    if (!isBallLaunched) {
      ballX = paddleX + PADDLE_WIDTH / 2;
    }
  }

  function handleTouchMove(e) {
    e.preventDefault();
    if (e.touches.length > 0) {
      const rect = canvas.getBoundingClientRect();
      const scaleX = CANVAS_WIDTH / rect.width;
      const clientX = (e.touches[0].clientX - rect.left) * scaleX;
      paddleX = Math.max(0, Math.min(CANVAS_WIDTH - PADDLE_WIDTH, clientX - PADDLE_WIDTH / 2));
      if (!isBallLaunched) {
        ballX = paddleX + PADDLE_WIDTH / 2;
      }
    }
  }

  function resetState() {
    paddleX = (CANVAS_WIDTH - PADDLE_WIDTH) / 2;
    ballX = paddleX + PADDLE_WIDTH / 2;
    ballY = CANVAS_HEIGHT - 30;
    ballSpeed = 4.5 + (level - 1) * 0.5;
    dx = 3;
    dy = -3.5;
    bricks = createBricks();
    score = 0;
    lives = INITIAL_LIVES;
    isBallLaunched = false;
    onScoreUpdate(score);
  }

  function resetBall() {
    isBallLaunched = false;
    paddleX = (CANVAS_WIDTH - PADDLE_WIDTH) / 2;
    ballX = paddleX + PADDLE_WIDTH / 2;
    ballY = CANVAS_HEIGHT - 30;
    dx = 3;
    dy = -3.5;
  }

  function loop() {
    if (!isRunning || isPaused) return;

    update();
    render();

    animFrameId = requestAnimationFrame(loop);
  }

  function update() {
    // Keyboard paddle movement
    if (rightPressed) {
      paddleX = Math.min(CANVAS_WIDTH - PADDLE_WIDTH, paddleX + 7);
      if (!isBallLaunched) ballX = paddleX + PADDLE_WIDTH / 2;
    } else if (leftPressed) {
      paddleX = Math.max(0, paddleX - 7);
      if (!isBallLaunched) ballX = paddleX + PADDLE_WIDTH / 2;
    }

    if (!isBallLaunched) return;

    ballX += dx;
    ballY += dy;

    // Wall collisions (Left & Right)
    if (ballX - BALL_RADIUS <= 0) {
      ballX = BALL_RADIUS;
      dx = -dx;
      audio.playHit();
    } else if (ballX + BALL_RADIUS >= CANVAS_WIDTH) {
      ballX = CANVAS_WIDTH - BALL_RADIUS;
      dx = -dx;
      audio.playHit();
    }

    // Top wall collision
    if (ballY - BALL_RADIUS <= 0) {
      ballY = BALL_RADIUS;
      dy = -dy;
      audio.playHit();
    }

    // Bottom out / Paddle collision
    const paddleTop = CANVAS_HEIGHT - 20;
    if (ballY + BALL_RADIUS >= paddleTop && ballY - BALL_RADIUS <= paddleTop + PADDLE_HEIGHT) {
      if (ballX >= paddleX && ballX <= paddleX + PADDLE_WIDTH) {
        const bounce = calculatePaddleBounce(ballX, paddleX, PADDLE_WIDTH, ballSpeed);
        dx = bounce.dx;
        dy = bounce.dy;
        audio.playPop();
      }
    } else if (ballY - BALL_RADIUS > CANVAS_HEIGHT) {
      // Ball lost
      lives -= 1;
      audio.playMismatch();
      if (lives <= 0) {
        isRunning = false;
        audio.playGameOver();
        onGameOver({ score, level });
      } else {
        resetBall();
      }
    }

    // Brick Collisions
    for (let r = 0; r < BRICK_ROWS; r++) {
      for (let c = 0; c < BRICK_COLS; c++) {
        const b = bricks[r][c];
        if (b.status === 1) {
          const bx = c * (brickWidth + BRICK_PADDING) + BRICK_OFFSET_LEFT;
          const by = r * (BRICK_HEIGHT + BRICK_PADDING) + BRICK_OFFSET_TOP;

          if (
            ballX + BALL_RADIUS > bx &&
            ballX - BALL_RADIUS < bx + brickWidth &&
            ballY + BALL_RADIUS > by &&
            ballY - BALL_RADIUS < by + BRICK_HEIGHT
          ) {
            dy = -dy;
            b.status = 0;
            score += b.points;
            onScoreUpdate(score);
            audio.playEat();

            // Check level clear
            if (areAllBricksDestroyed(bricks)) {
              level += 1;
              audio.playVictory();
              onGameWin({ score, level });
              bricks = createBricks();
              resetBall();
            }
            return;
          }
        }
      }
    }
  }

  function render() {
    if (!ctx) return;

    // Clear background
    ctx.fillStyle = '#0E0D18';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw Bricks
    for (let r = 0; r < BRICK_ROWS; r++) {
      for (let c = 0; c < BRICK_COLS; c++) {
        const b = bricks[r][c];
        if (b.status === 1) {
          const bx = c * (brickWidth + BRICK_PADDING) + BRICK_OFFSET_LEFT;
          const by = r * (BRICK_HEIGHT + BRICK_PADDING) + BRICK_OFFSET_TOP;
          ctx.fillStyle = b.color;
          ctx.beginPath();
          ctx.roundRect(bx, by, brickWidth, BRICK_HEIGHT, 3);
          ctx.fill();
        }
      }
    }

    // Draw Paddle
    ctx.fillStyle = '#42E8B4';
    ctx.shadowColor = '#42E8B4';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.roundRect(paddleX, CANVAS_HEIGHT - 20, PADDLE_WIDTH, PADDLE_HEIGHT, 6);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Draw Ball
    ctx.fillStyle = '#FFFFFF';
    ctx.shadowColor = '#7867FF';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(ballX, ballY, BALL_RADIUS, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Draw HUD: Lives
    ctx.fillStyle = '#F5F5FA';
    ctx.font = '12px sans-serif';
    ctx.fillText(`Lives: ${'❤️ '.repeat(Math.max(0, lives))}`, 20, 24);
    ctx.fillText(`Level: ${level}`, CANVAS_WIDTH - 80, 24);

    if (!isBallLaunched && isRunning) {
      ctx.fillStyle = '#B7B4CF';
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Press SPACE or Click to Launch Ball', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 60);
      ctx.textAlign = 'left';
    }
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
      level = 1;
      resetState();
      isRunning = true;
      isPaused = false;
      loop();
    },
    destroy() {
      isRunning = false;
      isPaused = false;
      if (animFrameId) cancelAnimationFrame(animFrameId);
      window.removeEventListener('keyup', handleKeyUp);
      if (canvas) {
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('touchmove', handleTouchMove);
      }
      if (inputManager) inputManager.destroy();
      empty(rootElement);
    }
  };
}

export default createGame;

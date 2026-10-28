/**
 * PixelPlay - Unified Game Player View & Shell
 */

import { createElement, empty } from '../utils/dom.js';
import { getGameById } from '../game-registry.js';
import { gameLifecycle } from '../game-lifecycle.js';
import { audio } from '../services/audio.js';
import { statistics } from '../services/statistics.js';
import { recentGames } from '../services/recent-games.js';
import { dailyChallenge } from '../services/daily-challenge.js';
import { createLoadingState } from '../components/loading-state.js';
import { createEmptyState } from '../components/empty-state.js';
import { notification } from '../services/notification.js';

export async function renderGamePlayerPage(container, gameId, isDailyChallenge = false) {
  empty(container);

  const game = getGameById(gameId);
  if (!game) {
    container.appendChild(createEmptyState({
      icon: '👾',
      title: 'Game Not Found',
      description: `The requested game ID "${gameId}" does not exist in the PixelPlay library.`,
      action: {
        label: 'Return to Library',
        onClick: () => { window.location.hash = '#/games'; }
      }
    }));
    return;
  }

  // Record into recently played
  recentGames.recordPlay(gameId);

  const playerContainer = createElement('div', { className: 'game-player-container' });

  // 1. Game Shell Header
  const header = createElement('div', { className: 'game-shell-header' });

  const titleGroup = createElement('div', { className: 'game-shell-title-group' }, [
    createElement('a', {
      href: isDailyChallenge ? '#/daily' : '#/games',
      className: 'btn btn-sm btn-outline',
      'aria-label': 'Back to Library',
      text: '← Back'
    }),
    createElement('h1', {
      className: 'game-shell-title',
      text: `${game.icon} ${game.name}`
    })
  ]);

  if (isDailyChallenge) {
    titleGroup.appendChild(createElement('span', {
      className: 'badge badge-secondary',
      text: '⭐ Daily Challenge'
    }));
  }
  header.appendChild(titleGroup);

  // Score Boxes
  const stats = statistics.getGameStats(game.id);
  const scoreBox = createElement('div', { className: 'score-box' }, [
    createElement('span', { className: 'score-box-label', text: 'Score' }),
    createElement('span', { className: 'score-box-value', id: 'live-score', text: '0' })
  ]);

  let bestValText = '0';
  if (game.id === 'reaction-rush' && stats.highScore > 0) {
    bestValText = `${stats.highScore}ms`;
  } else if (game.id === 'memory-match' && stats.bestTime !== null) {
    bestValText = `${(stats.bestTime / 1000).toFixed(1)}s`;
  } else if (stats.highScore > 0) {
    bestValText = stats.highScore.toLocaleString();
  }

  const bestBox = createElement('div', { className: 'score-box' }, [
    createElement('span', { className: 'score-box-label', text: 'Best' }),
    createElement('span', { className: 'score-box-value best', id: 'best-score', text: bestValText })
  ]);

  const scoreGroup = createElement('div', { className: 'game-shell-scores' }, [scoreBox, bestBox]);
  header.appendChild(scoreGroup);

  // Shell Action Buttons (Pause, Restart, Sound, Fullscreen)
  const actionsGroup = createElement('div', { className: 'game-shell-actions' });

  const pauseBtn = createElement('button', {
    className: 'btn-icon btn-outline',
    'aria-label': 'Pause game',
    text: '⏸',
    onClick: () => {
      if (gameLifecycle.isGamePaused()) {
        gameLifecycle.resume();
        pauseBtn.textContent = '⏸';
        hideOverlay();
      } else {
        gameLifecycle.pause();
        pauseBtn.textContent = '▶';
        showPauseOverlay();
      }
    }
  });
  actionsGroup.appendChild(pauseBtn);

  const restartBtn = createElement('button', {
    className: 'btn-icon btn-outline',
    'aria-label': 'Restart game',
    text: '🔄',
    onClick: () => {
      hideOverlay();
      pauseBtn.textContent = '⏸';
      gameLifecycle.reset();
    }
  });
  actionsGroup.appendChild(restartBtn);

  const soundBtn = createElement('button', {
    className: 'btn-icon btn-outline',
    'aria-label': 'Toggle audio',
    text: audio.soundEnabled ? '🔊' : '🔇',
    onClick: () => {
      audio.setSoundEnabled(!audio.soundEnabled);
      soundBtn.textContent = audio.soundEnabled ? '🔊' : '🔇';
    }
  });
  actionsGroup.appendChild(soundBtn);

  header.appendChild(actionsGroup);
  playerContainer.appendChild(header);

  // 2. Stage Viewport
  const stageWrapper = createElement('div', { className: 'game-stage-wrapper' });
  const stageRoot = createElement('div', { className: 'game-stage-root', id: 'game-mount-point' });
  stageWrapper.appendChild(stageRoot);

  // Overlay container
  const overlayContainer = createElement('div', {
    className: 'game-overlay',
    style: 'display: none;',
    id: 'game-player-overlay'
  });
  stageWrapper.appendChild(overlayContainer);

  playerContainer.appendChild(stageWrapper);

  // 3. Mobile Touch Controls (D-pad & Action button)
  const mobileControls = createElement('div', {
    className: 'mobile-controls-panel active',
    id: 'mobile-touch-controls'
  });

  const dpad = createElement('div', { className: 'touch-dpad' });
  const upBtn = createElement('button', {
    className: 'touch-btn',
    style: 'grid-column: 2; grid-row: 1;',
    text: '▲',
    'aria-label': 'Move Up',
    onClick: () => dispatchKey('ArrowUp')
  });
  const leftBtn = createElement('button', {
    className: 'touch-btn',
    style: 'grid-column: 1; grid-row: 2;',
    text: '◀',
    'aria-label': 'Move Left',
    onClick: () => dispatchKey('ArrowLeft')
  });
  const downBtn = createElement('button', {
    className: 'touch-btn',
    style: 'grid-column: 2; grid-row: 3;',
    text: '▼',
    'aria-label': 'Move Down',
    onClick: () => dispatchKey('ArrowDown')
  });
  const rightBtn = createElement('button', {
    className: 'touch-btn',
    style: 'grid-column: 3; grid-row: 2;',
    text: '▶',
    'aria-label': 'Move Right',
    onClick: () => dispatchKey('ArrowRight')
  });
  dpad.appendChild(upBtn);
  dpad.appendChild(leftBtn);
  dpad.appendChild(downBtn);
  dpad.appendChild(rightBtn);
  mobileControls.appendChild(dpad);

  // Action button (Jump / Space)
  const actionBtn = createElement('button', {
    className: 'btn btn-secondary touch-action-btn',
    text: 'ACTION',
    'aria-label': 'Action or Jump',
    onClick: () => dispatchKey('Space')
  });
  mobileControls.appendChild(actionBtn);

  playerContainer.appendChild(mobileControls);

  // 4. Game Instructions Card
  const instructionsCard = createElement('div', { className: 'game-instructions-card' }, [
    createElement('h2', { className: 'game-instructions-header', text: '📖 How to Play' }),
    createElement('p', { className: 'game-instructions-content', text: game.instructions }),
    createElement('div', { className: 'controls-key-grid' }, 
      game.controls.map(c => createElement('div', { className: 'controls-key-item' }, [
        createElement('kbd', { text: c.key }),
        createElement('span', { text: c.action })
      ]))
    )
  ]);
  playerContainer.appendChild(instructionsCard);

  container.appendChild(playerContainer);

  function dispatchKey(code) {
    window.dispatchEvent(new KeyboardEvent('keydown', { code, key: code, bubbles: true }));
  }

  function hideOverlay() {
    overlayContainer.style.display = 'none';
    empty(overlayContainer);
  }

  function showPauseOverlay() {
    empty(overlayContainer);
    overlayContainer.style.display = 'flex';
    overlayContainer.appendChild(createElement('h2', { className: 'game-overlay-title paused', text: 'Game Paused' }));
    overlayContainer.appendChild(createElement('p', { className: 'game-overlay-subtitle', text: 'Take a breath and jump back in anytime.' }));

    const btnRow = createElement('div', { className: 'game-overlay-buttons' }, [
      createElement('button', {
        className: 'btn btn-lg btn-primary',
        text: 'Resume Playing',
        onClick: () => {
          gameLifecycle.resume();
          pauseBtn.textContent = '⏸';
          hideOverlay();
        }
      }),
      createElement('button', {
        className: 'btn btn-lg btn-outline',
        text: 'Restart',
        onClick: () => {
          hideOverlay();
          pauseBtn.textContent = '⏸';
          gameLifecycle.reset();
        }
      })
    ]);
    overlayContainer.appendChild(btnRow);
  }

  function handleGameOverOverlay(result) {
    empty(overlayContainer);
    overlayContainer.style.display = 'flex';

    overlayContainer.appendChild(createElement('h2', { className: 'game-overlay-title gameover', text: 'Game Over' }));
    
    if (result.isNewHigh) {
      overlayContainer.appendChild(createElement('div', {
        className: 'badge badge-warning',
        style: 'margin-bottom: 1rem; font-size: 0.9rem; padding: 0.4rem 1rem;',
        text: '⭐ NEW PERSONAL BEST!'
      }));
    }

    const statBox = createElement('div', { className: 'game-overlay-stats' }, [
      createElement('div', { className: 'game-overlay-stat-item' }, [
        createElement('div', { className: 'score-box-label', text: 'Final Score' }),
        createElement('div', { className: 'score-box-value', text: String(result.score || 0) })
      ])
    ]);
    overlayContainer.appendChild(statBox);

    // If Daily Challenge, check and record completion
    if (isDailyChallenge) {
      dailyChallenge.recordCompletion(gameId, result);
      notification.success('Daily Challenge Completed! Streak recorded.');
    }

    const btnRow = createElement('div', { className: 'game-overlay-buttons' }, [
      createElement('button', {
        className: 'btn btn-lg btn-primary',
        text: 'Play Again',
        onClick: () => {
          hideOverlay();
          pauseBtn.textContent = '⏸';
          gameLifecycle.reset();
        }
      }),
      createElement('a', {
        href: '#/games',
        className: 'btn btn-lg btn-outline',
        text: 'Game Library'
      })
    ]);
    overlayContainer.appendChild(btnRow);
  }

  function handleGameWinOverlay(result) {
    empty(overlayContainer);
    overlayContainer.style.display = 'flex';

    overlayContainer.appendChild(createElement('h2', { className: 'game-overlay-title victory', text: 'Victory!' }));
    overlayContainer.appendChild(createElement('p', { className: 'game-overlay-subtitle', text: 'Outstanding play! Challenge conquered.' }));

    if (isDailyChallenge) {
      dailyChallenge.recordCompletion(gameId, result);
      notification.success('Daily Challenge Completed! Streak recorded.');
    }

    const btnRow = createElement('div', { className: 'game-overlay-buttons' }, [
      createElement('button', {
        className: 'btn btn-lg btn-primary',
        text: 'Continue / Play Again',
        onClick: () => {
          hideOverlay();
          pauseBtn.textContent = '⏸';
          gameLifecycle.reset();
        }
      }),
      createElement('a', {
        href: '#/games',
        className: 'btn btn-lg btn-outline',
        text: 'Back to Library'
      })
    ]);
    overlayContainer.appendChild(btnRow);
  }

  // 5. Mount Game Module via Lifecycle Manager
  try {
    stageRoot.appendChild(createLoadingState(`Loading ${game.name}...`));
    const gameModule = await game.loader();
    empty(stageRoot);

    await gameLifecycle.mount(gameId, gameModule, stageRoot, {
      onScoreUpdate: (score) => {
        const scoreEl = document.getElementById('live-score');
        if (scoreEl) scoreEl.textContent = score.toLocaleString();
      },
      onGameOver: (result) => {
        handleGameOverOverlay(result);
      },
      onGameWin: (result) => {
        handleGameWinOverlay(result);
      }
    });

    gameLifecycle.start();
  } catch (error) {
    console.error(`Failed to load or mount game ${gameId}:`, error);
    empty(stageRoot);
    stageRoot.appendChild(createEmptyState({
      icon: '⚠️',
      title: 'Game Launch Error',
      description: `Could not initialize ${game.name}. An unexpected module error occurred.`,
      action: {
        label: 'Return to Library',
        onClick: () => { window.location.hash = '#/games'; }
      }
    }));
  }
}

/**
 * PixelPlay - Shared Game Lifecycle Manager
 * Enforces the mount -> start -> (pause / resume / reset) -> destroy contract.
 * Guarantees that only one game instance is active at a time and all loops/listeners are torn down.
 */

import { logger } from './core/logger.js';
import { audio } from './services/audio.js';
import { statistics } from './services/statistics.js';
import { achievements } from './services/achievements.js';
import { SeededRNG } from './utils/random.js';
import { Clock } from './core/clock.js';

class GameLifecycleManager {
  constructor() {
    this.activeGameId = null;
    this.activeInstance = null;
    this.sessionStartTime = 0;
    this.isPaused = false;
  }

  /**
   * Mount and initialize a game module
   * @param {string} gameId 
   * @param {object} gameModule Module exposing createGame(context) or default factory
   * @param {HTMLElement} rootElement 
   * @param {object} [options={}] Optional challenge or custom configs
   */
  async mount(gameId, gameModule, rootElement, options = {}) {
    if (this.activeInstance) {
      this.destroy();
    }

    logger.info(`Mounting game: ${gameId}`);
    this.activeGameId = gameId;
    this.isPaused = false;
    this.sessionStartTime = Clock.now();

    // Prepare deterministic or standard RNG
    const rng = options.seed ? new SeededRNG(options.seed) : null;

    // Build the isolated Context for the game
    const context = {
      rootElement,
      gameId,
      options,
      rng,
      audio,
      statistics,
      achievements,
      onScoreUpdate: (score) => {
        if (typeof options.onScoreUpdate === 'function') {
          options.onScoreUpdate(score);
        }
      },
      onGameOver: (result) => {
        this.handleGameOver(gameId, result, options);
      },
      onGameWin: (result) => {
        this.handleGameWin(gameId, result, options);
      }
    };

    const factory = gameModule.createGame || gameModule.default;
    if (typeof factory !== 'function') {
      throw new Error(`Game module "${gameId}" does not export a valid factory function.`);
    }

    this.activeInstance = factory(context);
    if (!this.activeInstance || typeof this.activeInstance.mount !== 'function') {
      throw new Error(`Game instance for "${gameId}" does not conform to lifecycle contract.`);
    }

    await this.activeInstance.mount();
    statistics.recordSessionStart(gameId);

    // Evaluate play count milestones
    achievements.evaluateStats(statistics.getOverallSummary());

    return this.activeInstance;
  }

  start() {
    if (this.activeInstance && typeof this.activeInstance.start === 'function') {
      this.isPaused = false;
      this.activeInstance.start();
    }
  }

  pause() {
    if (this.activeInstance && typeof this.activeInstance.pause === 'function' && !this.isPaused) {
      this.isPaused = true;
      this.activeInstance.pause();
    }
  }

  resume() {
    if (this.activeInstance && typeof this.activeInstance.resume === 'function' && this.isPaused) {
      this.isPaused = false;
      this.activeInstance.resume();
    }
  }

  reset() {
    if (this.activeInstance && typeof this.activeInstance.reset === 'function') {
      this.isPaused = false;
      this.sessionStartTime = Clock.now();
      this.activeInstance.reset();
    }
  }

  destroy() {
    if (this.activeInstance) {
      logger.info(`Destroying active game: ${this.activeGameId}`);
      
      const durationSeconds = (Clock.now() - this.sessionStartTime) / 1000;
      if (this.activeGameId) {
        statistics.recordSessionEnd(this.activeGameId, durationSeconds);
      }

      if (typeof this.activeInstance.destroy === 'function') {
        try {
          this.activeInstance.destroy();
        } catch (err) {
          logger.error(`Error during destroy of game "${this.activeGameId}":`, err);
        }
      }

      this.activeInstance = null;
      this.activeGameId = null;
      this.isPaused = false;
      this.sessionStartTime = 0;
    }
  }

  handleGameOver(gameId, result = {}, options = {}) {
    logger.info(`Game Over for "${gameId}":`, result);
    const score = result.score || 0;
    const isNewHigh = statistics.recordScore(gameId, score);

    if (isNewHigh) {
      achievements.unlock('personal-best');
    }

    // Per-game specific achievement checks
    if (gameId === 'snake' && score >= 50) {
      achievements.unlock('snake-charmer');
    }
    if (gameId === 'reaction-rush' && result.timeMs && result.timeMs < 250) {
      achievements.unlock('quick-reflexes');
    }
    if (gameId === 'sequence-master' && result.level >= 10) {
      achievements.unlock('sequence-star');
    }
    if (gameId === 'endless-runner' && (result.distance >= 500 || score >= 500)) {
      achievements.unlock('runners-high');
    }

    if (typeof options.onGameOver === 'function') {
      options.onGameOver({ ...result, isNewHigh });
    }
  }

  handleGameWin(gameId, result = {}, options = {}) {
    logger.info(`Game Win for "${gameId}":`, result);
    statistics.recordWin(gameId);

    if (gameId === '2048') {
      achievements.unlock('tile-master');
    }
    if (gameId === 'brick-breaker') {
      achievements.unlock('brick-buster');
    }
    if (gameId === 'memory-match') {
      achievements.unlock('sharp-memory');
      if (result.timeMs) {
        statistics.recordTime(gameId, result.timeMs);
      }
    }
    if (gameId === 'tic-tac-toe') {
      if (result.againstComputer) {
        achievements.unlock('perfect-ttt');
      }
    }

    if (typeof options.onGameWin === 'function') {
      options.onGameWin(result);
    }
  }

  getActiveGameId() {
    return this.activeGameId;
  }

  isGamePaused() {
    return this.isPaused;
  }
}

export const gameLifecycle = new GameLifecycleManager();

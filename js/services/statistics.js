/**
 * PixelPlay - Personal Game Statistics Tracker
 */

import { storage } from '../core/storage.js';

class StatisticsService {
  constructor() {
    this.stats = storage.get('gameStats', {});
  }

  getGameStats(gameId) {
    if (!this.stats[gameId]) {
      this.stats[gameId] = {
        playCount: 0,
        highScore: 0,
        bestTime: null,
        wins: 0,
        losses: 0,
        draws: 0,
        totalPlayTimeSeconds: 0,
        lastPlayed: null
      };
    }
    return this.stats[gameId];
  }

  recordSessionStart(gameId) {
    const s = this.getGameStats(gameId);
    s.playCount += 1;
    s.lastPlayed = Date.now();
    this.save();
  }

  recordSessionEnd(gameId, durationSeconds = 0) {
    const s = this.getGameStats(gameId);
    if (durationSeconds > 0) {
      s.totalPlayTimeSeconds = (s.totalPlayTimeSeconds || 0) + Math.round(durationSeconds);
      this.save();
    }
  }

  recordScore(gameId, score) {
    const s = this.getGameStats(gameId);
    let isNewBest = false;

    // For reaction-rush, lower time is better
    if (gameId === 'reaction-rush') {
      if (s.highScore === 0 || score < s.highScore) {
        s.highScore = score;
        isNewBest = true;
      }
    } else {
      if (score > (s.highScore || 0)) {
        s.highScore = score;
        isNewBest = true;
      }
    }

    this.save();
    return isNewBest;
  }

  recordTime(gameId, timeMs) {
    const s = this.getGameStats(gameId);
    let isNewBest = false;
    if (s.bestTime === null || timeMs < s.bestTime) {
      s.bestTime = timeMs;
      isNewBest = true;
    }
    this.save();
    return isNewBest;
  }

  recordWin(gameId) {
    const s = this.getGameStats(gameId);
    s.wins = (s.wins || 0) + 1;
    this.save();
  }

  recordLoss(gameId) {
    const s = this.getGameStats(gameId);
    s.losses = (s.losses || 0) + 1;
    this.save();
  }

  recordDraw(gameId) {
    const s = this.getGameStats(gameId);
    s.draws = (s.draws || 0) + 1;
    this.save();
  }

  save() {
    storage.set('gameStats', this.stats);
  }

  getOverallSummary() {
    let totalSessions = 0;
    let totalSeconds = 0;
    const playedGames = new Set();

    for (const [gameId, s] of Object.entries(this.stats)) {
      if (s.playCount > 0) {
        totalSessions += s.playCount;
        playedGames.add(gameId);
        totalSeconds += (s.totalPlayTimeSeconds || 0);
      }
    }

    return {
      totalSessions,
      uniqueGamesPlayed: playedGames.size,
      totalPlayTimeSeconds: totalSeconds,
      perGame: this.stats
    };
  }
}

export const statistics = new StatisticsService();

/**
 * PixelPlay - Daily Challenge Engine
 */

import { Clock } from '../core/clock.js';
import { SeededRNG } from '../utils/random.js';
import { storage } from '../core/storage.js';
import { achievements } from './achievements.js';

// Deterministic rotation list of games with daily challenge adapters
export const CHALLENGE_ROTATION_GAMES = [
  'snake',
  '2048',
  'brick-breaker',
  'memory-match',
  'reaction-rush',
  'sequence-master',
  'endless-runner'
];

export const CHALLENGE_RULES = {
  snake: {
    targetScore: 30,
    description: 'Score at least 30 points on the daily deterministic grid.'
  },
  '2048': {
    targetScore: 1000,
    description: 'Score 1,000 points or more on the daily tile board.'
  },
  'brick-breaker': {
    targetScore: 250,
    description: 'Score 250 points and bust through the daily brick formation.'
  },
  'memory-match': {
    targetTimeSeconds: 45,
    description: 'Complete the daily card layout in under 45 seconds.'
  },
  'reaction-rush': {
    targetTimeMs: 280,
    description: 'Achieve a reaction time under 280ms in the daily reaction test.'
  },
  'sequence-master': {
    targetLevel: 6,
    description: 'Reach sequence level 6 on the daily seeded pattern.'
  },
  'endless-runner': {
    targetDistance: 350,
    description: 'Run at least 350 meters through today\'s obstacle course.'
  }
};

class DailyChallengeService {
  constructor() {
    this.challengeState = storage.get('dailyChallenge', {
      streak: 0,
      lastCompletedDate: null,
      history: {}
    });
  }

  /**
   * Get deterministic daily challenge config for today's UTC date
   * @param {Date} [date] 
   * @returns {object}
   */
  getTodayChallenge(date = new Date()) {
    const dateStr = Clock.getUTCDateString(date);
    const rng = new SeededRNG(dateStr);

    // Pick game deterministically
    const daysSinceEpoch = Math.floor(Clock.parseUTCDateString(dateStr).getTime() / (1000 * 60 * 60 * 24));
    const gameIndex = daysSinceEpoch % CHALLENGE_ROTATION_GAMES.length;
    const gameId = CHALLENGE_ROTATION_GAMES[gameIndex];
    const rules = CHALLENGE_RULES[gameId];

    const completed = !!this.challengeState.history[dateStr]?.completed;
    const record = this.challengeState.history[dateStr] || null;

    return {
      date: dateStr,
      gameId,
      seed: dateStr,
      rules,
      completed,
      record,
      streak: this.challengeState.streak
    };
  }

  isCompletedToday() {
    const todayStr = Clock.getUTCDateString();
    return !!this.challengeState.history[todayStr]?.completed;
  }

  /**
   * Record a challenge completion
   * @param {string} gameId 
   * @param {any} result 
   */
  recordCompletion(gameId, result) {
    const todayStr = Clock.getUTCDateString();
    const todayChallenge = this.getTodayChallenge();

    if (todayChallenge.gameId !== gameId) return false;

    // Check streak
    let newStreak = 1;
    if (this.challengeState.lastCompletedDate) {
      const diffDays = Clock.getDaysDifference(this.challengeState.lastCompletedDate, todayStr);
      if (diffDays === 1) {
        newStreak = (this.challengeState.streak || 0) + 1;
      } else if (diffDays === 0) {
        newStreak = this.challengeState.streak;
      }
    }

    this.challengeState.lastCompletedDate = todayStr;
    this.challengeState.streak = newStreak;
    this.challengeState.history[todayStr] = {
      completed: true,
      completedAt: Date.now(),
      gameId,
      result
    };

    storage.set('dailyChallenge', this.challengeState);

    // Evaluate Achievements
    achievements.unlock('daily-starter');
    if (newStreak >= 3) {
      achievements.unlock('challenge-streak');
    }

    const totalCompleted = Object.values(this.challengeState.history).filter(h => h.completed).length;
    if (totalCompleted >= 7) {
      achievements.unlock('challenge-champion');
    }

    return true;
  }
}

export const dailyChallenge = new DailyChallengeService();

/**
 * PixelPlay - 16 Central Achievements Engine
 */

import { storage } from '../core/storage.js';
import { notification } from './notification.js';
import { audio } from './audio.js';
import { eventBus } from '../event-bus.js';
import { EVENTS } from '../constants.js';

export const ACHIEVEMENTS_DEFINITIONS = [
  {
    id: 'first-steps',
    title: 'First Steps',
    description: 'Complete your very first game session.',
    icon: '🎯'
  },
  {
    id: 'getting-started',
    title: 'Getting Started',
    description: 'Play 5 game sessions across any titles.',
    icon: '🎮'
  },
  {
    id: 'game-explorer',
    title: 'Game Explorer',
    description: 'Play all 8 different games in the library.',
    icon: '🧭'
  },
  {
    id: 'regular-player',
    title: 'Regular Player',
    description: 'Play 25 game sessions.',
    icon: '🏆'
  },
  {
    id: 'personal-best',
    title: 'Personal Best',
    description: 'Set a new personal high score in any game.',
    icon: '⭐'
  },
  {
    id: 'snake-charmer',
    title: 'Snake Charmer',
    description: 'Reach a score of 50 or higher in Snake.',
    icon: '🐍'
  },
  {
    id: 'tile-master',
    title: 'Tile Master',
    description: 'Create the coveted 2048 tile.',
    icon: '🔢'
  },
  {
    id: 'brick-buster',
    title: 'Brick Buster',
    description: 'Clear a level in Brick Breaker.',
    icon: '🧱'
  },
  {
    id: 'sharp-memory',
    title: 'Sharp Memory',
    description: 'Successfully complete a round of Memory Match.',
    icon: '🧠'
  },
  {
    id: 'perfect-ttt',
    title: 'Perfect Tic-Tac-Toe',
    description: 'Win a match against the computer in Tic-Tac-Toe.',
    icon: '❌'
  },
  {
    id: 'quick-reflexes',
    title: 'Quick Reflexes',
    description: 'Achieve a reaction time under 250 milliseconds in Reaction Rush.',
    icon: '⚡'
  },
  {
    id: 'sequence-star',
    title: 'Sequence Star',
    description: 'Reach level 10 or higher in Sequence Master.',
    icon: '🎶'
  },
  {
    id: 'runners-high',
    title: 'Runner\'s High',
    description: 'Reach a distance of 500 meters in Endless Runner.',
    icon: '🏃'
  },
  {
    id: 'daily-starter',
    title: 'Daily Starter',
    description: 'Complete your first Daily Challenge.',
    icon: '📅'
  },
  {
    id: 'challenge-streak',
    title: 'Challenge Streak',
    description: 'Complete Daily Challenges on 3 consecutive UTC dates.',
    icon: '🔥'
  },
  {
    id: 'challenge-champion',
    title: 'Challenge Champion',
    description: 'Complete 7 total Daily Challenges.',
    icon: '👑'
  }
];

class AchievementsService {
  constructor() {
    this.unlocked = storage.get('achievements', {});
  }

  isUnlocked(id) {
    return !!this.unlocked[id]?.unlocked;
  }

  getUnlockDate(id) {
    return this.unlocked[id]?.unlockedAt || null;
  }

  unlock(id) {
    if (this.isUnlocked(id)) return false;

    const def = ACHIEVEMENTS_DEFINITIONS.find(a => a.id === id);
    if (!def) return false;

    this.unlocked[id] = {
      unlocked: true,
      unlockedAt: Date.now()
    };

    storage.set('achievements', this.unlocked);

    // Audio chime & notification toast
    audio.playVictory();
    notification.success(`🏆 Achievement Unlocked: ${def.title}!`);

    eventBus.emit(EVENTS.ACHIEVEMENT_UNLOCKED, {
      id,
      achievement: def
    });

    return true;
  }

  /**
   * Evaluate global statistics achievements
   * @param {object} statsSummary 
   */
  evaluateStats(statsSummary) {
    if (statsSummary.totalSessions >= 1) {
      this.unlock('first-steps');
    }
    if (statsSummary.totalSessions >= 5) {
      this.unlock('getting-started');
    }
    if (statsSummary.totalSessions >= 25) {
      this.unlock('regular-player');
    }
    if (statsSummary.uniqueGamesPlayed >= 8) {
      this.unlock('game-explorer');
    }
  }

  getProgress() {
    const total = ACHIEVEMENTS_DEFINITIONS.length;
    const unlockedCount = Object.values(this.unlocked).filter(a => a.unlocked).length;
    return {
      total,
      unlockedCount,
      percentage: Math.round((unlockedCount / total) * 100)
    };
  }

  getAll() {
    return ACHIEVEMENTS_DEFINITIONS.map(def => ({
      ...def,
      unlocked: this.isUnlocked(def.id),
      unlockedAt: this.getUnlockDate(def.id)
    }));
  }
}

export const achievements = new AchievementsService();

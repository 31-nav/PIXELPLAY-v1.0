/**
 * PixelPlay - Storage Schema & Default State
 */

import { CURRENT_SCHEMA_VERSION, THEMES } from '../constants.js';

export const DEFAULT_STORAGE_STATE = {
  version: CURRENT_SCHEMA_VERSION,
  preferences: {
    theme: THEMES.DARK,
    soundEnabled: true,
    musicEnabled: false,
    masterVolume: 0.7,
    reducedMotion: false
  },
  favorites: [],
  recentlyPlayed: [],
  gameStats: {},
  achievements: {},
  dailyChallenge: {
    streak: 0,
    lastCompletedDate: null,
    history: {}
  }
};

/**
 * Validate storage payload structure
 * @param {any} data 
 * @returns {boolean}
 */
export function validateStorageState(data) {
  if (!data || typeof data !== 'object') return false;
  if (typeof data.version !== 'number') return false;
  if (!data.preferences || typeof data.preferences !== 'object') return false;
  if (!Array.isArray(data.favorites)) return false;
  if (!Array.isArray(data.recentlyPlayed)) return false;
  if (!data.gameStats || typeof data.gameStats !== 'object') return false;
  if (!data.achievements || typeof data.achievements !== 'object') return false;
  if (!data.dailyChallenge || typeof data.dailyChallenge !== 'object') return false;
  return true;
}

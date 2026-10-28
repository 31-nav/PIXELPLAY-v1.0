/**
 * PixelPlay - Application Constants & Configuration
 */

export const APP_NAME = 'PixelPlay';
export const APP_TAGLINE = 'Small games. Big fun.';
export const APP_VERSION = '1.0.0';

export const STORAGE_KEY = 'pixelplay_storage_v1';
export const CURRENT_SCHEMA_VERSION = 1;

export const CATEGORIES = {
  ALL: 'all',
  ARCADE: 'arcade',
  PUZZLE: 'puzzle',
  REFLEX: 'reflex',
  MEMORY: 'memory',
  STRATEGY: 'strategy',
  ACTION: 'action'
};

export const CATEGORY_LABELS = {
  [CATEGORIES.ALL]: 'All Games',
  [CATEGORIES.ARCADE]: 'Arcade',
  [CATEGORIES.PUZZLE]: 'Puzzle',
  [CATEGORIES.REFLEX]: 'Reflex',
  [CATEGORIES.MEMORY]: 'Memory',
  [CATEGORIES.STRATEGY]: 'Strategy',
  [CATEGORIES.ACTION]: 'Action'
};

export const DIFFICULTY = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard'
};

export const EVENTS = {
  ROUTE_CHANGED: 'route:changed',
  GAME_START: 'game:start',
  GAME_PAUSE: 'game:pause',
  GAME_RESUME: 'game:resume',
  GAME_OVER: 'game:over',
  GAME_WIN: 'game:win',
  GAME_SCORE_UPDATE: 'game:score_update',
  ACHIEVEMENT_UNLOCKED: 'achievement:unlocked',
  THEME_CHANGED: 'theme:changed',
  SETTINGS_CHANGED: 'settings:changed',
  FAVORITE_TOGGLED: 'favorite:toggled',
  OFFLINE_STATUS_CHANGED: 'offline:status_changed',
  SW_UPDATED: 'sw:updated'
};

export const THEMES = {
  DARK: 'dark',
  LIGHT: 'light'
};

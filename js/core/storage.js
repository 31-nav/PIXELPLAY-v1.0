/**
 * PixelPlay - Centralized Storage Service
 */

import { STORAGE_KEY } from '../constants.js';
import { DEFAULT_STORAGE_STATE, validateStorageState } from './storage-schema.js';
import { migrateStorage } from './migration.js';
import { logger } from './logger.js';

class StorageService {
  constructor() {
    this.memoryFallback = null;
    this.isLocalStorageAvailable = this.checkAvailability();
    this.state = this.loadInitialState();
  }

  checkAvailability() {
    try {
      const testKey = '__pixelplay_storage_test__';
      window.localStorage.setItem(testKey, '1');
      window.localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      logger.warn('LocalStorage is unavailable or disabled. Falling back to memory storage.', e);
      return false;
    }
  }

  loadInitialState() {
    if (!this.isLocalStorageAvailable) {
      this.memoryFallback = JSON.parse(JSON.stringify(DEFAULT_STORAGE_STATE));
      return this.memoryFallback;
    }

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        const fresh = JSON.parse(JSON.stringify(DEFAULT_STORAGE_STATE));
        this.persist(fresh);
        return fresh;
      }

      const parsed = JSON.parse(raw);
      const migrated = migrateStorage(parsed);

      if (validateStorageState(migrated)) {
        return migrated;
      } else {
        logger.warn('Persisted state failed schema validation. Merging with defaults.');
        const merged = { ...DEFAULT_STORAGE_STATE, ...migrated };
        this.persist(merged);
        return merged;
      }
    } catch (error) {
      logger.error('Failed to parse or load state from localStorage. Using safe defaults.', error);
      const fresh = JSON.parse(JSON.stringify(DEFAULT_STORAGE_STATE));
      this.persist(fresh);
      return fresh;
    }
  }

  persist(state) {
    if (!this.isLocalStorageAvailable) {
      this.memoryFallback = state;
      return true;
    }

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      return true;
    } catch (error) {
      logger.error('Failed to persist state to localStorage (e.g. QuotaExceeded):', error);
      return false;
    }
  }

  getState() {
    return this.state;
  }

  get(key, defaultValue = null) {
    return this.state[key] !== undefined ? this.state[key] : defaultValue;
  }

  set(key, value) {
    this.state[key] = value;
    this.persist(this.state);
  }

  update(key, updaterFn) {
    const current = this.get(key);
    const updated = updaterFn(current);
    this.set(key, updated);
    return updated;
  }

  /**
   * Reset all user game progress, preferences, and stats to factory defaults
   */
  resetAll() {
    this.state = JSON.parse(JSON.stringify(DEFAULT_STORAGE_STATE));
    this.persist(this.state);
    logger.info('Storage state has been reset to defaults.');
  }
}

export const storage = new StorageService();

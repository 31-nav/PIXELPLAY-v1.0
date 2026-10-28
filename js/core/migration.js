/**
 * PixelPlay - Storage Schema Migrations
 */

import { CURRENT_SCHEMA_VERSION } from '../constants.js';
import { logger } from './logger.js';

const migrations = {
  // Future schema migrations will be registered here:
  // 2: (oldState) => { ... return newState; }
};

/**
 * Apply migrations to state if older than CURRENT_SCHEMA_VERSION
 * @param {object} rawData 
 * @returns {object} Migrated state
 */
export function migrateStorage(rawData) {
  let state = { ...rawData };
  const currentVer = state.version || 0;

  if (currentVer === CURRENT_SCHEMA_VERSION) {
    return state;
  }

  logger.info(`Migrating storage state from version ${currentVer} to ${CURRENT_SCHEMA_VERSION}`);

  for (let v = currentVer + 1; v <= CURRENT_SCHEMA_VERSION; v++) {
    if (typeof migrations[v] === 'function') {
      try {
        state = migrations[v](state);
        state.version = v;
        logger.info(`Successfully applied migration step to version ${v}`);
      } catch (err) {
        logger.error(`Migration step to version ${v} failed:`, err);
        break;
      }
    } else {
      state.version = v;
    }
  }

  return state;
}

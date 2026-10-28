/**
 * PixelPlay - Structured Diagnostic Logger
 */

const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3
};

class Logger {
  constructor(prefix = 'PixelPlay') {
    this.prefix = prefix;
    this.level = LOG_LEVELS.INFO;
  }

  setLevel(level) {
    if (level in LOG_LEVELS) {
      this.level = LOG_LEVELS[level];
    }
  }

  debug(...args) {
    if (this.level <= LOG_LEVELS.DEBUG) {
      console.debug(`[${this.prefix}]`, ...args);
    }
  }

  info(...args) {
    if (this.level <= LOG_LEVELS.INFO) {
      console.info(`[${this.prefix}]`, ...args);
    }
  }

  warn(...args) {
    if (this.level <= LOG_LEVELS.WARN) {
      console.warn(`[${this.prefix}]`, ...args);
    }
  }

  error(...args) {
    if (this.level <= LOG_LEVELS.ERROR) {
      console.error(`[${this.prefix}]`, ...args);
    }
  }
}

export const logger = new Logger('PixelPlay');

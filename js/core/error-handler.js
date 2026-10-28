/**
 * PixelPlay - Global Error & Unhandled Rejection Handler
 */

import { logger } from './logger.js';

class ErrorHandler {
  constructor() {
    this.handlers = [];
  }

  init() {
    window.addEventListener('error', (event) => {
      this.handleError(event.error || new Error(event.message), 'UncaughtException');
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.handleError(event.reason || new Error('Unhandled Promise Rejection'), 'UnhandledRejection');
    });
  }

  onError(callback) {
    this.handlers.push(callback);
    return () => {
      this.handlers = this.handlers.filter(h => h !== callback);
    };
  }

  handleError(error, context = 'General') {
    logger.error(`[ErrorHandler][${context}]`, error);
    for (const handler of this.handlers) {
      try {
        handler(error, context);
      } catch (e) {
        console.error('Error executing custom error handler:', e);
      }
    }
  }
}

export const errorHandler = new ErrorHandler();

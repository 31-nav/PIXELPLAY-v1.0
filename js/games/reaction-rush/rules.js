/**
 * PixelPlay - Reaction Rush Rules & Calculations
 */

export const MIN_DELAY_MS = 2000;
export const MAX_DELAY_MS = 5000;
export const TOTAL_ROUNDS = 5;

export const STATES = {
  IDLE: 'idle',
  WAITING: 'waiting',
  READY: 'ready',
  EARLY: 'early',
  RESULT: 'result',
  COMPLETE: 'complete'
};

export function getRandomDelay(min = MIN_DELAY_MS, max = MAX_DELAY_MS, rng = null) {
  if (rng) {
    return Math.floor(rng.next() * (max - min + 1)) + min;
  }
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function calculateAverage(times) {
  if (!times || times.length === 0) return 0;
  const sum = times.reduce((acc, t) => acc + t, 0);
  return Math.round(sum / times.length);
}

export function getBestTime(times) {
  if (!times || times.length === 0) return 0;
  return Math.min(...times);
}

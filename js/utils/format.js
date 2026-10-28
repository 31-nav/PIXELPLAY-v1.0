/**
 * PixelPlay - Formatting Utilities
 */

/**
 * Format a number with locale thousands separators
 * @param {number} num 
 * @returns {string}
 */
export function formatNumber(num) {
  if (typeof num !== 'number' || isNaN(num)) return '0';
  return num.toLocaleString();
}

/**
 * Format milliseconds into seconds with decimals or mm:ss
 * @param {number} ms 
 * @returns {string}
 */
export function formatTimeMs(ms) {
  if (typeof ms !== 'number' || isNaN(ms)) return '0ms';
  if (ms < 1000) {
    return `${Math.round(ms)}ms`;
  }
  const seconds = (ms / 1000).toFixed(2);
  return `${seconds}s`;
}

/**
 * Format seconds into mm:ss
 * @param {number} totalSeconds 
 * @returns {string}
 */
export function formatDuration(totalSeconds) {
  if (typeof totalSeconds !== 'number' || isNaN(totalSeconds)) return '00:00';
  const mins = Math.floor(totalSeconds / 60);
  const secs = Math.floor(totalSeconds % 60);
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

/**
 * Format a timestamp into human-readable date
 * @param {number|string|Date} timestamp 
 * @returns {string}
 */
export function formatDate(timestamp) {
  if (!timestamp) return 'Never';
  const d = new Date(timestamp);
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

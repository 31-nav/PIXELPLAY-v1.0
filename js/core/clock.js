/**
 * PixelPlay - Monotonic & UTC Time Utilities
 */

export class Clock {
  /**
   * Get high-resolution monotonic timestamp in milliseconds
   * @returns {number}
   */
  static now() {
    return (typeof performance !== 'undefined' && performance.now) 
      ? performance.now() 
      : Date.now();
  }

  /**
   * Get formatted UTC date string YYYY-MM-DD
   * @param {Date} [date] 
   * @returns {string}
   */
  static getUTCDateString(date = new Date()) {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Parse UTC date string into Date object
   * @param {string} dateStr YYYY-MM-DD
   * @returns {Date}
   */
  static parseUTCDateString(dateStr) {
    const [y, m, d] = dateStr.split('-').map(Number);
    return new Date(Date.UTC(y, m - 1, d));
  }

  /**
   * Calculate consecutive days difference between two UTC date strings
   * @param {string} earlierDateStr 
   * @param {string} laterDateStr 
   * @returns {number} Days difference
   */
  static getDaysDifference(earlierDateStr, laterDateStr) {
    const d1 = this.parseUTCDateString(earlierDateStr);
    const d2 = this.parseUTCDateString(laterDateStr);
    const diffTime = d2.getTime() - d1.getTime();
    return Math.round(diffTime / (1000 * 60 * 60 * 24));
  }
}

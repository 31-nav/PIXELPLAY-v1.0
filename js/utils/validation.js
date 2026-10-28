/**
 * PixelPlay - Runtime Validation Helpers
 */

export function isNonEmptyString(val) {
  return typeof val === 'string' && val.trim().length > 0;
}

export function isPositiveNumber(val) {
  return typeof val === 'number' && !isNaN(val) && val >= 0;
}

export function isPlainObject(val) {
  return val !== null && typeof val === 'object' && !Array.isArray(val);
}

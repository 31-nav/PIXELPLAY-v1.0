/**
 * PixelPlay - Input Manager with Keyboard & Touch Swipe Handling
 */

export class InputManager {
  constructor(targetElement = window) {
    this.target = targetElement;
    this.keyBindings = new Map();
    this.swipeCallbacks = [];
    this.cleanups = [];

    this.touchStartX = 0;
    this.touchStartY = 0;
    this.touchStartTime = 0;

    this.init();
  }

  init() {
    const handleKeyDown = (e) => {
      const binding = this.keyBindings.get(e.key) || this.keyBindings.get(e.code);
      if (binding) {
        if (binding.preventDefault) {
          e.preventDefault();
        }
        binding.callback(e);
      }
    };

    const handleTouchStart = (e) => {
      if (e.touches.length === 1) {
        this.touchStartX = e.touches[0].clientX;
        this.touchStartY = e.touches[0].clientY;
        this.touchStartTime = Date.now();
      }
    };

    const handleTouchEnd = (e) => {
      if (e.changedTouches.length === 1) {
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        const dx = touchEndX - this.touchStartX;
        const dy = touchEndY - this.touchStartY;
        const duration = Date.now() - this.touchStartTime;

        // Minimum swipe distance 30px, max duration 600ms
        if (duration < 600 && (Math.abs(dx) > 30 || Math.abs(dy) > 30)) {
          let direction = '';
          if (Math.abs(dx) > Math.abs(dy)) {
            direction = dx > 0 ? 'right' : 'left';
          } else {
            direction = dy > 0 ? 'down' : 'up';
          }

          for (const cb of this.swipeCallbacks) {
            cb(direction);
          }
        }
      }
    };

    this.target.addEventListener('keydown', handleKeyDown);
    this.target.addEventListener('touchstart', handleTouchStart, { passive: true });
    this.target.addEventListener('touchend', handleTouchEnd, { passive: true });

    this.cleanups.push(() => {
      this.target.removeEventListener('keydown', handleKeyDown);
      this.target.removeEventListener('touchstart', handleTouchStart);
      this.target.removeEventListener('touchend', handleTouchEnd);
    });
  }

  /**
   * Bind key or array of keys to callback
   * @param {string|string[]} keys 
   * @param {Function} callback 
   * @param {boolean} [preventDefault=true] 
   */
  bindKey(keys, callback, preventDefault = true) {
    const keyList = Array.isArray(keys) ? keys : [keys];
    for (const key of keyList) {
      this.keyBindings.set(key, { callback, preventDefault });
    }
  }

  /**
   * Register swipe gesture callback
   * @param {Function} callback (direction: 'up'|'down'|'left'|'right') => void
   */
  onSwipe(callback) {
    this.swipeCallbacks.push(callback);
  }

  /**
   * Clean up all event listeners
   */
  destroy() {
    for (const cleanup of this.cleanups) {
      cleanup();
    }
    this.keyBindings.clear();
    this.swipeCallbacks = [];
    this.cleanups = [];
  }
}

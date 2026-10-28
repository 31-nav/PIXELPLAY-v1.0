/**
 * PixelPlay - Theme Manager Service
 */

import { storage } from '../core/storage.js';
import { THEMES, EVENTS } from '../constants.js';
import { eventBus } from '../event-bus.js';

class ThemeManager {
  constructor() {
    this.currentTheme = this.resolveInitialTheme();
  }

  resolveInitialTheme() {
    const prefs = storage.get('preferences') || {};
    if (prefs.theme === THEMES.LIGHT || prefs.theme === THEMES.DARK) {
      return prefs.theme;
    }
    // Check OS preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return THEMES.LIGHT;
    }
    return THEMES.DARK;
  }

  init() {
    this.applyTheme(this.currentTheme);
    
    // Listen for OS theme preference changes if user hasn't explicitly overridden
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
        const prefs = storage.get('preferences') || {};
        if (!prefs.themeExplicitlySet) {
          this.setTheme(e.matches ? THEMES.LIGHT : THEMES.DARK, false);
        }
      });
    }
  }

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    this.currentTheme = theme;
  }

  setTheme(theme, explicit = true) {
    if (theme !== THEMES.LIGHT && theme !== THEMES.DARK) return;
    this.applyTheme(theme);
    
    storage.update('preferences', (prefs) => ({
      ...prefs,
      theme,
      themeExplicitlySet: explicit
    }));

    eventBus.emit(EVENTS.THEME_CHANGED, { theme });
  }

  toggleTheme() {
    const next = this.currentTheme === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK;
    this.setTheme(next, true);
    return next;
  }

  getTheme() {
    return this.currentTheme;
  }
}

export const themeManager = new ThemeManager();

/**
 * PixelPlay - Recently Played Games Tracker
 */

import { storage } from '../core/storage.js';

const MAX_RECENT_GAMES = 10;

class RecentGamesService {
  constructor() {
    this.recents = storage.get('recentlyPlayed', []);
  }

  recordPlay(gameId) {
    if (!gameId) return;
    // Remove if already exists to move it to the front
    this.recents = this.recents.filter(id => id !== gameId);
    this.recents.unshift(gameId);

    if (this.recents.length > MAX_RECENT_GAMES) {
      this.recents = this.recents.slice(0, MAX_RECENT_GAMES);
    }

    storage.set('recentlyPlayed', this.recents);
  }

  getAll() {
    return [...this.recents];
  }
}

export const recentGames = new RecentGamesService();

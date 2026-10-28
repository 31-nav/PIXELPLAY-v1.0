/**
 * PixelPlay - Favorites Service
 */

import { storage } from '../core/storage.js';
import { eventBus } from '../event-bus.js';
import { EVENTS } from '../constants.js';

class FavoritesService {
  constructor() {
    this.favorites = new Set(storage.get('favorites', []));
  }

  isFavorite(gameId) {
    return this.favorites.has(gameId);
  }

  toggle(gameId) {
    let isFav = false;
    if (this.favorites.has(gameId)) {
      this.favorites.delete(gameId);
    } else {
      this.favorites.add(gameId);
      isFav = true;
    }

    const arr = Array.from(this.favorites);
    storage.set('favorites', arr);
    eventBus.emit(EVENTS.FAVORITE_TOGGLED, { gameId, isFavorite: isFav, favorites: arr });
    return isFav;
  }

  getAll() {
    return Array.from(this.favorites);
  }
}

export const favorites = new FavoritesService();

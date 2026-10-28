# PixelPlay - Data Model & Storage Schema

## 1. Storage Schema Definition
PixelPlay persists user data in the browser's `localStorage` under the single key `pixelplay_storage_v1`.

```json
{
  "version": 1,
  "preferences": {
    "theme": "dark",
    "themeExplicitlySet": true,
    "soundEnabled": true,
    "musicEnabled": false,
    "masterVolume": 0.7,
    "reducedMotion": false
  },
  "favorites": [
    "snake",
    "brick-breaker"
  ],
  "recentlyPlayed": [
    "snake",
    "2048"
  ],
  "gameStats": {
    "snake": {
      "playCount": 4,
      "highScore": 80,
      "bestTime": null,
      "wins": 0,
      "losses": 4,
      "draws": 0,
      "totalPlayTimeSeconds": 142,
      "lastPlayed": 1730107200000
    }
  },
  "achievements": {
    "first-steps": {
      "unlocked": true,
      "unlockedAt": 1730107200000
    }
  },
  "dailyChallenge": {
    "streak": 3,
    "lastCompletedDate": "2026-10-28",
    "history": {
      "2026-10-28": {
        "completed": true,
        "completedAt": 1730107200000,
        "gameId": "snake",
        "result": { "score": 40 }
      }
    }
  }
}
```

## 2. Field Definitions
- `version` *(number)*: Schema version integer used for migrations.
- `preferences` *(object)*: User UI and audio settings.
  - `theme`: Either `'dark'` or `'light'`.
  - `soundEnabled`: Boolean indicating if sound effects are enabled.
  - `masterVolume`: Floating-point gain value between 0.0 and 1.0.
  - `reducedMotion`: Boolean indicating reduced motion preference.
- `favorites` *(string[])*: Array of unique favorited game IDs.
- `recentlyPlayed` *(string[])*: LIFO array of game IDs (max 10 items).
- `gameStats` *(object)*: Keyed by game ID with session counts, personal bests, and play duration.
- `achievements` *(object)*: Keyed by achievement ID with unlock timestamp.
- `dailyChallenge` *(object)*: Daily streak count, last completed UTC date string, and historical results.

## 3. Migration & Resilience
- **Validation**: `validateStorageState()` inspects the object shape on load.
- **Migration**: `migrateStorage()` applies sequential migration functions for schemas older than the current version.
- **Fallback**: If `localStorage` is disabled or fails quota checks, the `StorageService` operates against an in-memory object, preventing gameplay interruptions.
- **Factory Reset**: `storage.resetAll()` restores the state to `DEFAULT_STORAGE_STATE`.

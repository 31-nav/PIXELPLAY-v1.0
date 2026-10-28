# PixelPlay - Architecture & System Design

## 1. Architectural Overview
PixelPlay is architected as a modular, client-side Single Page Application (SPA) driven by standard native JavaScript ES modules.

```
                  +--------------------------------+
                  |         index.html             |
                  +---------------+----------------+
                                  |
                           +------v-------+
                           |   js/app.js  |
                           +------+-------+
                                  |
          +-----------------------+-----------------------+
          |                       |                       |
   +------v------+         +------v------+         +------v------+
   |  router.js  |         |  header.js  |         | storage.js  |
   +------+------+         +-------------+         +-------------+
          |
   +------v-----------------------------------------------+
   |                      Pages                           |
   | (home, library, player, daily, achievements, stats)  |
   +----------------------+-------------------------------+
                          |
                   +------v-----------+
                   | game-lifecycle.js|
                   +------+-----------+
                          |
             +------------+------------+
             |                         |
      +------v-------+          +------v-------+
      |  Snake, 2048 |   ...    | Runner, etc. |
      +--------------+          +--------------+
```

## 2. Client-Side Hash Routing
The application utilizes hash-based routing (`#/`, `#/games`, `#/play/:gameId`, etc.) to ensure seamless deployment to static CDNs (GitHub Pages, Netlify) without requiring server rewrite configurations.

The `Router` handles:
- Route matching and parameter extraction
- Dynamic page mounting
- Tearing down the active game session before page transition
- Updating browser `document.title` and active navbar highlights
- Announcing route changes to screen readers via `#a11y-live-announcer`.

## 3. Shared Game Lifecycle Contract
Every game module under `js/games/<game-id>/index.js` exports a factory function:
```javascript
export function createGame(context) {
  return {
    async mount() {},
    start() {},
    pause() {},
    resume() {},
    reset() {},
    destroy() {}
  };
}
```

### Context Object Interface
The `GameLifecycleManager` injects an isolated context object:
- `rootElement`: The designated DOM mounting container.
- `gameId`: The unique identifier string.
- `options`: Optional runtime configurations (such as daily challenge flags).
- `rng`: Seeded random number generator (for deterministic daily challenges) or `null`.
- `audio`: The shared Web Audio API synthesizer service.
- `statistics`: The statistics reporting service.
- `achievements`: The central achievements engine.
- `onScoreUpdate(score)`: Real-time score notification callback.
- `onGameOver(result)`: Callback triggered on failure/completion.
- `onGameWin(result)`: Callback triggered on win milestones.

## 4. Teardown & Leak Prevention
When navigating away from a game, `gameLifecycle.destroy()` is executed. Each game's `destroy()` method:
1. Cancels any active `requestAnimationFrame` IDs.
2. Clears all active `setTimeout` and `setInterval` handles.
3. Unbinds all keyboard and touch listeners registered via `InputManager`.
4. Empties the root DOM element to prevent detached node retention.

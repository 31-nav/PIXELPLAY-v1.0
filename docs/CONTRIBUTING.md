# PixelPlay - Contributing Guidelines

Thank you for your interest in contributing to PixelPlay!

## 1. Core Development Rules
- **No Frameworks or Package Dependencies**: All contributions must be written in pure HTML5, CSS3, and native vanilla JavaScript ES modules. Do not add `package.json` or external libraries.
- **Maintain Modular Architecture**:
  - Pure algorithms and math belong in `rules.js`.
  - Game mounting and UI rendering belong in `index.js`.
  - Styling rules belong in scoped `styles.css`.
- **Implement the Shared Lifecycle Contract**:
  Every game must export `createGame(context)` exposing:
  `mount()`, `start()`, `pause()`, `resume()`, `reset()`, and `destroy()`.
- **Clean Up Everything**:
  All timers, listeners, and animation loops must be canceled when `destroy()` is called.

## 2. Adding a New Game
1. Create a directory under `js/games/<game-id>/`.
2. Add `rules.js`, `index.js`, and `styles.css`.
3. Register the game in `js/game-registry.js`.
4. Add the game's file paths to `sw.js` for offline caching.
5. Add unit tests for the game's pure rules in `tests/test-runner.js`.
6. Document controls and scoring in `docs/GAME_RULES.md`.

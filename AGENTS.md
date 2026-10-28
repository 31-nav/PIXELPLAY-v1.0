# AGENTS.md — Persistent AI & Developer Guidelines

## 1. Non-Negotiable Technology Rules
- **Stack**: Pure HTML5, CSS3, Vanilla JavaScript (ES modules), HTML Canvas API, LocalStorage API, Web Audio API, and Service Worker API.
- **Strictly Prohibited**:
  - React, Vue, Angular, Svelte, or other UI frameworks.
  - TypeScript.
  - Tailwind CSS, Bootstrap, or any CSS utility frameworks.
  - jQuery or third-party DOM libraries.
  - Node.js runtime dependencies or npm packages (no `package.json`).
  - Webpack, Vite, Parcel, or build step bundlers.
  - Backend servers, cloud databases, external CDNs, or hotlinked fonts/scripts.
- All code must run natively in standard modern browsers from a static HTTP server.

## 2. Coding Conventions
- Use descriptive variable and function names.
- Prefer small, focused functions and pure logic separation (`rules.js` vs `index.js`).
- Use `const` by default and `let` only when reassignment is needed.
- No global variables; use ES modules and native `import`/`export`.
- Never use `eval()` or construct functions from strings.
- Never inject untrusted user input using `innerHTML`.
- Clean up all event listeners, timers, intervals, and `requestAnimationFrame` loops on teardown.

## 3. Game Development Conventions
- **Shared Lifecycle Contract**: Every game must implement the standard contract:
  - `mount(context)`
  - `start()`
  - `pause()`
  - `resume()`
  - `reset()`
  - `destroy()`
- **Isolation**: Each game owns its internal gameplay state and interacts with the platform only through the provided `context` (e.g. `onScoreUpdate`, `onGameOver`, `onGameWin`, `audio`, `rng`).
- **Single Active Game**: Only one game session may be active at any time. When navigating away, `gameLifecycle.destroy()` is invoked automatically.

## 4. Documentation & Maintenance
- When adding or altering features, update `README.md`, `docs/ARCHITECTURE.md`, and `docs/GAME_RULES.md`.
- Never claim a feature is completed unless it has been fully implemented and tested.
- Inspect the workspace before making edits and preserve existing code.

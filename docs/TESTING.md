# PixelPlay - Testing Strategy & Quality Assurance

## 1. Zero-Dependency Testing Philosophy
PixelPlay eliminates Node.js test runners (Jest, Mocha, Vitest) in favor of a native, browser-executable test harness located at `tests/index.html`.

This guarantees:
- Assertions execute in the exact target browser environment where the game runs.
- Direct validation of HTML Canvas contexts, `performance.now()`, and Web Audio API capabilities.
- Zero npm package dependencies or build pipelines.

## 2. Test Execution
1. Start local server: `python -m http.server 8000`.
2. Open `http://localhost:8000/tests/`.
3. The automated test runner executes unit assertions for:
   - **Snake**: Initial length, opposite direction detection, boundary collisions.
   - **2048**: Single merge rule, slide mechanics, 2048 tile win detection.
   - **Brick Breaker**: Matrix dimensions, paddle deflection angles, destruction flags.
   - **Memory Match**: Card deck generation, matching pairs.
   - **Tic-Tac-Toe**: 3-in-a-row winner check, Minimax defense against winning moves.
   - **Reaction Rush**: Average calculation, timing thresholds.
   - **Sequence Master**: Step verification, pad matching.
   - **Endless Runner**: AABB collision math, obstacle spawning.
   - **Seeded RNG**: Deterministic pseudo-random generation across identical seeds.
   - **Storage**: Schema validation and migration from older versions.

## 3. Supported Browser Matrix
- Google Chrome (desktop & Android)
- Mozilla Firefox (desktop & Android)
- Apple Safari (macOS & iOS)
- Microsoft Edge

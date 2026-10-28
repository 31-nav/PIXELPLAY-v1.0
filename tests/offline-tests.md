# PixelPlay - Offline Support & Service Worker Tests

This document defines testing procedures for the Service Worker (`sw.js`) and offline play.

---

## 1. Prerequisites
- The Service Worker requires an HTTPS origin or `http://localhost` / `http://127.0.0.1`.
- Opening `file://.../index.html` does not register Service Workers per browser security specifications.

## 2. Test Procedures

### Test 1: Service Worker Registration & Cache Pre-population
1. Run `python -m http.server 8000`.
2. Open Chrome/Firefox DevTools -> Application -> Service Workers.
3. Verify `sw.js` is registered, active, and controlling the page.
4. Check Cache Storage: `pixelplay-v1-static` must be populated with all CSS, JS modules, HTML, and SVG assets.

### Test 2: Offline Simulation
1. In DevTools Network tab, check "Offline".
2. Reload `http://localhost:8000/`.
3. Verify the application shell loads immediately from Cache Storage.
4. Verify the top header shows "Offline Mode".
5. Navigate to `#/games` and launch each of the 8 games (Snake, 2048, Brick Breaker, Memory Match, Tic-Tac-Toe, Reaction Rush, Sequence Master, Endless Runner).
6. Verify all 8 games are fully playable offline without any network errors.

### Test 3: Returning Online
1. In DevTools Network tab, uncheck "Offline".
2. Verify the offline status badge updates back to "Offline Ready".
3. Check that local records and stats remain intact.

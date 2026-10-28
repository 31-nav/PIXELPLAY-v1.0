# PixelPlay - Offline Support & Service Worker Architecture

## 1. Service Worker Lifecycle
Offline capability is powered by standard browser Service Worker technology implemented in `sw.js`.

```
[Network Request]
       |
  (Service Worker fetch event)
       |
       +---> [Matches Cache?] --- YES ---> Return cached response immediately
       |
       NO
       |
  [Fetch from Network]
       |
  Cache copy for future offline access & return response
```

### Install Phase
During installation, the Service Worker opens `pixelplay-v1-static` and pre-caches the complete list of core application assets:
- Root HTML documents (`index.html`, `404.html`)
- All 15 modular CSS stylesheets
- All 8 game modules (`rules.js`, `index.js`, `styles.css`)
- All core services, utilities, and components
- SVG icons and web app manifest.

### Activate Phase
When a new Service Worker activates, it iterates through all cache keys and deletes obsolete versions before claiming client control immediately (`clients.claim()`).

## 2. Offline Indicator & User Feedback
The site header includes a live offline status badge:
- **Online**: Displays `Offline Ready` with a green indicator.
- **Offline**: Displays `Offline Mode` with an amber indicator when the browser disconnects.
- All 8 games remain 100% playable in offline mode because all logic and synthesized sounds operate locally in-browser.

## 3. Testing Offline Capability
1. Run a local server: `python -m http.server 8000`.
2. Load `http://localhost:8000/`.
3. In Chrome DevTools -> Application -> Service Workers, verify `sw.js` status is `Activated and is running`.
4. Check the `Offline` checkbox in DevTools Network tab.
5. Reload the page and play any of the 8 games.

# PixelPlay v1.0 🎮
> *"Small games. Big fun."*

PixelPlay is a premium, responsive, browser-based casual mini-game platform that lets visitors discover and play games instantly—without mandatory accounts, app installations, tracking scripts, or network dependencies.

Built with **100% Vanilla HTML5, CSS3, and native ES Modules**, PixelPlay includes 8 complete, responsive games, a daily UTC challenge engine, 16 unlocked achievements, full Web Audio API synthesizer sound effects, and offline PWA capability via Service Worker.

---

## 🌟 Key Features

- **8 Genuinely Playable Games**: Complete, bug-free implementations across Arcade, Puzzle, Reflex, Memory, Strategy, and Action genres.
- **Zero Frameworks & Zero Build Steps**: No React, no Tailwind, no npm, no Vite, no node_modules. Standard browser APIs only.
- **100% Offline Capable**: Powered by Service Worker (`sw.js`) and Cache Storage. All 8 games remain fully playable offline.
- **Daily Challenge Engine**: Rotates a featured game every midnight UTC with deterministic targets and streak tracking.
- **16 Badges & Achievements**: Persistent unlock rules with real-time toast notifications and audio chimes.
- **Local-Device Persistence**: Versioned LocalStorage schema with auto-migration, in-memory recovery fallback, and full reset control.
- **Rich Visual Design System**: Midnight dark theme (#101018), high-contrast light theme, glassmorphism, responsive breakpoints, and mobile touch D-pad.
- **Synthesized Web Audio**: Procedural beeps, chimes, drops, and tones—no external audio files required.
- **Accessible & Tested**: Full keyboard navigation, visible focus rings, ARIA live announcements, and an automated browser test suite.

---

## 🎮 The 8 Games & Controls

| # | Game | Category | Controls | Objective |
|---|------|----------|----------|-----------|
| 1 | **Neon Snake** | Arcade | Arrow Keys / WASD / Swipe | Eat glowing food orbs, grow longer, avoid wall and self collisions. |
| 2 | **2048 Prism** | Puzzle | Arrow Keys / WASD / Swipe | Slide and merge matching tiles to reach the 2048 tile. |
| 3 | **Brick Breaker** | Arcade | Left/Right, A/D, Mouse, Touch | Bounce energy ball to demolish all brick rows across 3 lives. |
| 4 | **Memory Matrix** | Memory | Click / Tap / Enter | Match all paired cards in the fewest moves and fastest time. |
| 5 | **Tic-Tac-Toe Pro** | Strategy | Click / Tap / Keyboard | Play local 2P or challenge an unbeatable Minimax AI. |
| 6 | **Reaction Rush** | Reflex | Space / Click / Tap | Click the moment screen turns GREEN; measures millisecond reflexes. |
| 7 | **Sequence Master** | Reflex | 1, 2, 3, 4 / Click Pads | Replicate an ever-expanding 4-color audio sequence. |
| 8 | **Cyber Dash** | Action | Space / Up / W / Screen Tap | Sprint, jump, and dodge procedural spikes and barriers. |

---

## 🛠️ Technology Stack

PixelPlay strictly utilizes native web standards:
- **Structure**: Semantic HTML5 (`<header>`, `<main>`, `<nav>`, `<article>`, `<canvas>`)
- **Styling**: Modular Vanilla CSS3 with CSS Custom Properties, flexbox, grid, and glassmorphism
- **Logic**: Vanilla JavaScript with native ES modules (`import`/`export`)
- **Graphics**: HTML5 2D Canvas API for arcade rendering
- **Audio**: Web Audio API oscillator synthesis
- **Storage**: Browser LocalStorage API with schema versioning
- **Offline / PWA**: Service Worker API & Web App Manifest

*Strictly prohibited and completely absent: React, Vue, TypeScript, Tailwind, jQuery, Node.js packages, build tools, backend databases, and third-party hotlinks.*

---

## 📂 Project Structure

```text
pixelplay/
|-- index.html              # Main application entry HTML
|-- 404.html                # Static 404 fallback
|-- README.md               # Product overview and documentation
|-- AGENTS.md               # Persistent AI coding guidelines
|-- LICENSE                 # MIT License
|-- .gitignore              # Git ignore rules
|-- sw.js                   # Service worker for offline caching
|-- manifest.webmanifest    # PWA web manifest
|
|-- assets/
|   |-- favicon.svg         # Platform SVG logo & icon
|   |-- icons/              # Local icons
|   |-- images/             # Static artwork
|   |-- sounds/             # Audio assets
|
|-- css/
|   |-- reset.css           # CSS reset & box sizing
|   |-- variables.css       # Design tokens (colors, fonts, shadows)
|   |-- base.css            # Base typography & body styling
|   |-- layout.css          # App shell layout
|   |-- components.css      # Buttons, badges, modals, toasts
|   |-- navigation.css      # Top header & mobile nav drawer
|   |-- home.css            # Home page & hero section
|   |-- library.css         # Game library & filter chips
|   |-- game-shell.css      # Unified game player view & touch D-pad
|   |-- games.css           # Game-specific board & tile styles
|   |-- achievements.css    # 16-badge achievements view
|   |-- settings.css        # Settings toggles & sliders
|   |-- themes.css          # Light/dark theme overrides
|   |-- responsive.css      # Mobile media queries
|   |-- accessibility.css   # Screen reader & reduced-motion rules
|
|-- js/
|   |-- app.js              # Application bootstrapper
|   |-- router.js           # Client-side hash router
|   |-- routes.js           # Route table definitions
|   |-- game-registry.js    # 8-game registry & module loaders
|   |-- game-lifecycle.js   # Mount/start/pause/resume/destroy manager
|   |-- event-bus.js        # Global pub/sub event bus
|   |-- constants.js        # App constants, categories, events
|   |
|   |-- core/
|   |   |-- storage.js          # LocalStorage service with fallback
|   |   |-- storage-schema.js   # Schema definition & validation
|   |   |-- migration.js        # Data migration engine
|   |   |-- error-handler.js    # Uncaught error interception
|   |   |-- logger.js           # Diagnostic logger
|   |   |-- clock.js            # Monotonic performance clock & UTC dates
|   |
|   |-- services/
|   |   |-- audio.js            # Web Audio synthesizer
|   |   |-- achievements.js     # 16-achievement tracker
|   |   |-- statistics.js       # Play sessions & records
|   |   |-- favorites.js        # Favorite games manager
|   |   |-- recent-games.js     # Recently played list
|   |   |-- daily-challenge.js  # Deterministic UTC challenge engine
|   |   |-- theme-manager.js    # Light/dark theme switcher
|   |   |-- notification.js     # Toast notifications
|   |
|   |-- components/
|   |   |-- header.js           # Header with offline badge
|   |   |-- navigation.js       # Navigation links
|   |   |-- game-card.js        # Reusable game card
|   |   |-- modal.js            # Focus-trapped accessible modal
|   |   |-- toast.js            # Toast wrapper
|   |   |-- dialog.js           # Confirmation dialog
|   |   |-- empty-state.js      # Empty state views
|   |   |-- loading-state.js    # Loading spinner
|   |
|   |-- pages/
|   |   |-- home.js             # Home view
|   |   |-- game-library.js     # Filterable library
|   |   |-- game-player.js      # Unified game player
|   |   |-- daily-challenge-page.js # Daily challenge view
|   |   |-- achievements-page.js    # Achievements view
|   |   |-- statistics-page.js      # Statistics view
|   |   |-- settings-page.js        # Preferences & Reset
|   |   |-- not-found.js        # 404 view
|   |
|   |-- games/
|   |   |-- snake/              # Neon Snake (rules.js, index.js, styles.css)
|   |   |-- 2048/               # 2048 Prism (rules.js, index.js, styles.css)
|   |   |-- brick-breaker/      # Brick Breaker (rules.js, index.js, styles.css)
|   |   |-- memory-match/       # Memory Matrix (rules.js, index.js, styles.css)
|   |   |-- tic-tac-toe/        # Tic-Tac-Toe Pro (rules.js, index.js, styles.css)
|   |   |-- reaction-rush/      # Reaction Rush (rules.js, index.js, styles.css)
|   |   |-- sequence-master/    # Sequence Master (rules.js, index.js, styles.css)
|   |   |-- endless-runner/     # Cyber Dash (rules.js, index.js, styles.css)
|   |
|   |-- utils/
|       |-- dom.js              # DOM helpers & safe element builders
|       |-- random.js           # Math.random & Seeded Mulberry32 RNG
|       |-- format.js           # Number & duration formatters
|       |-- validation.js       # Runtime type guards
|       |-- accessibility.js    # Focus trap & ARIA announcer
|       |-- input-manager.js    # Keybinds & swipe detector
|
|-- tests/
|   |-- index.html              # Interactive browser test runner
|   |-- test-runner.js          # Unit assertions across all modules
|   |-- README.md               # Testing documentation
|   |-- manual-test-plan.md     # QA manual checklist
|   |-- game-tests.md           # Game rules test cases
|   |-- storage-tests.md        # LocalStorage resilience tests
|   |-- offline-tests.md        # Service worker test protocol
|
|-- docs/
    |-- PROJECT_SPECIFICATION.md
    |-- ARCHITECTURE.md
    |-- GAME_RULES.md
    |-- DATA_MODEL.md
    |-- OFFLINE_SUPPORT.md
    |-- TESTING.md
    |-- DEPLOYMENT.md
    |-- ACCESSIBILITY.md
    |-- CHANGELOG.md
    |-- CONTRIBUTING.md
    |-- SECURITY_AND_PRIVACY.md
```

---

## 🚀 Local Development Instructions

Because PixelPlay uses native JavaScript ES modules and registers a Service Worker, it **must** be served via HTTP/HTTPS.

> [!IMPORTANT]
> Opening `index.html` directly via `file://` will cause browser CORS restrictions to block native ES module imports and Service Worker registration. Always serve over local HTTP.

### Launching Local HTTP Server:

Using Python 3 (standard on Windows/macOS/Linux):
```bash
# Navigate to the workspace root directory:
cd "c:\PIXELPLAY v1.0"

# Start the server:
python -m http.server 8000
```

Or using Node's npx (if installed):
```bash
npx serve -l 8000
```

Open your browser and navigate to:
```
http://localhost:8000/
```

To run the automated test suite:
```
http://localhost:8000/tests/
```

---

## 🌐 Public Deployment

Because PixelPlay uses hash-based client routing (`#/`, `#/games`, `#/play/:id`), it deploys cleanly to any static web host without requiring server-side URL rewrite rules.

### 1. GitHub Pages
1. Push the repository to GitHub.
2. In the repository settings, go to **Pages**.
3. Under **Build and deployment**, select **Source: Deploy from a branch**.
4. Choose `main` branch and `/ (root)` folder.
5. Click **Save**. GitHub Pages will serve the site over HTTPS, enabling full Service Worker offline caching.

### 2. Netlify
1. Connect your repository to Netlify or drag-and-drop the project folder to the Netlify Drop interface.
2. Leave the build command **blank** (no build tool needed).
3. Set the publish directory to `.` (the root folder).
4. Deploy!

---

## 🏆 16 Unlocked Achievements

1. **First Steps**: Complete your very first game session.
2. **Getting Started**: Play 5 game sessions across any titles.
3. **Game Explorer**: Play all 8 different games in the library.
4. **Regular Player**: Play 25 game sessions.
5. **Personal Best**: Set a new personal high score in any game.
6. **Snake Charmer**: Reach a score of 50 or higher in Snake.
7. **Tile Master**: Create the 2048 tile in 2048 Prism.
8. **Brick Buster**: Clear a level in Brick Breaker.
9. **Sharp Memory**: Successfully complete a round of Memory Matrix.
10. **Perfect Tic-Tac-Toe**: Win against the computer in Tic-Tac-Toe.
11. **Quick Reflexes**: Achieve a reaction time under 250ms in Reaction Rush.
12. **Sequence Star**: Reach level 10 or higher in Sequence Master.
13. **Runner's High**: Reach a distance of 500 meters in Cyber Dash.
14. **Daily Starter**: Complete your first Daily Challenge.
15. **Challenge Streak**: Complete Daily Challenges on 3 consecutive UTC dates.
16. **Challenge Champion**: Complete 7 total Daily Challenges.

---

## 🔒 Privacy & Local Storage Disclosure

- **Zero Data Collection**: PixelPlay does not collect personal data, tracking cookies, or behavioral telemetry.
- **Local Only**: High scores, game sessions, streaks, and preferences reside solely in the user's browser via LocalStorage.
- **Client Modifiable**: Because records are stored locally on the client device, scores are for personal amusement and do not represent tamper-proof global leaderboards.
- **Full Control**: Users can wipe all local records at any time via the Settings page.

---

## 📄 License

PixelPlay is open source software licensed under the [MIT License](./LICENSE).

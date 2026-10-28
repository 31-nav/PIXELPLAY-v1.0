# PixelPlay - Security & Privacy Policy

## 1. Zero Tracking & Data Privacy
PixelPlay is architected with strict client-first privacy guarantees:
- **No Analytics / Telemetry**: No tracking pixels, Google Analytics, or behavioral telemetry are present.
- **No Third-Party Scripts**: No CDNs or third-party JavaScript libraries are loaded.
- **No Cookies**: The platform uses zero HTTP cookies.
- **Local Storage Only**: All settings, streaks, personal best scores, and achievement unlock states remain strictly in the visitor's local device browser storage.

## 2. Client-Side Score Mutability Disclosure
Because PixelPlay has no centralized database or authentication server:
- Local high scores and achievement badges are stored in browser `localStorage`.
- Savvy users can view and edit these values via Developer Tools.
- Scores reflect **personal entertainment records** on that specific device and must not be treated as cryptographically secure or competitive global leaderboards.

## 3. Safe Coding Practices
- **No `eval()`**: Dynamic code execution via `eval()` or `new Function()` is strictly prohibited.
- **XSS Prevention**: User-provided inputs are strictly escaped using `escapeHTML()` or inserted using `textContent` / `createElement`.
- **Schema Validation**: Data parsed from `localStorage` is verified by `validateStorageState()` before consumption to safeguard against injection or malformed data.

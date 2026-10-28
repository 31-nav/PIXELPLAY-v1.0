# PixelPlay - Manual Test Plan & Release Checklist

This test plan provides step-by-step instructions for manual Quality Assurance testing of the PixelPlay platform.

---

## 1. Application Navigation & Shell

| ID | Description | Steps | Expected Result |
|----|-------------|-------|-----------------|
| NAV-01 | Initial page load | Navigate to root URL (`#/`) | Home page loads with hero, daily challenge banner, stats, and 8 game cards. |
| NAV-02 | Client routing | Click "Games" in header | Route updates to `#/games` without full page reload. Active tab highlights. |
| NAV-03 | Direct deep link | Paste `#/play/snake` in address bar | Directly loads Snake game player view. |
| NAV-04 | Browser history | Press Back and Forward buttons | Seamlessly travels between previously visited hash routes. |
| NAV-05 | 404 Route | Navigate to `#/unknown-path` | Displays designed "Page Not Found" screen with link back to Home. |

---

## 2. Shared Game Lifecycle & Controls

| ID | Description | Steps | Expected Result |
|----|-------------|-------|-----------------|
| LIFE-01 | Pause & Resume | In any active game, press `Pause` or Space/P | Game physics/timer freezes. Pause overlay displays. Resuming unfreezes state. |
| LIFE-02 | Restart | In any active game, click `Restart` (🔄) | State resets cleanly to 0 score without duplicate game loops. |
| LIFE-03 | Audio Toggle | Click Mute button in shell header | Toggles mute on all Web Audio synthesizer sounds. Persists in LocalStorage. |
| LIFE-04 | Teardown on Leave | Start a game, navigate to `#/games` | All animation loops (`requestAnimationFrame`) and intervals cease immediately. |

---

## 3. Daily Challenge & Achievements

| ID | Description | Steps | Expected Result |
|----|-------------|-------|-----------------|
| ACH-01 | First Steps unlock | Complete one game session | Toast pops up: "🏆 Achievement Unlocked: First Steps!". Recorded on Achievements page. |
| DAILY-01 | Daily rotation | View Daily Challenge on home/daily page | Correct game for today's UTC calendar date is displayed. |
| DAILY-02 | Streak increment | Complete today's daily challenge target | Completed status marks true; streak increments by 1. |

---

## 4. Themes & Accessibility

| ID | Description | Steps | Expected Result |
|----|-------------|-------|-----------------|
| THEME-01 | Light/Dark toggle | Click theme button in header or Settings | Toggles `data-theme="light"` and `data-theme="dark"`. Persists across page refreshes. |
| A11Y-01 | Keyboard navigation | Use `Tab` and `Shift+Tab` across UI | Clear high-contrast focus rings appear on all interactive elements. |
| A11Y-02 | Screen reader announcement | Navigate between views | `#a11y-live-announcer` announces page title change via `aria-live`. |

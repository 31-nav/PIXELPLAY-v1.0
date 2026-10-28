# PixelPlay - Accessibility Guide & Compliance

## 1. Principles
PixelPlay is built with inclusive design principles to ensure games and navigation remain accessible to diverse users.

## 2. Keyboard Navigation
- All interactive controls (buttons, links, search inputs, filter chips, theme toggles) are focusable via `Tab` and `Shift+Tab`.
- Visible, high-contrast focus rings (`:focus-visible`) are enforced using CSS custom properties.
- Modal dialogs implement a strict **focus trap**, preventing keyboard focus from escaping into background elements while open. Focus is restored to the initiating trigger upon dialog dismissal.
- Skip to main content link (`.skip-link`) is accessible on initial tab press.

## 3. Assistive Technology & Screen Readers
- A polite ARIA live region (`#a11y-live-announcer`) announces page title changes dynamically on route transitions.
- All icon-only buttons include descriptive `aria-label` tags (e.g. `aria-label="Add Neon Snake to favorites"`).
- Canvas games include structured, human-readable instructions and controls listings directly below the game surface.

## 4. Reduced Motion
PixelPlay honors user system preferences for reduced motion:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```
In addition, users can explicitly toggle the "Reduce Motion" setting in `#/settings`.

## 5. Color Contrast & Forced Colors
- Default dark theme (#101018 background, #F5F5FA text) exceeds WCAG AA 4.5:1 contrast requirements.
- High-contrast light theme provides dark slate text on ivory/white surfaces.
- Windows High Contrast / Forced Colors mode is explicitly styled via `@media (forced-colors: active)`.

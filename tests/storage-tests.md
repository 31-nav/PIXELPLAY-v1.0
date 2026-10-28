# PixelPlay - Storage & Persistence Test Protocols

This document details tests for LocalStorage resilience, schema validation, and recovery.

---

## 1. Schema Integrity & Validation
- **Default State**: Verify that missing storage defaults to `DEFAULT_STORAGE_STATE` without runtime exceptions.
- **Corrupted JSON**: Manually inject non-JSON text into `localStorage['pixelplay_storage_v1']`. On reload, PixelPlay must log a warning and safely restore default schema.
- **Missing Keys**: If an older version object is missing `dailyChallenge` or `achievements`, schema validation merges defaults so no property access crashes occur.

## 2. Quota & In-Memory Fallback
- **Private Browsing / Cookies Disabled**: Simulate `localStorage.setItem` throwing a security error. PixelPlay's `StorageService` must fall back to memory storage, allowing gameplay to proceed uninterrupted.
- **Quota Exceeded**: Simulate storage write failures. PixelPlay catches errors gracefully and continues execution.

## 3. Reset All Data
- **Confirmation Requirement**: Clicking "Reset All Data" in Settings must display a confirmation dialog.
- **Full Wipe**: Confirming the reset resets high scores, play counts, 16 achievements, streaks, and preferences to factory defaults.

# PixelPlay Test Documentation & Harness

This directory houses the comprehensive test documentation, manual test protocols, and the zero-dependency browser-based automated test runner.

## Automated Test Harness

PixelPlay does not use Node.js runtime or npm dependencies. Instead, unit tests execute natively in any standard modern web browser using standard ES modules:

1. Launch a local static HTTP server from the root directory:
   ```bash
   python -m http.server 8000
   ```
2. Open your browser and navigate to:
   ```
   http://localhost:8000/tests/
   ```
3. The test runner will automatically execute all assertions across all 8 games, seeded RNG, schema migrations, and storage services, reporting real-time PASS/FAIL statuses.

## Test Documents

- [manual-test-plan.md](./manual-test-plan.md): Full end-to-end user journey and manual QA verification checklist.
- [game-tests.md](./game-tests.md): Detailed gameplay test cases for each of the 8 mini-games.
- [storage-tests.md](./storage-tests.md): LocalStorage quota, corruption handling, and schema migration verification.
- [offline-tests.md](./offline-tests.md): Service Worker caching, offline installation, and network transition tests.

/**
 * PixelPlay - Browser Automated Test Runner & Test Suites
 * Validates core game logic, algorithms, storage, and utilities with zero external dependencies.
 */

// Import pure rule modules & utilities
import * as SnakeRules from '../js/games/snake/rules.js';
import * as Rules2048 from '../js/games/2048/rules.js';
import * as BrickBreakerRules from '../js/games/brick-breaker/rules.js';
import * as MemoryRules from '../js/games/memory-match/rules.js';
import * as TicTacToeRules from '../js/games/tic-tac-toe/rules.js';
import * as ReactionRules from '../js/games/reaction-rush/rules.js';
import * as SequenceRules from '../js/games/sequence-master/rules.js';
import * as RunnerRules from '../js/games/endless-runner/rules.js';
import { SeededRNG } from '../js/utils/random.js';
import { validateStorageState, DEFAULT_STORAGE_STATE } from '../js/core/storage-schema.js';
import { migrateStorage } from '../js/core/migration.js';

export class SimpleTestRunner {
  constructor() {
    this.results = [];
  }

  assert(condition, message) {
    if (!condition) {
      throw new Error(`Assertion Failed: ${message}`);
    }
  }

  assertEqual(actual, expected, message) {
    if (actual !== expected) {
      throw new Error(`Expected "${expected}" but got "${actual}". ${message || ''}`);
    }
  }

  async test(name, fn) {
    try {
      await fn(this);
      this.results.push({ name, status: 'PASS' });
    } catch (err) {
      this.results.push({ name, status: 'FAIL', error: err.message });
    }
  }

  async runAll() {
    // 1. Snake Logic Tests
    await this.test('Snake: Initial snake has 3 segments', () => {
      const snake = SnakeRules.createInitialSnake();
      this.assertEqual(snake.length, 3);
    });

    await this.test('Snake: Opposite direction detection', () => {
      this.assert(
        SnakeRules.isOppositeDirection(SnakeRules.DIRECTIONS.UP, SnakeRules.DIRECTIONS.DOWN),
        'UP and DOWN must be opposite'
      );
      this.assert(
        !SnakeRules.isOppositeDirection(SnakeRules.DIRECTIONS.UP, SnakeRules.DIRECTIONS.LEFT),
        'UP and LEFT are not opposite'
      );
    });

    await this.test('Snake: Wall collision detection', () => {
      const headOutOfBounds = { x: -1, y: 5 };
      const body = [{ x: 5, y: 5 }];
      this.assert(SnakeRules.checkCollision(headOutOfBounds, body, 20), 'Negative X must trigger wall collision');
    });

    // 2. 2048 Logic Tests
    await this.test('2048: Line slide and single merge per move', () => {
      const line = [2, 2, 2, 2];
      const res = Rules2048.slideAndMergeLine(line);
      this.assertEqual(res.line[0], 4, 'First two 2s merge into 4');
      this.assertEqual(res.line[1], 4, 'Second two 2s merge into 4');
      this.assertEqual(res.line[2], 0, 'Rest padded with 0');
      this.assertEqual(res.score, 8, 'Score gained is 8');
    });

    await this.test('2048: Winning tile detection', () => {
      const board = Rules2048.createEmptyBoard();
      board[0][0] = 2048;
      this.assert(Rules2048.hasWinningTile(board, 2048), 'Should detect 2048 tile');
    });

    // 3. Brick Breaker Logic Tests
    await this.test('Brick Breaker: Brick matrix creation', () => {
      const bricks = BrickBreakerRules.createBricks(5, 8);
      this.assertEqual(bricks.length, 5);
      this.assertEqual(bricks[0].length, 8);
      this.assert(!BrickBreakerRules.areAllBricksDestroyed(bricks), 'Fresh bricks are not all destroyed');
    });

    await this.test('Brick Breaker: Paddle reflection angle calculation', () => {
      const bounce = BrickBreakerRules.calculatePaddleBounce(100, 100, 80, 4);
      this.assert(bounce.dy < 0, 'Ball should reflect upward with negative dy');
    });

    // 4. Memory Match Tests
    await this.test('Memory Match: Deck has paired cards', () => {
      const deck = MemoryRules.createDeck(6);
      this.assertEqual(deck.length, 12, '6 pairs equals 12 cards');
      this.assert(MemoryRules.areCardsMatching(deck[0], { pairId: deck[0].pairId }));
    });

    // 5. Tic-Tac-Toe Minimax Tests
    await this.test('Tic-Tac-Toe: Winning row detection', () => {
      const board = ['X', 'X', 'X', null, null, null, null, null, null];
      const outcome = TicTacToeRules.checkWinner(board);
      this.assertEqual(outcome.winner, 'X');
    });

    await this.test('Tic-Tac-Toe: Minimax blocks winning move', () => {
      // Human X has two in a row [0, 1], computer O must block at [2]
      const board = ['X', 'X', null, null, 'O', null, null, null, null];
      const move = TicTacToeRules.getBestMoveMinimax(board, 'O');
      this.assertEqual(move, 2, 'Computer O should block human at index 2');
    });

    // 6. Reaction Rush Tests
    await this.test('Reaction Rush: Average calculation', () => {
      const times = [200, 250, 300];
      const avg = ReactionRules.calculateAverage(times);
      this.assertEqual(avg, 250);
    });

    // 7. Sequence Master Tests
    await this.test('Sequence Master: Step validation', () => {
      const sequence = [0, 1, 3, 2];
      this.assert(SequenceRules.validateStep(sequence, 0, 0), 'Step 0 matches pad 0');
      this.assert(!SequenceRules.validateStep(sequence, 1, 0), 'Step 1 does not match pad 0');
    });

    // 8. Endless Runner Tests
    await this.test('Endless Runner: AABB collision detection', () => {
      const p = { x: 50, y: 200, width: 20, height: 30 };
      const obs = { x: 60, y: 210, width: 20, height: 30 };
      this.assert(RunnerRules.checkAABBCollision(p, obs), 'Overlapping rectangles must collide');
    });

    // 9. Seeded RNG Tests
    await this.test('Seeded RNG: Deterministic output for same seed', () => {
      const rng1 = new SeededRNG('2026-10-28');
      const rng2 = new SeededRNG('2026-10-28');
      this.assertEqual(rng1.next(), rng2.next(), 'Same seed generates identical first float');
      this.assertEqual(rng1.nextInt(1, 100), rng2.nextInt(1, 100), 'Same seed generates identical int');
    });

    // 10. Storage Schema & Migration Tests
    await this.test('Storage: Default schema validation', () => {
      this.assert(validateStorageState(DEFAULT_STORAGE_STATE), 'Default state must pass validation');
    });

    await this.test('Storage: Migration preserves older data', () => {
      const v0State = { version: 0, favorites: ['snake'] };
      const migrated = migrateStorage(v0State);
      this.assertEqual(migrated.version, 1, 'Version bumped to 1');
      this.assertEqual(migrated.favorites[0], 'snake', 'Favorites preserved');
    });

    return this.results;
  }
}

/**
 * PixelPlay - Central Game Registry
 * Contains metadata, controls, difficulty, and dynamic module loaders for all 8 games.
 */

import { CATEGORIES, DIFFICULTY } from './constants.js';

export const GAME_REGISTRY = [
  {
    id: 'snake',
    name: 'Neon Snake',
    tagline: 'Classic arcade serpent with a neon cyberpunk glow.',
    category: CATEGORIES.ARCADE,
    difficulty: DIFFICULTY.MEDIUM,
    supportsDailyChallenge: true,
    icon: '🐍',
    accentColor: '#42E8B4',
    instructions: 'Navigate the neon grid to consume glowing energy orbs. Each orb grows your snake and increases game speed. Avoid crashing into the grid walls or yourself!',
    controls: [
      { key: 'Arrow Keys / WASD', action: 'Change direction' },
      { key: 'Swipe (Mobile)', action: 'Swipe direction' },
      { key: 'Space / P', action: 'Pause / Resume' }
    ],
    loader: () => import('./games/snake/index.js')
  },
  {
    id: '2048',
    name: '2048 Prism',
    tagline: 'Slide and merge identical tiles to reach the legendary 2048.',
    category: CATEGORIES.PUZZLE,
    difficulty: DIFFICULTY.HARD,
    supportsDailyChallenge: true,
    icon: '🔢',
    accentColor: '#7867FF',
    instructions: 'Use your arrow keys or swipe to slide all tiles across the 4x4 board. When two tiles with the same number collide, they merge into one with double the value!',
    controls: [
      { key: 'Arrow Keys / WASD', action: 'Slide tiles' },
      { key: 'Swipe (Mobile)', action: 'Slide board' },
      { key: 'R', action: 'Restart board' }
    ],
    loader: () => import('./games/2048/index.js')
  },
  {
    id: 'brick-breaker',
    name: 'Brick Breaker',
    tagline: 'Shatter vibrant brick formations with precision angles.',
    category: CATEGORIES.ARCADE,
    difficulty: DIFFICULTY.MEDIUM,
    supportsDailyChallenge: true,
    icon: '🧱',
    accentColor: '#FF6B6B',
    instructions: 'Control the responsive paddle at the bottom of the screen. Bounce the energy ball to demolish all bricks on screen while maintaining your 3 lives.',
    controls: [
      { key: 'Arrow Left/Right, A/D', action: 'Move paddle' },
      { key: 'Mouse / Touch Drag', action: 'Steer paddle' },
      { key: 'Space', action: 'Launch ball / Pause' }
    ],
    loader: () => import('./games/brick-breaker/index.js')
  },
  {
    id: 'memory-match',
    name: 'Memory Matrix',
    tagline: 'Test and sharpen your visual recall by matching cards.',
    category: CATEGORIES.MEMORY,
    difficulty: DIFFICULTY.EASY,
    supportsDailyChallenge: true,
    icon: '🧠',
    accentColor: '#4EA8DE',
    instructions: 'Flip face-down cards two at a time to reveal symbols. Find all matching pairs in the fewest moves and fastest time possible.',
    controls: [
      { key: 'Click / Tap', action: 'Flip card' },
      { key: 'Tab + Enter', action: 'Keyboard accessible flip' }
    ],
    loader: () => import('./games/memory-match/index.js')
  },
  {
    id: 'tic-tac-toe',
    name: 'Tic-Tac-Toe Pro',
    tagline: 'Play local 2-player or challenge an unbeatable Minimax AI.',
    category: CATEGORIES.STRATEGY,
    difficulty: DIFFICULTY.MEDIUM,
    supportsDailyChallenge: false,
    icon: '❌',
    accentColor: '#FFB347',
    instructions: 'Place your mark on the 3x3 grid. Line up 3 marks in a row horizontally, vertically, or diagonally to claim victory.',
    controls: [
      { key: 'Click / Tap', action: 'Claim cell' },
      { key: 'Tab + Space/Enter', action: 'Keyboard cell selection' }
    ],
    loader: () => import('./games/tic-tac-toe/index.js')
  },
  {
    id: 'reaction-rush',
    name: 'Reaction Rush',
    tagline: 'Measure your neuro-reflexes with millisecond precision.',
    category: CATEGORIES.REFLEX,
    difficulty: DIFFICULTY.EASY,
    supportsDailyChallenge: true,
    icon: '⚡',
    accentColor: '#2CD6A0',
    instructions: 'Click or tap when the screen turns vibrant GREEN! Triggering too early counts as a false start. Complete 5 rounds to record your peak reflex speed.',
    controls: [
      { key: 'Click / Tap / Space', action: 'Trigger reflex reaction' }
    ],
    loader: () => import('./games/reaction-rush/index.js')
  },
  {
    id: 'sequence-master',
    name: 'Sequence Master',
    tagline: 'Memorize and replicate an ever-expanding audio-visual sequence.',
    category: CATEGORIES.REFLEX,
    difficulty: DIFFICULTY.HARD,
    supportsDailyChallenge: true,
    icon: '🎶',
    accentColor: '#E71D36',
    instructions: 'Watch and listen as the four colored pads light up in sequence. Replay the sequence in the exact order without a mistake to climb to higher levels!',
    controls: [
      { key: 'Click / Tap Pads', action: 'Select color pad' },
      { key: '1, 2, 3, 4 Keys', action: 'Keyboard pads (Green, Red, Yellow, Blue)' }
    ],
    loader: () => import('./games/sequence-master/index.js')
  },
  {
    id: 'endless-runner',
    name: 'Cyber Dash',
    tagline: 'Sprint, jump, and dodge procedural hazards in an endless cyberway.',
    category: CATEGORIES.ACTION,
    difficulty: DIFFICULTY.HARD,
    supportsDailyChallenge: true,
    icon: '🏃',
    accentColor: '#7867FF',
    instructions: 'Dash through the neon skyline. Jump over spikes and obstacles as your speed increases with distance. How far can you survive?',
    controls: [
      { key: 'Space / Up Arrow / W', action: 'Jump' },
      { key: 'Tap Screen', action: 'Touch jump' },
      { key: 'P', action: 'Pause / Resume' }
    ],
    loader: () => import('./games/endless-runner/index.js')
  }
];

export function getGameById(id) {
  return GAME_REGISTRY.find(g => g.id === id) || null;
}

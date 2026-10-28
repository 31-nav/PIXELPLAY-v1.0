# PixelPlay - Game Rules & Mechanics Specification

This document details the exact rules, controls, physics, scoring formulas, and daily challenge adapters for all 8 games.

---

## 1. Neon Snake
- **Grid Size**: 20 × 20 cells.
- **Initial Speed**: 140ms per tick; minimum speed capped at 60ms; accelerates by 4ms per 10 points.
- **Controls**: Arrow Keys / WASD / Swipe gestures. Reverse-direction prevention active.
- **Scoring**: Each consumed energy orb awards 10 points.
- **Daily Challenge Adapter**: Seeded initial food spawns; target is to reach 30 points.

## 2. 2048 Prism
- **Grid Size**: 4 × 4 matrix.
- **Movement**: Left, Right, Up, Down slides.
- **Merge Logic**: Tiles merge when identical numbers collide. A tile can merge at most once per slide.
- **Spawns**: 90% probability of 2; 10% probability of 4 on empty cells.
- **Win Condition**: Creating the 2048 tile.
- **Daily Challenge Adapter**: Reach 1,000 points on the daily tile layout.

## 3. Brick Breaker
- **Layout**: 5 rows × 8 columns of colored bricks.
- **Scoring**: Row 1 (Red) = 50 pts; Row 2 (Orange) = 40 pts; Row 3 (Yellow) = 30 pts; Row 4 (Mint) = 20 pts; Row 5 (Violet) = 10 pts.
- **Lives**: Starts with 3 lives.
- **Paddle Physics**: Deflection angle varies from -75° to +75° based on distance from paddle center.
- **Level Progression**: Clearing all 40 bricks increments level and ball speed.
- **Daily Challenge Adapter**: Score 250 points.

## 4. Memory Matrix
- **Deck**: 8 pairs (16 cards) on medium mode.
- **Mechanics**: Flip 2 cards. Match keeps cards open; mismatch locks board for 700ms before flipping face-down.
- **Scoring**: `Score = max(10, 1000 - (moves * 15) - (time_seconds * 5))`.
- **Daily Challenge Adapter**: Clear the deck in under 45 seconds.

## 5. Tic-Tac-Toe Pro
- **Grid**: 3 × 3 cells.
- **Modes**: Player vs Player or Player vs Computer.
- **AI Algorithm**: Recursive Minimax with alpha-beta depth pruning on Hard mode.
- **Win Condition**: 3 identical marks in a line.

## 6. Reaction Rush
- **Phases**: Idle -> Waiting (Red) -> Ready (Green) -> Result.
- **Delay**: Randomized 2,000ms to 5,000ms.
- **Timing**: Measured via monotonic `performance.now()`.
- **False Start**: Clicking during the Red waiting phase invalidates the attempt.
- **Session**: 5 rounds per session; calculates peak reflex time and 5-round average.
- **Daily Challenge Adapter**: Achieve a reflex time under 280ms.

## 7. Sequence Master
- **Pads**: 4 color pads (Green 329Hz, Red 261Hz, Yellow 220Hz, Blue 164Hz).
- **Controls**: Mouse click or 1, 2, 3, 4 keyboard keys.
- **Mechanics**: Sequence increases by 1 step every level. Input is disabled during playback.
- **Daily Challenge Adapter**: Reach level 6 or higher on the daily seeded pattern.

## 8. Cyber Dash (Endless Runner)
- **Physics**: Gravity = 0.65; Jump Force = -11.5; Ground Level = 270px.
- **Controls**: Space, Up Arrow, W, or Screen Tap.
- **Speed**: Starts at 4.5px/frame; accelerates up to 11.0px/frame.
- **Obstacles**: Procedural spikes, blocks, and barriers.
- **Scoring**: 1 point per 20 frames survived (meter distance).
- **Daily Challenge Adapter**: Survive for 350 meters.

# PixelPlay - Per-Game Verification Protocols

This document details test scenarios for each of the 8 mini-games.

---

## 1. Neon Snake
- **Movement**: Verify snake responds to Arrow keys, WASD, and touch gestures.
- **Reverse Prevention**: When moving RIGHT, pressing LEFT must be ignored (snake must not reverse into itself).
- **Food Spawning**: Eating glowing food increments score by 10, plays eat sound, and spawns new food off the snake body.
- **Speed Ramp**: As score increases, snake tick interval accelerates smoothly.
- **Collision**: Hitting the canvas perimeter or the snake's own tail immediately triggers game over.

## 2. 2048 Prism
- **Sliding**: Arrow keys or swipes slide tiles cleanly across the 4x4 matrix.
- **Single Merge Rule**: A line of `[2, 2, 2, 2]` sliding left must become `[4, 4, 0, 0]`, not `[8, 0, 0, 0]`.
- **Spawning**: Each valid slide spawns a new random tile (90% chance of 2, 10% chance of 4).
- **Win Detection**: Reaching the 2048 tile triggers the victory dialog with option to keep playing.
- **Game Over**: When all 16 cells are filled and no adjacent pairs match, game over overlay appears.

## 3. Brick Breaker
- **Paddle Control**: Paddle steers smoothly via Left/Right arrows, A/D, mouse cursor, and touch drag.
- **Launch Mechanic**: Ball remains glued to paddle until Space or Click launches it.
- **Reflection Angles**: Bouncing off the paddle edges reflects at steeper angles than the paddle center.
- **Lives System**: 3 lives; losing the ball decrements life count; 0 lives triggers game over.
- **Level Clear**: Breaking all bricks triggers victory and advances to the next level with increased speed.

## 4. Memory Matrix
- **Flipping**: Clicking a card turns it face-up.
- **Matching**: Matching two identical symbols keeps them face-up and awards score.
- **Mismatch Lockdown**: When two cards mismatch, input is locked for 700ms before cards flip back down to prevent cheating.
- **Timer & Moves**: Stopwatch and move counters update reliably.

## 5. Tic-Tac-Toe Pro
- **Mode Toggle**: Can switch between "vs Computer" and "Local 2 Players".
- **Win Check**: 3 marks in any row, column, or diagonal triggers victory with winning line highlighted.
- **Minimax AI**: On Hard mode, AI defends against human double-traps and never loses.
- **Draw**: Filled board with no 3-in-a-row marks triggers draw outcome.

## 6. Reaction Rush
- **Waiting Phase**: Red panel displays "Wait for GREEN...".
- **False Start**: Clicking while red displays "Too Early!" and does not count as a valid attempt.
- **Reaction Measurement**: Accurate monotonic timing via `performance.now()`.
- **Session Average**: After 5 rounds, computes and displays peak reflex time and session average.

## 7. Sequence Master
- **Audio Feedback**: Each of the 4 colored pads emits its distinct frequency tone.
- **Playback Lockdown**: User clicks are disabled while the computer plays the active sequence.
- **Level Scaling**: Each round adds one more random color to the sequence.
- **Wrong Input**: Pressing the incorrect pad triggers instant game over.

## 8. Cyber Dash (Endless Runner)
- **Jump Physics**: Space, Up Arrow, or Screen Tap launches runner upward with natural gravity.
- **Obstacle Variety**: Spikes, blocks, and barriers spawn procedurally with fair spacing.
- **AABB Collision**: Touching any hazard triggers collision audio and final distance score.
- **Speed Acceleration**: World speed increases slightly as distance increases.

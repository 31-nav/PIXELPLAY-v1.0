/**
 * PixelPlay - Sequence Master Rules & Logic
 */

export const PADS = [
  { id: 0, color: 'green', key: '1', name: 'Green' },
  { id: 1, color: 'red', key: '2', name: 'Red' },
  { id: 2, color: 'yellow', key: '3', name: 'Yellow' },
  { id: 3, color: 'blue', key: '4', name: 'Blue' }
];

export function getNextStep(rng = null) {
  if (rng) {
    return Math.floor(rng.next() * 4);
  }
  return Math.floor(Math.random() * 4);
}

export function validateStep(sequence, userStepIndex, pressedPadId) {
  return sequence[userStepIndex] === pressedPadId;
}

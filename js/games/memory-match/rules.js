/**
 * PixelPlay - Memory Match Rules & Logic
 */

export const SYMBOL_POOL = [
  '💎', '🔥', '⚡', '🌙', '⭐', '🍀', '🚀', '🎯',
  '🎨', '🔮', '🪐', '🦄', '🍎', '👑', '⚓', '🔔'
];

export const DIFFICULTIES = {
  EASY: { id: 'easy', rows: 3, cols: 4, pairs: 6, label: '3×4 (Easy)' },
  MEDIUM: { id: 'medium', rows: 4, cols: 4, pairs: 8, label: '4×4 (Medium)' },
  HARD: { id: 'hard', rows: 4, cols: 6, pairs: 12, label: '4×6 (Hard)' }
};

export function createDeck(pairCount = 8, rng = null) {
  const chosenSymbols = SYMBOL_POOL.slice(0, pairCount);
  const cards = [];

  chosenSymbols.forEach((symbol, index) => {
    cards.push({ id: `c_${index}_a`, pairId: index, symbol, flipped: false, matched: false });
    cards.push({ id: `c_${index}_b`, pairId: index, symbol, flipped: false, matched: false });
  });

  // Shuffle
  for (let i = cards.length - 1; i > 0; i--) {
    const j = rng
      ? Math.floor(rng.next() * (i + 1))
      : Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }

  return cards;
}

export function areCardsMatching(cardA, cardB) {
  return cardA.pairId === cardB.pairId;
}

export function isDeckCompleted(cards) {
  return cards.every(c => c.matched);
}

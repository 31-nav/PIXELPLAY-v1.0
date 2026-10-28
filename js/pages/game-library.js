/**
 * PixelPlay - Game Library Page View
 */

import { createElement, empty } from '../utils/dom.js';
import { GAME_REGISTRY } from '../game-registry.js';
import { createGameCard } from '../components/game-card.js';
import { createEmptyState } from '../components/empty-state.js';
import { CATEGORIES, CATEGORY_LABELS } from '../constants.js';
import { favorites } from '../services/favorites.js';

export function renderGameLibraryPage(container) {
  empty(container);

  let searchQuery = '';
  let activeCategory = CATEGORIES.ALL;
  let showFavoritesOnly = false;
  let currentSort = 'featured';

  const page = createElement('div', { className: 'library-page' });

  // Page Header
  const header = createElement('div', { className: 'home-section-header', style: 'margin-top: 0;' }, [
    createElement('h1', { className: 'home-section-title', text: '🎮 Game Library' }),
    createElement('p', {
      className: 'header-desc',
      text: 'Explore our catalog of 8 browser-ready arcade, puzzle, and reflex mini-games.'
    })
  ]);
  page.appendChild(header);

  // Controls Container
  const controls = createElement('div', { className: 'library-controls' });

  // Search input row
  const searchRow = createElement('div', { className: 'library-search-row' });
  const searchBar = createElement('div', { className: 'search-bar' }, [
    createElement('span', { className: 'search-icon-wrapper', text: '🔍' }),
    createElement('input', {
      type: 'search',
      className: 'search-input',
      placeholder: 'Search games by name or description...',
      'aria-label': 'Search games',
      onInput: (e) => {
        searchQuery = e.target.value.toLowerCase().trim();
        updateGrid();
      }
    })
  ]);
  searchRow.appendChild(searchBar);
  controls.appendChild(searchRow);

  // Filter Chips row & Sort select
  const filterRow = createElement('div', { className: 'library-filter-row' });

  const chipsContainer = createElement('div', { className: 'filter-tags' });

  // All Category chips
  Object.values(CATEGORIES).forEach((cat) => {
    const chip = createElement('button', {
      className: `filter-chip ${cat === activeCategory ? 'active' : ''}`,
      text: CATEGORY_LABELS[cat] || cat,
      onClick: () => {
        activeCategory = cat;
        showFavoritesOnly = false;
        updateChips();
        updateGrid();
      }
    });
    chipsContainer.appendChild(chip);
  });

  // Favorites Filter Chip
  const favChip = createElement('button', {
    className: 'filter-chip',
    text: '❤️ Favorites Only',
    onClick: () => {
      showFavoritesOnly = !showFavoritesOnly;
      updateChips();
      updateGrid();
    }
  });
  chipsContainer.appendChild(favChip);
  filterRow.appendChild(chipsContainer);

  // Sort Dropdown
  const sortSelect = createElement('select', {
    className: 'sort-select',
    'aria-label': 'Sort games',
    onChange: (e) => {
      currentSort = e.target.value;
      updateGrid();
    }
  }, [
    createElement('option', { value: 'featured', text: 'Sort: Featured' }),
    createElement('option', { value: 'az', text: 'Sort: Name (A-Z)' }),
    createElement('option', { value: 'za', text: 'Sort: Name (Z-A)' }),
    createElement('option', { value: 'difficulty', text: 'Sort: Difficulty' })
  ]);
  filterRow.appendChild(sortSelect);

  controls.appendChild(filterRow);
  page.appendChild(controls);

  // Games Grid
  const grid = createElement('div', { className: 'games-grid' });
  page.appendChild(grid);

  function updateChips() {
    const chips = chipsContainer.querySelectorAll('.filter-chip');
    chips.forEach((c) => {
      if (c === favChip) {
        c.classList.toggle('active', showFavoritesOnly);
      } else {
        const cat = c.textContent;
        const matchingKey = Object.keys(CATEGORY_LABELS).find(k => CATEGORY_LABELS[k] === cat);
        c.classList.toggle('active', !showFavoritesOnly && matchingKey === activeCategory);
      }
    });
  }

  function updateGrid() {
    empty(grid);

    let filtered = GAME_REGISTRY.filter((g) => {
      // Search filter
      if (searchQuery) {
        const matchesName = g.name.toLowerCase().includes(searchQuery);
        const matchesDesc = g.tagline.toLowerCase().includes(searchQuery);
        if (!matchesName && !matchesDesc) return false;
      }

      // Favorites filter
      if (showFavoritesOnly) {
        if (!favorites.isFavorite(g.id)) return false;
      }

      // Category filter
      if (!showFavoritesOnly && activeCategory !== CATEGORIES.ALL) {
        if (g.category !== activeCategory) return false;
      }

      return true;
    });

    // Sorting
    filtered.sort((a, b) => {
      if (currentSort === 'az') return a.name.localeCompare(b.name);
      if (currentSort === 'za') return b.name.localeCompare(a.name);
      if (currentSort === 'difficulty') {
        const rank = { easy: 1, medium: 2, hard: 3 };
        return (rank[a.difficulty] || 2) - (rank[b.difficulty] || 2);
      }
      return 0; // default registry order
    });

    if (filtered.length === 0) {
      grid.appendChild(createEmptyState({
        icon: '🔍',
        title: showFavoritesOnly ? 'No Favorites Saved Yet' : 'No Matching Games',
        description: showFavoritesOnly
          ? 'Browse the library and tap the heart icon on any game card to add it to your favorites!'
          : 'Try clearing your search term or selecting a different category filter.',
        action: showFavoritesOnly ? {
          label: 'Show All Games',
          onClick: () => {
            showFavoritesOnly = false;
            activeCategory = CATEGORIES.ALL;
            searchQuery = '';
            searchBar.querySelector('input').value = '';
            updateChips();
            updateGrid();
          }
        } : null
      }));
    } else {
      filtered.forEach((g) => {
        grid.appendChild(createGameCard(g));
      });
    }
  }

  updateGrid();
  container.appendChild(page);
}

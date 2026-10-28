/**
 * PixelPlay - Settings & Configuration Page View
 */

import { createElement, empty } from '../utils/dom.js';
import { themeManager } from '../services/theme-manager.js';
import { audio } from '../services/audio.js';
import { storage } from '../core/storage.js';
import { THEMES } from '../constants.js';
import { confirmDialog } from '../components/dialog.js';
import { notification } from '../services/notification.js';

export function renderSettingsPage(container) {
  empty(container);

  const prefs = storage.get('preferences') || {};
  const page = createElement('div', { className: 'settings-container' });

  // Page Header
  const header = createElement('div', { className: 'home-section-header', style: 'margin-top: 0;' }, [
    createElement('h1', { className: 'home-section-title', text: '⚙️ Settings & Preferences' }),
    createElement('p', {
      className: 'header-desc',
      text: 'Customize your gameplay experience, audio, visuals, and device storage.'
    })
  ]);
  page.appendChild(header);

  // 1. Appearance Section
  const appearanceSec = createElement('div', { className: 'settings-section' }, [
    createElement('h2', { className: 'settings-section-title', text: '🎨 Appearance' }),
    createElement('p', { className: 'settings-section-desc', text: 'Toggle themes or visual preferences.' }),

    // Theme Toggle Item
    createElement('div', { className: 'setting-item' }, [
      createElement('div', { className: 'setting-label-group' }, [
        createElement('span', { className: 'setting-label', text: 'Light Mode Theme' }),
        createElement('span', { className: 'setting-hint', text: 'Switch between Midnight Dark and High-Contrast Light theme.' })
      ]),
      createElement('label', { className: 'switch' }, [
        createElement('input', {
          type: 'checkbox',
          checked: themeManager.getTheme() === THEMES.LIGHT,
          onChange: (e) => {
            themeManager.setTheme(e.target.checked ? THEMES.LIGHT : THEMES.DARK);
          }
        }),
        createElement('span', { className: 'switch-slider' })
      ])
    ]),

    // Reduced Motion Toggle Item
    createElement('div', { className: 'setting-item' }, [
      createElement('div', { className: 'setting-label-group' }, [
        createElement('span', { className: 'setting-label', text: 'Reduce Motion' }),
        createElement('span', { className: 'setting-hint', text: 'Minimize transitions, hover animations, and effects.' })
      ]),
      createElement('label', { className: 'switch' }, [
        createElement('input', {
          type: 'checkbox',
          checked: !!prefs.reducedMotion,
          onChange: (e) => {
            const val = e.target.checked;
            storage.update('preferences', p => ({ ...p, reducedMotion: val }));
            if (val) {
              document.body.classList.add('reduce-motion');
            } else {
              document.body.classList.remove('reduce-motion');
            }
          }
        }),
        createElement('span', { className: 'switch-slider' })
      ])
    ])
  ]);
  page.appendChild(appearanceSec);

  // 2. Audio Section
  const audioSec = createElement('div', { className: 'settings-section' }, [
    createElement('h2', { className: 'settings-section-title', text: '🔊 Audio & Sound Effects' }),
    createElement('p', { className: 'settings-section-desc', text: 'Synthesized Web Audio sound effects and volume levels.' }),

    // Sound Enabled Toggle
    createElement('div', { className: 'setting-item' }, [
      createElement('div', { className: 'setting-label-group' }, [
        createElement('span', { className: 'setting-label', text: 'Sound Effects' }),
        createElement('span', { className: 'setting-hint', text: 'Enable or mute game sound cues and chimes.' })
      ]),
      createElement('label', { className: 'switch' }, [
        createElement('input', {
          type: 'checkbox',
          checked: audio.soundEnabled,
          onChange: (e) => {
            audio.setSoundEnabled(e.target.checked);
          }
        }),
        createElement('span', { className: 'switch-slider' })
      ])
    ]),

    // Master Volume Slider
    createElement('div', { className: 'setting-item' }, [
      createElement('div', { className: 'setting-label-group' }, [
        createElement('span', { className: 'setting-label', text: 'Master Volume' }),
        createElement('span', { className: 'setting-hint', text: 'Adjust audio output volume.' })
      ]),
      createElement('div', { className: 'range-slider-group' }, [
        createElement('input', {
          type: 'range',
          className: 'range-slider',
          min: '0',
          max: '1',
          step: '0.05',
          value: String(audio.masterVolume),
          onInput: (e) => {
            audio.setMasterVolume(parseFloat(e.target.value));
          }
        })
      ])
    ])
  ]);
  page.appendChild(audioSec);

  // 3. Storage & Privacy Section
  const storageSec = createElement('div', { className: 'settings-section' }, [
    createElement('h2', { className: 'settings-section-title', text: '💾 Local Storage & Data' }),
    createElement('p', {
      className: 'settings-section-desc',
      text: 'PixelPlay stores all statistics, favorites, achievements, and preferences directly on your local device. No personal data or cookies are transmitted to any server.'
    }),

    createElement('div', { className: 'setting-item' }, [
      createElement('div', { className: 'setting-label-group' }, [
        createElement('span', { className: 'setting-label', text: 'Reset All Local Data' }),
        createElement('span', { className: 'setting-hint', text: 'Permanently wipe your high scores, unlocked achievements, streaks, and settings.' })
      ]),
      createElement('button', {
        className: 'btn btn-danger',
        text: 'Reset All Data',
        onClick: () => {
          confirmDialog({
            title: 'Wipe All Local Data?',
            message: 'This will reset all your game records, statistics, daily challenge streaks, and 16 achievements back to zero. This action cannot be undone.',
            confirmLabel: 'Yes, Reset Everything',
            confirmVariant: 'btn-danger',
            onConfirm: () => {
              storage.resetAll();
              notification.warning('All local data and statistics have been reset.');
              setTimeout(() => {
                window.location.reload();
              }, 600);
            }
          });
        }
      })
    ])
  ]);
  page.appendChild(storageSec);

  container.appendChild(page);
}

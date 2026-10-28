/**
 * PixelPlay - Shared Web Audio Synthesizer Service
 */

import { storage } from '../core/storage.js';
import { logger } from '../core/logger.js';

class AudioService {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.isUnlocked = false;

    const prefs = storage.get('preferences') || {};
    this.soundEnabled = prefs.soundEnabled ?? true;
    this.masterVolume = prefs.masterVolume ?? 0.7;
  }

  ensureContext() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        try {
          this.ctx = new AudioContext();
          this.masterGain = this.ctx.createGain();
          this.masterGain.gain.setValueAtTime(this.soundEnabled ? this.masterVolume : 0, this.ctx.currentTime);
          this.masterGain.connect(this.ctx.destination);
          this.isUnlocked = true;
        } catch (e) {
          logger.warn('AudioContext could not be initialized:', e);
        }
      }
    } else if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  setSoundEnabled(enabled) {
    this.soundEnabled = !!enabled;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.soundEnabled ? this.masterVolume : 0, this.ctx.currentTime);
    }
    storage.update('preferences', (prefs) => ({ ...prefs, soundEnabled: this.soundEnabled }));
  }

  setMasterVolume(volume) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    if (this.masterGain && this.ctx && this.soundEnabled) {
      this.masterGain.gain.setValueAtTime(this.masterVolume, this.ctx.currentTime);
    }
    storage.update('preferences', (prefs) => ({ ...prefs, masterVolume: this.masterVolume }));
  }

  /**
   * Synthesize tone using Web Audio API
   */
  playTone(freq, type = 'sine', duration = 0.1, delay = 0) {
    if (!this.soundEnabled) return;
    this.ensureContext();
    if (!this.ctx || !this.masterGain) return;

    try {
      const startTime = this.ctx.currentTime + delay;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.15, startTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(startTime);
      osc.stop(startTime + duration);
    } catch (e) {
      // Browsers may block audio before first user interaction
    }
  }

  /* Preset Sound Effects */
  playClick() {
    this.playTone(600, 'triangle', 0.04);
  }

  playPop() {
    this.playTone(450, 'sine', 0.08);
  }

  playEat() {
    this.playTone(320, 'square', 0.06);
    this.playTone(480, 'square', 0.06, 0.04);
  }

  playMatch() {
    this.playTone(523.25, 'sine', 0.12);
    this.playTone(659.25, 'sine', 0.16, 0.08);
  }

  playMismatch() {
    this.playTone(280, 'sawtooth', 0.15);
    this.playTone(220, 'sawtooth', 0.2, 0.1);
  }

  playJump() {
    if (!this.soundEnabled) return;
    this.ensureContext();
    if (!this.ctx || !this.masterGain) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(450, now + 0.12);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.12);
    } catch (e) {}
  }

  playHit() {
    this.playTone(180, 'square', 0.08);
  }

  playGameOver() {
    this.playTone(300, 'sawtooth', 0.15);
    this.playTone(250, 'sawtooth', 0.18, 0.12);
    this.playTone(180, 'sawtooth', 0.3, 0.25);
  }

  playVictory() {
    this.playTone(523.25, 'triangle', 0.12);
    this.playTone(659.25, 'triangle', 0.12, 0.1);
    this.playTone(783.99, 'triangle', 0.15, 0.2);
    this.playTone(1046.5, 'triangle', 0.3, 0.32);
  }

  playPad(padIndex) {
    const freqs = [329.63, 261.63, 220.00, 164.81]; // E4, C4, A3, E3
    const freq = freqs[padIndex % freqs.length];
    this.playTone(freq, 'sine', 0.3);
  }
}

export const audio = new AudioService();

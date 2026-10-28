/**
 * PixelPlay - Notification & Toast Service
 */

import { createElement, $ } from '../utils/dom.js';

class NotificationService {
  constructor() {
    this.container = null;
  }

  ensureContainer() {
    if (!this.container || !document.body.contains(this.container)) {
      this.container = $('#toast-container');
      if (!this.container) {
        this.container = createElement('div', {
          id: 'toast-container',
          className: 'toast-container',
          'aria-live': 'polite'
        });
        document.body.appendChild(this.container);
      }
    }
  }

  /**
   * Show a toast message
   * @param {string} message 
   * @param {'info'|'success'|'warning'|'danger'} [type='info'] 
   * @param {number} [duration=3500] 
   */
  show(message, type = 'info', duration = 3500) {
    this.ensureContainer();

    const toast = createElement('div', {
      className: `toast toast-${type}`,
      role: 'status'
    }, [
      createElement('div', { className: 'toast-content', text: message })
    ]);

    this.container.appendChild(toast);

    // Trigger animation in next frame
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    const timer = setTimeout(() => {
      this.dismiss(toast);
    }, duration);

    toast.addEventListener('click', () => {
      clearTimeout(timer);
      this.dismiss(toast);
    });
  }

  dismiss(toast) {
    toast.classList.remove('show');
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 200);
  }

  success(msg) { this.show(msg, 'success'); }
  info(msg) { this.show(msg, 'info'); }
  warning(msg) { this.show(msg, 'warning'); }
  danger(msg) { this.show(msg, 'danger'); }
}

export const notification = new NotificationService();

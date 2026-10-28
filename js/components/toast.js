/**
 * PixelPlay - Toast Notification Component
 */

import { notification } from '../services/notification.js';

export const toast = {
  show: (msg, type, dur) => notification.show(msg, type, dur),
  success: (msg) => notification.success(msg),
  info: (msg) => notification.info(msg),
  warning: (msg) => notification.warning(msg),
  danger: (msg) => notification.danger(msg)
};

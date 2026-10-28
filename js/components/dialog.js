/**
 * PixelPlay - Confirmation Dialog Helper
 */

import { createModal } from './modal.js';
import { createElement } from '../utils/dom.js';

export function confirmDialog({ title = 'Confirm Action', message = 'Are you sure?', confirmLabel = 'Confirm', confirmVariant = 'btn-primary', onConfirm, onCancel }) {
  const content = createElement('p', { text: message });

  const modal = createModal({
    title,
    content,
    footerButtons: [
      {
        label: 'Cancel',
        variant: 'btn-outline',
        onClick: () => { if (onCancel) onCancel(); }
      },
      {
        label: confirmLabel,
        variant: confirmVariant,
        onClick: () => { if (onConfirm) onConfirm(); }
      }
    ]
  });

  modal.open();
  return modal;
}

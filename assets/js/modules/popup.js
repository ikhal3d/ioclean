/* ============================================================
 * popup.js
 * Modal/dialog controller. Any [data-modal-open="id"] opens
 * the modal with that id; [data-modal-close] dismisses.
 * Backdrop click + Escape also close.
 * ============================================================ */

import { $$ } from './utils.js';

export function init() {
  const open = id => {
    const m = document.getElementById(id);
    if (m) m.classList.add('is-open');
  };
  const close = (m) => m && m.classList.remove('is-open');

  $$('[data-modal-open]').forEach(b => b.addEventListener('click', e => {
    e.preventDefault();
    open(b.dataset.modalOpen);
  }));

  $$('.modal').forEach(modal => {
    modal.addEventListener('click', e => {
      if (e.target === modal || e.target.closest('[data-modal-close]')) close(modal);
    });
  });

  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    $$('.modal.is-open').forEach(close);
  });
}

/* ============================================================
 * faq.js
 * Accessible single-open accordion. Click toggles current item;
 * keyboard Enter/Space already handled by native <button>.
 * ============================================================ */

import { $$ } from './utils.js';

export function init() {
  const items = $$('.faq__item');
  if (!items.length) return;

  items.forEach(item => {
    const q = item.querySelector('.faq__q');
    if (!q) return;

    q.addEventListener('click', e => {
      e.preventDefault();
      const wasOpen = item.classList.contains('is-open');
      items.forEach(i => {
        i.classList.remove('is-open');
        i.querySelector('.faq__q')?.setAttribute('aria-expanded', 'false');
      });
      if (!wasOpen) {
        item.classList.add('is-open');
        q.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

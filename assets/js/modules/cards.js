/* ============================================================
 * cards.js
 * Mouse-tracked spotlight on .card and optional tilt on .tilt.
 * Sets CSS custom properties --mx / --my used by cards.css.
 * ============================================================ */

import { $$, prefersReducedMotion } from './utils.js';

function bindSpotlight(card) {
  card.addEventListener('pointermove', e => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${((e.clientX - rect.left) / rect.width) * 100}%`);
    card.style.setProperty('--my', `${((e.clientY - rect.top)  / rect.height) * 100}%`);
  });
}

function bindTilt(el) {
  const max = parseFloat(el.dataset.tilt) || 6;
  let raf = null;
  el.addEventListener('pointermove', e => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = null;
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top)  / rect.height;
      const rx = (y - 0.5) * -2 * max;
      const ry = (x - 0.5) *  2 * max;
      el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    });
  });
  el.addEventListener('pointerleave', () => { el.style.transform = ''; });
}

export function init() {
  $$('.card').forEach(bindSpotlight);
  if (prefersReducedMotion()) return;
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  $$('.tilt').forEach(bindTilt);
}

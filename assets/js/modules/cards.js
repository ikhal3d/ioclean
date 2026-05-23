/* ============================================================
 * cards.js
 * Optional 3D tilt on .tilt elements. The card hover-spotlight was
 * removed (the cursor-tracked radial gradient read as visual haze
 * across the whole card surface).
 * ============================================================ */

import { $$, prefersReducedMotion } from './utils.js';

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
  if (prefersReducedMotion()) return;
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  $$('.tilt').forEach(bindTilt);
}

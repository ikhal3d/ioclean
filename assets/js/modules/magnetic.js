/* ============================================================
 * magnetic.js
 * Buttons with [data-magnetic] gently track the cursor when
 * it's near. Strength + radius are tunable per element via
 * data-strength and data-radius (px).
 * ============================================================ */

import { $$, prefersReducedMotion, clamp } from './utils.js';

function bind(el) {
  const strength = parseFloat(el.dataset.strength || 0.35);
  const radius   = parseFloat(el.dataset.radius   || 120);
  const label = el.querySelector('.btn__label');
  const icon  = el.querySelector('.btn__icon');

  let rect;
  const refresh = () => { rect = el.getBoundingClientRect(); };
  refresh();
  window.addEventListener('resize', refresh, { passive: true });
  window.addEventListener('scroll', refresh, { passive: true });

  el.addEventListener('pointermove', e => {
    if (!rect) refresh();
    const cx = rect.left + rect.width  / 2;
    const cy = rect.top  + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.hypot(dx, dy);
    const r = Math.max(rect.width, rect.height) / 2 + radius;
    if (dist > r) return reset();
    const k = 1 - dist / r;
    const tx = dx * strength * k;
    const ty = dy * strength * k;
    el.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
    if (label) label.style.transform = `translate3d(${tx * 0.4}px, ${ty * 0.4}px, 0)`;
    if (icon)  icon.style.transform  = `translate3d(${tx * 0.5}px, ${ty * 0.5}px, 0)`;
  });

  const reset = () => {
    el.style.transform = '';
    if (label) label.style.transform = '';
    if (icon)  icon.style.transform  = '';
  };

  el.addEventListener('pointerleave', reset);
  el.addEventListener('pointerup', reset);
}

export function init() {
  if (prefersReducedMotion()) return;
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  $$('[data-magnetic]').forEach(bind);
}

/* ============================================================
 * parallax.js
 * Subtle scroll-driven parallax. Element gains a translateY
 * offset proportional to its distance from viewport center.
 * Magnitude per element via data-parallax="0.18" (strength).
 *
 * Also drives a scroll-progress bar (.scroll-progress).
 * ============================================================ */

import { $, $$, onScroll, prefersReducedMotion, clamp } from './utils.js';

export function init() {
  const targets = $$('[data-parallax]');
  const progress = $('.scroll-progress');

  if (!targets.length && !progress) return;
  // Treat tablet + mobile like reduced-motion for the parallax math.
  // The scroll-progress bar still runs (cheap), but per-target
  // translate computations are skipped to keep scrolling smooth.
  const reduced = prefersReducedMotion() || window.innerWidth <= 1024;

  onScroll(() => {
    if (progress) {
      const html = document.documentElement;
      const max = (html.scrollHeight - html.clientHeight) || 1;
      progress.style.width = clamp(html.scrollTop / max * 100, 0, 100) + '%';
    }

    if (reduced || !targets.length) return;

    const viewportH = window.innerHeight;
    const viewportMid = viewportH / 2;

    for (const el of targets) {
      const rect = el.getBoundingClientRect();
      const rectMid = rect.top + rect.height / 2;
      const delta = (rectMid - viewportMid) / viewportH;   // -ish range −1 … 1
      const strength = parseFloat(el.dataset.parallax) || 0.16;
      const offset = -delta * strength * 100;              // px
      el.style.transform = `translate3d(0, ${offset}px, 0)`;
    }
  });
}

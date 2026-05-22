/* ============================================================
 * utils.js
 * Tiny shared helpers (selectors, prefers-reduced-motion, etc).
 * Keep imperative API minimal — modules import what they need.
 * ============================================================ */

export const $  = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/** Respect users' motion preference everywhere. */
export const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Clamp a value between min and max. */
export const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

/** Linearly interpolate. */
export const lerp = (a, b, t) => a + (b - a) * t;

/** Listen to scroll with rAF throttling. Returns an off() teardown. */
export function onScroll(handler, opts = { passive: true }) {
  let ticking = false;
  const wrapped = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(() => {
        handler();
        ticking = false;
      });
    }
  };
  window.addEventListener('scroll', wrapped, opts);
  handler();
  return () => window.removeEventListener('scroll', wrapped, opts);
}

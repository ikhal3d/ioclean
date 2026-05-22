/* ============================================================
 * reveal.js
 * IntersectionObserver-driven entrance animations.
 * Triggers counter start when a .reveal carries data-count.
 * ============================================================ */

import { $$ } from './utils.js';
import { startCounter } from './counters.js';

export function init() {
  const targets = $$('.reveal');
  if (!targets.length) return;

  const io = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      if (entry.target.dataset.count !== undefined) startCounter(entry.target);
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.14,
    rootMargin: '0px 0px -60px 0px',
  });

  targets.forEach(el => io.observe(el));
}

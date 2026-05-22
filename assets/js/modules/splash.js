/* ============================================================
 * splash.js
 * Removes the page-loading splash and fades in the body once
 * fonts + critical assets are ready.
 * ============================================================ */

import { $ } from './utils.js';

export function init() {
  const splash = $('.page-splash');
  const body   = document.body;
  const minDelay = 280; // floor to avoid a jarring flash on fast loads

  const start = performance.now();
  const reveal = () => {
    const elapsed = performance.now() - start;
    const wait = Math.max(0, minDelay - elapsed);
    setTimeout(() => {
      body.classList.add('is-loaded');
      if (splash) splash.classList.add('is-loaded');
      // Mark fonts as ready for staggered hero animations.
      document.documentElement.classList.add('fonts-ready');
    }, wait);
  };

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(reveal).catch(reveal);
  } else {
    window.addEventListener('load', reveal);
  }
}

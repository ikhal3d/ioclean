/* ============================================================
 * splash.js
 * Removes the page-loading splash and fades in the body once
 * fonts + critical assets are ready.
 * ============================================================ */

import { $ } from './utils.js';

export function init() {
  const splash = $('.page-splash');
  const body   = document.body;
  const minDelay = 280;   // floor to avoid a flash on fast loads
  const maxDelay = 2500;  // hard ceiling so a stuck font load never traps the splash

  const start = performance.now();
  let revealed = false;
  const reveal = () => {
    if (revealed) return;
    revealed = true;
    const elapsed = performance.now() - start;
    const wait = Math.max(0, minDelay - elapsed);
    setTimeout(() => {
      body.classList.add('is-loaded');
      if (splash) splash.classList.add('is-loaded');
      document.documentElement.classList.add('fonts-ready');
    }, wait);
  };

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(reveal).catch(reveal);
  } else {
    window.addEventListener('load', reveal);
  }
  // Hard fallback — never leave the splash up longer than maxDelay
  // even if document.fonts.ready never resolves (seen on some iOS
  // Safari builds when a webfont 404s or the connection drops).
  setTimeout(reveal, maxDelay);
}

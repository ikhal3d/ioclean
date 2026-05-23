/* ============================================================
 * reveal-phone.js
 *
 * Phone numbers are kept out of the raw HTML so search engines,
 * SEO crawlers and dumb scrapers don't index them. Each element
 * carries the number as a base64-encoded data attribute, and we
 * decode + inject it on page load.
 *
 *   <a data-tel="MDQzMzM5Mjc3Nw=="
 *      data-tel-display="MDQgMzMzIDkyIDc3Nw==">…fallback text…</a>
 *
 *   data-tel         — base64 of the dialable digits (no spaces)
 *   data-tel-display — base64 of the human-friendly display string;
 *                      optional, falls back to data-tel
 *
 * On a real user's browser the link becomes
 *   <a href="tel:0433392777">04 333 92 777</a>
 * Crawlers that don't execute JS just see the fallback text.
 * ============================================================ */

import { $$ } from './utils.js';

function decode(s) {
  try { return atob(s); } catch (_) { return ''; }
}

export function init() {
  $$('[data-tel]').forEach(el => {
    const raw = decode(el.dataset.tel);
    if (!raw) return;
    const display = el.dataset.telDisplay
      ? decode(el.dataset.telDisplay)
      : raw;

    el.href = 'tel:' + raw.replace(/\s+/g, '');
    // Only swap the text if the element doesn't already contain
    // structured children (e.g. a btn__label span); otherwise update
    // any nested .tel-display element if present.
    const targetSpan = el.querySelector('.tel-display');
    if (targetSpan) {
      targetSpan.textContent = display;
    } else if (el.children.length === 0) {
      el.textContent = display;
    }
  });
}

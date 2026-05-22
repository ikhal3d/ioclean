/* ============================================================
 * text-fx.js
 * Splits headlines marked with [data-split] into words wrapped
 * in <span class="word"> so CSS can stagger their entrance.
 * Also stamps the current year for any [data-year] element.
 * ============================================================ */

import { $$ } from './utils.js';

function splitWords(el) {
  const text = el.textContent;
  el.textContent = '';
  text.split(/(\s+)/).forEach((chunk, i) => {
    if (/^\s+$/.test(chunk)) {
      el.appendChild(document.createTextNode(' '));
      return;
    }
    const span = document.createElement('span');
    span.className = 'word';
    span.style.animationDelay = `${i * 70}ms`;
    span.textContent = chunk;
    el.appendChild(span);
  });
}

export function init() {
  $$('[data-split]').forEach(splitWords);
  $$('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
}

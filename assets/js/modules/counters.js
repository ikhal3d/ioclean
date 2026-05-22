/* ============================================================
 * counters.js
 * Animated number counter — eased ramp from 0 → target.
 * Each .reveal[data-count] is started by reveal.js when in view.
 * ============================================================ */

const easeOutCubic = t => 1 - Math.pow(1 - t, 3);

const format = (n, decimals = 0) =>
  n.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

/** Start counter on an element that has data-count="X". */
export function startCounter(el) {
  const target   = parseFloat(el.dataset.count);
  const suffix   = el.dataset.suffix || '';
  const prefix   = el.dataset.prefix || '';
  const decimals = parseInt(el.dataset.decimals || '0', 10);
  const dur      = parseInt(el.dataset.duration || '1600', 10);

  if (Number.isNaN(target)) return;

  const start = performance.now();
  const tick = now => {
    const t = Math.min(1, (now - start) / dur);
    const v = target * easeOutCubic(t);
    el.textContent = `${prefix}${format(v, decimals)}${suffix}`;
    if (t < 1) requestAnimationFrame(tick);
    else el.textContent = `${prefix}${format(target, decimals)}${suffix}`;
  };
  requestAnimationFrame(tick);
}

export function init() {
  // No-op — counters are triggered by reveal.js when the element scrolls into view.
}

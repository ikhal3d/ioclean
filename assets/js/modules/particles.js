/* ============================================================
 * particles.js
 * Lightweight canvas particle field with connection lines.
 * Pauses when the canvas leaves the viewport.
 * Reads density from data-density (low|med|high), defaults to med.
 * ============================================================ */

import { $$, prefersReducedMotion } from './utils.js';

const DENSITY_MAP = { low: 26, med: 56, high: 90 };

function makeField(canvas) {
  const ctx = canvas.getContext('2d');
  let particles = [];
  let raf = null;
  let dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));

  const density = DENSITY_MAP[canvas.dataset.density] || DENSITY_MAP.med;
  const lineMax = parseFloat(canvas.dataset.linkRange || 130);
  const color   = canvas.dataset.color || '265'; // hue base

  const size = () => {
    const rect = canvas.getBoundingClientRect();
    canvas.width  = Math.max(1, rect.width  * dpr);
    canvas.height = Math.max(1, rect.height * dpr);
  };

  const spawn = () => {
    const rect = canvas.getBoundingClientRect();
    const n = Math.max(12, Math.round(density * (rect.width * rect.height) / (1280 * 720)));
    particles = Array.from({ length: n }, () => ({
      x:  Math.random() * rect.width,
      y:  Math.random() * rect.height,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.22 - 0.04,
      r:  Math.random() * 1.5 + 0.4,
      a:  Math.random() * 0.5 + 0.2,
      hue: parseFloat(color) + Math.random() * 50,
    }));
  };

  const draw = () => {
    const rect = canvas.getBoundingClientRect();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, rect.width, rect.height);

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < -10) p.x = rect.width  + 10;
      if (p.x > rect.width  + 10) p.x = -10;
      if (p.y < -10) p.y = rect.height + 10;
      if (p.y > rect.height + 10) p.y = -10;

      ctx.beginPath();
      ctx.fillStyle = `hsla(${p.hue}, 90%, 75%, ${p.a})`;
      ctx.shadowColor = `hsla(${p.hue}, 90%, 70%, ${p.a})`;
      ctx.shadowBlur = 12;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.shadowBlur = 0;

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < lineMax * lineMax) {
          const dist = Math.sqrt(d2);
          const alpha = 0.06 * (1 - dist / lineMax);
          ctx.beginPath();
          ctx.strokeStyle = `hsla(${color}, 90%, 75%, ${alpha})`;
          ctx.lineWidth = 0.6;
          ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
    raf = requestAnimationFrame(draw);
  };

  const start = () => { if (!raf) raf = requestAnimationFrame(draw); };
  const stop  = () => { if (raf) { cancelAnimationFrame(raf); raf = null; } };

  size(); spawn();

  const ro = new ResizeObserver(() => { size(); spawn(); });
  ro.observe(canvas);

  const vis = new IntersectionObserver(([entry]) => {
    entry.isIntersecting ? start() : stop();
  });
  vis.observe(canvas);

  return { start, stop };
}

export function init() {
  if (prefersReducedMotion()) return;
  // Skip on tablet + mobile — the per-frame canvas paint compounds
  // with backdrop-filters and gradients to make scroll feel sluggish.
  // CSS in mobile.css also display:none the .particles container.
  if (window.innerWidth <= 1024) return;
  $$('.particles canvas').forEach(makeField);
}

/* ============================================================
 * nav.js
 * Sticky-nav state, mobile drawer, hide-on-scroll, and
 * smooth anchor scrolling with sticky-nav offset.
 * ============================================================ */

import { $, $$, onScroll } from './utils.js';

export function init() {
  const nav     = $('.nav');
  const toggle  = $('.nav__toggle');
  const drawer  = $('.nav-drawer');
  const body    = document.body;

  if (!nav) return;

  /* —— Sticky shadow only (no hide-on-scroll) ——————————————
   * Nav stays anchored at the top of the viewport at every scroll
   * position. We just toggle a is-scrolled class so the nav gets a
   * slightly stronger background once the user has scrolled past
   * the very top. */
  onScroll(() => {
    nav.classList.toggle('is-scrolled', window.scrollY > 24);
  });

  /* —— Mobile drawer ———————————————————————————————————— */
  if (toggle && drawer) {
    const close = () => {
      toggle.classList.remove('is-open');
      drawer.classList.remove('is-open');
      body.classList.remove('is-drawer-open');
      toggle.setAttribute('aria-expanded', 'false');
    };
    const open = () => {
      toggle.classList.add('is-open');
      drawer.classList.add('is-open');
      body.classList.add('is-drawer-open');
      toggle.setAttribute('aria-expanded', 'true');
    };

    toggle.addEventListener('click', () => {
      drawer.classList.contains('is-open') ? close() : open();
    });
    $$('a, .btn', drawer).forEach(a => a.addEventListener('click', close));
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && drawer.classList.contains('is-open')) close();
    });
  }

  /* —— Smooth anchor scrolling with nav offset —————————— */
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const href = a.getAttribute('href');
    if (href.length < 2) return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const navH = nav.getBoundingClientRect().height;
    window.scrollTo({
      top: target.getBoundingClientRect().top + window.scrollY - navH - 24,
      behavior: 'smooth',
    });
  });
}

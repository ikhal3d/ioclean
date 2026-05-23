/* ============================================================
 * form.js
 * Client-side stub for the contact form: validates required
 * fields, then shows a success message. Replace handleSubmit
 * with a fetch() to your backend or Formspree when you wire
 * up the real endpoint.
 * ============================================================ */

import { $$ } from './utils.js';

async function handleSubmit(form) {
  // Future: const res = await fetch('/api/contact', { method: 'POST', body: new FormData(form) });
  // Until then, simulate a small delay so the UX feels real.
  await new Promise(r => setTimeout(r, 600));
  return { ok: true };
}

function bind(form) {
  const success = form.querySelector('.form-success');
  const btn     = form.querySelector('button[type="submit"]');
  const originalBtnText = btn?.querySelector('.btn__label')?.textContent || btn?.textContent;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (btn) {
      btn.disabled = true;
      const label = btn.querySelector('.btn__label');
      if (label) label.textContent = 'Sending…';
      else btn.textContent = 'Sending…';
    }

    const { ok } = await handleSubmit(form);

    if (btn) {
      btn.disabled = false;
      const label = btn.querySelector('.btn__label');
      if (label) label.textContent = originalBtnText;
      else btn.textContent = originalBtnText;
    }

    if (ok && success) {
      success.classList.add('is-shown');
      form.querySelectorAll('input, textarea, select').forEach(f => {
        if (f.type !== 'submit') f.value = '';
      });
      setTimeout(() => success.classList.remove('is-shown'), 6500);
    }
  });
}

/**
 * Pre-fill the service <select> from a ?service=… URL parameter.
 * Lets the landing-page service cards deep-link straight into the
 * contact form with the right option already selected.
 */
const SERVICE_MAP = {
  office:             'Office cleaning',
  industrial:         'Industrial',
  medical:            'Medical centre',
  childcare:          'Childcare',
  warehouse:          'Warehouse',
  'end-of-lease':     'End-of-lease',
  'post-construction':'Post-construction',
  emergency:          'Emergency clean',
  'anti-viral':       'Anti-viral deep clean',
};

function prefillFromQuery() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('service');
  if (!slug) return;
  const target = SERVICE_MAP[slug];
  if (!target) return;
  $$('form[data-contact] select[name="service"]').forEach(sel => {
    for (let i = 0; i < sel.options.length; i++) {
      if (sel.options[i].textContent.trim() === target) {
        sel.selectedIndex = i;
        break;
      }
    }
  });
}

export function init() {
  $$('form[data-contact]').forEach(bind);
  prefillFromQuery();
}

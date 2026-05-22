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

export function init() {
  $$('form[data-contact]').forEach(bind);
}

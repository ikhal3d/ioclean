/* ============================================================
 * form.js
 * Submits the contact form to Web3Forms (https://web3forms.com),
 * which forwards the message to info@ioclean.com.au — no backend
 * required. Get a free access key at https://web3forms.com →
 * "Create Access Key", then paste it into ACCESS_KEY below.
 * ============================================================ */

import { $$ } from './utils.js';

const ENDPOINT   = 'https://api.web3forms.com/submit';
const ACCESS_KEY = '4a70fd63-2af6-4466-aeff-0b825708d2f9';

async function handleSubmit(form) {
  const data = new FormData(form);
  // Web3Forms control fields:
  data.append('access_key', ACCESS_KEY);
  data.append('subject',    'New ioclean quote request');
  data.append('from_name',  'ioclean website');
  data.append('redirect',   'false');

  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: data,
    });
    const json = await res.json().catch(() => ({}));
    return { ok: res.ok && json.success !== false };
  } catch (err) {
    console.warn('Form submit failed:', err);
    return { ok: false };
  }
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

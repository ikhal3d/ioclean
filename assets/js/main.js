/* ============================================================
 * main.js
 * Entry point — boots every module on DOMContentLoaded.
 * Each module is small, isolated, and self-tearing-down when
 * its targets aren't present, so adding/removing pages is safe.
 * ============================================================ */

import * as splash    from './modules/splash.js';
import * as nav       from './modules/nav.js';
import * as reveal    from './modules/reveal.js';
import * as counters  from './modules/counters.js';
import * as particles from './modules/particles.js';
import * as magnetic  from './modules/magnetic.js';
import * as parallax  from './modules/parallax.js';
import * as cards     from './modules/cards.js';
import * as faq       from './modules/faq.js';
import * as popup     from './modules/popup.js';
import * as form      from './modules/form.js';
import * as textfx    from './modules/text-fx.js';

const boot = () => {
  splash.init();
  nav.init();
  textfx.init();
  reveal.init();
  counters.init();
  particles.init();
  cards.init();
  magnetic.init();
  parallax.init();
  faq.init();
  popup.init();
  form.init();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}

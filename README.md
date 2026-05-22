# ioclean

Premium Melbourne commercial cleaning website. Production-quality static site
designed to ship to GitHub Pages with **zero build step**.

> Aesthetic reference: dark futuristic SaaS landing pages (Linear, Stripe, Vercel).
> Brand palette: deep purple, electric violet, indigo, blue, magenta on near-black.

## Tech

- **Pure HTML + CSS + JavaScript** — no build, no bundler, no framework lock-in.
- **CSS custom properties** for design tokens (single source of truth).
- **ES modules** for JavaScript — each behaviour lives in its own file.
- **IntersectionObserver, requestAnimationFrame, CSS transforms** for the
  animation system. All GPU-accelerated.
- **Vendored fonts via Google Fonts**: Space Grotesk (display), Inter (body),
  JetBrains Mono (technical accents).

## Folder layout

```
/
├── index.html                  # Landing page
├── about.html                  # About page
├── contact.html                # Contact page
├── .nojekyll                   # tells GitHub Pages to skip Jekyll
├── README.md
└── assets/
    ├── css/
    │   ├── main.css            # entry — imports the modules below
    │   ├── tokens.css          # design tokens: color, radius, spacing, motion
    │   ├── base.css            # reset + global typography + body bg
    │   ├── layout.css          # sections, grids, container
    │   ├── effects.css         # glass, blobs, particles, reveals, marquee
    │   ├── nav.css             # sticky nav + mobile drawer
    │   ├── buttons.css         # btn variants, magnetic, glow, FAB
    │   ├── cards.css           # glass cards (service / package / stat / testimonial)
    │   ├── components.css     # faq, forms, check-list, cta-banner, modal
    │   ├── hero.css            # hero compositions + orbit visual + stat strip
    │   ├── map.css             # Australia coverage map (glow Victoria + ripple)
    │   └── footer.css          # footer grid + social
    │
    ├── js/
    │   ├── main.js             # entry — boots every module on DOMContentLoaded
    │   └── modules/
    │       ├── utils.js        # $, $$, prefersReducedMotion, onScroll
    │       ├── splash.js       # loading splash + page fade-in
    │       ├── nav.js          # sticky state + mobile drawer + smooth scroll
    │       ├── reveal.js       # IntersectionObserver entrance animations
    │       ├── counters.js     # eased counter ramp for [data-count]
    │       ├── particles.js    # canvas particle field
    │       ├── magnetic.js     # buttons that track the cursor
    │       ├── parallax.js     # scroll-driven [data-parallax] offsets
    │       ├── cards.js        # mouse-tracked spotlight + tilt
    │       ├── faq.js          # accordion controller
    │       ├── popup.js        # modal/dialog controller
    │       ├── form.js         # contact form submit handler
    │       └── text-fx.js      # word-splitting + [data-year] stamp
    │
    └── img/
        ├── brand/
        │   ├── logo-mark.svg
        │   └── favicon.svg
        └── illustrations/      # (reserved for future SVG illustrations)
```

## Conventions

### CSS

- All design values live in `tokens.css` — never hardcode hex codes or pixel
  values for spacing inside component files. Use `var(--c-violet-400)`,
  `var(--s-5)`, `var(--r-lg)`, etc.
- Component class names use a light BEM flavour: `.card__icon`, `.faq__q`,
  `.nav-drawer__link`. State suffixes use `.is-*` (`.is-open`, `.is-scrolled`).
- Animations should be GPU-accelerated (transform/opacity only) and respect
  `prefers-reduced-motion` — handled globally in `base.css`.

### JavaScript

- Each module exports an `init()` function and self-tears-down when its
  targets aren't in the DOM. Adding/removing a page is safe.
- No global variables — modules only communicate via shared DOM state
  or by importing each other's exports (see `reveal.js` ↔ `counters.js`).
- `prefersReducedMotion()` guards the heavier modules.

## Animation system

| Mechanism | Where | Effect |
|---|---|---|
| CSS keyframes | `effects.css`, `map.css`, `hero.css` | Blob drift, gradient shift, orbit, Victoria glow, ripples |
| IntersectionObserver | `reveal.js` | All `.reveal` enter animations + counter triggers |
| Canvas + rAF | `particles.js` | Particle field with connection lines |
| Pointer events | `magnetic.js`, `cards.js` | Magnetic buttons, card spotlight, tilt |
| Scroll handler (rAF-throttled) | `parallax.js`, `nav.js` | Parallax offsets, sticky nav, scroll-progress bar |

## Adding content

- **New service** → drop another `<article class="card service-card">` into
  the services grid in `index.html`. No CSS changes needed.
- **New package** → same pattern with `.package-card`. Use
  `.package-card--featured` for one card to elevate it.
- **New page** → copy any of the three pages, swap `<main>` content, and
  flip the nav `.is-active` class to the new page.
- **New CSS module** → add the file, then add one `@import` line to
  `assets/css/main.css`.
- **New JS module** → add the file under `assets/js/modules/`, then add
  `import * as X from './modules/x.js'` + `X.init()` to `main.js`.

## Deployment

The repo is structured so it can be published directly via GitHub Pages
(set Pages → Source → "Deploy from a branch" → root). No build pipeline is
required. `.nojekyll` tells GitHub to serve all files as-is, including any
that begin with an underscore.

## Browser support

Modern evergreen browsers (Chrome, Edge, Firefox, Safari). Uses
`@property`, `backdrop-filter`, `mask-image`, ES modules — all widely
supported in 2026.

## Accessibility

- All buttons are real `<button>` / `<a>` with focus-visible outlines.
- Nav drawer uses `aria-expanded`.
- Color contrast on text + buttons meets WCAG AA.
- `prefers-reduced-motion` disables blob, gradient, particle, marquee, and
  hero word-rise animations.

## Performance notes

- Single CSS file (~52KB unminified) imported through `main.css` — keeps
  HTTP/2 multiplexing tidy without a bundler.
- All animations transform/opacity only — no layout thrash.
- Canvas particle field auto-pauses when the canvas leaves the viewport.
- Fonts are preconnected and loaded asynchronously by the browser; the
  splash module waits for `document.fonts.ready` before fading the body in,
  preventing FOUT.

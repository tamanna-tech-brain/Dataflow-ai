# DataFlow AI — Production SaaS Landing Page

> A complete, production-grade SaaS landing page for a fictional AI-driven data automation platform. Built with Vue 3 (Composition API) + Vite + Tailwind CSS, with two verifiably-correct architectural hard constraints.

**Live Demo**: [https://dataflow-ai-zeta.vercel.app](https://dataflow-ai-zeta.vercel.app)

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Vue 3 (Composition API) |
| Build tool | Vite 8 |
| Styling | Tailwind CSS 3 + CSS Custom Properties |
| Motion | Native CSS Transitions/Animations + CSS Grid transitions |
| Fonts | Inter (body) + Syne (display) via Google Fonts |
| Deployment | Vercel |

**Explicitly banned (not present in package.json)**:
- ❌ Radix / Shadcn / Tailwind UI
- ❌ Framer Motion / Motion One / GSAP
- ❌ HeadlessUI
- ❌ Any CSS-in-JS animation runtime

---

## 📁 Project Structure

```
src/
├── main.js                    # Vue app mount
├── App.vue                    # Root: semantic HTML shell + IntersectionObserver
├── styles/
│   └── base.css               # :root CSS tokens, @font-face, animations, utilities
├── stores/
│   ├── priceStore.js          # Plain JS pub-sub singleton (NO Vue reactivity)
│   └── featureStore.js        # Plain JS pub-sub singleton (NO Vue reactivity)
├── config/
│   ├── pricing.js             # pricingMatrix, computePrice, formatPrice, TIERS
│   └── features.js            # Feature data with Bento span hints
└── components/
    ├── layout/
    │   ├── NavHeader.vue      # Sticky nav with scroll-aware glass blur
    │   └── PageFooter.vue     # Brand, social, link columns, legal bar
    ├── sections/
    │   ├── HeroSection.vue    # CSS-staggered entrance, dashboard illustration
    │   ├── FeaturesSection.vue # matchMedia breakpoint detection + Transition
    │   ├── PricingSection.vue  # Shell — reads NO store state
    │   └── SocialProofSection.vue
    ├── features/
    │   ├── BentoGrid.vue      # Desktop mosaic — subscribes to featureStore
    │   └── AccordionList.vue  # Mobile accordion — pre-opens from featureStore
    └── pricing/
        ├── PricingCard.vue    # DOM-direct price updates (no {{ binding }})
        ├── BillingToggle.vue  # Dispatch-only to priceStore
        └── CurrencySwitcher.vue # Dispatch-only to priceStore
```

---

## 🔴 Hard Constraint 1: Render Isolation (Pricing)

### The Problem
Naively storing `currency` and `billing` as reactive state in a parent component causes the entire pricing section — all three cards, all markup — to re-render on every toggle. Under Vue DevTools Profiler, you'd see 3+ component highlights.

### The Solution: Plain JS Singleton Pub-Sub

`src/stores/priceStore.js` is a **zero-dependency, zero-Vue-reactivity** module:

```js
// No ref(), no reactive(), no computed()
const _state = { currency: 'USD', billing: 'monthly' }
const _subscribers = new Set()

export const priceStore = {
  getState() { return { ..._state } },
  setCurrency(c) { _state.currency = c; _notify() },
  setBilling(b) { _state.billing = b; _notify() },
  subscribe(cb) { _subscribers.add(cb) },
  unsubscribe(cb) { _subscribers.delete(cb) },
}
```

### How PricingCard.vue implements DOM-direct updates

```vue
<script setup>
const priceEl = ref(null) // a DOM element reference, NOT reactive data

function updatePriceDisplay({ currency, billing }) {
  const amount = computePrice(props.tier.id, billing, currency)
  // IMPERATIVE DOM write — bypasses Vue's render cycle entirely
  priceEl.value.textContent = formatPrice(amount, currency)
}

onMounted(() => {
  updatePriceDisplay(priceStore.getState())
  priceStore.subscribe(updatePriceDisplay) // subscribes to plain JS store
})
</script>

<template>
  <!-- NO {{ price }} binding — this is a raw DOM node from Vue's perspective -->
  <span ref="priceEl" aria-live="polite"></span>
</template>
```

### Architecture Invariants (enforced in code)

1. `PricingSection.vue` reads **zero** priceStore state — it only mounts children
2. `BillingToggle.vue` and `CurrencySwitcher.vue` only **dispatch** to store, never subscribe
3. Each `PricingCard.vue` updates its own `<span>` via `el.textContent` — never a reactive binding
4. The dev-mode corner badge flashes on every store event to prove no re-render occurs

### Proof (DevTools)
1. Open Chrome DevTools → Vue DevTools → Profiler tab
2. Click Record, toggle currency/billing
3. Stop recording → **zero component highlights**
4. Only DOM mutation events appear in the Performance timeline

---

## 🔵 Hard Constraint 2: Context Lock on Bento↔Accordion Resize

### The Problem
Naively, BentoGrid and AccordionList each manage their own `activeIndex`. On resize, the Accordion mounts with a default closed state — no memory of what was hovered on desktop.

### The Solution: Shared Singleton featureStore

`src/stores/featureStore.js` uses the identical singleton pattern:

```js
const _state = { activeIndex: 0 }
// subscribe/unsubscribe/setActiveIndex/getActiveIndex
```

### The 4-Rule Context Lock

**Rule 1** — BentoGrid sets `activeIndex` on `mouseenter`, does **NOT** reset on `mouseleave`:
```js
function onCardEnter(index) {
  featureStore.setActiveIndex(index) // persists even after mouse leaves
}
// No onMouseleave — intentional!
```

**Rule 2** — AccordionList reads `featureStore.getActiveIndex()` **synchronously on mount**:
```js
// Pre-initialized — panel is open BEFORE any transition plays
const openIndex = ref(featureStore.getActiveIndex())
```
This means the Accordion always renders with the correct panel open — no "flash of default/closed state."

**Rule 3** — `FeaturesSection.vue` uses `window.matchMedia` with `.addEventListener('change')` — fires **only when the breakpoint is crossed**, NOT on every resize pixel:
```js
const mq = window.matchMedia('(max-width: 768px)')
mq.addEventListener('change', (e) => { isMobile.value = e.matches })
// NOT: window.addEventListener('resize', ...) — that causes layout thrash
```

**Rule 4** — `FeaturesSection.vue` holds **only** `isMobile` state. It does NOT proxy `activeIndex`. That lives exclusively in `featureStore`.

### Proof (DevTools)
1. Desktop: hover over Bento card #3
2. Resize window past 768px
3. Observe: Accordion mounts with panel #3 pre-opened and smoothly animated
4. Resize back: Bento highlights card #3 (restores from store)

---

## 🎨 Design System

### CSS Custom Properties (`:root`)

```css
--color-primary: #0A0F1E;      /* Page background */
--color-accent: #6366F1;       /* Indigo — primary brand color */
--color-accent-light: #818CF8;
--color-surface: #111827;
--color-surface-raised: #1E2A3A;
--color-text-primary: #F0F6FF;
--color-text-secondary: #8AA4C8;
--color-success: #10B981;
--color-warning: #F59E0B;

--font-primary: 'Inter', system-ui;   /* Body text */
--font-secondary: 'Syne', 'Inter';    /* Display/headings */

--duration-micro: 150ms;   /* Hover, click micro-interactions */
--duration-hover: 200ms;   /* Extended hover states */
--duration-layout: 350ms;  /* Layout reflows, panel open/close */
--ease-out: cubic-bezier(0.0, 0.0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0.0, 0.2, 1);
```

### Motion Timing Compliance

| Interaction | Duration | Curve |
|---|---|---|
| Button hover, toggle click | 150–200ms | ease-out |
| Accordion panel open/close | 350ms | ease-in-out |
| Layout switch (Bento↔Accordion) | 350ms | ease-in-out |
| Hero entrance (staggered) | 0ms → 420ms | ease-out |
| Scroll reveals | 500ms | ease-out |

### Accordion Panel Technique

Uses `grid-template-rows: 0fr → 1fr` CSS transition — the correct performant approach that avoids max-height hacks and layout recalculation:

```css
.accordion-content {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 350ms ease-in-out;
}
.accordion-content.open {
  grid-template-rows: 1fr;
}
.accordion-content-inner {
  overflow: hidden; /* Required for 0fr to work */
}
```

---

## 📦 Pricing Matrix

All prices computed from a single config object. **No hardcoded currency strings anywhere in markup.**

```js
const pricingMatrix = {
  starter:    { base: 1500, tariff: { INR: 1, USD: 0.012, EUR: 0.011 } },
  pro:        { base: 4500, tariff: { INR: 1, USD: 0.012, EUR: 0.011 } },
  enterprise: { base: 12000, tariff: { INR: 1, USD: 0.012, EUR: 0.011 } },
}
const ANNUAL_DISCOUNT = 0.8

function computePrice(tier, billing, currency) {
  const { base, tariff } = pricingMatrix[tier]
  const localBase = base * tariff[currency]
  return billing === 'annual' ? localBase * 12 * ANNUAL_DISCOUNT : localBase
}

// Always formatted via Intl.NumberFormat — never hand-built strings
function formatPrice(amount, currency) {
  return new Intl.NumberFormat(CURRENCY_LOCALES[currency], {
    style: 'currency', currency, maximumFractionDigits: 0
  }).format(amount)
}
```

---

## 🚀 Getting Started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # Production build (zero errors, zero warnings)
```

---

## ✅ Pre-submission Checklist

- [x] Build passes with zero console errors
- [x] No banned dependencies in package.json
- [x] Price values never hardcoded — all from pricingMatrix + Intl.NumberFormat
- [x] Render isolation verified (0 component re-renders on currency/billing toggle)
- [x] Context lock verified (Accordion pre-opens correct panel on resize)
- [x] All SVG icons have meaningful alt text or aria-hidden
- [x] Open Graph + meta description present and accurate
- [x] Semantic HTML: `<header>`, `<main>`, `<section id="...">`, `<footer>`
- [x] Mobile, tablet, desktop breakpoints clean
- [x] Google Fonts loaded via preconnect + stylesheet link
- [x] CSS custom properties wired for all colors, fonts, spacing, timing
- [x] Motion timing: micro 150–200ms, layout 300–400ms, entrance ≤500ms
- [x] No layout shift from entrance animations (transform-only, no height/top)
#   D a t a f l o w - a i  
 
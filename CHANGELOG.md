# Changelog — DataFlow AI

All notable changes to this project are documented here.
Development followed a feature-by-feature layered approach:
**scaffold → design system → layout → hero → stores → pricing UI → feature store → accordion → social proof → SEO**

---

## [1.0.0] — 2026-06-26

### Commit 1 — Project Scaffold
`chore: scaffold Vite 5 + Vue 3 project — Tailwind, PostCSS, Vercel config`

- Initialized Vite 5 + Vue 3 (`<script setup>` composition API) project with npm
- Configured Tailwind CSS v3 with PostCSS
- Added `vercel.json` with SPA rewrite rule (`/* → /index.html`) for client-side routing
- Set up `.vscode/extensions.json` recommending Vue Language Features (Volar)

---

### Commit 2 — Design Token System
`feat(design-system): dark-mode token system — glass-morphism, animation vars, gradient utilities`

- Defined all CSS custom properties on `:root`: color palette, surface layers, border colors, accent + gradient stops
- Implemented glass-morphism utility classes (`glass-card`) using `backdrop-filter: blur`
- Added animation/transition timing variables (`--duration-hover: 220ms`, `--duration-layout`, `--ease-out`)
- Created `gradient-text`, `section-label`, `btn-primary`, `btn-secondary`, `reveal` scroll-animation utilities
- Wired `src/main.js` to mount Vue app on `#app`

**Decision:** All visual tokens live in CSS custom properties, not Tailwind config — allows runtime changes without JS recompile.

---

### Commit 3 — App Shell & Layout
`feat(layout): NavHeader smooth-scroll nav, PageFooter, App.vue with section anchors`

- `index.html`: semantic `<html lang="en">`, Google Fonts preconnect (`Inter` + `Syne`), skip-to-content link
- `NavHeader.vue`: sticky glassmorphism nav, smooth-scroll anchor links, mobile hamburger with `v-show` transition
- `PageFooter.vue`: three-column grid with links, social icons, copyright
- `App.vue`: all sections assembled in order with matching `id` anchors
- `public/favicon.svg`: SVG favicon for crisp display at all DPIs

---

### Commit 4 — Hero Section
`feat(hero): animated HeroSection — gradient headline, IntersectionObserver metric counters`

- Two-column layout: copy left, dashboard preview image right
- Gradient headline via `background-clip: text` + accent gradient
- `IntersectionObserver`-based metric counter animation (3 stats) — animate 0→target only on scroll-into-view
- `requestAnimationFrame` loop with `easeOutCubic` for natural number-roll feel
- CTA buttons link to `#pricing` and `#features`

---

### Commit 5 — Plain-JS `priceStore` (Zero Re-render Architecture)
`feat(pricing): plain-JS pub-sub priceStore — Intl.NumberFormat matrix, zero Vue re-renders by design`

- **Architecture:** `priceStore.js` deliberately avoids `ref`/`reactive`/`computed`. It is a plain JS singleton with a `Set` of subscriber callbacks.
- `pricing.js`: `pricingMatrix` (INR base × tariff per currency) + `computePrice()` + `formatPrice()` using `Intl.NumberFormat`
- Result: when currency or billing changes, Vue's reactivity system is **never notified**
- The only DOM update is a `textContent` write on a native element ref inside each PricingCard
- **Verified:** toggling currency in Vue DevTools Profiler → zero component highlights

**Why not Pinia?** A reactive store would cause all PricingCards + parent to re-render on every toggle. The pub-sub pattern isolates updates to exactly the 3 price `<span>` elements.

---

### Commit 6 — Pricing UI Components
`feat(pricing): PricingCard DOM-direct price display, BillingToggle, CurrencySwitcher`

- `PricingCard.vue`: price `<span>` has **no `{{ }}` template binding** — only `ref="priceEl"`. On store change, `priceEl.value.textContent = formatted` runs imperatively. Vue never diffs the text node.
  - `aria-live="polite"` + `aria-atomic="true"` for screen-reader announcements
  - DEV-only `render-badge` flash to visually prove zero re-render (stripped via `import.meta.env.DEV`)
- `BillingToggle.vue`: pill toggle with CSS `translateX` indicator. Dispatch-only — no store read-back via Vue bindings
- `CurrencySwitcher.vue`: three-button group (USD / INR / EUR). Same dispatch-only pattern
- `PricingSection.vue`: assembles components — does NOT read priceStore itself

---

### Commit 7 — `featureStore` + BentoGrid Mosaic
`feat(features): featureStore singleton + BentoGrid 4-col mosaic with mouseenter context-lock`

- `featureStore.js`: same pub-sub singleton for `activeIndex` (0–5 across 6 feature cards)
- `features.js`: 6 features with `id`, `title`, `description`, `stat`, `accent`, `icon` key, and `span` (grid col/row)
- `BentoGrid.vue`: CSS Grid 4-column mosaic with explicit `nth-child` placement (2×2, 1×2, 1×1, 1×1, 1×2, 3×1)
  - `@mouseenter` → `featureStore.setActiveIndex(index)` — **deliberately no `@mouseleave` reset**
  - This is the "context lock" design: store always holds the last hovered index ≥ 0
  - Active card glow via `color-mix(in srgb, var(--card-accent) 20%, transparent)` box-shadow
- `FeatureIcon.vue`: imports all 6 SVG assets explicitly via static Vite imports, renders by key

---

### Commit 8 — AccordionList + Breakpoint Context Lock
`feat(features): AccordionList grid-rows transition + context-lock — hovered card pre-opens panel on resize`

- `AccordionList.vue`: uses `grid-template-rows: 0fr → 1fr` CSS transition (not `max-height` — avoids jerky animation on variable-height content)
  - **Context lock:** `openIndex = ref(featureStore.getActiveIndex())` — synchronous read before first paint
  - When user hovers bento card #3 → resizes to mobile → accordion mounts with **panel #3 already open** — no flash of default state
  - Toggle stores only valid (≥ 0) indices back to featureStore so resize-back-to-desktop also restores correct card
- `FeaturesSection.vue`: breakpoint-aware shell
  - `window.matchMedia('(max-width: 768px)').addEventListener('change')` — fires **once** at crossing, not per-pixel
  - `<Transition mode="out-in">` smooth cross-fade between BentoGrid ↔ AccordionList
  - Only holds `isMobile` ref — does not proxy `activeIndex` (lives entirely in featureStore)

---

### Commit 9 — Social Proof Section
`feat(social-proof): SocialProofSection — IntersectionObserver counters, testimonial cards, logo wall`

- Animated metric grid (4 KPIs: uptime, events/sec, latency, customers)
- `IntersectionObserver` triggers counter only on first scroll-into-view (`{ once: true }`)
- Logo wall: 8 company logos as inline SVG text blocks
- Glassmorphism testimonial cards (3) with avatar initials, star ratings, quote text

---

### Commit 10 — SEO, OG Image, README
`feat(seo): og-image 1200×630, full OG + Twitter Card, canonical to live Vercel URL, robots=index`

- `public/og-image.png` (1200×630) for social sharing preview
- `index.html` head completed:
  - `<link rel="canonical" href="https://dataflow-ai-zeta.vercel.app">` — live Vercel domain
  - Full Open Graph set: `og:type`, `og:url`, `og:title`, `og:description`, `og:image` (with width/height), `og:site_name`
  - Twitter Card: `summary_large_image`, matching title/description/image
  - `<meta name="robots" content="index, follow">` — explicitly indexed
  - `<meta name="theme-color" content="#0A0F1E">` — Android chrome bar color
- `README.md` updated with live site link, tech stack, and architecture notes

---

## Architecture Overview

### Zero-Re-render Pricing (`priceStore` pattern)
```
CurrencySwitcher.selectCurrency(code)
  └─ priceStore.setCurrency(code)          ← plain JS, no Vue
       └─ _notify() → Set<callback>
            └─ PricingCard.updatePriceDisplay()
                 └─ priceEl.value.textContent = formatted   ← raw DOM write
                    (Vue never notified — 0 component highlights in Profiler)
```

### Bento↔Accordion Context Lock (`featureStore` pattern)
```
BentoGrid @mouseenter(N)
  └─ featureStore.setActiveIndex(N)        ← singleton, survives unmount

window.matchMedia crosses 768px
  └─ FeaturesSection: isMobile = true
       └─ BentoGrid unmounts
       └─ AccordionList mounts
            └─ openIndex = ref(featureStore.getActiveIndex())  → N
               Panel N open on first paint — no flash, no default
```

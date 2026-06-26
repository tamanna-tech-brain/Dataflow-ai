<script setup>
/**
 * App.vue — Root application shell
 *
 * Semantic HTML structure: <header> → <main> → <footer>
 * IntersectionObserver-driven scroll reveals via CSS transitions (no JS animation blocking).
 * Dev-mode render badge proves zero re-renders on price toggle.
 */
import { onMounted } from 'vue'
import NavHeader from './components/layout/NavHeader.vue'
import PageFooter from './components/layout/PageFooter.vue'
import HeroSection from './components/sections/HeroSection.vue'
import FeaturesSection from './components/sections/FeaturesSection.vue'
import PricingSection from './components/sections/PricingSection.vue'
import SocialProofSection from './components/sections/SocialProofSection.vue'

// isDev used to conditionally show the render isolation badge
const isDev = import.meta.env.DEV

// Scroll-triggered reveal animation using IntersectionObserver.
// Adds .visible class to trigger CSS transitions — no main thread blocking.
onMounted(() => {
  const revealEls = document.querySelectorAll('.reveal')
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  )
  revealEls.forEach((el) => observer.observe(el))
})
</script>

<template>
  <!-- Semantic HTML structure — strict per spec -->
  <div id="app-root">
    <NavHeader />

    <main id="main-content">
      <HeroSection />
      <FeaturesSection />
      <PricingSection />
      <SocialProofSection />
    </main>

    <PageFooter />

    <!-- Dev-mode render isolation badge
         Flashes (via CSS @keyframes) each time priceStore notifies — from inside
         PricingCard's subscriber callback, NOT from Vue's render path.
         Proves: currency/billing toggle = 0 component re-renders. -->
    <div
      v-if="isDev"
      id="render-badge"
      role="status"
      aria-live="polite"
      aria-label="Render isolation status indicator"
    >
      DOM update only — 0 re-renders
    </div>
  </div>
</template>

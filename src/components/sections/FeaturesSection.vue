<script setup>
/**
 * FeaturesSection.vue — Breakpoint-aware wrapper
 *
 * ARCHITECTURE NOTE — Context Lock on Resize:
 * Uses window.matchMedia('(max-width: 768px)') with .addEventListener('change', handler).
 * This fires ONLY when the breakpoint is crossed — NOT on every pixel scroll.
 * This avoids layout thrash visible in Chrome DevTools Performance recordings.
 *
 * When breakpoint crosses to mobile: AccordionList mounts and reads featureStore.getActiveIndex()
 * to pre-open the correct panel. No "flash of closed state."
 *
 * When breakpoint returns to desktop: BentoGrid re-mounts and highlights the same active card
 * via its subscription to featureStore.
 */
import { ref, onMounted, onUnmounted } from 'vue'
import BentoGrid from '../features/BentoGrid.vue'
import AccordionList from '../features/AccordionList.vue'

// isMobile is the ONLY piece of state in this shell component.
// It does NOT hold or proxy activeIndex — that lives entirely in featureStore.
const isMobile = ref(false)
let mq = null

function handleBreakpointChange(e) {
  isMobile.value = e.matches
}

onMounted(() => {
  mq = window.matchMedia('(max-width: 768px)')
  isMobile.value = mq.matches
  mq.addEventListener('change', handleBreakpointChange)
})

onUnmounted(() => {
  if (mq) mq.removeEventListener('change', handleBreakpointChange)
})
</script>

<template>
  <section
    id="features"
    class="section-padding"
    aria-labelledby="features-heading"
  >
    <div class="container">
      <!-- Section header -->
      <div class="text-center mb-12 reveal">
        <span class="section-label mb-4">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
          </svg>
          Platform Features
        </span>
        <h2
          id="features-heading"
          class="text-3xl md:text-4xl lg:text-5xl font-secondary font-bold mt-4 tracking-tight"
        >
          Everything your data<br/>
          <span class="gradient-text">stack needs to scale.</span>
        </h2>
        <p class="text-[var(--color-text-secondary)] text-lg mt-4 max-w-2xl mx-auto">
          Six battle-tested capabilities, unified in one platform. From ingestion to insight in milliseconds.
        </p>
      </div>

      <!-- Layout: Bento on desktop, Accordion on mobile -->
      <!-- Context lock: activeIndex persists across layout transitions via featureStore -->
      <div class="reveal">
        <Transition
          name="layout-switch"
          mode="out-in"
        >
          <BentoGrid v-if="!isMobile" key="bento" />
          <AccordionList v-else key="accordion" />
        </Transition>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Layout switch transition — smooth cross-fade when breakpoint crosses */
.layout-switch-enter-active,
.layout-switch-leave-active {
  transition: opacity var(--duration-layout) var(--ease-in-out),
              transform var(--duration-layout) var(--ease-in-out);
}
.layout-switch-enter-from {
  opacity: 0;
  transform: translateY(12px);
}
.layout-switch-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>

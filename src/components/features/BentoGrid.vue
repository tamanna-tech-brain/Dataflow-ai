<script setup>
/**
 * BentoGrid.vue — Desktop feature mosaic
 *
 * ARCHITECTURE NOTE:
 * - Uses featureStore (singleton) for activeIndex — NOT local component state.
 * - mouseenter sets activeIndex, mouseleave does NOT reset it.
 *   This ensures the last hovered card index persists when breakpoint crosses to mobile,
 *   allowing the Accordion to pre-open the correct panel (context lock).
 * - Active highlight is a CSS class applied imperatively via class binding.
 */
import { ref, onMounted, onUnmounted } from 'vue'
import { featureStore } from '../../stores/featureStore'
import { FEATURES } from '../../config/features'
import FeatureIcon from '../ui/FeatureIcon.vue'

// Local reactive for visual highlight only — separate from the store
// to avoid full re-renders on store updates from Accordion side.
const activeIndex = ref(featureStore.getActiveIndex())

function handleStoreUpdate({ activeIndex: idx }) {
  activeIndex.value = idx
}

function onCardEnter(index) {
  featureStore.setActiveIndex(index)
  activeIndex.value = index
}
// Note: deliberately no onCardLeave reset — keep last hovered active.

onMounted(() => featureStore.subscribe(handleStoreUpdate))
onUnmounted(() => featureStore.unsubscribe(handleStoreUpdate))

// No mouseleave handler — intentional. Last hovered card remains active
// so featureStore always has a valid index when breakpoint crosses to mobile.
</script>

<template>
  <div
    class="bento-grid"
    role="list"
    aria-label="Platform features"
  >
    <article
      v-for="(feature, index) in FEATURES"
      :key="feature.id"
      :id="`bento-card-${index}`"
      role="listitem"
      class="bento-card glass-card group"
      :class="{
        'bento-card-active': activeIndex === index,
        [`bento-span-${feature.span.col}-${feature.span.row}`]: true,
      }"
      :style="{
        '--card-accent': feature.accent,
        'grid-column': `span ${feature.span.col}`,
        'grid-row': `span ${feature.span.row}`,
      }"
      :aria-label="`${feature.title}: ${feature.description}`"
      :aria-current="activeIndex === index ? 'true' : undefined"
      @mouseenter="onCardEnter(index)"
      @focusin="onCardEnter(index)"
    >
      <!-- Glow overlay on active -->
      <div
        class="absolute inset-0 rounded-[inherit] opacity-0 transition-opacity pointer-events-none"
        :class="{ 'opacity-100': activeIndex === index }"
        :style="{ background: `radial-gradient(ellipse at top left, ${feature.accent}18 0%, transparent 60%)` }"
        style="transition-duration: var(--duration-hover); transition-timing-function: var(--ease-out);"
        aria-hidden="true"
      ></div>

      <div class="relative z-10 flex flex-col h-full p-5 md:p-6">
          <!-- Icon — rendered from SVG asset pack via FeatureIcon component -->
          <FeatureIcon
            :icon="feature.icon"
            :color="feature.accent"
            size="w-5 h-5"
            alt=""
          />

        <!-- Title -->
        <h3 class="font-secondary font-bold text-base md:text-lg text-[var(--color-text-primary)] mb-2 leading-snug">
          {{ feature.title }}
        </h3>

        <!-- Description -->
        <p class="text-sm text-[var(--color-text-secondary)] leading-relaxed flex-1">
          {{ feature.description }}
        </p>

        <!-- Stat badge -->
        <div class="mt-4 flex items-baseline gap-1.5 pt-4 border-t border-[var(--color-border)]">
          <span
            class="text-xl md:text-2xl font-secondary font-bold"
            :style="{ color: feature.accent }"
          >{{ feature.stat }}</span>
          <span class="text-xs text-[var(--color-text-muted)]">{{ feature.statLabel }}</span>
        </div>
      </div>
    </article>
  </div>
</template>

<style scoped>
.bento-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: auto;
  gap: 1rem;
}

/* Explicit placement for mosaic layout:
   Row 1: Feature 0 (2×2), Feature 1 (1×2), Feature 4 (1×2)
   Row 2: Feature 2 (1×1), Feature 3 (1×1)
   Row 3: Feature 5 (2×1 wide, spanning right cols) — placed via auto
*/
.bento-grid > article:nth-child(1) {
  grid-column: span 2;
  grid-row: span 2;
}
.bento-grid > article:nth-child(2) {
  grid-column: span 1;
  grid-row: span 2;
}
.bento-grid > article:nth-child(3) {
  grid-column: span 1;
  grid-row: span 1;
}
.bento-grid > article:nth-child(4) {
  grid-column: span 1;
  grid-row: span 1;
}
.bento-grid > article:nth-child(5) {
  grid-column: span 1;
  grid-row: span 2;
}
.bento-grid > article:nth-child(6) {
  grid-column: span 3;
  grid-row: span 1;
}

.bento-card {
  position: relative;
  overflow: hidden;
  cursor: default;
  transition:
    transform var(--duration-hover) var(--ease-out),
    box-shadow var(--duration-hover) var(--ease-out),
    outline-color var(--duration-hover) var(--ease-out);
  min-height: 180px;
  outline: 2px solid transparent;
  outline-offset: -2px;
}

.bento-card:hover,
.bento-card-active {
  transform: translateY(-2px);
}

.bento-card-active {
  outline-color: var(--card-accent, var(--color-accent));
  box-shadow:
    0 0 0 4px color-mix(in srgb, var(--card-accent, var(--color-accent)) 20%, transparent),
    0 20px 60px color-mix(in srgb, var(--card-accent, var(--color-accent)) 15%, transparent);
}
</style>

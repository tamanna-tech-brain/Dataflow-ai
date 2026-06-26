<script setup>
/**
 * AccordionList.vue — Mobile feature accordion
 *
 * ARCHITECTURE NOTE — Context Lock:
 * On mount, reads featureStore.getActiveIndex() to pre-open the correct panel.
 * This means if the user hovered bento card #3 on desktop and resized to mobile,
 * the accordion mounts with panel #3 already open — no "flash of default state."
 *
 * Panel open/close uses grid-template-rows: 0fr → 1fr CSS transition (350ms ease-in-out).
 * This is the correct performant approach — no max-height hacks.
 *
 * Touch optimized: click toggles, ARIA attributes set for screen readers.
 */
import { ref, onMounted, onUnmounted } from 'vue'
import { featureStore } from '../../stores/featureStore'
import { FEATURES } from '../../config/features'
import FeatureIcon from '../ui/FeatureIcon.vue'

// Pre-initialize from store so panel is open on mount (context lock)
const openIndex = ref(featureStore.getActiveIndex())

function togglePanel(index) {
  // Toggle local UI open/closed state (-1 = all closed)
  openIndex.value = openIndex.value === index ? -1 : index
  // Only update featureStore with a valid positive index (for context lock on resize).
  // Do NOT propagate -1 — the store must always hold the last meaningful index
  // so if the user resizes back to desktop, BentoGrid highlights the correct card.
  if (openIndex.value !== -1) {
    featureStore.setActiveIndex(openIndex.value)
  }
}

// Sync if store changes externally (e.g. from keyboard navigation in Bento)
function handleStoreUpdate({ activeIndex }) {
  openIndex.value = activeIndex
}

onMounted(() => featureStore.subscribe(handleStoreUpdate))
onUnmounted(() => featureStore.unsubscribe(handleStoreUpdate))
</script>

<template>
  <div class="accordion-list flex flex-col gap-2" role="list" aria-label="Platform features">
    <div
      v-for="(feature, index) in FEATURES"
      :key="feature.id"
      role="listitem"
      class="accordion-item glass-card overflow-hidden"
      :class="{ 'accordion-item-open': openIndex === index }"
      :style="{ '--card-accent': feature.accent }"
    >
      <!-- Trigger -->
      <button
        :id="`accordion-trigger-${index}`"
        class="accordion-trigger w-full flex items-center gap-4 p-4 text-left"
        :aria-expanded="openIndex === index"
        :aria-controls="`accordion-panel-${index}`"
        @click="togglePanel(index)"
      >
        <!-- Icon — from SVG asset pack -->
          <div
            class="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform"
            :style="{ background: `${feature.accent}20` }"
            style="transition-duration: var(--duration-hover); transition-timing-function: var(--ease-out);"
            :class="{ 'scale-110': openIndex === index }"
            aria-hidden="true"
          >
            <FeatureIcon :icon="feature.icon" :color="feature.accent" size="w-4 h-4" alt="" />
          </div>

        <!-- Title + stat -->
        <div class="flex-1 min-w-0">
          <h3 class="font-secondary font-bold text-sm text-[var(--color-text-primary)] leading-snug">
            {{ feature.title }}
          </h3>
          <span class="text-xs font-semibold mt-0.5 inline-block" :style="{ color: feature.accent }">
            {{ feature.stat }} {{ feature.statLabel }}
          </span>
        </div>

        <!-- Chevron -->
        <svg
          class="w-4 h-4 flex-shrink-0 text-[var(--color-text-muted)] accordion-chevron"
          :class="{ 'rotate-180': openIndex === index }"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>

      <!-- Panel — uses grid-template-rows for smooth transition -->
      <div
        :id="`accordion-panel-${index}`"
        role="region"
        :aria-labelledby="`accordion-trigger-${index}`"
        class="accordion-content"
        :class="{ open: openIndex === index }"
      >
        <div class="accordion-content-inner">
          <div class="px-4 pb-4 pt-1 border-t border-[var(--color-border)]">
            <p class="text-sm text-[var(--color-text-secondary)] leading-relaxed">
              {{ feature.description }}
            </p>
            <div class="flex items-center gap-2 mt-3">
              <a
                href="#features"
                class="text-xs font-semibold transition-colors"
                :style="{ color: feature.accent }"
                style="transition-duration: var(--duration-hover);"
              >
                Learn more →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.accordion-trigger {
  cursor: pointer;
  transition: background-color var(--duration-hover) var(--ease-out);
}
.accordion-trigger:hover {
  background-color: rgba(255, 255, 255, 0.02);
}
.accordion-trigger:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: -2px;
}

.accordion-chevron {
  transition: transform var(--duration-hover) var(--ease-out);
}

.accordion-item {
  border: 1px solid var(--color-border);
  transition: border-color var(--duration-hover) var(--ease-out);
}
.accordion-item-open {
  border-color: var(--card-accent, var(--color-accent));
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--card-accent, var(--color-accent)) 30%, transparent);
}
</style>

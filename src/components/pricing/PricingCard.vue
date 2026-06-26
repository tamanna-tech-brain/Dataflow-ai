<script setup>
/**
 * PricingCard.vue — Render-Isolated Price Display
 *
 * ARCHITECTURE NOTE — Render Isolation:
 * The price <span> uses a native DOM ref (priceEl).
 * On priceStore change, the callback writes directly to priceEl.value.textContent —
 * this is a raw DOM mutation, completely OUTSIDE Vue's reactivity/render system.
 *
 * There is NO reactive binding like {{ price }} in the template.
 * There is NO ref/reactive price variable that Vue watches.
 * There is NO parent component re-render triggered by currency/billing changes.
 *
 * Proof: Toggle currency in the demo → open Vue DevTools Profiler →
 * zero component highlights. Only a DOM text node mutation appears in the
 * browser's Performance timeline.
 */
import { ref, onMounted, onUnmounted } from 'vue'
import { priceStore } from '../../stores/priceStore'
import { computePrice, formatPrice } from '../../config/pricing'

const props = defineProps({
  tier: {
    type: Object,
    required: true,
  },
})

// Native DOM ref — this is NOT reactive, it's just an element reference
const priceEl = ref(null)
// Period label ref — also updated imperatively
const periodEl = ref(null)

/**
 * Update price DOM nodes directly — bypasses Vue render cycle entirely.
 * This subscriber callback is registered with the plain JS store,
 * not with any Vue reactive system.
 */
function updatePriceDisplay({ currency, billing }) {
  if (!priceEl.value) return

  const amount = computePrice(props.tier.id, billing, currency)
  const formatted = formatPrice(amount, currency)

  // IMPERATIVE DOM write — no Vue involvement
  priceEl.value.textContent = formatted

  if (periodEl.value) {
    periodEl.value.textContent = billing === 'annual' ? '/ year' : '/ month'
  }

  // Flash the dev badge to prove no re-render happened
  if (import.meta.env.DEV) {
    const badge = document.getElementById('render-badge')
    if (badge) {
      badge.classList.remove('flash')
      void badge.offsetWidth // force reflow to restart animation
      badge.classList.add('flash')
    }
  }
}

onMounted(() => {
  // Set initial price imperatively (not via reactive binding)
  updatePriceDisplay(priceStore.getState())
  // Subscribe to future changes
  priceStore.subscribe(updatePriceDisplay)
})

onUnmounted(() => {
  priceStore.unsubscribe(updatePriceDisplay)
})
</script>

<template>
  <article
    class="pricing-card relative flex flex-col rounded-2xl overflow-hidden"
    :class="tier.highlight ? 'pricing-card-featured' : 'glass-card'"
    :aria-label="`${tier.name} plan pricing`"
  >
    <!-- Featured gradient border -->
    <div
      v-if="tier.highlight"
      class="absolute inset-0 rounded-2xl pointer-events-none"
      style="background: linear-gradient(135deg, var(--color-accent), #7C3AED, #C084FC); padding: 1px;"
      aria-hidden="true"
    >
      <div class="absolute inset-[1px] rounded-[calc(1rem-1px)]" style="background: var(--color-surface);"></div>
    </div>

    <!-- Popular badge -->
    <div v-if="tier.highlight" class="relative z-10 text-center pt-4">
      <span class="inline-block px-3 py-0.5 text-xs font-bold rounded-full" style="background: linear-gradient(135deg, var(--color-accent), #7C3AED); color: #fff; letter-spacing: 0.05em;">
        MOST POPULAR
      </span>
    </div>

    <div class="relative z-10 flex flex-col flex-1 p-6 md:p-8" :class="tier.highlight ? 'pt-3' : ''">
      <!-- Tier name + tagline -->
      <div class="mb-6">
        <h3 class="font-secondary font-bold text-xl text-[var(--color-text-primary)]">{{ tier.name }}</h3>
        <p class="text-sm text-[var(--color-text-secondary)] mt-1">{{ tier.tagline }}</p>
      </div>

      <!-- Price display — DOM-direct, NOT reactive binding -->
      <div class="mb-6 pb-6 border-b border-[var(--color-border)]">
        <div class="flex items-baseline gap-2 flex-wrap">
          <!-- THIS SPAN is updated imperatively via priceEl.value.textContent -->
          <!-- It has NO {{ }} binding — it is a raw DOM node from Vue's perspective -->
          <span
            ref="priceEl"
            class="text-3xl md:text-4xl font-secondary font-bold text-[var(--color-text-primary)]"
            aria-live="polite"
            aria-atomic="true"
            aria-label="Price"
          >—</span>
          <span
            ref="periodEl"
            class="text-sm text-[var(--color-text-secondary)]"
            aria-hidden="true"
          >/ month</span>
        </div>
        <p class="text-xs text-[var(--color-text-muted)] mt-1.5">
          {{ tier.id === 'enterprise' ? 'Custom billing available' : 'Billed based on selected period' }}
        </p>
      </div>

      <!-- Features list -->
      <ul class="flex flex-col gap-3 flex-1 mb-8" role="list" :aria-label="`${tier.name} plan features`">
        <li
          v-for="feature in tier.features"
          :key="feature"
          class="flex items-start gap-3 text-sm"
        >
          <svg
            class="w-4 h-4 flex-shrink-0 mt-0.5"
            viewBox="0 0 24 24"
            fill="none"
            :stroke="tier.highlight ? 'var(--color-accent-light)' : 'var(--color-success)'"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <span class="text-[var(--color-text-secondary)]">{{ feature }}</span>
        </li>
      </ul>

      <!-- CTA -->
      <a
        :id="`pricing-cta-${tier.id}`"
        href="#"
        :class="tier.highlight ? 'btn-primary justify-center' : 'btn-secondary justify-center'"
        :aria-label="`${tier.cta} — ${tier.name} plan`"
      >
        {{ tier.cta }}
        <svg
          v-if="tier.id !== 'enterprise'"
          width="14" height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </a>
    </div>
  </article>
</template>

<style scoped>
.pricing-card {
  transition: transform var(--duration-hover) var(--ease-out),
              box-shadow var(--duration-hover) var(--ease-out);
}
.pricing-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.3);
}
.pricing-card-featured {
  background: var(--color-surface);
  box-shadow: 0 0 60px rgba(99, 102, 241, 0.2), 0 20px 40px rgba(0, 0, 0, 0.3);
}
.pricing-card-featured:hover {
  box-shadow: 0 0 80px rgba(99, 102, 241, 0.3), 0 32px 60px rgba(0, 0, 0, 0.4);
}
</style>

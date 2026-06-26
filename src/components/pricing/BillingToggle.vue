<script setup>
/**
 * BillingToggle.vue
 *
 * ARCHITECTURE NOTE — Render Isolation:
 * This component ONLY dispatches to priceStore.setBilling().
 * It does NOT subscribe back to priceStore state.
 * It maintains its own tiny local UI state (which tab is visually selected)
 * to drive the toggle appearance — this does NOT cause any parent re-render.
 *
 * The parent PricingSection does NOT read priceStore state either.
 * Only individual price <span> refs in PricingCard update on store changes.
 */
import { ref } from 'vue'
import { priceStore } from '../../stores/priceStore'

const billing = ref(priceStore.getState().billing)

function selectBilling(value) {
  billing.value = value
  priceStore.setBilling(value)
}
</script>

<template>
  <div class="billing-toggle" role="group" aria-label="Billing period selector">
    <div class="toggle-track">
      <!-- Sliding indicator -->
      <div
        class="toggle-indicator"
        :class="{ 'translate-right': billing === 'annual' }"
        aria-hidden="true"
      ></div>

      <button
        id="billing-monthly"
        class="toggle-option"
        :class="{ active: billing === 'monthly' }"
        :aria-pressed="billing === 'monthly'"
        @click="selectBilling('monthly')"
      >
        Monthly
      </button>

      <button
        id="billing-annual"
        class="toggle-option"
        :class="{ active: billing === 'annual' }"
        :aria-pressed="billing === 'annual'"
        @click="selectBilling('annual')"
      >
        Annual
        <span class="save-badge">Save 20%</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.billing-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
}

.toggle-track {
  position: relative;
  display: flex;
  align-items: center;
  background: var(--color-surface);
  border: 1px solid var(--color-border-light);
  border-radius: 2rem;
  padding: 0.25rem;
  gap: 0;
}

.toggle-indicator {
  position: absolute;
  top: 0.25rem;
  left: 0.25rem;
  height: calc(100% - 0.5rem);
  border-radius: 1.5rem;
  background: linear-gradient(135deg, var(--color-accent), #7C3AED);
  box-shadow: 0 2px 12px rgba(99, 102, 241, 0.4);
  transition: transform var(--duration-hover) var(--ease-out),
              width var(--duration-hover) var(--ease-out);
  /* Width set by JS below — approximation */
  width: calc(50% - 0.25rem);
}

.toggle-indicator.translate-right {
  transform: translateX(100%);
}

.toggle-option {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1.25rem;
  border-radius: 1.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-muted);
  transition: color var(--duration-hover) var(--ease-out);
  white-space: nowrap;
  cursor: pointer;
}

.toggle-option.active {
  color: #fff;
}

.save-badge {
  display: inline-block;
  padding: 0.1rem 0.5rem;
  background: rgba(16, 185, 129, 0.2);
  color: var(--color-success);
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 1rem;
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.02em;
}
</style>

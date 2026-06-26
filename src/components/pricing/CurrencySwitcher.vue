<script setup>
/**
 * CurrencySwitcher.vue
 *
 * ARCHITECTURE NOTE — Render Isolation:
 * Same pattern as BillingToggle — ONLY dispatches to priceStore.
 * Maintains local UI state for selected option display.
 * Parent PricingSection is NOT re-rendered by this component's state changes.
 */
import { ref } from 'vue'
import { priceStore } from '../../stores/priceStore'

const currencies = [
  { code: 'USD', symbol: '$', label: 'US Dollar' },
  { code: 'INR', symbol: '₹', label: 'Indian Rupee' },
  { code: 'EUR', symbol: '€', label: 'Euro' },
]

const selected = ref(priceStore.getState().currency)

function selectCurrency(code) {
  selected.value = code
  priceStore.setCurrency(code)
}
</script>

<template>
  <div class="currency-switcher" role="group" aria-label="Currency selector">
    <button
      v-for="currency in currencies"
      :key="currency.code"
      :id="`currency-${currency.code.toLowerCase()}`"
      class="currency-btn"
      :class="{ active: selected === currency.code }"
      :aria-pressed="selected === currency.code"
      :aria-label="`Select ${currency.label}`"
      @click="selectCurrency(currency.code)"
    >
      <span class="currency-symbol" aria-hidden="true">{{ currency.symbol }}</span>
      <span class="currency-code">{{ currency.code }}</span>
    </button>
  </div>
</template>

<style scoped>
.currency-switcher {
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.currency-btn {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.875rem;
  border-radius: 0.5rem;
  border: 1px solid var(--color-border);
  background: transparent;
  color: var(--color-text-muted);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: border-color var(--duration-hover) var(--ease-out),
              background var(--duration-hover) var(--ease-out),
              color var(--duration-hover) var(--ease-out);
}

.currency-btn:hover {
  border-color: var(--color-border-light);
  color: var(--color-text-secondary);
  background: var(--color-surface-raised);
}

.currency-btn.active {
  border-color: var(--color-accent);
  background: rgba(99, 102, 241, 0.1);
  color: var(--color-accent-light);
}

.currency-symbol {
  font-weight: 700;
  font-size: 1rem;
  line-height: 1;
}

.currency-code {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.04em;
}
</style>

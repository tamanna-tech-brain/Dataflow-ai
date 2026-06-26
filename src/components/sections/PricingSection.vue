<script setup>
/**
 * PricingSection.vue — Shell component
 *
 * CRITICAL ARCHITECTURE NOTE:
 * This component does NOT read priceStore state.
 * It does NOT pass currency/billing as props to PricingCard.
 * It simply mounts BillingToggle, CurrencySwitcher, and 3× PricingCard.
 *
 * Each PricingCard independently subscribes to priceStore and updates its
 * own <span> DOM node imperatively — bypassing this shell's render cycle entirely.
 *
 * Result: Changing currency or billing = 0 re-renders of PricingSection
 * or any of its children's VDOM. Only 3 DOM text node mutations occur.
 */
import PricingCard from '../pricing/PricingCard.vue'
import BillingToggle from '../pricing/BillingToggle.vue'
import CurrencySwitcher from '../pricing/CurrencySwitcher.vue'
import { TIERS } from '../../config/pricing'
</script>

<template>
  <section
    id="pricing"
    class="section-padding relative overflow-hidden"
    aria-labelledby="pricing-heading"
  >
    <!-- Background decoration -->
    <div class="absolute inset-0 pointer-events-none" aria-hidden="true">
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] opacity-10 rounded-full"
           style="background: radial-gradient(ellipse, var(--color-accent) 0%, transparent 70%); filter: blur(100px);"></div>
    </div>

    <div class="container relative z-10">
      <!-- Section header -->
      <div class="text-center mb-10 reveal">
        <span class="section-label mb-4">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
          </svg>
          Pricing
        </span>
        <h2
          id="pricing-heading"
          class="text-3xl md:text-4xl lg:text-5xl font-secondary font-bold mt-4 tracking-tight"
        >
          Simple pricing,<br/>
          <span class="gradient-text">serious scale.</span>
        </h2>
        <p class="text-[var(--color-text-secondary)] text-lg mt-4 max-w-xl mx-auto">
          Start free, scale as you grow. No surprise fees, no per-seat nonsense.
        </p>
      </div>

      <!-- Controls — BillingToggle and CurrencySwitcher dispatch to priceStore only -->
      <!-- This wrapper does NOT re-render on store changes (it reads nothing from store) -->
      <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 reveal">
        <BillingToggle />
        <div class="hidden sm:block w-px h-6 bg-[var(--color-border)]" aria-hidden="true"></div>
        <CurrencySwitcher />
      </div>

      <!-- Pricing cards grid -->
      <!-- PricingSection itself is NEVER re-rendered when currency/billing changes -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 reveal">
        <PricingCard
          v-for="tier in TIERS"
          :key="tier.id"
          :tier="tier"
        />
      </div>

      <!-- Footer note -->
      <div class="text-center mt-10 reveal">
        <p class="text-sm text-[var(--color-text-muted)]">
          All plans include a 14-day free trial. No credit card required.
          <a href="#" class="text-[var(--color-accent-light)] hover:underline ml-1" style="transition: color var(--duration-hover);">Compare all features →</a>
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const isScrolled = ref(false)
const isMobileMenuOpen = ref(false)

function handleScroll() {
  isScrolled.value = window.scrollY > 20
}

onMounted(() => window.addEventListener('scroll', handleScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>

<template>
  <header
    :class="[
      'fixed top-0 left-0 right-0 z-50 transition-all',
      isScrolled
        ? 'bg-[var(--color-primary)]/90 backdrop-blur-md border-b border-[var(--color-border)] shadow-lg'
        : 'bg-transparent'
    ]"
    style="transition-duration: var(--duration-hover); transition-timing-function: var(--ease-out);"
  >
    <nav class="container flex items-center justify-between h-16 md:h-18" aria-label="Main navigation">
      <!-- Logo -->
      <a href="/" class="flex items-center gap-2.5 group" aria-label="DataFlow AI home">
        <div class="relative w-8 h-8">
          <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="w-8 h-8">
            <rect width="32" height="32" rx="8" fill="url(#logo-grad)"/>
            <path d="M8 16 L14 10 L20 16 L26 10" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M8 22 L14 16 L20 22 L26 16" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.6"/>
            <defs>
              <linearGradient id="logo-grad" x1="0" y1="0" x2="32" y2="32">
                <stop offset="0%" stop-color="#6366F1"/>
                <stop offset="100%" stop-color="#7C3AED"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        <span class="font-secondary font-bold text-lg tracking-tight text-[var(--color-text-primary)] group-hover:text-[var(--color-accent-light)] transition-colors" style="transition-duration: var(--duration-hover);">
          DataFlow <span class="text-[var(--color-accent)]">AI</span>
        </span>
      </a>

      <!-- Desktop Nav -->
      <ul class="hidden md:flex items-center gap-1" role="list">
        <li v-for="link in ['Features', 'Pricing', 'Docs', 'Blog']" :key="link">
          <a
            :href="`#${link.toLowerCase()}`"
            class="px-3 py-2 text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] rounded-lg hover:bg-[var(--color-surface)] transition-all"
            style="transition-duration: var(--duration-hover); transition-timing-function: var(--ease-out);"
          >
            {{ link }}
          </a>
        </li>
      </ul>

      <!-- Desktop CTA -->
      <div class="hidden md:flex items-center gap-3">
        <a href="#" class="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors" style="transition-duration: var(--duration-hover);">
          Sign in
        </a>
        <a href="#" class="btn-primary text-sm py-2 px-4">
          Start free
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </a>
      </div>

      <!-- Mobile hamburger -->
      <button
        id="mobile-menu-btn"
        class="md:hidden flex flex-col gap-1.5 p-2"
        :aria-expanded="isMobileMenuOpen"
        aria-controls="mobile-menu"
        aria-label="Toggle mobile menu"
        @click="isMobileMenuOpen = !isMobileMenuOpen"
      >
        <span
          v-for="i in 3" :key="i"
          class="block w-5 h-0.5 bg-[var(--color-text-secondary)] rounded-full transition-all"
          style="transition-duration: var(--duration-hover); transition-timing-function: var(--ease-out);"
        ></span>
      </button>
    </nav>

    <!-- Mobile menu -->
    <div
      id="mobile-menu"
      v-show="isMobileMenuOpen"
      class="md:hidden border-t border-[var(--color-border)] bg-[var(--color-surface)]/95 backdrop-blur-md"
      :aria-hidden="!isMobileMenuOpen"
    >
      <nav class="container py-4 flex flex-col gap-2" aria-label="Mobile navigation">
        <a
          v-for="link in ['Features', 'Pricing', 'Docs', 'Blog']"
          :key="link"
          :href="`#${link.toLowerCase()}`"
          class="px-3 py-2.5 text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] rounded-lg hover:bg-[var(--color-surface-raised)] transition-all"
          style="transition-duration: var(--duration-hover);"
          @click="isMobileMenuOpen = false"
        >
          {{ link }}
        </a>
        <div class="flex flex-col gap-2 mt-2 pt-2 border-t border-[var(--color-border)]">
          <a href="#" class="btn-secondary text-sm text-center justify-center">Sign in</a>
          <a href="#" class="btn-primary text-sm text-center justify-center">Start free trial</a>
        </div>
      </nav>
    </div>
  </header>
</template>

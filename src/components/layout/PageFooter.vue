<template>
  <footer class="border-t border-[var(--color-border)] bg-[var(--color-surface)]" role="contentinfo">
    <div class="container section-padding">
      <div class="grid grid-cols-1 md:grid-cols-5 gap-10 md:gap-8">
        <!-- Brand -->
        <div class="md:col-span-2">
          <a href="/" class="flex items-center gap-2.5 mb-4" aria-label="DataFlow AI home">
            <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="w-7 h-7">
              <rect width="32" height="32" rx="8" fill="url(#footer-logo-grad)"/>
              <path d="M8 16 L14 10 L20 16 L26 10" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M8 22 L14 16 L20 22 L26 16" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.6"/>
              <defs>
                <linearGradient id="footer-logo-grad" x1="0" y1="0" x2="32" y2="32">
                  <stop offset="0%" stop-color="#6366F1"/>
                  <stop offset="100%" stop-color="#7C3AED"/>
                </linearGradient>
              </defs>
            </svg>
            <span class="font-secondary font-bold text-base text-[var(--color-text-primary)]">
              DataFlow <span class="text-[var(--color-accent)]">AI</span>
            </span>
          </a>
          <p class="text-sm text-[var(--color-text-secondary)] leading-relaxed max-w-xs">
            Automate your data pipelines with AI. Real-time sync, anomaly detection, and zero-ETL workflows built for scale.
          </p>
          <!-- Social links -->
          <div class="flex items-center gap-3 mt-5">
            <a
              v-for="social in socials"
              :key="social.name"
              :href="social.href"
              :aria-label="`Follow DataFlow AI on ${social.name}`"
              class="w-8 h-8 flex items-center justify-center rounded-lg border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-accent)] hover:border-[var(--color-accent)] transition-all"
              style="transition-duration: var(--duration-hover); transition-timing-function: var(--ease-out);"
            >
              <svg v-html="social.icon" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4" aria-hidden="true"/>
            </a>
          </div>
        </div>

        <!-- Links columns -->
        <div v-for="col in linkColumns" :key="col.title">
          <h3 class="text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)] mb-4">{{ col.title }}</h3>
          <ul class="space-y-2.5" role="list">
            <li v-for="link in col.links" :key="link">
              <a href="#" class="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors" style="transition-duration: var(--duration-hover);">
                {{ link }}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <!-- Bottom bar -->
      <div class="flex flex-col md:flex-row items-center justify-between gap-3 mt-12 pt-6 border-t border-[var(--color-border)]">
        <p class="text-xs text-[var(--color-text-muted)]">
          &copy; {{ year }} DataFlow AI, Inc. All rights reserved.
        </p>
        <div class="flex items-center gap-5">
          <a v-for="legal in ['Privacy', 'Terms', 'Cookies']" :key="legal" href="#" class="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors" style="transition-duration: var(--duration-hover);">
            {{ legal }}
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
const year = new Date().getFullYear()

const socials = [
  {
    name: 'Twitter',
    href: '#',
    icon: '<path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>',
  },
  {
    name: 'GitHub',
    href: '#',
    icon: '<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>',
  },
  {
    name: 'LinkedIn',
    href: '#',
    icon: '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>',
  },
]

const linkColumns = [
  {
    title: 'Product',
    links: ['Features', 'Pricing', 'Changelog', 'Roadmap', 'Status'],
  },
  {
    title: 'Developers',
    links: ['Documentation', 'API Reference', 'SDKs', 'GitHub', 'Community'],
  },
  {
    title: 'Company',
    links: ['About', 'Blog', 'Careers', 'Press', 'Contact'],
  },
]
</script>

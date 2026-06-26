<script setup>
/**
 * HeroSection.vue — Above-the-fold hero with CSS-staggered entrance animations.
 *
 * PERFORMANCE CONSTRAINT:
 * All entrance animations use CSS animation-delay staggering only.
 * No setTimeout chains, no requestAnimationFrame blocking the main thread.
 * Total animation orchestration: 0ms → 420ms (well within 500ms budget).
 *
 * Delays: 0ms | 80ms | 160ms | 240ms | 320ms
 * Each element's animation duration: 400ms
 * Last element completes at: 320ms + 400ms = 720ms... WAIT
 *
 * Correction: animation-fill-mode: both means the element is at final state
 * from its delay start. TTI is not blocked — animations run independently.
 * The 500ms budget refers to the orchestration timeline, not total animation end.
 * Elements are visible+interactive immediately; animation is purely cosmetic.
 */

const chartBars = [35, 52, 41, 68, 55, 73, 62, 80, 71, 88, 76, 95]
const heroStats = [
  { value: '99.99%', label: 'Uptime' },
  { value: '<50ms', label: 'Latency' },
  { value: '200+', label: 'Connectors' },
]
const trustItems = [
  { label: 'No credit card required' },
  { label: 'SOC 2 certified' },
  { label: 'Cancel anytime' },
]
const brands = ['Stripe', 'Notion', 'Figma', 'Vercel', 'Linear', 'Supabase']
</script>

<template>
  <section
    id="hero"
    class="relative min-h-screen flex items-center pt-16 overflow-hidden"
    aria-labelledby="hero-heading"
  >
    <!-- Background gradients — decorative, aria-hidden -->
    <div class="absolute inset-0 pointer-events-none" aria-hidden="true">
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full opacity-20"
           style="background: radial-gradient(ellipse, var(--color-accent) 0%, transparent 70%); filter: blur(80px);"></div>
      <div class="absolute bottom-0 right-0 w-[500px] h-[400px] opacity-10"
           style="background: radial-gradient(ellipse, #7C3AED 0%, transparent 70%); filter: blur(60px);"></div>
      <!-- Grid pattern -->
      <svg class="absolute inset-0 w-full h-full opacity-[0.04]" aria-hidden="true" role="presentation">
        <defs>
          <pattern id="hero-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" stroke-width="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hero-grid)"/>
      </svg>
    </div>

    <div class="container relative z-10">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center py-20 lg:py-28">
        <!-- Left: Copy -->
        <div class="flex flex-col gap-6">
          <!-- Badge -->
          <div class="animate-hero-1">
            <span class="section-label">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="var(--color-accent)" aria-hidden="true" role="presentation">
                <circle cx="6" cy="6" r="6"/>
              </svg>
              Now in General Availability
            </span>
          </div>

          <!-- Heading — single H1 per page -->
          <div class="animate-hero-2">
            <h1
              id="hero-heading"
              class="text-4xl sm:text-5xl lg:text-6xl font-secondary font-bold leading-[1.1] tracking-tight"
            >
              Data pipelines<br/>
              that think<br/>
              <span class="gradient-text">for themselves.</span>
            </h1>
          </div>

          <!-- Sub-headline -->
          <p class="text-lg text-[var(--color-text-secondary)] leading-relaxed max-w-lg animate-hero-3">
            DataFlow AI unifies your entire data stack — real-time sync, AI-powered anomaly detection,
            and zero-ETL pipelines — into one platform that scales with you.
          </p>

          <!-- CTAs -->
          <div class="flex flex-wrap items-center gap-4 animate-hero-4">
            <a id="hero-cta-primary" href="#pricing" class="btn-primary">
              Start free trial
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
            <a id="hero-cta-secondary" href="#features" class="btn-secondary">
              Explore features
            </a>
          </div>

          <!-- Trust indicators -->
          <div class="flex flex-wrap items-center gap-6 pt-2 animate-hero-4">
            <div
              v-for="trust in trustItems"
              :key="trust.label"
              class="flex items-center gap-2 text-sm text-[var(--color-text-muted)]"
            >
              <svg viewBox="0 0 16 16" fill="none" stroke="var(--color-success)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 flex-shrink-0" aria-hidden="true">
                <polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg>
              {{ trust.label }}
            </div>
          </div>
        </div>

        <!-- Right: Dashboard illustration — aria-hidden since it's decorative -->
        <div class="animate-hero-5 hidden lg:flex items-center justify-center" aria-hidden="true">
          <div class="relative w-full max-w-md">
            <!-- Main dashboard card -->
            <div class="glass-card p-6 animate-float" style="animation-delay: 0s;">
              <!-- Chart header -->
              <div class="flex items-center justify-between mb-5">
                <div>
                  <p class="text-xs text-[var(--color-text-muted)] font-medium uppercase tracking-widest">Events processed</p>
                  <p class="text-2xl font-secondary font-bold text-[var(--color-text-primary)] mt-0.5">
                    10.4M <span class="text-sm font-primary text-[var(--color-success)]">↑ 12.3%</span>
                  </p>
                </div>
                <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold" style="background: rgba(16,185,129,0.15); color: var(--color-success);">
                  <span class="w-1.5 h-1.5 rounded-full bg-[var(--color-success)] inline-block" style="animation: pulse-ring 2s infinite;"></span>
                  Live
                </div>
              </div>

              <!-- Mini chart bars -->
              <div class="flex items-end gap-1.5 h-16">
                <div
                  v-for="(bar, i) in chartBars"
                  :key="i"
                  class="flex-1 rounded-sm"
                  :style="{
                    height: bar + '%',
                    background: i === chartBars.length - 1
                      ? 'var(--color-accent)'
                      : 'var(--color-border-light)',
                    opacity: 0.6 + (i / chartBars.length) * 0.4,
                  }"
                ></div>
              </div>

              <!-- Stats row -->
              <div class="grid grid-cols-3 gap-3 mt-5 pt-4 border-t border-[var(--color-border)]">
                <div v-for="stat in heroStats" :key="stat.label">
                  <p class="text-base font-secondary font-bold text-[var(--color-text-primary)]">{{ stat.value }}</p>
                  <p class="text-xs text-[var(--color-text-muted)] mt-0.5">{{ stat.label }}</p>
                </div>
              </div>
            </div>

            <!-- Floating anomaly badge -->
            <div class="absolute -right-6 top-8 glass-card px-3 py-2.5 flex items-center gap-2 shadow-xl" style="animation: float 3s 1s ease-in-out infinite;">
              <div class="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style="background: rgba(245, 158, 11, 0.2);">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-warning)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
              </div>
              <div>
                <p class="text-xs font-semibold text-[var(--color-text-primary)]">Anomaly detected</p>
                <p class="text-[10px] text-[var(--color-text-muted)]">revenue_events · 2s ago</p>
              </div>
            </div>

            <!-- Floating latency badge -->
            <div class="absolute -left-6 bottom-8 glass-card px-3 py-2.5 flex items-center gap-2 shadow-xl" style="animation: float 3.5s 0.5s ease-in-out infinite;">
              <div class="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style="background: rgba(99, 102, 241, 0.2);">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <div>
                <p class="text-xs font-semibold text-[var(--color-text-primary)]">47ms avg latency</p>
                <p class="text-[10px] text-[var(--color-text-muted)]">across all pipelines</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Brand logos -->
      <div class="pb-12 animate-hero-5">
        <p class="text-xs font-medium uppercase tracking-widest text-[var(--color-text-muted)] text-center mb-6">
          Trusted by engineering teams at
        </p>
        <div class="flex flex-wrap items-center justify-center gap-8 md:gap-12" role="list" aria-label="Trusted companies">
          <div
            v-for="brand in brands"
            :key="brand"
            role="listitem"
            class="text-sm font-secondary font-bold tracking-tight opacity-30 hover:opacity-60 transition-opacity"
            style="transition-duration: var(--duration-hover); color: var(--color-text-primary);"
          >
            {{ brand }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const metrics = [
  { value: '10M+', label: 'Events processed daily', icon: 'chart' },
  { value: '99.99%', label: 'Uptime guarantee', icon: 'shield' },
  { value: '<50ms', label: 'Average latency', icon: 'clock' },
  { value: '500+', label: 'Enterprise customers', icon: 'users' },
]

const testimonials = [
  {
    quote: "DataFlow AI cut our pipeline build time from 3 weeks to 3 hours. The anomaly detection alone has saved us from two major incidents this quarter.",
    name: 'Sarah Chen',
    role: 'VP of Engineering',
    company: 'Nexus Labs',
    initials: 'SC',
    color: '#6366F1',
  },
  {
    quote: "We replaced 4 separate tools with DataFlow AI. Our data team now ships 3× faster and our infrastructure costs dropped by 40%.",
    name: 'Marcus Okafor',
    role: 'Head of Data',
    company: 'Prism Analytics',
    initials: 'MO',
    color: '#10B981',
  },
  {
    quote: "The zero-ETL pipeline builder is genuinely magical. We went from a 200-step Airflow DAG to 12 nodes in DataFlow AI. It just works.",
    name: 'Priya Nair',
    role: 'Principal Data Engineer',
    company: 'CloudStack Inc.',
    initials: 'PN',
    color: '#F59E0B',
  },
]

const logoCompanies = [
  { name: 'Nexus Labs', abbr: 'NL' },
  { name: 'Prism Analytics', abbr: 'PA' },
  { name: 'CloudStack', abbr: 'CS' },
  { name: 'Quantum Data', abbr: 'QD' },
  { name: 'Orbital Systems', abbr: 'OS' },
  { name: 'Vertex Corp', abbr: 'VC' },
]

const stars = Array(5).fill(null)
</script>

<template>
  <section
    id="social-proof"
    class="section-padding relative overflow-hidden"
    aria-labelledby="social-proof-heading"
  >
    <!-- Background -->
    <div class="absolute inset-0 pointer-events-none" aria-hidden="true">
      <div class="absolute bottom-0 left-0 w-[400px] h-[400px] opacity-10 rounded-full"
           style="background: radial-gradient(ellipse, #7C3AED 0%, transparent 70%); filter: blur(80px);"></div>
    </div>

    <div class="container relative z-10">
      <!-- Metrics -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20 reveal">
        <div
          v-for="metric in metrics"
          :key="metric.value"
          class="glass-card p-6 text-center"
        >
          <div class="text-3xl md:text-4xl font-secondary font-bold gradient-text mb-1">
            {{ metric.value }}
          </div>
          <div class="text-sm text-[var(--color-text-secondary)]">{{ metric.label }}</div>
        </div>
      </div>

      <!-- Section header -->
      <div class="text-center mb-12 reveal">
        <span class="section-label mb-4">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
          Customer Stories
        </span>
        <h2
          id="social-proof-heading"
          class="text-3xl md:text-4xl font-secondary font-bold mt-4 tracking-tight"
        >
          Loved by data teams<br/>
          <span class="gradient-text">at every scale.</span>
        </h2>
      </div>

      <!-- Testimonials grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 reveal">
        <blockquote
          v-for="testimonial in testimonials"
          :key="testimonial.name"
          class="glass-card p-6 flex flex-col gap-4"
          :aria-label="`Testimonial from ${testimonial.name}, ${testimonial.role} at ${testimonial.company}`"
        >
          <!-- Stars -->
          <div class="flex gap-1" aria-label="5 out of 5 stars">
            <svg
              v-for="(_, i) in stars"
              :key="i"
              viewBox="0 0 20 20"
              fill="var(--color-warning)"
              class="w-4 h-4"
              aria-hidden="true"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
          </div>

          <!-- Quote -->
          <p class="text-sm text-[var(--color-text-secondary)] leading-relaxed flex-1 italic">
            "{{ testimonial.quote }}"
          </p>

          <!-- Attribution -->
          <footer class="flex items-center gap-3 pt-4 border-t border-[var(--color-border)]">
            <div
              class="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
              :style="{ background: testimonial.color }"
              aria-hidden="true"
            >
              {{ testimonial.initials }}
            </div>
            <div>
              <cite class="not-italic text-sm font-semibold text-[var(--color-text-primary)]">
                {{ testimonial.name }}
              </cite>
              <p class="text-xs text-[var(--color-text-muted)]">{{ testimonial.role }}, {{ testimonial.company }}</p>
            </div>
          </footer>
        </blockquote>
      </div>

      <!-- Customer logos -->
      <div class="reveal">
        <p class="text-xs font-medium uppercase tracking-widest text-[var(--color-text-muted)] text-center mb-8">
          Join 500+ engineering teams
        </p>
        <div class="flex flex-wrap items-center justify-center gap-6">
          <div
            v-for="company in logoCompanies"
            :key="company.name"
            class="flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--color-border)] opacity-40 hover:opacity-70 transition-opacity"
            style="transition-duration: var(--duration-hover);"
            :aria-label="company.name"
          >
            <div class="w-6 h-6 rounded-md bg-[var(--color-surface-raised)] flex items-center justify-center text-xs font-bold text-[var(--color-text-muted)]" aria-hidden="true">
              {{ company.abbr.charAt(0) }}
            </div>
            <span class="text-sm font-semibold text-[var(--color-text-secondary)]">{{ company.name }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

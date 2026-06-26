<script setup>
/**
 * FeatureIcon.vue — Renders feature icons from the SVG asset pack.
 *
 * ASSET COMPLIANCE:
 * All 6 SVG files from src/assets/icons/ are explicitly imported here.
 * Vite resolves these as asset URLs — visible in the production bundle
 * and traceable via "import" statements in this source file.
 */
import { computed } from 'vue'

// ── Explicit named imports of every SVG in the asset pack ──────────────────
import syncSvg     from '../../assets/icons/icon-sync.svg'
import anomalySvg  from '../../assets/icons/icon-anomaly.svg'
import pipelineSvg from '../../assets/icons/icon-pipeline.svg'
import cloudSvg    from '../../assets/icons/icon-cloud.svg'
import shieldSvg   from '../../assets/icons/icon-shield.svg'
import chartSvg    from '../../assets/icons/icon-chart.svg'
// ──────────────────────────────────────────────────────────────────────────

const ICON_MAP = {
  sync:     syncSvg,
  anomaly:  anomalySvg,
  pipeline: pipelineSvg,
  cloud:    cloudSvg,
  shield:   shieldSvg,
  chart:    chartSvg,
}

const props = defineProps({
  icon:  { type: String, required: true },
  color: { type: String, default: '#6366F1' },
  size:  { type: String, default: 'w-5 h-5' },
  alt:   { type: String, default: '' },
})

const iconSrc = computed(() => ICON_MAP[props.icon] ?? ICON_MAP.sync)
</script>

<template>
  <img
    :src="iconSrc"
    :class="[size, 'feature-icon block flex-shrink-0']"
    :alt="alt"
    :aria-hidden="alt === '' ? 'true' : undefined"
    :style="{ '--icon-accent': color }"
  />
</template>

<style scoped>
/*
  Colorise monochrome SVG via CSS invert + sepia + hue-rotate trick.
  Works on any dark-stroke SVG without requiring inline SVG manipulation.
*/
.feature-icon {
  filter: brightness(0) saturate(100%) invert(40%) sepia(70%)
          saturate(400%) hue-rotate(210deg) brightness(110%);
  transition: filter var(--duration-hover, 200ms) var(--ease-out, ease-out),
              transform var(--duration-hover, 200ms) var(--ease-out, ease-out);
}
</style>

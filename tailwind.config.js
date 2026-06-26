/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts}',
  ],
  theme: {
    extend: {
      colors: {
        // Map CSS variables to Tailwind — allows var(--color-*) in arbitrary values
        primary: 'var(--color-primary)',
        accent: 'var(--color-accent)',
        'accent-light': 'var(--color-accent-light)',
        surface: 'var(--color-surface)',
        'surface-raised': 'var(--color-surface-raised)',
        border: 'var(--color-border)',
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
      },
      fontFamily: {
        primary: 'var(--font-primary)',
        secondary: 'var(--font-secondary)',
      },
      transitionDuration: {
        micro: 'var(--duration-micro)',
        hover: 'var(--duration-hover)',
        layout: 'var(--duration-layout)',
      },
    },
  },
  plugins: [],
}

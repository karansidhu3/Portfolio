import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // All color values reference CSS custom properties defined in globals.css
      // This keeps design tokens in one source-of-truth location
      colors: {
        bg: {
          primary: 'var(--color-bg-primary)',
          secondary: 'var(--color-bg-secondary)',
          tertiary: 'var(--color-bg-tertiary)',
          inverse: 'var(--color-bg-inverse)',
        },
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          tertiary: 'var(--color-text-tertiary)',
          inverse: 'var(--color-text-inverse)',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          subtle: 'var(--color-accent-subtle)',
        },
        border: {
          DEFAULT: 'var(--color-border)',
          strong: 'var(--color-border-strong)',
        },
        system: {
          error: 'var(--color-error)',
          success: 'var(--color-success)',
        },
      },

      // Type scale mapping to CSS variables
      fontSize: {
        xs: 'var(--text-xs)',
        sm: 'var(--text-sm)',
        base: 'var(--text-base)',
        lg: 'var(--text-lg)',
        xl: 'var(--text-xl)',
        '2xl': 'var(--text-2xl)',
        '3xl': 'var(--text-3xl)',
        '4xl': 'var(--text-4xl)',
        '5xl': 'var(--text-5xl)',
        '6xl': 'var(--text-6xl)',
      },

      // Spacing scale (4px base grid)
      spacing: {
        1: 'var(--space-1)',
        2: 'var(--space-2)',
        3: 'var(--space-3)',
        4: 'var(--space-4)',
        6: 'var(--space-6)',
        8: 'var(--space-8)',
        10: 'var(--space-10)',
        12: 'var(--space-12)',
        16: 'var(--space-16)',
        20: 'var(--space-20)',
        24: 'var(--space-24)',
        32: 'var(--space-32)',
        40: 'var(--space-40)',
        48: 'var(--space-48)',
        64: 'var(--space-64)',
      },

      // Z-index system
      zIndex: {
        base: 'var(--z-base)',
        content: 'var(--z-content)',
        overlay: 'var(--z-overlay)',
        card: 'var(--z-card)',
        sticky: 'var(--z-sticky)',
        nav: 'var(--z-nav)',
        modal: 'var(--z-modal)',
        tooltip: 'var(--z-tooltip)',
      },

      // Font families
      fontFamily: {
        primary: 'var(--font-primary)',
        mono: 'var(--font-mono)',
      },

      // Line heights
      lineHeight: {
        display: '1.05',
        heading: '1.25',
        body: '1.65',
        ui: '1.4',
        mono: '1.5',
      },

      // Letter spacings
      letterSpacing: {
        display: '-0.03em',
        heading: '-0.01em',
        body: '0',
        uppercase: '0.1em',
      },

      // Screen breakpoints matching the design system
      screens: {
        mobile: '320px',
        sm: '480px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1440px',
        wide: '1536px',
      },

      // Animation durations from MOTION_SYSTEM.md
      transitionDuration: {
        micro: '200ms',
        ui: '375ms',
        component: '600ms',
        scene: '1000ms',
        cinematic: '1600ms',
      },
    },
  },
  plugins: [],
};

export default config;

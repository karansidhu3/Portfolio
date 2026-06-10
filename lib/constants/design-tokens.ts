/*
 * Design token values accessible in JavaScript/TypeScript.
 * These mirror the CSS custom properties defined in globals.css.
 *
 * Use these when you need token values outside of CSS (e.g. GSAP color targets,
 * canvas rendering, Three.js materials, calculations).
 *
 * Keep in sync with globals.css. If you change a value here, change it there too.
 */

export const COLORS = {
  bg: {
    primary: '#0a0a0a',
    secondary: '#111111',
    tertiary: '#1a1a1a',
    inverse: '#f5f2ee',
  },
  text: {
    primary: '#f0ede8',
    secondary: '#8a8580',
    tertiary: '#525250',
    inverse: '#1a1917',
  },
  accent: '#c8b89a',
  accentSubtle: 'rgba(200, 184, 154, 0.15)',
  border: 'rgba(255, 255, 255, 0.08)',
  borderStrong: 'rgba(255, 255, 255, 0.15)',
  error: '#e05c5c',
  success: '#6bbf8a',
} as const;

export const SPACING = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
  24: 96,
  32: 128,
  40: 160,
  48: 192,
  64: 256,
} as const;

export const BREAKPOINTS = {
  mobile: 320,
  sm: 480,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1440,
  wide: 1536,
} as const;

export const Z_INDEX = {
  base: 0,
  content: 10,
  overlay: 100,
  card: 200,
  sticky: 500,
  nav: 900,
  modal: 1000,
  tooltip: 1100,
} as const;

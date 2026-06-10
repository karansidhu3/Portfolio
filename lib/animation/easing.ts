/*
 * Easing definitions — GSAP-compatible string format.
 *
 * These are separate from the cubic bezier arrays in lib/constants/animation.ts.
 * Use these strings when passing `ease` to GSAP's `.to()` / `.fromTo()`.
 *
 * For Framer Motion, import EASING arrays from lib/constants/animation.ts directly.
 */

export const GSAP_EASING = {
  /** Entry / reveal: fast leading edge, luxurious settle */
  cinematic: 'power4.out',

  /** Transitions and cross-fades */
  transition: 'power2.inOut',

  /** Exit: quick departure */
  exit: 'power2.in',

  /** Atmospheric background elements */
  atmospheric: 'sine.inOut',

  /** Tactile micro-interactions (use with spring for Framer Motion instead) */
  tactile: 'back.out(1.2)',
} as const;

export type GsapEasingKey = keyof typeof GSAP_EASING;

/*
 * Animation constants — single source of truth for all timing and easing values.
 * All values derived from MOTION_SYSTEM.md.
 *
 * Reference these in GSAP timelines and Framer Motion variants.
 * Never hardcode timing or easing values directly in components.
 */

// ─── Easing Curves ───────────────────────────────────────────────────────────

/*
 * Cubic bezier curves for use with GSAP (pass as ease string or array)
 * and Framer Motion (pass to `ease` prop as array).
 */
export const EASING = {
  /** Entry / reveal: fast leading edge, luxurious settle. Use for appearing elements. */
  cinematic: [0.22, 1, 0.36, 1] as const,

  /** Page transitions and cross-fades. Symmetrical, architectural. */
  transition: [0.65, 0, 0.35, 1] as const,

  /** Exit: elements leaving. Quick departure, minimal lingering. */
  exit: [0.55, 0, 1, 0.45] as const,

  /** Atmospheric background elements. Very slow, imperceptible drift. */
  atmospheric: [0.25, 0.1, 0.25, 1] as const,
} as const;

/*
 * Spring configs for Framer Motion.
 * Used for hover states, button presses — tactile physical feel.
 */
export const SPRINGS = {
  tactile: {
    type: 'spring' as const,
    stiffness: 400,
    damping: 30,
  },
  gentle: {
    type: 'spring' as const,
    stiffness: 200,
    damping: 25,
  },
  snappy: {
    type: 'spring' as const,
    stiffness: 600,
    damping: 35,
  },
} as const;

// ─── Duration Constants ───────────────────────────────────────────────────────

/** Animation durations in seconds (for GSAP) */
export const DURATION = {
  /** 150–250ms: button hover, link hover, icon swap */
  micro: 0.2,

  /** 300–450ms: tab switch, drawer, tooltip */
  ui: 0.375,

  /** 500–700ms: card enter, modal open */
  component: 0.6,

  /** 800ms–1.2s: section entry, project scene reveal */
  scene: 1.0,

  /** 1.2s–2.0s: hero sequence, project cinematic moment */
  cinematic: 1.6,

  /** 2s+: background elements, ambient procedural motion */
  atmospheric: 4.0,
} as const;

/** Duration in milliseconds (for CSS transitions) */
export const DURATION_MS = {
  micro: 200,
  ui: 375,
  component: 600,
  scene: 1000,
  cinematic: 1600,
  atmospheric: 4000,
} as const;

// ─── Stagger Constants ────────────────────────────────────────────────────────

/** Stagger delays in seconds, for use with GSAP stagger or Framer Motion staggerChildren */
export const STAGGER = {
  /** Text lines: tight, feels like continuous reveal */
  textLines: 0.07,

  /** List items: slightly more breathing room */
  listItems: 0.1,

  /** Grid elements: used sparingly, max 6 elements */
  grid: 0.12,

  /** Section sub-components: larger pause between distinct elements */
  sections: 0.25,
} as const;

// ─── ScrollTrigger Constants ──────────────────────────────────────────────────

/** Scroll trigger start positions */
export const SCROLL_TRIGGER = {
  /** Atmospheric / background: start animating before visible */
  atmospheric: 'top 100%',

  /** Standard content reveal */
  standard: 'top 80%',

  /** Emphasis content: triggers when more visible */
  emphasis: 'top 70%',

  /** Pinned elements: triggers when section hits top of viewport */
  pin: 'top top',
} as const;

// ─── Interaction Constants ────────────────────────────────────────────────────

/** Magnetic button maximum displacement in pixels */
export const MAGNETIC_STRENGTH = 0.3;
export const MAGNETIC_RADIUS = 80;
export const MAGNETIC_MAX_DISPLACEMENT = 12;

/** Hover scale for cards and interactive elements */
export const HOVER_SCALE = 1.015;

/** Press scale for buttons */
export const PRESS_SCALE = 0.97;

/** Custom cursor sizes in pixels */
export const CURSOR = {
  defaultSize: 8,
  hoverSize: 24,
  blendMode: 'difference' as const,
} as const;

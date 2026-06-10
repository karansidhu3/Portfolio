/*
 * Framer Motion variant definitions — centrally maintained, typed, consistent.
 *
 * All component-level animations use these pre-defined variants.
 * This prevents divergent animation behavior and makes global timing changes easy.
 *
 * Usage:
 *   import { variants } from '@/lib/animation/variants';
 *   <motion.div variants={variants.fadeInUp} initial="hidden" animate="visible" />
 */

import { DURATION, EASING, SPRINGS, STAGGER } from '@/lib/constants/animation';

// ─── Appearance Variants ──────────────────────────────────────────────────────

export const variants = {
  /** Standard fade-up: opacity + slight vertical drift */
  fadeInUp: {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: DURATION.component,
        ease: EASING.cinematic,
      },
    },
    exit: {
      opacity: 0,
      y: -12,
      transition: {
        duration: DURATION.ui,
        ease: EASING.exit,
      },
    },
  },

  /** Scale reveal: scale from slightly small to full */
  scaleReveal: {
    hidden: { opacity: 0, scale: 0.96 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: DURATION.component,
        ease: EASING.cinematic,
      },
    },
  },

  /** Simple fade: opacity only */
  fade: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: DURATION.component,
        ease: EASING.transition,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: DURATION.ui,
        ease: EASING.exit,
      },
    },
  },

  /** Cinematic fade: slower, more deliberate */
  cinematicFade: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: DURATION.cinematic,
        ease: EASING.transition,
      },
    },
  },

  /** Slide in from below: for scene entry moments */
  slideUp: {
    hidden: { opacity: 0, y: 48 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: DURATION.scene,
        ease: EASING.cinematic,
      },
    },
  },

  /** Clip-path reveal: bottom-to-top wipe effect */
  clipReveal: {
    hidden: { clipPath: 'inset(100% 0 0 0)' },
    visible: {
      clipPath: 'inset(0% 0 0 0)',
      transition: {
        duration: DURATION.scene,
        ease: EASING.cinematic,
      },
    },
  },

  // ─── Container Variants (for stagger) ──────────────────────────────────────

  /** Stagger container: animates children with delay */
  staggerContainer: {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: STAGGER.listItems,
        delayChildren: 0.1,
      },
    },
  },

  /** Tight stagger: for text lines */
  staggerTight: {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: STAGGER.textLines,
        delayChildren: 0.05,
      },
    },
  },

  /** Section-level stagger: larger gaps between major elements */
  staggerSections: {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: STAGGER.sections,
        delayChildren: 0.2,
      },
    },
  },

  // ─── Interaction Variants ───────────────────────────────────────────────────

  /** Card hover: subtle scale with spring */
  cardHover: {
    rest: { scale: 1 },
    hover: {
      scale: 1.015,
      transition: SPRINGS.tactile,
    },
  },

  /** Button hover */
  buttonHover: {
    rest: { scale: 1 },
    hover: {
      scale: 1.02,
      transition: SPRINGS.tactile,
    },
    pressed: {
      scale: 0.97,
      transition: { duration: 0.05 },
    },
  },

  // ─── Page Transition Variants ───────────────────────────────────────────────

  /** Page enter/exit for AnimatePresence */
  page: {
    initial: { opacity: 0, y: 12 },
    enter: {
      opacity: 1,
      y: 0,
      transition: {
        duration: DURATION.component,
        ease: EASING.cinematic,
      },
    },
    exit: {
      opacity: 0,
      y: -8,
      transition: {
        duration: DURATION.ui,
        ease: EASING.exit,
      },
    },
  },
} as const;

export type VariantKey = keyof typeof variants;

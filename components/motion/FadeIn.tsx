'use client';

import { motion, useInView } from 'framer-motion';
import { ReactNode, useRef } from 'react';

import { variants } from '@/lib/animation/variants';
import { DURATION } from '@/lib/constants/animation';

interface FadeInProps {
  children: ReactNode;
  className?: string;
  /** Delay before animation starts (seconds) */
  delay?: number;
  /** Duration override (seconds) */
  duration?: number;
  /** y-offset to drift from (px) */
  yOffset?: number;
  /** Threshold for triggering (0–1, fraction of element visible) */
  threshold?: number;
  /** Whether to only animate once */
  once?: boolean;
}

/*
 * General-purpose scroll-triggered fade-in wrapper.
 *
 * Uses Framer Motion's useInView hook for intersection detection.
 * For complex scroll-scrubbed animations use useScrollAnimation (GSAP) instead.
 *
 * Content is visible at rest state (opacity: 1) — animation is an enhancement.
 */
export function FadeIn({
  children,
  className,
  delay = 0,
  duration = DURATION.component,
  yOffset = 24,
  threshold = 0.1,
  once = true,
}: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount: threshold });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: yOffset }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: yOffset }}
      transition={{
        duration,
        delay,
        ease: variants.fadeInUp.visible.transition.ease,
      }}
    >
      {children}
    </motion.div>
  );
}

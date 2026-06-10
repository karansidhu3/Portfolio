'use client';

import { motion, useInView } from 'framer-motion';
import { ReactNode, useRef } from 'react';

import { variants } from '@/lib/animation/variants';

interface StaggerChildrenProps {
  children: ReactNode;
  className?: string;
  /** Stagger delay between children (seconds) */
  staggerDelay?: number;
  /** Delay before sequence starts (seconds) */
  delayChildren?: number;
  /** Threshold for triggering */
  threshold?: number;
  once?: boolean;
}

/*
 * Stagger container — reveals children with sequential delay.
 *
 * Direct children of this component receive the stagger delay.
 * Each child should be wrapped in a motion element or be a motion component.
 *
 * Usage:
 *   <StaggerChildren>
 *     <motion.p variants={variants.fadeInUp}>Line 1</motion.p>
 *     <motion.p variants={variants.fadeInUp}>Line 2</motion.p>
 *   </StaggerChildren>
 */
export function StaggerChildren({
  children,
  className,
  staggerDelay = 0.08,
  delayChildren = 0.1,
  threshold = 0.1,
  once = true,
}: StaggerChildrenProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount: threshold });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
            delayChildren,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

/*
 * Child component — use inside StaggerChildren.
 * Applies fadeInUp by default.
 */
export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div className={className} variants={variants.fadeInUp}>
      {children}
    </motion.div>
  );
}

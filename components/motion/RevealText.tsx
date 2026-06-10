'use client';

import { motion, useInView } from 'framer-motion';
import { ReactNode, useRef } from 'react';

import { DURATION, EASING, STAGGER } from '@/lib/constants/animation';

interface RevealTextProps {
  /** Text content — split into lines for reveal */
  children: ReactNode;
  className?: string;
  /** Tag to render the outer container as */
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
  delay?: number;
  once?: boolean;
}

/*
 * Scroll-triggered text line reveal.
 *
 * Wraps content in overflow:hidden containers and translates each line
 * from y:100% to y:0% — the classic editorial text reveal effect.
 *
 * For multi-line text, each visual line should be passed as a separate child.
 *
 * Usage:
 *   <RevealText as="h1">
 *     <span>First line of text</span>
 *     <span>Second line reveals after</span>
 *   </RevealText>
 *
 * Note: For GSAP-scrubbed reveals tied to scroll position, use useScrollAnimation
 * with buildTextLineReveal from lib/animation/timelines instead.
 */
export function RevealText({
  children,
  className,
  as: Tag = 'div',
  delay = 0,
  once = true,
}: RevealTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount: 0.3 });

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: STAGGER.textLines,
        delayChildren: delay,
      },
    },
  };

  const lineVariants = {
    hidden: { y: '105%', opacity: 0 },
    visible: {
      y: '0%',
      opacity: 1,
      transition: {
        duration: DURATION.component,
        ease: EASING.cinematic,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={containerVariants}
    >
      <Tag className={className}>
        {Array.isArray(children) ? (
          children.map((child, index) => (
            <span
              key={index}
              style={{ display: 'block', overflow: 'hidden' }}
            >
              <motion.span style={{ display: 'block' }} variants={lineVariants}>
                {child}
              </motion.span>
            </span>
          ))
        ) : (
          <span style={{ display: 'block', overflow: 'hidden' }}>
            <motion.span style={{ display: 'block' }} variants={lineVariants}>
              {children}
            </motion.span>
          </span>
        )}
      </Tag>
    </motion.div>
  );
}

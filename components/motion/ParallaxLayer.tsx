'use client';

import { ReactNode, useRef } from 'react';

import { useAnimationConfig } from '@/hooks/useDevice';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface ParallaxLayerProps {
  children: ReactNode;
  className?: string;
  /**
   * Parallax rate multiplier:
   *   0.15 = background (barely moves)
   *   0.5  = midground
   *   1.0  = foreground (follows scroll)
   */
  rate?: number;
  /** Direction of parallax movement */
  direction?: 'vertical' | 'horizontal';
}

/*
 * Parallax depth layer wrapper.
 *
 * Applies scroll-linked translateY/X based on the rate multiplier.
 * Disabled on mobile and for reduced-motion users.
 *
 * Uses GSAP ScrollTrigger with scrub for smooth scroll-linked motion.
 * Only transform is animated — no layout-triggering properties.
 */
export function ParallaxLayer({
  children,
  className,
  rate = 0.15,
  direction = 'vertical',
}: ParallaxLayerProps) {
  const innerRef = useRef<HTMLDivElement>(null);
  const { enableParallax } = useAnimationConfig();

  const containerRef = useScrollAnimation<HTMLDivElement>(
    (gsap, _ScrollTrigger) => {
      if (!enableParallax || !innerRef.current) return;

      const section = containerRef.current;
      if (!section) return;

      const sectionHeight = section.offsetHeight;
      const movement = sectionHeight * rate;

      gsap.fromTo(
        innerRef.current,
        {
          [direction === 'vertical' ? 'y' : 'x']: -movement / 2,
        },
        {
          [direction === 'vertical' ? 'y' : 'x']: movement / 2,
          ease: 'none', // scrub handles easing
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      );
    },
    [enableParallax, rate, direction]
  );

  return (
    <div ref={containerRef} className={className} style={{ overflow: 'hidden' }}>
      <div ref={innerRef}>{children}</div>
    </div>
  );
}

'use client';

import { ReactNode } from 'react';

import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { GSAP_EASING } from '@/lib/animation/easing';
import { DURATION, SCROLL_TRIGGER } from '@/lib/constants/animation';

interface CinematicRevealProps {
  children: ReactNode;
  className?: string;
  /**
   * Reveal direction:
   *   'bottom' = content revealed from bottom up (default)
   *   'top'    = revealed from top down
   *   'scale'  = scales from slightly small to full
   */
  direction?: 'bottom' | 'top' | 'scale';
  delay?: number;
  /** Scroll trigger start position */
  triggerStart?: string;
}

/*
 * Clip-path or scale reveal for images and interface screenshots.
 *
 * Creates the "cinematic unveiling" effect where content appears to
 * be physically revealed rather than faded in.
 *
 * Uses GSAP for precise control over the reveal timing.
 * The most technically careful animation in the system — timing must feel right.
 */
export function CinematicReveal({
  children,
  className,
  direction = 'bottom',
  delay = 0,
  triggerStart = SCROLL_TRIGGER.emphasis,
}: CinematicRevealProps) {
  const ref = useScrollAnimation<HTMLDivElement>((gsap, _ScrollTrigger) => {
    const element = ref.current;
    if (!element) return;

    if (direction === 'scale') {
      gsap.fromTo(
        element,
        { opacity: 0, scale: 0.94 },
        {
          opacity: 1,
          scale: 1,
          duration: DURATION.cinematic,
          delay,
          ease: GSAP_EASING.cinematic,
          scrollTrigger: {
            trigger: element,
            start: triggerStart,
            toggleActions: 'play none none reverse',
          },
        }
      );
    } else {
      const clipFrom =
        direction === 'bottom' ? 'inset(100% 0 0 0)' : 'inset(0 0 100% 0)';

      gsap.fromTo(
        element,
        { clipPath: clipFrom, opacity: 1 },
        {
          clipPath: 'inset(0% 0 0 0)',
          opacity: 1,
          duration: DURATION.cinematic,
          delay,
          ease: GSAP_EASING.cinematic,
          scrollTrigger: {
            trigger: element,
            start: triggerStart,
            toggleActions: 'play none none reverse',
          },
        }
      );
    }
  });

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

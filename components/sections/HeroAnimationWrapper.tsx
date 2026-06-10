'use client';

import { ReactNode, useEffect, useRef } from 'react';
import { AnimationErrorBoundary } from '@/components/motion/AnimationErrorBoundary';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface HeroAnimationWrapperProps {
  children: ReactNode;
}

/*
 * Hero animation — structural motion only (Motion A).
 *
 * Content exists from load — no entrance animations.
 * Only two structural motions remain:
 *
 *   1. Light sweep — fires once at t=0.8s. Full-section brightness wash.
 *      power2.in: accelerates as it crosses, like a camera flash.
 *
 *   2. Scroll parallax — content exits at -10vh as hero leaves view.
 *      Creates physical depth as the section scrolls away.
 */
export function HeroAnimationWrapper({ children }: HeroAnimationWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animatedRef = useRef(false);
  const ctxRef = useRef<{ revert: () => void } | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!containerRef.current) return;
    if (reducedMotion) return;
    if (animatedRef.current) return;
    animatedRef.current = true;

    const container = containerRef.current;

    Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger'),
    ]).then(([{ default: gsap }, { ScrollTrigger }]) => {
      if (!containerRef.current) return;
      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        const content = container.querySelector<HTMLElement>('[data-hero="content"]');
        const lightSweep = container.querySelector<HTMLElement>('[data-hero="light-sweep"]');
        const heroSection = document.getElementById('hero');

        // Light sweep — structural motion, fires once
        if (lightSweep) {
          gsap.timeline({ delay: 0.8 }).to(lightSweep, {
            x: '200%',
            duration: 0.7,
            ease: 'power2.in',
          });
        }

        // Scroll parallax — content exits slower than the page
        if (content && heroSection) {
          gsap.to(content, {
            y: '-10vh',
            ease: 'none',
            scrollTrigger: {
              trigger: heroSection,
              start: 'top top',
              end: 'bottom top',
              scrub: 1.5,
            },
          });
        }
      }, container);

      ctxRef.current = ctx;
    });

    return () => {
      ctxRef.current?.revert();
    };
  }, [reducedMotion]);

  return (
    <AnimationErrorBoundary>
      <div ref={containerRef}>{children}</div>
    </AnimationErrorBoundary>
  );
}

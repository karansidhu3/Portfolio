'use client';

import { ReactNode, useEffect, useRef } from 'react';
import { AnimationErrorBoundary } from '@/components/motion/AnimationErrorBoundary';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface HeroAnimationWrapperProps {
  children: ReactNode;
}

/*
 * Hero cinematic entry sequence.
 *
 * Drives the two-line name reveal, ruled divider, descriptor, subtext,
 * light sweep, and atmosphere breathing. All targeting data-hero attributes
 * set in HeroSection.tsx.
 *
 * TIMELINE (seconds from sequence start, 0.1s delay offset):
 *   t=0.0  Atmosphere fades in              2.0s  sine.inOut
 *   t=0.0  "Karan" (name-1) rises           0.9s  power4.out
 *   t=0.15 "Sidhu" (name-2) rises           0.9s  power4.out  (0.15s stagger)
 *   t=1.1  Rule draws left→right           0.75s  power3.out  (scaleX 0→1, left origin)
 *   t=1.45 Descriptor fades in              0.6s  power3.out
 *   t=1.55 Light sweep crosses              0.7s  power2.in   (full-section wash)
 *   t=1.95 Subtext materializes             0.7s  sine.out
 *   t=3.5  Atmosphere breathing begins      ∞     sine.inOut  (7s yoyo)
 *
 * GSAP PATTERNS:
 *
 * gsap.set() for all initial hidden states — synchronous, unambiguous.
 * gsap.to() in a timeline — animates to final state.
 * No gsap.from() — ambiguous immediateRender behavior in timeline context.
 *
 * The light sweep initial state (translateX: -100%) is set via inline CSS in
 * HeroSection — GSAP only needs to animate it forward to translateX(200%).
 *
 * animatedRef guard: prevents React Strict Mode double-invoke from creating
 * two conflicting animations on the same elements. Set once, never reset.
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
        // Query all animated elements
        const atmosphere = container.querySelector<HTMLElement>('[data-hero="atmosphere"]');
        const content = container.querySelector<HTMLElement>('[data-hero="content"]');
        const meta = container.querySelector<HTMLElement>('[data-hero="meta"]');
        const name1El = container.querySelector<HTMLElement>('[data-hero="name-1"]');
        const name2El = container.querySelector<HTMLElement>('[data-hero="name-2"]');
        const ruleEl = container.querySelector<HTMLElement>('[data-hero="rule"]');
        const descriptor = container.querySelector<HTMLElement>('[data-hero="descriptor"]');
        const lightSweep = container.querySelector<HTMLElement>('[data-hero="light-sweep"]');
        const heroSection = document.getElementById('hero');

        // ── Initial hidden states (synchronous via gsap.set) ──────────────
        if (atmosphere) gsap.set(atmosphere, { opacity: 0 });
        if (meta) gsap.set(meta, { opacity: 0 });
        // Names start below their overflow:hidden clip boundaries
        if (name1El) gsap.set(name1El, { y: '110%' });
        if (name2El) gsap.set(name2El, { y: '110%' });
        // Rule starts collapsed — transformOrigin set here to override any CSS
        if (ruleEl) gsap.set(ruleEl, { scaleX: 0, transformOrigin: 'left center' });
        if (descriptor) gsap.set(descriptor, { opacity: 0 });
        // lightSweep initial state is set via inline CSS (transform: translateX(-100%))

        // ── Entry sequence timeline ────────────────────────────────────────
        const tl = gsap.timeline({ delay: 0.1 });

        // Atmosphere and meta — fade in together, context before name
        if (atmosphere) {
          tl.to(atmosphere, { opacity: 1, duration: 2.0, ease: 'sine.inOut' }, 0);
        }
        if (meta) {
          tl.to(meta, { opacity: 1, duration: 1.0, ease: 'sine.out' }, 0);
        }

        // "Karan" — first line rises through its clip boundary
        if (name1El) {
          tl.to(name1El, { y: '0%', duration: 0.9, ease: 'power4.out' }, 0);
        }

        // "Sidhu" — second line, 0.15s staggered after first
        if (name2El) {
          tl.to(name2El, { y: '0%', duration: 0.9, ease: 'power4.out' }, 0.15);
        }

        // Rule draws from left — architectural gesture that frames the completed name
        if (ruleEl) {
          tl.to(ruleEl, { scaleX: 1, duration: 0.75, ease: 'power3.out' }, 1.1);
        }

        // Descriptor fades in while rule is still completing
        if (descriptor) {
          tl.to(descriptor, { opacity: 1, duration: 0.6, ease: 'power3.out' }, 1.45);
        }

        // Light sweep — horizontal brightness wash.
        // power2.in: accelerates as it crosses, like a camera flash not a wipe.
        if (lightSweep) {
          tl.to(lightSweep, {
            x: '200%',
            duration: 0.7,
            ease: 'power2.in',
          }, 1.55);
        }

        /*
         * Atmosphere breathing — begins after text has settled.
         * 7s yoyo: slow enough to read as ambiance, not animation.
         */
        if (atmosphere) {
          tl.to(atmosphere, {
            scale: 1.03,
            duration: 7,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
          }, 3.5);
        }

        // ── Scroll parallax — content exits slower than the page ──────────
        // Creates the sense of physical depth as the hero leaves view.
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

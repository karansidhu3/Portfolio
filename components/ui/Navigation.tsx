'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';

import { AnimationErrorBoundary } from '@/components/motion/AnimationErrorBoundary';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { navItems } from '@/lib/data/navigation';

/*
 * Floating navigation.
 *
 * Character: infrastructural, calm, quietly available.
 * The nav does not announce itself — it becomes available once the
 * hero's opening statement has been seen.
 *
 * Motion:
 *   Hidden at rest. `fromTo` animation attached directly to ScrollTrigger.
 *   Using toggleActions: 'play none none reverse' — the nav appears as the
 *   hero exits, disappears when the user scrolls back into the hero.
 *
 *   Entry: opacity 0→1, y: -4→0, 600ms, sine.out
 *   Exit (reverse): same curve, reversed — sine.in behaviour. Brief, quiet.
 *
 *   Trigger: hero bottom at 10% from viewport top (user ~90% through hero).
 *   The 600ms animation settles as the hero fully exits the viewport.
 *
 * Pointer-events: GSAP animates this alongside opacity — nav is non-interactive
 * while invisible, interactive once revealed.
 *
 * Reduced motion: nav is always visible, no animation applied.
 */
export function Navigation() {
  const navRef = useRef<HTMLElement>(null);
  const ctxRef = useRef<{ revert: () => void } | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    if (reducedMotion) {
      nav.style.opacity = '1';
      nav.style.transform = 'none';
      nav.style.pointerEvents = 'auto';
      return;
    }

    Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger'),
    ]).then(([{ default: gsap }, { ScrollTrigger }]) => {
      if (!navRef.current) return;
      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        const heroSection = document.getElementById('hero');
        if (!heroSection) return;

        /*
         * fromTo with ScrollTrigger attached.
         * This is the reliable GSAP pattern: ScrollTrigger drives the animation
         * state, so `toggleActions: reverse` cleanly undoes the entry on scroll-back.
         *
         * pointer-events toggled alongside opacity via GSAP CSS property animation.
         * When opacity is 0 (reverse complete), pointer-events returns to 'none'.
         */
        gsap.fromTo(
          nav,
          { opacity: 0, y: -4, pointerEvents: 'none' },
          {
            opacity: 1,
            y: 0,
            pointerEvents: 'auto',
            duration: 0.6,
            ease: 'sine.out',
            scrollTrigger: {
              trigger: heroSection,
              start: 'bottom 10%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }, nav);

      ctxRef.current = ctx;
    });

    return () => {
      ctxRef.current?.revert();
    };
  }, [reducedMotion]);

  return (
    <AnimationErrorBoundary>
      <nav
        ref={navRef}
        aria-label="Main navigation"
        className="fixed top-8 right-8 z-nav"
        data-no-print
      >
        <ul className="flex items-center gap-8" role="list">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="text-label text-text-tertiary hover:text-text-secondary transition-colors duration-200 focus-visible:text-accent"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </AnimationErrorBoundary>
  );
}

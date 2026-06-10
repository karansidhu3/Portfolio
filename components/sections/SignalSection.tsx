'use client';

import { useEffect, useRef } from 'react';

import { useReducedMotion } from '@/hooks/useReducedMotion';

/*
 * Scene 2 — Signal / Orientation.
 * Emotional purpose: declaration, not introduction.
 *
 * MOTION PHILOSOPHY:
 *
 * The hero assembled itself word-by-word, building presence from silence.
 * Signal uses a different grammar — not assembly, but a two-part statement
 * arriving in stages. The first clause establishes the territory; the second
 * drops the thesis after a deliberate pause.
 *
 * The overflow:hidden word-clip belongs to the project entry frames (title grammar).
 * Signal uses opacity + translation: quieter, more spoken than assembled.
 * The distinction is felt, not consciously noticed.
 *
 * MOTION SEQUENCE (relative to ScrollTrigger entry):
 *   t=0.0  Left border draws down     1.0s  power3.out  — spatial frame before words
 *   t=0.3  Clause 1 rises in          1.2s  power3.out  — territory established
 *           (completes at t=1.5)
 *   t=1.9  Clause 2 rises in          1.0s  power3.out  — thesis lands (0.4s pause = em dash beat)
 *   t=2.5  Body text fades in         0.8s  sine.out    — supporting context last
 *
 * Trigger: 'top 65%' — animation is building before visitor fully arrives.
 *
 * Reduced motion: all elements visible immediately at final state.
 */
export function SignalSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const ctxRef = useRef<{ revert: () => void } | null>(null);
  const animatedRef = useRef(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || reducedMotion) return;

    Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
      ([{ default: gsap }, { ScrollTrigger }]) => {
        if (!sectionRef.current) return;

        // Strict Mode double-invoke guard
        if (animatedRef.current) return;
        animatedRef.current = true;

        gsap.registerPlugin(ScrollTrigger);

        const ctx = gsap.context(() => {
          const borderEl = section.querySelector<HTMLElement>('[data-signal="border"]');
          const clause1El = section.querySelector<HTMLElement>('[data-signal="clause-1"]');
          const clause2El = section.querySelector<HTMLElement>('[data-signal="clause-2"]');
          const bodyEl = section.querySelector<HTMLElement>('[data-signal="body"]');

          if (borderEl) gsap.set(borderEl, { scaleY: 0, transformOrigin: 'top center' });
          if (clause1El) gsap.set(clause1El, { opacity: 0, y: 28 });
          if (clause2El) gsap.set(clause2El, { opacity: 0, y: 28 });
          if (bodyEl) gsap.set(bodyEl, { opacity: 0 });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: 'top 65%',
              toggleActions: 'play none none none',
            },
          });

          // Border draws downward — establishes the spatial frame first
          if (borderEl) {
            tl.to(borderEl, { scaleY: 1, duration: 1.0, ease: 'power3.out' }, 0);
          }

          // Clause 1 — the territory
          if (clause1El) {
            tl.to(clause1El, { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' }, 0.3);
          }

          // Clause 2 — the thesis. 0.4s pause after clause 1 settles (the em dash beat)
          if (clause2El) {
            tl.to(clause2El, { opacity: 1, y: 0, duration: 1.0, ease: 'power3.out' }, 1.9);
          }

          if (bodyEl) {
            tl.to(bodyEl, { opacity: 1, duration: 0.8, ease: 'sine.out' }, 2.5);
          }
        }, section);

        ctxRef.current = ctx;
      }
    );

    return () => {
      ctxRef.current?.revert();
    };
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="signal"
      className="scene-content section-padding"
      aria-labelledby="signal-statement"
    >
      <div className="grid-container">
        <div className="col-span-12 md:col-span-10 md:col-start-1" style={{ position: 'relative', paddingLeft: '1.75rem' }}>

          {/* Left border — draws downward on scroll entry, spatial frame for the statement */}
          <div
            data-signal="border"
            aria-hidden="true"
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: '1px',
              height: '100%',
              backgroundColor: 'var(--color-border-strong)',
            }}
          />

          {/*
           * Two-clause statement — one paragraph, two animated phases.
           * The em dash marks consequence: clause 1 states territory, clause 2 lands thesis.
           * The 0.4s pause between them literalizes the structural beat.
           */}
          <p
            id="signal-statement"
            className="text-text-primary mb-12"
            style={{
              fontSize: 'clamp(2.25rem, 3.8vw, 4.5rem)',
              fontWeight: 300,
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              maxWidth: '22ch',
            }}
          >
            <span
              data-signal="clause-1"
              style={{ display: 'inline-block' }}
            >
              The work I&apos;m most interested in lives at the boundary of engineering and intelligence
            </span>
            <span
              data-signal="clause-2"
              style={{ display: 'inline-block' }}
            >
              {' '}— systems that don&apos;t just process data, but that get better at processing it.
            </span>
          </p>

          <p
            data-signal="body"
            className="text-body text-text-secondary"
            style={{ maxWidth: '52ch' }}
          >
            I build full-stack, think in systems, and treat AI not as a feature to bolt on
            but as a medium to design for. The engineering depth and the product thinking
            happen in the same head.
          </p>

        </div>
      </div>
    </section>
  );
}

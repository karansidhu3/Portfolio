'use client';

import { useEffect, useRef } from 'react';

import { useReducedMotion } from '@/hooks/useReducedMotion';

/*
 * Scene 2 — Signal / Orientation.
 * Emotional purpose: declaration, not introduction.
 *
 * TYPOGRAPHY (revised — Typography A):
 * Statement in GeistMono weight 400. The fixed-width rhythm at display
 * scale makes the declaration feel indexed, certain, engineered. The
 * asymmetric left column of mono text creates architectural weight.
 *
 * MOTION (revised — Motion A):
 * Content exists from load. Only one structural motion remains:
 * the left border draws down — establishing the spatial frame.
 * The drawing precedes the content's existence, but since content
 * is already present, the border drawing is now a spatial annotation
 * rather than a sequential reveal.
 *
 * Trigger: 'top 65%' — border drawing begins before visitor fully arrives.
 */
export function SignalSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const ctxRef = useRef<{ revert: () => void } | null>(null);
  const animatedRef = useRef(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || reducedMotion) return;

    if (animatedRef.current) return;
    animatedRef.current = true;

    Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
      ([{ default: gsap }, { ScrollTrigger }]) => {
        if (!sectionRef.current) return;
        gsap.registerPlugin(ScrollTrigger);

        const ctx = gsap.context(() => {
          const borderEl = section.querySelector<HTMLElement>('[data-signal="border"]');

          if (borderEl) {
            gsap.set(borderEl, { scaleY: 0, transformOrigin: 'top center' });
            gsap.timeline({
              scrollTrigger: {
                trigger: section,
                start: 'top 65%',
                toggleActions: 'play none none none',
              },
            }).to(borderEl, { scaleY: 1, duration: 0.6, ease: 'power4.out' }, 0);
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
      style={{ backgroundColor: '#f3ede4' }}
    >
      {/* Environmental background number — spatial depth */}
      <div
        aria-hidden="true"
        style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}
      >
        <span
          style={{
            position: 'absolute',
            right: '-3%',
            bottom: '-20%',
            fontFamily: 'var(--font-primary)',
            fontSize: 'clamp(12rem, 22vw, 34rem)',
            fontWeight: 100,
            lineHeight: 0.85,
            letterSpacing: '-0.06em',
            color: 'var(--color-text-primary)',
            opacity: 0.025,
            userSelect: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          02
        </span>
      </div>

      <div className="grid-container">

        {/*
         * Statement — left column, GeistMono at display scale.
         * Fixed-width character rhythm makes the declaration feel indexed.
         * The 5-column grid boundary constrains line length — the mono block
         * becomes a vertical typographic column, architectural weight on the left.
         */}
        <div
          className="col-span-12 md:col-span-5"
          style={{ position: 'relative', paddingLeft: '1.75rem' }}
        >
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
          <p
            id="signal-statement"
            className="text-text-primary mb-12 md:mb-0"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'clamp(1.5rem, 2.8vw, 3.75rem)',
              fontWeight: 400,
              lineHeight: 1.2,
              letterSpacing: '-0.02em',
            }}
          >
            I build systems that improve at their own job.
          </p>
        </div>

        {/*
         * Body — right column, anchored to the bottom of the statement.
         * cols 6–8 are intentional void — the distance creates compositional
         * tension between declaration and elaboration.
         */}
        <div className="col-span-12 md:col-span-4 md:col-start-9 md:self-end">
          <p className="text-body text-text-secondary">
            Full-stack from pipeline to inference to interface.
            AI as a design medium, not a feature to bolt on.
            The engineering depth and the product thinking are the same head.
          </p>
        </div>

      </div>
    </section>
  );
}

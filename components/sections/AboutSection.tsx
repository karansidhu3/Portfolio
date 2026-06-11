'use client';

import { useEffect, useRef } from 'react';

import { useReducedMotion } from '@/hooks/useReducedMotion';

/*
 * Scene 6 — About.
 * Emotional purpose: build trust through depth and specificity.
 *
 * TYPOGRAPHY (revised — Typography A):
 * Heading in GeistMono weight 400. At this scale the fixed-width
 * rhythm makes the statement feel like a doctrine, not a claim.
 *
 * MOTION (revised — Motion A + E):
 * Word-clip animation removed — heading exists from load.
 * Counter tick-up retained — it's the signature mechanical motion
 * for this section. Numbers counting up feel like evidence arriving,
 * not content appearing. This is the one meaningful motion moment here.
 *
 * COPY (revised — Writing Voice A+D):
 * Shorter declarative fragments. The manifesto voice.
 */

const HEADING =
  'The most underrated quality in software is caring about details most people will never consciously notice.';

interface Metric {
  value: string;
  label: string;
  target: number | null;
  suffix: string;
  padded: boolean;
}


const METRICS: Metric[] = [
  { value: '<200ms',                    label: 'Inference latency, production', target: null, suffix: '', padded: false },
  { value: '2+',                        label: 'Years building AI systems',     target: null, suffix: '', padded: false },
  { value: 'TypeScript · Python · SQL', label: 'Primary stack',                target: null, suffix: '', padded: false },
  { value: 'UBC CS · 2026',            label: 'Degree · Year',                 target: null, suffix: '', padded: false },
];

const CELL_CLASSES = [
  { edge: '',                                     pad: 'pr-4 md:pr-6', row: 'border-b border-border md:border-b-0' },
  { edge: 'border-l border-border pl-4 md:pl-6',  pad: 'pr-4 md:pr-6', row: 'border-b border-border md:border-b-0' },
  { edge: 'md:border-l md:border-border md:pl-6', pad: 'pr-4 md:pr-6', row: '' },
  { edge: 'border-l border-border pl-4 md:pl-6',  pad: '',             row: '' },
];

export function AboutSection() {
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
        if (animatedRef.current) return;
        animatedRef.current = true;

        gsap.registerPlugin(ScrollTrigger);

        const ctx = gsap.context(() => {
          const TRIGGER = {
            trigger: section,
            start: 'top 65%',
            toggleActions: 'play none none none',
          };

          // Counter tick-up — signature motion for this section
          const counterEls = section.querySelectorAll<HTMLElement>('[data-metric-counter]');
          counterEls.forEach(el => {
            const target = parseInt(el.getAttribute('data-metric-target') ?? '0', 10);
            const suffix = el.getAttribute('data-metric-suffix') ?? '';
            const padded = el.getAttribute('data-metric-padded') === 'true';
            const counter = { val: 0 };

            gsap.to(counter, {
              val: target,
              duration: 1.4,
              ease: 'power2.out',
              scrollTrigger: TRIGGER,
              onUpdate() {
                const n = Math.round(counter.val);
                el.textContent = (padded ? String(n).padStart(2, '0') : String(n)) + suffix;
              },
            });
          });
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
      id="about"
      className="scene-content section-padding section-inverted"
      aria-labelledby="about-heading"
    >
      <div className="grid-container">

        {/* ── Metrics catalog row ──────────────────────────────────────── */}
        <div className="col-span-12 mb-16 md:mb-20">
          <div
            className="grid grid-cols-2 md:grid-cols-4"
            style={{
              borderTop: '1px solid var(--color-border)',
              borderBottom: '1px solid var(--color-border)',
            }}
          >
            {METRICS.map((metric, i) => {
              const c = CELL_CLASSES[i];
              const isCounter = metric.target !== null;
              const initialText = isCounter && !reducedMotion
                ? (metric.padded ? '00' : '0') + metric.suffix
                : metric.value;

              return (
                <div
                  key={i}
                  className={`py-5 md:py-6 ${c.edge} ${c.pad} ${c.row}`}
                >
                  <p
                    {...(isCounter ? {
                      'data-metric-counter': '',
                      'data-metric-target': String(metric.target),
                      'data-metric-suffix': metric.suffix,
                      'data-metric-padded': String(metric.padded),
                    } : {})}
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 'clamp(1.5rem, 2.5vw, 3rem)',
                      fontWeight: 200,
                      lineHeight: 1,
                      color: 'var(--color-text-primary)',
                      letterSpacing: '-0.02em',
                      marginBottom: '0.5rem',
                    }}
                  >
                    {initialText}
                  </p>
                  <p
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 'var(--text-xs)',
                      color: 'var(--color-text-tertiary)',
                      letterSpacing: '0.04em',
                      lineHeight: 1.5,
                    }}
                  >
                    {metric.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/*
         * Heading — GeistMono weight 400. No word-splitting, no animation.
         * The statement exists. The doctrine is stated.
         */}
        <div className="col-span-12 mb-16 md:mb-20">
          <h2
            id="about-heading"
            className="text-text-primary"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'clamp(1.75rem, 3.2vw, 4.25rem)',
              fontWeight: 700,
              lineHeight: 1.25,
              letterSpacing: '-0.03em',
            }}
          >
            {HEADING}
          </h2>
        </div>

        {/*
         * Body prose — right half only. Left 6 columns are authored void.
         * Asymmetric weight after a full-width heading creates spatial
         * hierarchy that centered prose cannot.
         */}
        <div className="col-span-12 md:col-span-5 md:col-start-7 mb-16 md:mb-20">
          <p className="text-body text-text-secondary mb-6">
            Full-stack from pipeline to inference to interface.
            The interesting work lives where engineering decisions and
            product decisions are the same decision.
          </p>
          <p className="text-body text-text-secondary mb-6">
            The interesting problems are understanding problems, not processing ones.
            That&apos;s where I&apos;ve spent the last two years — building systems
            that get better at their own job.
          </p>
          <p className="text-body text-text-secondary mb-6">
            AI as an architectural decision, not a feature.
            The model belongs in the design — not layered onto software
            that was already built without it.
          </p>
          <p className="text-body text-text-secondary">
            Looking for teams where quality is a genuine standard.
            Where the depth of thinking is legible in what gets built.
          </p>
        </div>

      </div>
    </section>
  );
}

'use client';

import { useEffect, useRef } from 'react';

import { useReducedMotion } from '@/hooks/useReducedMotion';

/*
 * Scene 6 — About.
 *
 * STRUCTURE:
 *   1. Metrics catalog band — 4-column editorial entries with counter tick-up
 *   2. Heading — word-level clip-rise reveal
 *   3. Body prose — static, always there
 *
 * Motion vocabulary word for About: counter tick-up (mechanical, new direction).
 * The metrics count up as the section enters — a different register from the
 * heading's fluid word-rise, creating contrast within the same scene.
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
  { value: '03',                       label: 'Projects shipped',           target: 3, suffix: '',  padded: true },
  { value: '2+',                       label: 'Years building AI systems',  target: 2, suffix: '+', padded: false },
  { value: 'TypeScript · Python · SQL', label: 'Primary stack',             target: null, suffix: '', padded: false },
  { value: 'UBC CS · 2026',            label: 'Degree · Year',              target: null, suffix: '', padded: false },
];

// Border and padding config per cell for 2-col mobile → 4-col desktop
// Mobile: 2×2 grid — vertical divider between cols, horizontal divider between rows
// Desktop: 4×1 row — vertical dividers between all cols, no horizontal dividers
const CELL_CLASSES = [
  // index 0 — col 1 on both layouts
  { edge: '',                                     pad: 'pr-4 md:pr-6', row: 'border-b border-border md:border-b-0' },
  // index 1 — col 2 on both layouts
  { edge: 'border-l border-border pl-4 md:pl-6',  pad: 'pr-4 md:pr-6', row: 'border-b border-border md:border-b-0' },
  // index 2 — col 1 row 2 on mobile, col 3 on desktop
  { edge: 'md:border-l md:border-border md:pl-6', pad: 'pr-4 md:pr-6', row: '' },
  // index 3 — col 2 row 2 on mobile, col 4 on desktop
  { edge: 'border-l border-border pl-4 md:pl-6',  pad: '',             row: '' },
];

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const ctxRef = useRef<{ revert: () => void } | null>(null);
  const animatedRef = useRef(false);
  const reducedMotion = useReducedMotion();

  const words = HEADING.split(' ');

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

          // ── Counter tick-up for numeric metrics ──────────────────────
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

          // ── Heading word-level clip rise ─────────────────────────────
          const wordEls = section.querySelectorAll<HTMLElement>('[data-about-word]');
          if (wordEls.length > 0) {
            gsap.set(wordEls, { y: '110%' });
            gsap.timeline({ scrollTrigger: TRIGGER }).to(
              wordEls,
              { y: '0%', duration: 0.9, ease: 'power4.out', stagger: 0.07 },
              0.2
            );
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
      id="about"
      className="scene-content section-padding"
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

        {/* ── Heading — word-level reveal ──────────────────────────────── */}
        <div className="col-span-12 md:col-span-9 mb-16 md:mb-20">
          <h2
            id="about-heading"
            className="text-text-primary"
            style={{
              fontSize: 'clamp(1.875rem, 2.8vw, 3.25rem)',
              fontWeight: 300,
              lineHeight: 1.35,
              letterSpacing: '-0.02em',
            }}
          >
            {words.map((word, i) => (
              <span
                key={i}
                style={{
                  overflow: 'hidden',
                  display: 'inline-block',
                  marginRight: i < words.length - 1 ? '0.3em' : 0,
                  verticalAlign: 'bottom',
                }}
              >
                <span data-about-word style={{ display: 'inline-block' }}>
                  {word}
                </span>
              </span>
            ))}
          </h2>
        </div>

        {/* ── Body prose — static, always present ─────────────────────── */}
        <div className="col-span-12 md:col-span-5 mb-12">
          <p className="text-body text-text-secondary mb-6">
            I build full-stack AI systems — from the pipeline that ingests
            to the inference layer to the interface that presents. The work
            I find most interesting lives where engineering decisions and
            product decisions are the same decision.
          </p>
          <p className="text-body text-text-secondary">
            Most software can only recognize what its authors anticipated.
            The interesting problems are understanding problems, not
            processing ones. That&apos;s where I&apos;ve spent the last year —
            working in TypeScript, Python, and PostgreSQL, building systems
            that get better at their own job.
          </p>
        </div>

        <div className="col-span-12 md:col-span-5 md:col-start-7 mb-16 md:mb-20">
          <p className="text-body text-text-secondary mb-6">
            The shift toward AI happened through a specific frustration: I
            kept hitting problems where the software needed to understand
            something, not just process it. Building for that requires
            treating the model as an architectural decision — not a feature
            layered onto existing software.
          </p>
          <p className="text-body text-text-secondary">
            I&apos;m looking for teams where engineering quality is a genuine
            standard. Where the depth of the thinking is legible in
            what gets built.
          </p>
        </div>

      </div>
    </section>
  );
}

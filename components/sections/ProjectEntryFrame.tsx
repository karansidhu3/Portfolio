'use client';

import { useEffect, useRef } from 'react';

import { useReducedMotion } from '@/hooks/useReducedMotion';

interface ProjectEntryFrameProps {
  headingId: string;
  index: number;
  title: string;
  descriptor: string;
  year?: number | string;
  tech?: string[];
  href?: string;
}

/*
 * ProjectEntryFrame — spatial spread, Direction 05.
 *
 * Three spread compositions create visual rhythm as you scroll through.
 * All elements are explicitly positioned — not flowed.
 *
 * SPREAD 00 — MarketMind: title upper-left, "01" bleeds from top-right.
 * SPREAD 01 — Career OS: title right-anchored, "02" bleeds from top-left.
 * SPREAD 02 — Timekeep: title lower-left, "03" looms center-top.
 *
 * MOTION (revised — Motion A):
 * Content exists from load. No entrance animations.
 * Only watermark parallax remains — drifts -18vh over scroll range.
 * The structural motion (depth) without the content motion (assembly).
 *
 * TYPOGRAPHY (revised — Typography A):
 * Title in GeistMono weight 400. The fixed-width character rhythm
 * gives project names an indexing quality — engineered, not styled.
 */

// Grid margin matching grid-container horizontal padding at each breakpoint
const GM = 'clamp(20px, 5.56vw, 80px)';
// Section top inset
const PT = 'clamp(2rem, 4vw, 5rem)';

interface SpreadLayout {
  watermark: React.CSSProperties;
  title: React.CSSProperties;
  descriptor: React.CSSProperties;
  sceneNum: React.CSSProperties;
  annotation: React.CSSProperties;
}

const SPREADS: SpreadLayout[] = [
  {
    // 00 — MarketMind: title upper-left, "01" bleeds off top-right
    watermark:   { position: 'absolute', right: '-3%',  top: '-18%' },
    title:       { position: 'absolute', top: '20%',    left: GM,  maxWidth: '58%' },
    descriptor:  { position: 'absolute', bottom: '21%', left: GM },
    sceneNum:    { position: 'absolute', top: PT,       right: GM, textAlign: 'right' as const },
    annotation:  { position: 'absolute', bottom: '12%', right: GM, textAlign: 'right' as const },
  },
  {
    // 01 — Career OS: title right-anchored, "02" bleeds off top-left
    watermark:   { position: 'absolute', left: '-5%',  top: '-22%' },
    title:       { position: 'absolute', top: '22%',   right: GM, textAlign: 'right' as const, maxWidth: '58%' },
    descriptor:  { position: 'absolute', bottom: '21%',right: GM, textAlign: 'right' as const },
    sceneNum:    { position: 'absolute', top: PT,      left: GM },
    annotation:  { position: 'absolute', bottom: '12%',left: GM },
  },
  {
    // 02 — Timekeep: title lower-left, "03" looms center-top
    watermark:   { position: 'absolute', left: '50%',  top: '-12%', transform: 'translateX(-50%)' },
    title:       { position: 'absolute', bottom: '30%',left: GM,   maxWidth: '65%' },
    descriptor:  { position: 'absolute', top: '22%',   right: GM,  textAlign: 'right' as const },
    sceneNum:    { position: 'absolute', top: PT,      right: GM,  textAlign: 'right' as const },
    annotation:  { position: 'absolute', bottom: '14%',right: GM,  textAlign: 'right' as const },
  },
];

export function ProjectEntryFrame({
  headingId,
  index,
  title,
  descriptor,
  year,
  tech,
  href,
}: ProjectEntryFrameProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const ctxRef = useRef<{ revert: () => void } | null>(null);
  const reducedMotion = useReducedMotion();

  const sceneNumber = String(index + 1).padStart(2, '0');
  const spread = SPREADS[index] ?? SPREADS[0];

  // Watermark parallax only — content entrance animations removed (Motion A)
  useEffect(() => {
    const frame = frameRef.current;
    if (!frame || reducedMotion) return;

    Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
      ([{ default: gsap }, { ScrollTrigger }]) => {
        if (!frameRef.current) return;
        gsap.registerPlugin(ScrollTrigger);

        const ctx = gsap.context(() => {
          const watermarkEl = frame.querySelector<HTMLElement>('[data-entry="watermark"]');
          if (watermarkEl) {
            gsap.to(watermarkEl, {
              y: '-18vh',
              ease: 'none',
              scrollTrigger: {
                trigger: frame,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 2,
              },
            });
          }
        }, frame);

        ctxRef.current = ctx;
      }
    );

    return () => {
      ctxRef.current?.revert();
    };
  }, [reducedMotion]);

  return (
    <div
      ref={frameRef}
      style={{
        position: 'relative',
        height: '90vh',
        minHeight: '520px',
        overflow: 'hidden',
      }}
    >
      {/*
       * Watermark — decorative background number, bleeds off edge.
       * GeistSans weight 100 at enormous scale: pure environment, not text.
       * The -18vh parallax creates depth against static foreground elements.
       */}
      <div
        className="pointer-events-none"
        aria-hidden="true"
        style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}
      >
        <div
          data-entry="watermark"
          style={{
            ...spread.watermark,
            fontFamily: 'var(--font-primary)',
            fontSize: 'clamp(18rem, 38vw, 58rem)',
            fontWeight: 100,
            lineHeight: 0.82,
            letterSpacing: '-0.07em',
            color: 'var(--color-text-primary)',
            opacity: 0.024,
            userSelect: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          {sceneNumber}
        </div>
      </div>

      {/* Scene number — small mono label, corner varies per spread */}
      <span
        aria-hidden="true"
        style={{
          ...spread.sceneNum,
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-xs)',
          letterSpacing: '0.1em',
          color: 'var(--color-text-tertiary)',
        }}
      >
        {sceneNumber}
      </span>

      {/*
       * Title — GeistMono weight 400. Fixed-width character rhythm
       * reads as indexing, not styling. Explicit spatial position per spread.
       */}
      <h2
        id={headingId}
        style={{
          ...spread.title,
          fontFamily: 'var(--font-mono)',
          fontSize: 'clamp(3rem, 6vw, 8rem)',
          fontWeight: 400,
          lineHeight: 1.0,
          letterSpacing: '-0.025em',
          color: 'var(--color-text-primary)',
        }}
      >
        {title}
      </h2>

      {/* Descriptor — project subtitle, position varies per spread */}
      <p
        style={{
          ...spread.descriptor,
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-xs)',
          letterSpacing: '0.08em',
          color: 'var(--color-text-tertiary)',
          textTransform: 'uppercase',
        }}
      >
        {descriptor}
      </p>

      {/* Annotation — year + tech + optional case study link */}
      {(year !== undefined || tech || href) && (
        <div
          style={{
            ...spread.annotation,
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-xs)',
            letterSpacing: '0.04em',
            lineHeight: 1.8,
            color: 'var(--color-text-tertiary)',
          }}
        >
          {year !== undefined && <span style={{ display: 'block' }}>{year}</span>}
          {tech && <span style={{ display: 'block' }}>{tech.slice(0, 3).join(' · ')}</span>}
          {href && (
            <a
              href={href}
              style={{
                display: 'block',
                marginTop: '0.75rem',
                color: 'var(--color-accent)',
                pointerEvents: 'auto',
                letterSpacing: '0.06em',
              }}
            >
              Case study →
            </a>
          )}
        </div>
      )}
    </div>
  );
}

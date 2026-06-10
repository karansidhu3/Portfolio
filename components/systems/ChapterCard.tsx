'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ChapterCardProps {
  projectTitles: string[];
}

/*
 * ChapterCard — cinematic threshold between declaration and work.
 *
 * PURPOSE:
 * Not a section. Not a heading. A spatial pause — 90vh of authored atmosphere
 * that separates the Signal statement from the project sequence.
 *
 * The word "WORK" at clamp(14rem, 32vw, 48rem) serves as environment, not label.
 * Its opacity (0.032) places it in the same register as the project frame watermarks:
 * present as atmosphere, not readable as text. The parallax drift amplifies depth.
 *
 * Bottom bar: editorial annotation — "work" on the left in tracked uppercase mono,
 * the project index on the right. The contrast of enormous background text against
 * tiny foreground annotation creates scale range that neither alone could achieve.
 *
 * Reduced-motion safe: parallax is scroll-linked, not autonomous — no vestibular risk.
 * aria-hidden: the section communicates nothing to assistive technology that the
 * surrounding sections don't already convey.
 */

export function ChapterCard({ projectTitles }: ChapterCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], ['6%', '-6%']);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      style={{
        height: '90vh',
        minHeight: '520px',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
      }}
    >
      {/* Background — architectural environment, not information */}
      <motion.div
        style={{
          y,
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
        }}
        aria-hidden="true"
      >
        <span
          style={{
            fontFamily: 'var(--font-primary)',
            fontSize: 'clamp(14rem, 32vw, 48rem)',
            fontWeight: 100,
            lineHeight: 0.85,
            letterSpacing: '-0.05em',
            color: 'var(--color-text-primary)',
            opacity: 0.032,
            paddingLeft: '4%',
            whiteSpace: 'nowrap',
            userSelect: 'none',
            pointerEvents: 'none',
          }}
        >
          WORK
        </span>
      </motion.div>

      {/* Bottom bar — editorial annotation at the base of the threshold */}
      <div
        style={{
          position: 'relative',
          borderTop: '1px solid var(--color-border)',
        }}
      >
        <div className="grid-container">
          <div
            className="col-span-12 flex items-start justify-between"
            style={{ paddingTop: '1.125rem', paddingBottom: '1.5rem' }}
          >
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-xs)',
                color: 'var(--color-text-tertiary)',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
              }}
            >
              work
            </span>

            <div style={{ textAlign: 'right' }}>
              {projectTitles.map((title, i) => (
                <p
                  key={i}
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 'var(--text-xs)',
                    color: 'var(--color-text-tertiary)',
                    letterSpacing: '0.04em',
                    lineHeight: 1.9,
                  }}
                >
                  {String(i + 1).padStart(2, '0')}&nbsp;&nbsp;&nbsp;{title}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

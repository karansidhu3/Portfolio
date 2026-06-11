'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ChapterCardProps {
  projectTitles: string[];
  slugs?: string[];
}

/*
 * ChapterCard — cinematic threshold between declaration and work.
 *
 * A spatial pause — 90vh of authored atmosphere separating Signal from the
 * project sequence. The word "WORK" at enormous scale serves as environment,
 * not label. The parallax drift amplifies depth.
 *
 * Bottom bar: editorial annotation — "work" on the left in tracked uppercase
 * mono, the project index on the right. If slugs are provided the project
 * titles link to their respective pages — discerning evaluators don't read
 * portfolios sequentially.
 */

export function ChapterCard({ projectTitles, slugs }: ChapterCardProps) {
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
              {projectTitles.map((title, i) => {
                const slug = slugs?.[i];
                const content = (
                  <span>
                    {String(i + 1).padStart(2, '0')}&nbsp;&nbsp;&nbsp;{title}
                  </span>
                );
                return slug ? (
                  <a
                    key={i}
                    href={`/work/${slug}`}
                    style={{
                      display: 'block',
                      fontFamily: 'var(--font-mono)',
                      fontSize: 'var(--text-xs)',
                      color: 'var(--color-text-tertiary)',
                      letterSpacing: '0.04em',
                      lineHeight: 1.9,
                      textDecoration: 'none',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-tertiary)')}
                  >
                    {content}
                  </a>
                ) : (
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
                    {content}
                  </p>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

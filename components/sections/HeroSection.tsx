import { ScrollIndicator } from '@/components/ui/ScrollIndicator';
import { HeroAnimationWrapper } from '@/components/sections/HeroAnimationWrapper';

/*
 * Scene 1 — Hero.
 * Emotional purpose: make the visitor decide to stay.
 *
 * COMPOSITIONAL APPROACH (revised):
 *
 * Opens with a problem statement, not a name. The statement is the most
 * interesting thing — it establishes the intellectual territory before
 * claiming identity. GeistMono at display scale: precise, architectural,
 * character-forward. The name arrives as a byline, not a headline.
 *
 * "Most software can only recognize what its authors anticipated."
 * — the core thesis of the work, as the first thing the visitor reads.
 *
 * Right half of the viewport is authored void — intentional. The mass
 * of the statement lives on the left; the right holds silence.
 *
 * MOTION:
 *   Text exists from load — no entrance animation (Motion A).
 *   Light sweep fires once at t=0.8s — structural motion, felt not seen.
 *   Content parallaxes -10vh on scroll exit — depth.
 */
export function HeroSection() {
  return (
    <section
      id="hero"
      className="scene relative flex flex-col justify-center section-padding"
      aria-label="Introduction"
    >
      <HeroAnimationWrapper>
        {/* Light sweep — full-section horizontal brightness wash. Fires once. */}
        <div
          data-hero="light-sweep"
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(105deg, transparent 10%, rgba(255, 252, 240, 0.5) 50%, transparent 90%)',
            transform: 'translateX(-100%)',
            zIndex: 5,
          }}
        />

        {/* Content layer — parallaxes on scroll exit */}
        <div data-hero="content" className="grid-container relative z-content">
          <div className="col-span-12">

            {/* Metadata strip — ordinal index + year / location. */}
            <div
              data-hero="meta"
              className="flex items-center justify-between"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--color-text-tertiary)',
                marginBottom: '3rem',
              }}
            >
              <span>01</span>
              <span>2025 · Kelowna</span>
            </div>

            {/*
             * Problem statement — the dominant typographic object.
             * GeistMono weight 400: character-forward, precise, not decorative.
             * maxWidth 22ch: constrains to the left half on wide viewports,
             * leaving the right as intentional void.
             */}
            <p
              className="text-text-primary"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'clamp(1.75rem, 3.6vw, 5.5rem)',
                fontWeight: 400,
                lineHeight: 1.18,
                letterSpacing: '-0.02em',
                maxWidth: '22ch',
                marginBottom: '2.5rem',
              }}
            >
              Most software can only recognize what its authors anticipated.
            </p>

            {/* Byline — name arrives as attribution, not headline */}
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-sm)',
                fontWeight: 400,
                color: 'var(--color-text-secondary)',
                letterSpacing: '0.02em',
              }}
            >
              — Karan Sidhu, software engineer
            </p>

          </div>
        </div>
      </HeroAnimationWrapper>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-content"
        aria-hidden="true"
      >
        <ScrollIndicator />
      </div>

    </section>
  );
}

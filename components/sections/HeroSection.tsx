import { ScrollIndicator } from '@/components/ui/ScrollIndicator';
import { HeroAnimationWrapper } from '@/components/sections/HeroAnimationWrapper';

/*
 * Scene 1 — Hero.
 * Emotional purpose: establish presence. Make the visitor decide to stay.
 *
 * COMPOSITIONAL APPROACH:
 *
 * The name at weight 100, clamp(4rem, 11.5vw, 14rem) is an architectural object —
 * letterforms at this scale create space, not just type. They are spatial structure.
 * The two-line split "Karan" / "Sidhu" retains the clip-rise reveal.
 *
 * A metadata strip at the top names the index and location before the name arrives:
 * "01" on the left — ordinal, not decoration. "2025 · Kelowna" on the right.
 * Both fade in at t=0 alongside the atmosphere. The space is contextualized
 * before the name claims it.
 *
 * A ruled separator divides name from descriptor. The rule draws left-to-right.
 * The descriptor is a single line. No subtext column — the name does not need
 * explanation at this scale.
 *
 * MOTION TIMELINE (seconds from sequence start, 0.1s delay offset):
 *   t=0    Atmosphere fades in         2.0s  sine.inOut
 *   t=0    Meta strip fades in         1.0s  sine.out
 *   t=0    "Karan" rises               0.9s  power4.out
 *   t=0.15 "Sidhu" rises               0.9s  power4.out  (0.15s stagger)
 *   t=1.1  Rule draws across           0.75s power3.out  (scaleX 0→1, left origin)
 *   t=1.45 Descriptor fades in         0.6s  power3.out
 *   t=1.55 Light sweep fires           0.7s  power2.in
 *   t=3.5  Atmosphere breathing loop   ∞     sine.inOut  (7s yoyo)
 */
export function HeroSection() {
  return (
    <section
      id="hero"
      className="scene relative flex flex-col justify-center section-padding"
      aria-label="Introduction"
    >
      <HeroAnimationWrapper>
        {/*
         * Atmospheric layer — warm primary + cool secondary ambient.
         * Fades in at t=0. The light is in the space before the name arrives.
         */}
        <div
          data-hero="atmosphere"
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            background: [
              'radial-gradient(ellipse 90% 70% at 22% 18%, rgba(210, 185, 145, 0.16) 0%, transparent 68%)',
              'radial-gradient(ellipse 45% 38% at 75% 75%, rgba(120, 135, 200, 0.05) 0%, transparent 62%)',
            ].join(', '),
          }}
        />

        {/*
         * Light sweep — full-section horizontal brightness wash.
         * Fires once at t≈1.55, sweeps left→right in 0.7s. Felt, not seen.
         */}
        <div
          data-hero="light-sweep"
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(105deg, transparent 10%, rgba(215, 195, 160, 0.09) 50%, transparent 90%)',
            transform: 'translateX(-100%)',
            zIndex: 5,
          }}
        />

        {/* Content layer — parallaxes on scroll exit */}
        <div data-hero="content" className="grid-container relative z-content">
          <div className="col-span-12">

            {/*
             * Metadata strip — ordinal index + year / location.
             * Mono, ultra-small, tertiary color. Context before the name claims the space.
             * Fades in at t=0 alongside the atmosphere — it is part of the environment.
             */}
            <div
              data-hero="meta"
              className="flex items-center justify-between"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--color-text-tertiary)',
                marginBottom: '2.5rem',
              }}
            >
              <span>01</span>
              <span>2025 · Kelowna</span>
            </div>

            {/*
             * Name — two-line typographic composition.
             *
             * Weight 100 at clamp(4rem, 11.5vw, 14rem): the letterforms become spatial
             * objects at this scale. The mass is in the size, not the weight.
             * -0.02em tracking: tighter than default, still readable at small viewports.
             * lineHeight 0.88: names press together as a single typographic unit.
             *
             * Each line has its own overflow:hidden clip boundary.
             * The inner div starts at y: 110% and rises through the clip on reveal.
             */}
            <h1
              className="text-text-primary"
              style={{
                fontSize: 'clamp(4rem, 11.5vw, 14rem)',
                fontWeight: 100,
                lineHeight: 0.88,
                letterSpacing: '-0.02em',
                marginBottom: '2.25rem',
              }}
            >
              <div style={{ overflow: 'hidden' }}>
                <div data-hero="name-1" style={{ display: 'block' }}>Karan</div>
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div data-hero="name-2" style={{ display: 'block' }}>Sidhu</div>
              </div>
            </h1>

            {/*
             * Ruled separator — architectural divider between name and descriptor.
             * Draws left→right at t=1.1. The name is titled; the descriptor is captioned.
             */}
            <div
              data-hero="rule"
              aria-hidden="true"
              style={{
                height: '1px',
                backgroundColor: 'var(--color-border)',
                marginBottom: '2rem',
              }}
            />

            {/* Descriptor — single line, left-aligned */}
            <div data-hero="descriptor">
              <p
                className="text-text-secondary"
                style={{
                  fontSize: 'clamp(1.1rem, 1.4vw, 1.5rem)',
                  fontWeight: 300,
                  lineHeight: 1.35,
                  letterSpacing: '-0.01em',
                }}
              >
                Software engineer building intelligent systems.
              </p>
            </div>

          </div>
        </div>
      </HeroAnimationWrapper>

      {/* Scroll indicator — appears after sequence settles */}
      <div
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-content"
        aria-hidden="true"
      >
        <ScrollIndicator />
      </div>
    </section>
  );
}

'use client';

import { motion } from 'framer-motion';

/*
 * Site navigation — persistent identity anchor.
 *
 * TIMING:
 * Appears at delay: 3.5s — identical to the ScrollIndicator. Both arrive
 * together at the moment the hero sequence settles. Before that moment,
 * nothing competes with the hero. After it, the spatial container quietly
 * reveals itself: the indicator pointing down, the nav naming the structure.
 *
 * VISUAL REGISTER:
 * No background. No border. No shadow. No backdrop blur.
 * The grain overlay at z-950 sits above this (z-900), which means the nav
 * inherits the material texture of the environment rather than floating
 * over it as a discrete UI layer. This is intentional — the nav belongs
 * to the space, not to a separate chrome layer.
 *
 * Wordmark "KS" in monospace — archival, indexed, small. Links to top.
 * Section links at the same typographic register: mono, xs, slightly tracked,
 * tertiary color. They are escape hatches, not primary navigation.
 * Not uppercase — uppercase at this size reads as signage, not authorship.
 *
 * POINTER EVENTS:
 * The outer header is pointer-events-none so the transparent nav band
 * doesn't block scroll or clicks on page content behind it. Individual
 * interactive elements opt back in with pointer-events-auto. This means
 * the nav is only "present" as a UI element where it actually is one.
 *
 * HOVER:
 * text-tertiary → text-secondary over 200ms. Barely perceptible. That is
 * the correct register. A color flush or underline would compete.
 *
 * Client component: the initial fade animation requires the framer-motion
 * bundle, which is already loaded by ScrollIndicator and HeroAnimationWrapper.
 */

const NAV_LINKS = [
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
] as const;

export function SiteNav() {
  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-nav pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6, duration: 1.0, ease: 'easeOut' }}
    >
      <div className="grid-container" style={{ paddingTop: '1.5rem', paddingBottom: '1.5rem' }}>
        <div className="col-span-4 md:col-span-8 lg:col-span-12 flex items-center justify-between">

          {/*
           * Wordmark — identity anchor, links to top.
           * py-3 extends the touch target to ~44px without affecting visual size.
           */}
          <a
            href="#"
            className="pointer-events-auto text-mono text-text-tertiary hover:text-text-secondary transition-colors duration-200"
            aria-label="Karan Sidhu — return to top"
            style={{ lineHeight: 1, padding: '0.75rem 0' }}
          >
            KS
          </a>

          {/*
           * Section anchors — escape hatches, not primary wayfinding.
           * gap-6 on mobile (24px), gap-8 on desktop (32px).
           * py-3 on each link extends touch targets to ≥44px (WCAG 2.5.5).
           */}
          <nav
            className="flex items-center gap-6 md:gap-8"
            aria-label="Page sections"
          >
            {NAV_LINKS.map(({ label, href }) => (
              <a
                key={href}
                href={href}
                className="pointer-events-auto text-text-tertiary hover:text-text-secondary transition-colors duration-200"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--text-xs)',
                  letterSpacing: '0.04em',
                  lineHeight: 1,
                  padding: '0.75rem 0',
                }}
              >
                {label}
              </a>
            ))}
          </nav>

        </div>
      </div>
    </motion.header>
  );
}

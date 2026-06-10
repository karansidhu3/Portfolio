'use client';

import { useEffect, useRef } from 'react';

import { useReducedMotion } from '@/hooks/useReducedMotion';

interface ProjectEntryFrameProps {
  /** The h2 id — passed so the parent section's aria-labelledby works */
  headingId: string;
  /** 0-based index of this project */
  index: number;
  title: string;
  descriptor: string;
}

/*
 * Cinematic project entry frame — the authored moment before project content.
 *
 * PURPOSE:
 * This is not a header. It is a spatial threshold.
 *
 * 85vh of authored space grounded at the bottom by the project title.
 * The scene number indexes from the top-right. Nothing fills the middle —
 * the emptiness is the atmosphere. The title arrives into this space.
 *
 * MOTION — word-level vertical stagger:
 *
 * Each word is wrapped in an overflow:hidden container (the clip boundary).
 * The inner span starts at y: 110% — hidden below its clip boundary.
 * Words rise into view sequentially (stagger: 0.25s per word), each settling
 * with power4.out easing. The sequential arrival reads as "typed in" or
 * "assembled" — deliberate, weighted, each word landing on its own.
 *
 * GSAP PATTERN — why gsap.set() + gsap.to(), not from():
 *
 * gsap.from() on a paused ScrollTrigger timeline has ambiguous immediateRender
 * behavior: some tween positions apply the "from" state immediately, others
 * don't, depending on position in the timeline. This creates unreliable
 * initial states. The explicit pattern is:
 *   1. gsap.set() — set initial hidden state immediately and synchronously
 *   2. gsap.to() in a timeline — animate to final state on trigger
 * No ambiguity. No intermediate flash states.
 *
 * Trigger: 'top 60%' — fires when frame's top reaches 60% from viewport top.
 * At this point, the title (at the bottom of the 85vh frame) is still below
 * the viewport. The animation builds in the background. By the time the title
 * scrolls into view, the words are mid-animation — the user sees them still
 * rising into place as they look at the section. This creates the "assembled
 * while you watch" feel rather than a complete reveal that's already done.
 *
 * COMPOSITION:
 * Scene number (monospace, tertiary) — top right
 * Title words (text-display, 80px desktop) — bottom left, grounded
 * Descriptor (label, muted) — below title, annotation
 *
 * Reduced motion: all elements immediately visible at final state.
 * animatedRef guard: prevents React Strict Mode double-invoke from creating
 * two conflicting animations on the same elements.
 */

const STAGGER = 0.25;
const WORD_DURATION = 1.4;

export function ProjectEntryFrame({
  headingId,
  index,
  title,
  descriptor,
}: ProjectEntryFrameProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const ctxRef = useRef<{ revert: () => void } | null>(null);
  const animatedRef = useRef(false);
  const reducedMotion = useReducedMotion();

  const sceneNumber = String(index + 1).padStart(2, '0');
  const words = title.split(' ');

  /*
   * Descriptor fires after the last word finishes settling:
   *   0.2s (start offset)
   *   + (words.length - 1) × STAGGER (last word's delayed start)
   *   + WORD_DURATION (last word's animation duration)
   *   + 0.35s (breath between last word and descriptor)
   */
  const descriptorDelay = 0.2 + (words.length - 1) * STAGGER + WORD_DURATION + 0.35;

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame || reducedMotion) return;

    Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
      ([{ default: gsap }, { ScrollTrigger }]) => {
        if (!frameRef.current) return;

        // Guard: Strict Mode double-invoke protection.
        // Without this, both invocations resolve their dynamic imports (from cache)
        // and create two animations fighting over the same elements.
        if (animatedRef.current) return;
        animatedRef.current = true;

        gsap.registerPlugin(ScrollTrigger);

        const ctx = gsap.context(() => {
          const numberEl = frame.querySelector<HTMLElement>('[data-entry="number"]');
          const wordEls = frame.querySelectorAll<HTMLElement>('[data-entry-word]');
          const descriptorEl = frame.querySelector<HTMLElement>('[data-entry="descriptor"]');

          /*
           * Set initial hidden states explicitly via gsap.set().
           * This is reliable: synchronous, no ambiguity about when the state applies.
           * gsap.set() within a context is tracked and reverted on ctx.revert().
           *
           * Words at y: '110%' — below their overflow:hidden clip boundaries.
           * Number and descriptor at opacity: 0.
           */
          if (numberEl) gsap.set(numberEl, { opacity: 0 });
          if (wordEls.length > 0) gsap.set(wordEls, { y: '110%' });
          if (descriptorEl) gsap.set(descriptorEl, { opacity: 0 });

          /*
           * ScrollTrigger timeline — plays once on entry.
           *
           * Trigger: 'top 60%' fires when the frame's top edge reaches 60% from
           * the viewport's top. At that moment, the title (at the bottom of the
           * 85vh frame) is still below the viewport. The animation has time to
           * build before the title enters view. By the time the user can see the
           * title area, the words are in motion — the reveal happens while they watch.
           */
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: frame,
              start: 'top 60%',
              toggleActions: 'play none none none',
            },
          });

          // Scene number: fades in quietly alongside words
          if (numberEl) {
            tl.to(numberEl, { opacity: 1, duration: 0.6, ease: 'sine.out' }, 0);
          }

          /*
           * Title words: each rises from below its clip boundary.
           * gsap.to() is used (not from()) because initial state is already set
           * by gsap.set() above — no need for GSAP to manage initial state here.
           * Stagger creates the sequential arrival: each word 0.25s after the previous.
           */
          if (wordEls.length > 0) {
            tl.to(
              wordEls,
              {
                y: '0%',
                duration: WORD_DURATION,
                ease: 'power4.out',
                stagger: STAGGER,
              },
              0.2
            );
          }

          // Descriptor: appears after all words have settled
          if (descriptorEl) {
            tl.to(
              descriptorEl,
              { opacity: 1, duration: 0.5, ease: 'sine.out' },
              descriptorDelay
            );
          }

          /*
           * Watermark parallax — drifts upward at a different rate than the page.
           *
           * Trigger: full frame scroll (top enters bottom of viewport → bottom exits top).
           * The total scroll distance is ~185vh (85vh frame + 100vh viewport).
           * The watermark drifts 15vh over this distance — barely perceptible,
           * but it creates a sense that the space has depth and is in motion.
           *
           * scrub: 2 — follows scroll with 2s of lag. Smooth, organic drift.
           * No easing (ease: 'none') — pure linear scroll mapping for correct parallax.
           */
          const watermarkEl = frame.querySelector<HTMLElement>('[data-entry="watermark"]');
          if (watermarkEl) {
            gsap.to(watermarkEl, {
              y: '-15vh',
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
  }, [reducedMotion, descriptorDelay]);

  return (
    <div
      ref={frameRef}
      className="entry-frame"
      style={{
        height: '70vh',
        minHeight: '460px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative', // required: scopes the watermark container to this frame, not the parent section
      }}
    >
      {/*
       * Scene number watermark — the project's index at typographic scale.
       *
       * Very large (20vw, up to 22rem), very faint (opacity 0.03), right-aligned.
       * Positioned in the empty upper space where nothing else lives.
       *
       * SCROLL PARALLAX: GSAP drives it upward at a slightly different rate than
       * the page scroll. As the user moves through the 85vh entry space, the
       * number drifts from its natural position toward the top of the frame.
       * This creates a sense of depth and motion in the otherwise empty space —
       * the project's identity is present before the title assembles.
       *
       * The drift is subtle: ~15vh over a full frame scroll (85vh + 100vh viewport).
       * The user doesn't consciously track it; they sense that something is in motion.
       *
       * Related: it IS the project's identity. The visitor subliminally registers
       * "this is project 01" before the title rises into view.
       */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{ overflow: 'hidden' }}
      >
        <div
          data-entry="watermark"
          style={{
            position: 'absolute',
            right: '8%',
            top: '28%',
            fontSize: 'clamp(7rem, 20vw, 22rem)',
            fontWeight: 200,
            letterSpacing: '-0.06em',
            lineHeight: 1,
            color: 'var(--color-text-primary)',
            opacity: 0.055,
            userSelect: 'none',
          }}
        >
          {sceneNumber}
        </div>
      </div>

      {/* Scene number — top right, diagonal tension with title at bottom left */}
      <div className="grid-container w-full">
        <div className="col-span-4 md:col-span-8 lg:col-span-12 flex justify-end">
          <span
            data-entry="number"
            className="text-mono text-text-tertiary"
            aria-hidden="true"
          >
            {sceneNumber}
          </span>
        </div>
      </div>

      {/* Title + descriptor — grounded at the bottom */}
      <div className="grid-container w-full">
        <div className="col-span-4 md:col-span-6 lg:col-span-9">
          {/*
           * Each word: outer span = overflow:hidden clip boundary.
           *            inner span [data-entry-word] = what GSAP animates.
           *
           * overflow:hidden on the outer span clips the inner span's visual
           * position when it's at y: 110% (below the boundary). As GSAP
           * animates y → 0%, the word rises into view through the boundary.
           *
           * marginRight recreates word spacing (inline-block collapses whitespace).
           * The h2 reads as a complete string for screen readers — the word split
           * is purely a rendering concern, invisible to assistive technology.
           */}
          <h2
            id={headingId}
            className="text-display text-text-primary"
            style={{ marginBottom: '1rem' }}
          >
            {words.map((word, i) => (
              <span
                key={i}
                style={{
                  overflow: 'hidden',
                  display: 'inline-block',
                  marginRight: i < words.length - 1 ? '0.35em' : 0,
                  verticalAlign: 'bottom',
                }}
              >
                <span
                  data-entry-word
                  style={{ display: 'inline-block' }}
                >
                  {word}
                </span>
              </span>
            ))}
          </h2>
          <p data-entry="descriptor" className="text-label">
            {descriptor}
          </p>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/*
 * Scroll-reactive atmosphere — global environmental layer.
 *
 * The portfolio is a space you move through. As sections change, the
 * environmental lighting shifts: position, color temperature, intensity.
 * Each section has a specific atmospheric register. The controller
 * cross-fades between them as the visitor scrolls.
 *
 * ARCHITECTURE:
 *
 * Multiple absolutely-positioned layers, one per atmospheric state.
 * Layer 0 (hero) starts visible; all others start at opacity: 0.
 * As each section's trigger zone is crossed, the outgoing layer fades
 * out and the incoming layer fades in — simultaneously, scrubbed to scroll.
 *
 * Scrub: the transition is tied to scroll position, not clock time.
 * Scroll slowly: the atmosphere shifts slowly.
 * Scroll quickly: the atmosphere catches up on its own.
 * This creates the sense that the environment responds to navigation speed.
 *
 * STATES:
 *
 * Hero: warm amber, upper-left. Personal light. The name emerges into warmth.
 * Signal: cooler, more centered overhead. The statement is authoritative — the
 *   light becomes more even, less directional, as if a claim is being made.
 * Work (MarketMind): amber shifted slightly lower-right. Systems feel structured.
 * Career OS: subtle green ambient. Product thinking, organic judgment, less mechanical.
 * Timekeep: warm red-amber at different position. Archived weight; honest finish.
 * About: warm personal, upper-center. Returns to the register of the hero but
 *   quieter — the person, not the name.
 *
 * This layer renders ABOVE the base layout atmosphere (which handles vignette
 * and persistent warm/cool tension). These states are additive — they augment
 * the base rather than replace it.
 *
 * Reduced motion: no animations, all layers hidden except hero. The base
 * atmosphere in layout.tsx provides sufficient environmental quality without
 * scroll-reactive behavior.
 *
 * Performance: pure CSS gradients, opacity transitions, no JS per frame.
 * GSAP ScrollTrigger drives opacity via rAF — zero forced layouts.
 */

interface AtmosphereState {
  id: string;
  triggerSelector: string | null; // null = initial state (no trigger needed)
  gradient: string;
}

const ATMOSPHERE_STATES: AtmosphereState[] = [
  {
    id: 'hero',
    triggerSelector: null, // Initial state — no trigger
    gradient: [
      'radial-gradient(ellipse 82% 62% at 22% 18%, rgba(210, 185, 145, 0.16) 0%, transparent 68%)',
      'radial-gradient(ellipse 40% 35% at 76% 76%, rgba(120, 135, 200, 0.05) 0%, transparent 62%)',
    ].join(', '),
  },
  {
    id: 'signal',
    triggerSelector: '#signal',
    // Cooler, more centered — the declaration is authoritative, not personal
    gradient: [
      'radial-gradient(ellipse 68% 52% at 42% 26%, rgba(195, 178, 138, 0.08) 0%, transparent 65%)',
      'radial-gradient(ellipse 48% 38% at 60% 74%, rgba(145, 160, 215, 0.06) 0%, transparent 58%)',
    ].join(', '),
  },
  {
    id: 'work',
    triggerSelector: '#work',
    // MarketMind — warm amber, slightly lower and more right. Systems feel warm but structured.
    gradient: [
      'radial-gradient(ellipse 74% 54% at 28% 36%, rgba(210, 185, 145, 0.10) 0%, transparent 68%)',
      'radial-gradient(ellipse 38% 30% at 78% 62%, rgba(130, 145, 205, 0.04) 0%, transparent 55%)',
    ].join(', '),
  },
  {
    id: 'career-os',
    triggerSelector: '#project-career-os',
    // Career OS — subtle green tint. Product thinking, organic, less mechanical.
    gradient: [
      'radial-gradient(ellipse 70% 50% at 20% 32%, rgba(125, 195, 155, 0.12) 0%, transparent 65%)',
      'radial-gradient(ellipse 42% 32% at 74% 68%, rgba(120, 135, 200, 0.05) 0%, transparent 55%)',
    ].join(', '),
  },
  {
    id: 'timekeep',
    triggerSelector: '#project-timekeep',
    // Timekeep — warm red-amber, shifted position. Archived; honest finish.
    gradient: [
      'radial-gradient(ellipse 64% 50% at 32% 28%, rgba(210, 148, 126, 0.08) 0%, transparent 65%)',
      'radial-gradient(ellipse 38% 30% at 70% 72%, rgba(130, 145, 205, 0.04) 0%, transparent 55%)',
    ].join(', '),
  },
  {
    id: 'about',
    triggerSelector: '#about',
    // About — warm personal, upper-center. Returns to hero warmth, quieter.
    gradient: [
      'radial-gradient(ellipse 72% 58% at 36% 22%, rgba(210, 185, 145, 0.09) 0%, transparent 68%)',
      'radial-gradient(ellipse 38% 30% at 68% 74%, rgba(125, 140, 205, 0.04) 0%, transparent 58%)',
    ].join(', '),
  },
];

export function AtmosphereController() {
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const ctxRef = useRef<{ revert: () => void } | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    // Reduced motion: no scroll-reactive behavior.
    // The base atmosphere in layout.tsx is sufficient for a static experience.
    if (reducedMotion) return;

    Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger'),
    ]).then(([{ default: gsap }, { ScrollTrigger }]) => {
      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        // Ensure all non-initial layers start at opacity 0
        // (The initial hero layer starts at opacity 1 via inline style)
        ATMOSPHERE_STATES.forEach((state, i) => {
          const layer = layerRefs.current[i];
          if (!layer || i === 0) return;
          gsap.set(layer, { opacity: 0 });
        });

        // Create a cross-fade transition for each non-initial state
        ATMOSPHERE_STATES.forEach((state, i) => {
          if (!state.triggerSelector) return; // hero = initial, no trigger

          const triggerEl = document.querySelector(state.triggerSelector);
          if (!triggerEl) return; // safe fallback — section may not exist

          const incomingLayer = layerRefs.current[i];
          const outgoingLayer = layerRefs.current[i - 1] ?? null;
          if (!incomingLayer) return;

          /*
           * Scrubbed cross-fade timeline — very wide transition zone.
           *
           * The previous 80%→30% window was too short: the atmosphere changed
           * noticeably within a single scroll gesture. The user perceived a
           * clear "section boundary" as the light shifted.
           *
           * This window starts the transition when the section is still 1.3×
           * the viewport height below the current view — long before the user
           * can see the section's content. The cross-fade completes when the
           * section's top has scrolled 10% above the viewport.
           *
           * Total transition zone: 140% of viewport height.
           * At typical scroll speed, this takes ~3–4 seconds to traverse.
           *
           * scrub: 3 — 3s lag behind scroll. The atmosphere drifts, not snaps.
           * At fast scroll speed it catches up; at reading speed it leads slowly.
           */
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: triggerEl,
              start: 'top 130%',
              end: 'top -10%',
              scrub: 3,
            },
          });

          if (outgoingLayer) {
            tl.to(outgoingLayer, { opacity: 0, ease: 'none' }, 0);
          }

          tl.to(incomingLayer, { opacity: 1, ease: 'none' }, 0);
        });
      });

      ctxRef.current = ctx;
    });

    return () => {
      ctxRef.current?.revert();
    };
  }, [reducedMotion]);

  return (
    <>
      {ATMOSPHERE_STATES.map((state, i) => (
        <div
          key={state.id}
          ref={(el) => {
            layerRefs.current[i] = el;
          }}
          aria-hidden="true"
          style={{
            position: 'fixed',
            inset: 0,
            pointerEvents: 'none',
            background: state.gradient,
            // Hero (i === 0) starts visible; all others are hidden
            // until GSAP sets opacity: 0 in the effect
            opacity: i === 0 ? 1 : 0,
          }}
        />
      ))}
    </>
  );
}

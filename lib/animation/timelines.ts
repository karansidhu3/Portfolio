/*
 * GSAP timeline builders.
 *
 * Pre-built timeline sequences for complex multi-element animations.
 * These produce reusable animation functions that accept element refs.
 *
 * Requires GSAP to be available (client-side only).
 * Register ScrollTrigger before calling scroll-linked builders.
 */

import { GSAP_EASING } from '@/lib/animation/easing';
import { DURATION, SCROLL_TRIGGER, STAGGER } from '@/lib/constants/animation';

export { GSAP_EASING, DURATION, SCROLL_TRIGGER, STAGGER };

/*
 * Hero entry sequence.
 *
 * Animates: name → descriptor → subtext → scroll indicator
 * Timeline matches SITE_ARCHITECTURE.md Scene 1 animation spec.
 */
export function buildHeroEntryTimeline(gsap: typeof import('gsap').default) {
  const tl = gsap.timeline({ defaults: { ease: GSAP_EASING.cinematic } });

  return {
    play: (elements: {
      name: Element | null;
      descriptor: Element | null;
      subtext: Element | null;
      scrollIndicator: Element | null;
    }) => {
      if (!elements.name) return tl;

      tl.fromTo(
        elements.name,
        { opacity: 0, y: 32 },
        { opacity: 1, y: 0, duration: DURATION.scene }
      );

      if (elements.descriptor) {
        tl.fromTo(
          elements.descriptor,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: DURATION.component },
          '-=0.5'
        );
      }

      if (elements.subtext) {
        tl.fromTo(
          elements.subtext,
          { opacity: 0 },
          { opacity: 1, duration: DURATION.component },
          '-=0.2'
        );
      }

      if (elements.scrollIndicator) {
        tl.fromTo(
          elements.scrollIndicator,
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: DURATION.ui },
          '+=0.5'
        );
      }

      return tl;
    },
  };
}

/*
 * Staggered text line reveal.
 *
 * Animates multiple text line elements with clip-path wipe.
 * Each line is wrapped in overflow:hidden — inner element translates up.
 */
export function buildTextLineReveal(
  gsap: typeof import('gsap').default,
  lines: NodeListOf<Element> | Element[],
  options?: {
    stagger?: number;
    duration?: number;
    scrollTrigger?: { trigger: Element; start?: string };
  }
) {
  const {
    stagger = STAGGER.textLines,
    duration = DURATION.component,
    scrollTrigger,
  } = options ?? {};

  return gsap.fromTo(
    Array.from(lines),
    { y: '100%', opacity: 0 },
    {
      y: '0%',
      opacity: 1,
      duration,
      ease: GSAP_EASING.cinematic,
      stagger,
      ...(scrollTrigger && {
        scrollTrigger: {
          trigger: scrollTrigger.trigger,
          start: scrollTrigger.start ?? SCROLL_TRIGGER.standard,
          toggleActions: 'play none none reverse',
        },
      }),
    }
  );
}

/*
 * SVG path drawing animation for architecture diagrams.
 *
 * Animates strokeDashoffset from full length to 0 — the "drawing" effect.
 * Paths must have their stroke-dasharray and stroke-dashoffset initialized.
 */
export function buildDiagramDrawAnimation(
  gsap: typeof import('gsap').default,
  _ScrollTrigger: typeof import('gsap/ScrollTrigger').ScrollTrigger,
  container: Element
) {
  const paths = container.querySelectorAll('[data-diagram-path]');
  const nodes = container.querySelectorAll('[data-diagram-node]');

  paths.forEach((path) => {
    const svgPath = path as SVGPathElement;
    const length = svgPath.getTotalLength();
    svgPath.style.strokeDasharray = `${length}`;
    svgPath.style.strokeDashoffset = `${length}`;
  });

  gsap.set(nodes, { opacity: 0, scale: 0.8 });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: container,
      start: SCROLL_TRIGGER.emphasis,
      end: 'bottom 30%',
      scrub: 1.5,
    },
  });

  tl.to(paths, {
    strokeDashoffset: 0,
    duration: 2,
    ease: 'none',
    stagger: 0.3,
  });

  tl.to(
    nodes,
    {
      opacity: 1,
      scale: 1,
      duration: 0.5,
      ease: GSAP_EASING.cinematic,
      stagger: 0.15,
    },
    '-=1'
  );

  return tl;
}

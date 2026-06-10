'use client';

import { DependencyList, useEffect, useRef } from 'react';

import { useReducedMotion } from '@/hooks/useReducedMotion';

/*
 * Core GSAP animation hook.
 *
 * Wraps GSAP context API for React compatibility.
 * All ScrollTrigger instances created inside setupFn are scoped to
 * the returned ref's DOM subtree and cleaned up automatically on unmount.
 *
 * Usage:
 *   const ref = useScrollAnimation((gsap, ScrollTrigger) => {
 *     ScrollTrigger.create({ trigger: ref.current, ... });
 *     gsap.fromTo(ref.current, { opacity: 0 }, { opacity: 1, ... });
 *   });
 *   return <section ref={ref}>...</section>;
 *
 * The setup function only runs when animations are enabled (respects reduced-motion).
 */
export function useScrollAnimation<T extends HTMLElement = HTMLDivElement>(
  setupFn: (
    gsap: typeof import('gsap').default,
    ScrollTrigger: typeof import('gsap/ScrollTrigger').ScrollTrigger
  ) => void,
  deps: DependencyList = []
): React.RefObject<T | null> {
  const ref = useRef<T>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !ref.current) return;

    let ctx: ReturnType<typeof import('gsap').default.context> | undefined;

    // Dynamically import GSAP to avoid SSR issues and allow tree-shaking
    Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
      ([{ default: gsap }, { ScrollTrigger }]) => {
        gsap.registerPlugin(ScrollTrigger);

        ctx = gsap.context(() => {
          setupFn(gsap, ScrollTrigger);
        }, ref);
      }
    );

    return () => {
      ctx?.revert();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion, ...deps]);

  return ref;
}

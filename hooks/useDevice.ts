'use client';

import { useEffect, useState } from 'react';

import { useReducedMotion } from '@/hooks/useReducedMotion';
import { isTouchDevice } from '@/lib/utils/device';

/*
 * Returns true when the device is a touch device.
 * Safe for SSR — defaults to false until mounted.
 */
export function useIsTouch(): boolean {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch(isTouchDevice());
  }, []);

  return isTouch;
}

/*
 * Returns true when the viewport is mobile (< 768px).
 * Responds to resize events.
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();

    window.addEventListener('resize', check, { passive: true });
    return () => window.removeEventListener('resize', check);
  }, []);

  return isMobile;
}

/*
 * Aggregated animation config — the single place where capability detection
 * feeds into animation decisions.
 *
 * Components should import this hook rather than doing their own capability checks.
 */
export function useAnimationConfig() {
  const isTouch = useIsTouch();
  const isMobile = useIsMobile();
  const reducedMotion = useReducedMotion();

  return {
    /** Enable WebGL atmospheric background */
    enableWebGL: !isTouch && !isMobile && !reducedMotion,

    /** Enable parallax depth layers */
    enableParallax: !isTouch && !isMobile && !reducedMotion,

    /** Enable custom cursor (mouse devices only) */
    enableCustomCursor: !isTouch,

    /** Enable scroll-driven animations */
    enableScrollAnimations: !reducedMotion,

    /** Enable hover animations */
    enableHoverAnimations: !isTouch && !reducedMotion,

    /** Scale factor for animation distances on mobile */
    animationIntensity: isMobile ? 0.5 : 1.0,

    /** Stagger duration in seconds */
    staggerDuration: isMobile ? 0.05 : 0.08,
  };
}

/*
 * Device and capability detection utilities.
 * Used to gate WebGL, parallax, custom cursor, and animation intensity.
 *
 * All functions are safe to call in SSR contexts (return safe defaults
 * when window/navigator is unavailable).
 */

/** True if running in a browser (not SSR) */
export function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

/** True if the device supports touch (mobile/tablet) */
export function isTouchDevice(): boolean {
  if (!isBrowser()) return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

/** True if viewport is considered mobile (< 768px) */
export function isMobileViewport(): boolean {
  if (!isBrowser()) return false;
  return window.innerWidth < 768;
}

/** True if the device likely has a GPU capable of WebGL */
export function hasWebGLSupport(): boolean {
  if (!isBrowser()) return false;
  try {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
  } catch {
    return false;
  }
}

/** True if user prefers reduced motion */
export function prefersReducedMotion(): boolean {
  if (!isBrowser()) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** True if device pixel ratio is high (retina) */
export function isRetina(): boolean {
  if (!isBrowser()) return false;
  return window.devicePixelRatio > 1;
}

/** Get safe device pixel ratio (capped at 2 for performance) */
export function getSafePixelRatio(): number {
  if (!isBrowser()) return 1;
  return Math.min(window.devicePixelRatio, 2);
}

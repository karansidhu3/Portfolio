'use client';

import { useEffect, useState } from 'react';

/*
 * Detects the user's reduced-motion preference.
 *
 * When true, all animations should be disabled or reduced to
 * instant opacity-only transitions (< 150ms).
 *
 * The animation system checks this at the root level to avoid
 * per-component checks scattered throughout the codebase.
 */
export function useReducedMotion(): boolean {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(query.matches);

    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    query.addEventListener('change', handler);
    return () => query.removeEventListener('change', handler);
  }, []);

  return reducedMotion;
}

'use client';

import dynamic from 'next/dynamic';

import { useAnimationConfig } from '@/hooks/useDevice';

/*
 * Atmospheric background — optional WebGL enhancement.
 *
 * Degrades gracefully to CSS on mobile, touch devices, and reduced-motion.
 * Never SSR'd. Only loads the heavy WebGL component when capability is confirmed.
 *
 * Phase 5 implementation: WebGL shader to be built and evaluated per
 * the EXPERIMENTS.md Tier 2 (2.2) protocol before committing to full integration.
 *
 * The CSS fallback is the baseline — it must look intentional on its own.
 */

// Lazy-loaded to avoid including Three.js in the initial bundle
const WebGLAtmosphere = dynamic(() => import('./WebGLAtmosphereInner'), {
  ssr: false,
  loading: () => null,
});

interface AtmosphericBackgroundProps {
  /** Subtle color tint for this section's atmosphere */
  tintColor?: string;
  className?: string;
}

export function AtmosphericBackground({
  tintColor = 'transparent',
  className = '',
}: AtmosphericBackgroundProps) {
  const { enableWebGL } = useAnimationConfig();

  if (enableWebGL) {
    return <WebGLAtmosphere tintColor={tintColor} className={className} />;
  }

  // CSS fallback — must look intentional on its own
  return (
    <div
      className={`absolute inset-0 ${className}`}
      style={{ backgroundColor: tintColor }}
      aria-hidden="true"
    />
  );
}

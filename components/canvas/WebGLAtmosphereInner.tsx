'use client';

/*
 * WebGL atmospheric background — inner implementation.
 * Only rendered when WebGL is confirmed available and appropriate.
 *
 * Phase 5: This file is a placeholder for the actual WebGL implementation.
 * The shader should:
 *   - Use simplex/perlin noise at very low frequency
 *   - Very low intensity (barely visible — felt, not seen)
 *   - GPU cost must stay under 1ms/frame (< 6% of 16.67ms budget)
 *   - Must pass the 30-second viewing test: looks good when a visitor
 *     sits on a section for 30 seconds
 *
 * Build the shader in isolation first. Evaluate before integrating.
 * See EXPERIMENTS.md Tier 2 (2.2) for the evaluation protocol.
 */

interface WebGLAtmosphereInnerProps {
  tintColor: string;
  className?: string;
}

export default function WebGLAtmosphereInner({
  tintColor,
  className = '',
}: WebGLAtmosphereInnerProps) {
  // Phase 5: Replace with actual Three.js / R3F implementation
  // For now, renders the CSS fallback
  return (
    <div
      className={`absolute inset-0 ${className}`}
      style={{ backgroundColor: tintColor }}
      aria-hidden="true"
    />
  );
}

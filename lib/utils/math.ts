/*
 * Math utilities for animations and spatial calculations.
 * These are the core building blocks for all scroll-driven and physics-based effects.
 */

/** Linear interpolation between a and b by t (0–1) */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** Clamp value between min and max */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Map a value from one range to another */
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  return ((value - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin;
}

/** Map range and clamp to output range */
export function mapRangeClamped(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  return clamp(mapRange(value, inMin, inMax, outMin, outMax), outMin, outMax);
}

/** Smooth damp — framerate-independent lerp (use in RAF loops) */
export function damp(a: number, b: number, lambda: number, dt: number): number {
  return lerp(a, b, 1 - Math.exp(-lambda * dt));
}

/** Convert degrees to radians */
export function degToRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/** Euclidean distance between two 2D points */
export function distance(x1: number, y1: number, x2: number, y2: number): number {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

/** Normalize a value within a range to 0–1 */
export function normalize(value: number, min: number, max: number): number {
  return (value - min) / (max - min);
}

/** Round to n decimal places */
export function round(value: number, decimals: number = 2): number {
  return Math.round(value * 10 ** decimals) / 10 ** decimals;
}

/** Get progress (0–1) of a value within a range, clamped */
export function getProgress(value: number, start: number, end: number): number {
  return clamp((value - start) / (end - start), 0, 1);
}

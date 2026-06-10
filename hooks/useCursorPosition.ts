'use client';

import { useEffect, useRef, useState } from 'react';

import { damp } from '@/lib/utils/math';
import { rafLoop } from '@/lib/utils/timing';

interface CursorPosition {
  x: number;
  y: number;
}

/*
 * Tracks raw cursor position.
 * Updated on mousemove.
 */
export function useRawCursorPosition(): CursorPosition {
  const [position, setPosition] = useState<CursorPosition>({ x: 0, y: 0 });

  useEffect(() => {
    const handler = (e: MouseEvent) => setPosition({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handler, { passive: true });
    return () => window.removeEventListener('mousemove', handler);
  }, []);

  return position;
}

/*
 * Smoothed cursor position using RAF-based lerp.
 * Used for the custom cursor follower — prevents harsh snapping.
 *
 * lambda: lerp speed (higher = faster follow, lower = more lag)
 */
export function useSmoothedCursorPosition(lambda: number = 12): CursorPosition {
  const target = useRef<CursorPosition>({ x: 0, y: 0 });
  const [smoothed, setSmoothed] = useState<CursorPosition>({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMove, { passive: true });

    const cancel = rafLoop((dt) => {
      setSmoothed((prev) => ({
        x: damp(prev.x, target.current.x, lambda, dt),
        y: damp(prev.y, target.current.y, lambda, dt),
      }));
    });

    return () => {
      window.removeEventListener('mousemove', handleMove);
      cancel();
    };
  }, [lambda]);

  return smoothed;
}

/*
 * Magnetic effect: returns offset values for an element to attract toward cursor.
 * Used for primary CTAs.
 *
 * Pass a ref to the element. Returns { x, y } offsets to apply as transforms.
 */
export function useMagneticEffect(
  elementRef: React.RefObject<HTMLElement | null>,
  options?: { radius?: number; strength?: number }
) {
  const { radius = 80, strength = 0.3 } = options ?? {};
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < radius) {
        const magnetStrength = ((radius - distance) / radius) * strength;
        setOffset({
          x: dx * magnetStrength,
          y: dy * magnetStrength,
        });
      } else {
        setOffset({ x: 0, y: 0 });
      }
    };

    const handleLeave = () => setOffset({ x: 0, y: 0 });

    window.addEventListener('mousemove', handleMove, { passive: true });
    element.addEventListener('mouseleave', handleLeave);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      element.removeEventListener('mouseleave', handleLeave);
    };
  }, [elementRef, radius, strength]);

  return offset;
}

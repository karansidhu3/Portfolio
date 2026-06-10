'use client';

import { useEffect, useRef, useState } from 'react';

import { clamp } from '@/lib/utils/math';

/*
 * Tracks scroll progress (0–1) for the full document.
 * Used for reading progress indicators and global scroll-dependent state.
 */
export function useScrollProgress(): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? clamp(scrollTop / docHeight, 0, 1) : 0);
    };

    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  return progress;
}

/*
 * Tracks whether the page has been scrolled past a threshold.
 * Used for showing/hiding the navigation.
 */
export function useScrolledPast(threshold: number): boolean {
  const [scrolledPast, setScrolledPast] = useState(false);

  useEffect(() => {
    const update = () => setScrolledPast(window.scrollY > threshold);
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, [threshold]);

  return scrolledPast;
}

/*
 * Tracks scroll velocity (px/sec).
 * Used for scroll-velocity-reactive atmosphere experiments.
 */
export function useScrollVelocity(): number {
  const [velocity, setVelocity] = useState(0);
  const lastScrollY = useRef(0);
  const lastTime = useRef(Date.now());
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const update = () => {
      const now = Date.now();
      const dt = now - lastTime.current;
      const dy = window.scrollY - lastScrollY.current;
      const v = dt > 0 ? (dy / dt) * 1000 : 0; // px/sec

      setVelocity(v);
      lastScrollY.current = window.scrollY;
      lastTime.current = now;

      // Decay velocity to 0 when scrolling stops
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setVelocity(0), 150);
    };

    window.addEventListener('scroll', update, { passive: true });
    return () => {
      window.removeEventListener('scroll', update);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return velocity;
}

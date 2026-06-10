'use client';

import { useEffect, useRef } from 'react';

import { useReducedMotion } from '@/hooks/useReducedMotion';

/*
 * FlowPath — continuous visual guide system with a drawing cursor dot.
 *
 * A viewport-fixed canvas renders two layers:
 *   1. A Catmull-Rom spline — the path that's been "drawn" through the document
 *   2. A glowing dot at a fixed viewport position — the drawing cursor
 *
 * The dot pulses with a slow autonomous animation (2.5s period) and
 * brightens when the user is actively scrolling, giving the impression
 * that it's actively tracing the path through the experience.
 *
 * RAF loop: always-on but idles at ~24fps for the dot pulse.
 * During active scroll: full 60fps line + dot redraw.
 */

const KEYFRAMES: [number, number][] = [
  [0.000, 0.38],
  [0.045, 0.22],
  [0.090, 0.50],
  [0.120, 0.72],
  [0.160, 0.54],
  [0.185, 0.25],
  [0.235, 0.42],
  [0.295, 0.60],
  [0.380, 0.73],
  [0.435, 0.42],
  [0.475, 0.28],
  [0.555, 0.64],
  [0.605, 0.45],
  [0.645, 0.30],
  [0.725, 0.62],
  [0.775, 0.40],
  [0.830, 0.36],
  [0.875, 0.55],
  [0.925, 0.46],
  [0.965, 0.54],
  [1.000, 0.50],
];

function catmullRomX(t: number): number {
  if (t <= KEYFRAMES[0][0]) return KEYFRAMES[0][1];
  const last = KEYFRAMES[KEYFRAMES.length - 1];
  if (t >= last[0]) return last[1];

  let i = 1;
  while (i < KEYFRAMES.length - 1 && KEYFRAMES[i][0] < t) i++;

  const i0 = Math.max(i - 2, 0);
  const i1 = i - 1;
  const i2 = i;
  const i3 = Math.min(i + 1, KEYFRAMES.length - 1);

  const span = KEYFRAMES[i2][0] - KEYFRAMES[i1][0];
  const st = span > 0 ? Math.max(0, Math.min(1, (t - KEYFRAMES[i1][0]) / span)) : 0;
  const st2 = st * st;
  const st3 = st2 * st;

  return 0.5 * (
    2 * KEYFRAMES[i1][1] +
    (-KEYFRAMES[i0][1] + KEYFRAMES[i2][1]) * st +
    (2 * KEYFRAMES[i0][1] - 5 * KEYFRAMES[i1][1] + 4 * KEYFRAMES[i2][1] - KEYFRAMES[i3][1]) * st2 +
    (-KEYFRAMES[i0][1] + 3 * KEYFRAMES[i1][1] - 3 * KEYFRAMES[i2][1] + KEYFRAMES[i3][1]) * st3
  );
}

function smoothstep(x: number): number {
  const c = Math.max(0, Math.min(1, x));
  return c * c * (3 - 2 * c);
}

// The dot sits 62% down the viewport — the "drawing cursor" position.
// This means more line is visible above the dot (already drawn) than below (upcoming).
const DOT_Y_FRAC = 0.62;
const FADE_ZONE = 0.10;
// When idle, redraw at ~24fps — just enough for the dot pulse to look smooth
const IDLE_INTERVAL = 1000 / 24;

export function FlowPath() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const velocityRef = useRef(0);
  const prevScrollYRef = useRef(0);
  const prevTimeRef = useRef(0);
  const sectionYsRef = useRef<number[]>([]);
  const lastIdleDrawRef = useRef(0);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const setSize = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const cacheSections = () => {
      sectionYsRef.current = Array.from(
        document.querySelectorAll('section[id]')
      ).map(el => (el as HTMLElement).offsetTop);
    };

    const draw = (time: number) => {
      const scrollY = window.scrollY;
      const docH = Math.max(document.documentElement.scrollHeight, 1);
      const viewH = window.innerHeight;
      const viewW = window.innerWidth;
      const mobile = viewW < 768;

      ctx.clearRect(0, 0, viewW, viewH);

      const tStart = scrollY / docH;
      const tEnd = (scrollY + viewH) / docH;
      const ampMult = mobile ? 0.50 : 1.0;
      const STEPS = mobile ? 60 : 100;

      const sYs = sectionYsRef.current;
      const velMag = Math.min(Math.abs(velocityRef.current), 1.0);

      // ── Line ──────────────────────────────────────────────────────────
      ctx.save();
      ctx.lineWidth = mobile ? 0.5 : 0.75;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      let px: number | null = null;
      let py: number | null = null;

      for (let s = 0; s <= STEPS; s++) {
        const frac = s / STEPS;
        const t = tStart + frac * (tEnd - tStart);
        const rawX = catmullRomX(t);
        const x = (0.5 + (rawX - 0.5) * ampMult) * viewW;
        const y = frac * viewH;

        const edgeFade = frac < FADE_ZONE
          ? smoothstep(frac / FADE_ZONE)
          : frac > 1 - FADE_ZONE
            ? smoothstep((1 - frac) / FADE_ZONE)
            : 1;

        const absY = scrollY + y;
        let minDist = 99999;
        for (const sy of sYs) {
          const d = Math.abs(absY - sy);
          if (d < minDist) minDist = d;
        }
        const proximity = Math.exp(-((minDist / 220) ** 2));

        const baseOp = mobile ? 0.055 : 0.075;
        const sectionOp = mobile ? 0.065 : 0.105;
        const velOp = velMag * 0.028;
        const opacity = (baseOp + sectionOp * proximity + velOp) * edgeFade;

        if (px !== null && py !== null) {
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(x, y);
          ctx.strokeStyle = `rgba(200,184,154,${opacity.toFixed(3)})`;
          ctx.stroke();
        }
        px = x;
        py = y;
      }

      ctx.restore();

      // ── Dot ───────────────────────────────────────────────────────────
      const tDot = Math.max(0, Math.min(1, (scrollY + viewH * DOT_Y_FRAC) / docH));
      const dotX = (0.5 + (catmullRomX(tDot) - 0.5) * ampMult) * viewW;
      const dotY = DOT_Y_FRAC * viewH;

      // Autonomous pulse: 2.5s period sine wave, range 0.6–1.0
      const pulse = 0.7 + 0.3 * Math.sin(time * 0.00125 * Math.PI);
      // Brighten while scrolling — snaps up fast, decays with velocity
      const activeBoost = 0.45 + 0.55 * Math.min(velMag * 1.5, 1.0);
      const dotIntensity = pulse * activeBoost;

      ctx.save();

      // Outermost halo — radial gradient, wide and nearly invisible
      const haloR = mobile ? 10 : 18;
      const haloGrad = ctx.createRadialGradient(dotX, dotY, 0, dotX, dotY, haloR);
      haloGrad.addColorStop(0, `rgba(200,184,154,${(0.12 * dotIntensity).toFixed(3)})`);
      haloGrad.addColorStop(0.5, `rgba(200,184,154,${(0.05 * dotIntensity).toFixed(3)})`);
      haloGrad.addColorStop(1, 'rgba(200,184,154,0)');
      ctx.beginPath();
      ctx.arc(dotX, dotY, haloR, 0, Math.PI * 2);
      ctx.fillStyle = haloGrad;
      ctx.fill();

      // Glow ring — shadowBlur creates the bloom
      const glowR = mobile ? 3.5 : 5;
      ctx.shadowColor = `rgba(200,184,154,${(0.6 * dotIntensity).toFixed(3)})`;
      ctx.shadowBlur = mobile ? 10 : 16;
      ctx.beginPath();
      ctx.arc(dotX, dotY, glowR, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200,184,154,${(0.70 * dotIntensity).toFixed(3)})`;
      ctx.fill();

      // Bright core — crisp center point, slightly cooler white
      ctx.shadowBlur = 0;
      const coreR = mobile ? 1.5 : 2;
      ctx.beginPath();
      ctx.arc(dotX, dotY, coreR, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(228,216,196,${Math.min(1, 0.95 * dotIntensity).toFixed(3)})`;
      ctx.fill();

      ctx.restore();
    };

    // Always-on loop — 60fps during scroll, ~24fps idle for the dot pulse
    const tick = (time: number) => {
      const isActive = Math.abs(velocityRef.current) > 0.0003;

      if (isActive) {
        velocityRef.current *= 0.88;
        draw(time);
      } else if (time - lastIdleDrawRef.current >= IDLE_INTERVAL) {
        velocityRef.current = 0;
        draw(time);
        lastIdleDrawRef.current = time;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    const onScroll = () => {
      const now = performance.now();
      const dt = Math.max(now - prevTimeRef.current, 1);
      velocityRef.current = (window.scrollY - prevScrollYRef.current) / dt;
      prevScrollYRef.current = window.scrollY;
      prevTimeRef.current = now;
    };

    const onResize = () => {
      setSize();
      cacheSections();
    };

    setSize();
    cacheSections();
    rafRef.current = requestAnimationFrame(tick);

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, [reducedMotion]);

  if (reducedMotion) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 3,
      }}
    />
  );
}

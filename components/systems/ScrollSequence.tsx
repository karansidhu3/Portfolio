'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

import { useReducedMotion } from '@/hooks/useReducedMotion';

export interface ScrollSequenceProps {
  frames: string[];
  frameHeight?: number;
  captions?: string[];
  displayHeight?: string;
  label?: string;
}

function PlaceholderReel({ displayHeight }: { displayHeight: string }) {
  return (
    <div
      style={{
        height: displayHeight,
        backgroundColor: 'var(--color-bg-secondary)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        borderTop: '1px solid var(--color-border)',
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.65rem',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'var(--color-text-tertiary)',
        }}
      >
        Reel — frames pending
      </div>
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.6rem',
          letterSpacing: '0.06em',
          color: 'var(--color-text-tertiary)',
          opacity: 0.5,
        }}
      >
        Add JPG frames to activate sequence
      </div>
    </div>
  );
}

/*
 * ScrollSequence — canvas-based scroll-driven image sequence.
 *
 * Internal scroll container captures scroll independently of the page.
 * Each frameHeight px of scroll advances one frame.
 * Canvas uses cover-fill drawImage for any aspect ratio.
 * All DOM overlay updates bypass React state for zero-jank performance.
 *
 * Property controls:
 *   frames        — array of image paths (up to 65)
 *   frameHeight   — px of scroll per frame (default: 60)
 *   captions      — optional per-frame captions
 *   displayHeight — CSS height of the visible window (default: '80vh')
 *   label         — ARIA label for the sequence region
 */
export function ScrollSequence({
  frames,
  frameHeight = 60,
  captions,
  displayHeight = '80vh',
  label = 'Project reel',
}: ScrollSequenceProps) {
  const outerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const frameCounterRef = useRef<HTMLSpanElement>(null);
  const captionRef = useRef<HTMLSpanElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const frameIndexRef = useRef(0);
  const rafRef = useRef<number>(0);
  const loadedCountRef = useRef(0);

  const [loadProgress, setLoadProgress] = useState(0);
  const [allLoaded, setAllLoaded] = useState(false);
  const [containerH, setContainerH] = useState(0);

  const reducedMotion = useReducedMotion();
  const frameCount = frames.length;

  // Cover-fill drawImage — same math as CSS object-fit: cover
  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    const img = imagesRef.current[index];
    if (!canvas || !img || !img.complete || img.naturalWidth === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    const imageAspect = iw / ih;
    const canvasAspect = cw / ch;
    let sx = 0, sy = 0, sw = iw, sh = ih;

    if (imageAspect > canvasAspect) {
      sw = ih * canvasAspect;
      sx = (iw - sw) / 2;
    } else {
      sh = iw / canvasAspect;
      sy = (ih - sh) / 2;
    }

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cw, ch);
  }, []);

  // Preload all frames in parallel
  useEffect(() => {
    if (frameCount === 0) return;

    const images: HTMLImageElement[] = new Array(frameCount);
    imagesRef.current = images;
    loadedCountRef.current = 0;
    setAllLoaded(false);
    setLoadProgress(0);

    frames.forEach((src, i) => {
      const img = new window.Image();
      img.onload = () => {
        loadedCountRef.current++;
        setLoadProgress(loadedCountRef.current / frameCount);
        if (i === 0 && frameIndexRef.current === 0) drawFrame(0);
        if (loadedCountRef.current === frameCount) setAllLoaded(true);
      };
      img.onerror = () => {
        loadedCountRef.current++;
        if (loadedCountRef.current === frameCount) {
          setAllLoaded(true);
          setLoadProgress(1);
        }
      };
      img.src = src;
      images[i] = img;
    });
  }, [frames, frameCount, drawFrame]);

  // ResizeObserver — sync canvas buffer dimensions to display size
  useEffect(() => {
    const canvas = canvasRef.current;
    const outer = outerRef.current;
    if (!canvas || !outer) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        const dpr = window.devicePixelRatio || 1;
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        setContainerH(height);
        drawFrame(frameIndexRef.current);
      }
    });

    observer.observe(outer);
    return () => observer.disconnect();
  }, [drawFrame]);

  // Scroll handler — RAF-batched, all DOM updates bypass React state
  useEffect(() => {
    const scrollEl = scrollContainerRef.current;
    if (!scrollEl || frameCount === 0 || reducedMotion) return;

    const onScroll = () => {
      const scrollTop = scrollEl.scrollTop;
      const newIndex = Math.min(Math.floor(scrollTop / frameHeight), frameCount - 1);

      // Dismiss scroll hint on first interaction
      if (scrollTop > 2 && scrollHintRef.current) {
        scrollHintRef.current.style.opacity = '0';
      }

      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        if (newIndex === frameIndexRef.current) return;
        frameIndexRef.current = newIndex;

        drawFrame(newIndex);

        if (captionRef.current && captions?.[newIndex] !== undefined) {
          captionRef.current.textContent = captions[newIndex];
        }

        if (frameCounterRef.current) {
          const n = String(newIndex + 1).padStart(2, '0');
          const total = String(frameCount).padStart(2, '0');
          frameCounterRef.current.textContent = `${n} / ${total}`;
        }

        if (progressBarRef.current && frameCount > 1) {
          const pct = (newIndex / (frameCount - 1)) * 100;
          progressBarRef.current.style.height = `${pct}%`;
        }
      });
    };

    scrollEl.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      scrollEl.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, [frames, frameCount, frameHeight, captions, drawFrame, reducedMotion]);

  if (frameCount === 0) {
    return <PlaceholderReel displayHeight={displayHeight} />;
  }

  // Track height: enough scroll distance for all frames + the container height
  // so the last frame has time to settle before the sticky element unsticks.
  const trackHeight = containerH > 0
    ? frameCount * frameHeight + containerH
    : frameCount * frameHeight + 600;

  return (
    <div
      ref={outerRef}
      style={{ position: 'relative', height: displayHeight, overflow: 'hidden' }}
      role="img"
      aria-label={label}
    >
      {/* Internal scroll container — captures scroll independently of the page */}
      <div
        ref={scrollContainerRef}
        className="hide-scrollbar"
        style={{
          position: 'absolute',
          inset: 0,
          overflowY: reducedMotion ? 'hidden' : 'scroll',
          scrollbarWidth: 'none',
        }}
      >
        {/* Scroll track — height encodes total scrub distance */}
        <div style={{ height: trackHeight }}>
          {/* Sticky canvas mount — fills the visible window */}
          <div style={{ position: 'sticky', top: 0, height: displayHeight }}>

            <canvas
              ref={canvasRef}
              style={{ display: 'block', width: '100%', height: '100%' }}
              aria-hidden="true"
            />

            {/* Cinematic vignette — edge darkening like a film frame */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                inset: 0,
                pointerEvents: 'none',
                background: [
                  'radial-gradient(ellipse 130% 120% at 50% 50%, transparent 45%, rgba(7,7,12,0.6) 100%)',
                  'linear-gradient(to bottom, rgba(7,7,12,0.35) 0%, transparent 14%, transparent 86%, rgba(7,7,12,0.45) 100%)',
                ].join(', '),
              }}
            />

            {/* Loading progress bar — bottom edge, accent color */}
            {!allLoaded && (
              <div
                aria-label={`Loading: ${Math.round(loadProgress * 100)}%`}
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  height: '1px',
                  backgroundColor: 'var(--color-accent)',
                  width: `${loadProgress * 100}%`,
                  transition: 'width 0.12s ease',
                  opacity: 0.85,
                }}
              />
            )}

            {/* Vertical scrub progress — right edge 1px */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                right: 0,
                top: 0,
                width: '1px',
                height: '100%',
                backgroundColor: 'var(--color-border)',
              }}
            >
              <div
                ref={progressBarRef}
                style={{
                  width: '100%',
                  height: '0%',
                  backgroundColor: 'var(--color-accent)',
                  opacity: 0.7,
                }}
              />
            </div>

            {/* Frame counter — bottom right */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                bottom: '1.5rem',
                right: '1.75rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6rem',
                letterSpacing: '0.1em',
                color: 'var(--color-text-tertiary)',
                opacity: 0.7,
              }}
            >
              <span ref={frameCounterRef}>
                01 / {String(frameCount).padStart(2, '0')}
              </span>
            </div>

            {/* Per-frame caption — bottom left */}
            {captions && captions.length > 0 && (
              <div
                style={{
                  position: 'absolute',
                  bottom: '1.5rem',
                  left: '1.75rem',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6rem',
                  letterSpacing: '0.08em',
                  color: 'var(--color-text-tertiary)',
                  maxWidth: '40ch',
                  opacity: 0.7,
                }}
              >
                <span ref={captionRef}>{captions[0]}</span>
              </div>
            )}

            {/* Scroll hint — center bottom, fades on first scroll */}
            {!reducedMotion && (
              <div
                ref={scrollHintRef}
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  bottom: '2.75rem',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--color-text-tertiary)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'opacity 0.5s ease',
                  opacity: allLoaded ? 0.6 : 0,
                  pointerEvents: 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                <span>Scroll</span>
                <svg width="8" height="14" viewBox="0 0 8 14" fill="none" aria-hidden="true">
                  <path
                    d="M4 1v12M1 9l3 4 3-4"
                    stroke="currentColor"
                    strokeWidth="0.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

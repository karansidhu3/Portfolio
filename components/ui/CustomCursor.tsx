'use client';

import { useEffect, useState } from 'react';

import { useIsTouch } from '@/hooks/useDevice';
import { useSmoothedCursorPosition } from '@/hooks/useCursorPosition';
import { CURSOR } from '@/lib/constants/animation';

type CursorState = 'default' | 'hover' | 'text' | 'project';

/*
 * Custom cursor — context-aware, desktop only.
 *
 * States from EXPERIMENTS.md Tier 1 (1.6):
 *   default: small dot (8px)
 *   hover:   ring (24px) indicating interaction zone
 *   text:    fades out
 *   project: show "View" affordance
 *
 * Disabled on touch devices.
 * mix-blend-mode: difference creates the inversion effect on hover.
 */
export function CustomCursor() {
  const isTouch = useIsTouch();
  const position = useSmoothedCursorPosition(14);
  const [state, setCursorState] = useState<CursorState>('default');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isTouch) return;

    const handleEnter = () => setIsVisible(true);
    const handleLeave = () => setIsVisible(false);
    const handleMove = () => setIsVisible(true);

    // Detect what the cursor is hovering over
    const handleOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive =
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('[data-cursor="hover"]') !== null;
      const isProjectArea = target.closest('[data-cursor="project"]') !== null;
      const isText =
        target.tagName === 'P' ||
        target.tagName === 'SPAN' ||
        (target.tagName === 'H1' && !isInteractive) ||
        (target.tagName === 'H2' && !isInteractive);

      if (isProjectArea) setCursorState('project');
      else if (isInteractive) setCursorState('hover');
      else if (isText) setCursorState('text');
      else setCursorState('default');
    };

    document.addEventListener('mouseenter', handleEnter);
    document.addEventListener('mouseleave', handleLeave);
    document.addEventListener('mousemove', handleMove, { passive: true });
    document.addEventListener('mouseover', handleOver, { passive: true });

    return () => {
      document.removeEventListener('mouseenter', handleEnter);
      document.removeEventListener('mouseleave', handleLeave);
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseover', handleOver);
    };
  }, [isTouch]);

  if (isTouch) return null;

  const size = state === 'hover' || state === 'project' ? CURSOR.hoverSize : CURSOR.defaultSize;
  const opacity = state === 'text' ? 0 : isVisible ? 1 : 0;

  return (
    <>
      {/* Hide system cursor */}
      <style>{`* { cursor: none !important; }`}</style>

      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          left: position.x,
          top: position.y,
          width: size,
          height: size,
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'var(--color-text-primary)',
          mixBlendMode: CURSOR.blendMode,
          opacity,
          transition: `width 200ms ease, height 200ms ease, opacity 150ms ease`,
          pointerEvents: 'none',
          zIndex: 'var(--z-tooltip)',
          willChange: 'transform',
        }}
      />
    </>
  );
}

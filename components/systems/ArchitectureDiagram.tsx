'use client';


import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface ArchitectureDiagramProps {
  /** SVG file path, relative to /public */
  svgPath: string;
  /** Alt text describing what the diagram shows */
  description: string;
  className?: string;
}

/*
 * SVG system diagram with scroll-driven draw animation.
 *
 * Paths with data-diagram-path attribute are animated via stroke-dashoffset.
 * Nodes with data-diagram-node attribute appear after their connecting paths.
 *
 * SVG authoring requirements:
 *   - Paths must have stroke-dasharray set to their full length
 *   - Drawing order must be logical (follows system flow)
 *   - Max 15 paths, 10 nodes (performance constraint)
 *   - Paths must be individual elements (not merged/compound)
 *
 * Phase 4 implementation: SVGs need to be authored in Figma/Illustrator
 * with the animation data attributes before this component is meaningful.
 *
 * For now, renders an accessible placeholder.
 */
export function ArchitectureDiagram({
  svgPath: _svgPath,
  description,
  className = '',
}: ArchitectureDiagramProps) {
  const containerRef = useScrollAnimation<HTMLDivElement>(
    (gsap, _ScrollTrigger) => {
      const container = containerRef.current;
      if (!container) return;

      const paths = container.querySelectorAll('[data-diagram-path]');
      const nodes = container.querySelectorAll('[data-diagram-node]');

      if (paths.length === 0) return;

      // Initialize stroke-dasharray for each path
      paths.forEach((path) => {
        const pathEl = path as SVGPathElement;
        try {
          const length = pathEl.getTotalLength();
          pathEl.style.strokeDasharray = `${length}`;
          pathEl.style.strokeDashoffset = `${length}`;
        } catch {
          // getTotalLength not available for all SVG elements
        }
      });

      gsap.set(nodes, { opacity: 0, scale: 0.85 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top 70%',
          end: 'bottom 30%',
          scrub: 1.5,
        },
      });

      tl.to(paths, {
        strokeDashoffset: 0,
        duration: 2,
        ease: 'none',
        stagger: 0.3,
      }).to(
        nodes,
        {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          stagger: 0.15,
        },
        '-=1'
      );
    }
  );

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      role="img"
      aria-label={description}
    >
      {/* Phase 4: Replace with actual SVG inline or object tag */}
      <div
        className="w-full border border-border bg-bg-secondary flex items-center justify-center"
        style={{ height: 400 }}
      >
        <p className="text-label text-center px-8">
          Architecture diagram — {description}
          <br />
          SVG to be authored for Phase 4
        </p>
      </div>
    </div>
  );
}

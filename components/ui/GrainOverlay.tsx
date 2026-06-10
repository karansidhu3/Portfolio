/*
 * Film grain texture overlay — page-level material environment.
 *
 * An SVG feTurbulence fractalNoise filter tiled across the viewport.
 * At 4% opacity it shifts the visual register from "screen" to "surface" —
 * the difference between a flat digital void and a material environment.
 *
 * The grain doesn't animate or respond to anything. It's environmental.
 * It's what makes the page feel like something with physical presence rather
 * than a lit rectangle on a black background.
 *
 * Fixed position: follows scroll. The grain belongs to the space, not the content.
 * Pointer-events: none. Zero interaction cost, zero DOM weight beyond this div.
 * z-index 950: above page content and navigation, ensuring the texture is
 * applied uniformly across the entire rendered surface.
 *
 * SVG approach (vs canvas/WebGL): zero JS, zero animation cost, works in
 * reduced-motion mode without modification. The SVG filter is applied at
 * paint time by the browser's compositing engine.
 *
 * baseFrequency 0.62, numOctaves 4: medium-fine grain — photographic film
 * character rather than digital noise. Coarser than the previous 0.75 value —
 * higher frequency = smaller grain particles = more digital. 0.62 sits in the
 * range where the grain reads as material texture rather than pixel artifact.
 * Tile size 250px (from 200px): longer repeat distance, less tiling artifacting.
 */
export function GrainOverlay() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 950,
        pointerEvents: 'none',
        opacity: 0.065,
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='250' height='250'%3E%3Cfilter id='grain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.62' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='250' height='250' filter='url(%23grain)'/%3E%3C/svg%3E\")",
        backgroundSize: '250px 250px',
        backgroundRepeat: 'repeat',
      }}
    />
  );
}

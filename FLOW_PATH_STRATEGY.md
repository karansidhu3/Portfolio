# Flow Path System — Strategy

> A continuous visual guide that operates below conscious perception.
> The user should feel the current before they see the line.

---

## Core Concept

A single Catmull-Rom spline flows from the top of the document to the bottom.
It is parameterized by normalized document position `t ∈ [0, 1]`.

At any scroll position, a fixed viewport-sized canvas renders the visible slice
of that path. The result: a continuous warm line that feels like it passes
*through* the page rather than sitting *on* it.

---

## Why Catmull-Rom

Catmull-Rom splines pass through their control points exactly.
This means the path can be authored precisely at key moments
(the hero rule, section boundaries, statement areas) while remaining
smooth between them. The curves are natural and asymmetric — not
the perfect sine waves of parametric generation.

---

## Path Design Philosophy

The path is NOT:
- A connector between sections
- A decorative squiggle
- A progress indicator
- Symmetric or mathematically regular

The path IS:
- A loosely correlated shadow of the reading structure
- A horizontal oscillation that mirrors content weight
- An authored line — like a camera movement path

Specific authored behaviors:
- Dives LEFT with the hero name (the name is left-heavy at this scale)
- Crosses CENTER at the ruled separator (the rule is the turning point)
- Swings RIGHT through the MarqueeBand (the ticker pulls it across)
- Returns FAR LEFT at the Signal statement (the 22ch statement is left-anchored)
- Oscillates through project areas — left for entry frames, right for content
- Resolves near CENTER at contact/footer (the end is calm)

---

## Rendering Architecture

```
position: fixed canvas (viewport-sized)
│
├── On mount: cache section offsetTop positions
├── On scroll: update velocity, kick off RAF loop
├── RAF loop: draw → velocity decay → stop when idle
└── On resize: recalculate canvas size + section positions
```

**No document-height canvas.** The canvas is always viewport-sized.
Only the path segment that's currently visible gets computed and drawn.

---

## Opacity System — Three Layers

```
Final opacity = (base + proximity_boost + velocity_boost) × edge_fade
```

1. **Base** — minimum opacity everywhere (~0.07–0.08)
   The line is always barely present. Never fully invisible,
   never asserting itself.

2. **Proximity boost** — increases near section boundaries
   A narrow gaussian centered on each section's `offsetTop`.
   Half-width: ~220px. Peak boost: ~0.10
   Effect: the line "pulses" slightly as the user crosses scene transitions.
   They feel the beat without noticing why.

3. **Velocity boost** — increases slightly when scrolling
   Very small (max ~0.03). The line becomes marginally more present
   during active scroll, fading back when the user stops.
   Gives the path a "waking up" quality in motion.

4. **Edge fade** — zero at top and bottom 10% of viewport
   Smooth-step curve. The path emerges from and returns to the void
   at each viewport edge. Never clips — always fades.

---

## Scroll Velocity and the RAF Loop

The path does not run a continuous RAF loop at 60fps idle.
This would waste battery unnecessarily.

Instead:
- On scroll: update velocity, start loop if not running
- Each RAF frame: draw, decay velocity by ×0.88
- When |velocity| < 0.0003: draw once more, stop loop

This means the path animates for ~500ms after scrolling stops
(velocity × 0.88^n < 0.0003 → ~30 frames → ~500ms at 60fps).
The opacity decays back to baseline smoothly. Imperceptible as intentional.

---

## Mobile Behavior

- Amplitude reduced to 50% of desktop (closer to center, narrower swing)
- Base opacity slightly lower (0.05 vs 0.08)
- Fewer segments per frame (60 vs 100) — performance
- Line width 0.5px vs 0.75px
- No changes to path keyframes — same t-values, just compressed x

The result: on narrow viewports the path feels like a subtle centerline
rather than a wide oscillation. Still present; not distracting.

---

## Z-Index Placement

```
z: auto  →  Base vignette (layout.tsx)
z: auto  →  AtmosphereController layers
z: 3     →  FlowPath canvas         ← HERE
z: 10    →  Page content (.z-content)
z: 900   →  Navigation
z: 950   →  GrainOverlay
```

The path sits between the atmospheric base and all page content.
The grain texture renders above it, which means the path naturally
inherits the material surface of the environment.
It is part of the room, not an overlay on the room.

---

## What "Felt Before Noticed" Means in Practice

At 0.07–0.18 opacity on a near-black background (#07070c),
the path is below the threshold of conscious attention in peripheral vision.
The eye doesn't lock onto it.

But it creates:
- A slight directional pull toward the path's x-position
- A subconscious rhythm at section transitions (the opacity pulse)
- A sense that the page has an underlying structure
- A feeling of authored motion, not random layout

The test: cover the path. The page should feel slightly less intentional.
Not broken — just less authored.

---

## Anti-patterns Avoided

- No glow / bloom effect — stays warm but never luminous
- No dashed line — implies interaction, not atmosphere
- No arrowheads — the direction is implicit, never labeled
- No section labels or annotations on the path
- No strong curvature at section boundaries (would look like a connector)
- No parallax offset — the path maps exactly to scroll position (no lag)
  Note: velocity-opacity variation gives a sense of physical response
  without the visual confusion of positional parallax

---

*Status: ACTIVE*
*Component: `components/systems/FlowPath.tsx`*

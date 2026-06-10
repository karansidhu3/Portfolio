# MOTION_SYSTEM.md — Motion & Animation System

> Motion in this portfolio is not decoration. It is architecture.
> Every animation communicates spatial relationship, temporal structure, or emotional intent.
> If an animation does none of these things, it does not exist.

---

## 1. ANIMATION PHILOSOPHY

### 1.1 Motion as Narrative Instrument

In cinema, editing is not about making cuts — it's about controlling time and attention. In this portfolio, animation serves the same role as editing does in film: it controls what the visitor perceives, when they perceive it, and how they feel about it.

Before implementing any animation, define:
1. **What attention is this directing?** (Where should the eye go next?)
2. **What temporal relationship is this communicating?** (What happened before? What happens next?)
3. **What does this emotionally signal?** (Is this an arrival? A departure? A revelation?)

If you cannot answer these three questions, the animation should not exist.

### 1.2 The Cinematic Pacing Model

This portfolio moves **slower than typical web animations.** This is intentional and correct.

The reference model is cinematic pacing: the deliberate, unhurried reveal of information that creates anticipation and rewards attention. Fast animations communicate urgency and efficiency. Slow animations communicate confidence and presence.

**Rule:** When your instinct says 300ms, try 600ms. When your instinct says 600ms, try 900ms. Then evaluate.

### 1.3 Motion Budget

One primary motion event per viewport at any given time. Supporting motion may exist simultaneously, but should be significantly subordinate in scale and speed.

**Anti-pattern:** Multiple elements animating simultaneously at full intensity. This creates chaos, destroys hierarchy, and exhausts the viewer.

---

## 2. EASING SYSTEM

### 2.1 Easing Philosophy

Linear motion is mechanically correct but perceptually wrong — our eyes are trained by the physical world where objects have inertia, resistance, and momentum. Easing curves are how digital motion communicates these physical properties.

The easing vocabulary in this project is limited and intentional:

### 2.2 Primary Easing Curves

```javascript
// CSS variable format for use across GSAP and Framer Motion

const EASING = {
  // ENTRY / REVEAL: Fast leading edge, long luxurious tail
  // Use for: elements appearing, content revealing, scene entries
  cinematic: [0.22, 1, 0.36, 1],  // easeOutExpo equivalent
  
  // TRANSITION: Symmetrical, architectural
  // Use for: page transitions, cross-fades, element swaps
  transition: [0.65, 0, 0.35, 1], // easeInOutCubic

  // EXIT: Quick departure, minimal lingering
  // Use for: elements leaving, scene exits
  exit: [0.55, 0, 1, 0.45],       // easeInCubic

  // TACTILE: Physical spring feel for micro-interactions
  // Use ONLY for: hover states, button presses, small interactive elements
  spring: { type: 'spring', stiffness: 400, damping: 30 },

  // ATMOSPHERIC: Very slow, imperceptible, environmental
  // Use for: background elements, procedural systems
  atmospheric: [0.25, 0.1, 0.25, 1], // easeInOutQuad
}
```

### 2.3 Easing Anti-Patterns

```
NEVER USE:
- Linear: [1, 0, 0, 1]        — mechanical and cheap
- easeInElastic               — cartoonish, wrong register
- easeOutBounce               — cartoonish, wrong register
- easeInBack (steep)          — objects don't slingshot without reason
- easeOutBack (aggressive)    — restraint required; very subtle only

USE CAREFULLY:
- easeOutBack (subtle, s=1.2) — only for physical UI elements (cards, drawers)
                                Never for text or structural elements
```

---

## 3. TIMING REFERENCE

### 3.1 Duration Standards

```
CATEGORY              DURATION         USE CASES
──────────────────────────────────────────────────────────
Micro-interaction    150–250ms        Button hover, link hover, icon swap
UI transition        300–450ms        Tab switch, drawer open, tooltip appear
Component reveal     500–700ms        Card enter, modal open, tooltip rich
Scene enter          800ms–1.2s       Section entry, project scene reveal
Cinematic reveal     1.2s–2.0s        Hero sequence, project cinematic moment
Atmospheric motion   2.0s–8.0s        Background elements, ambient procedural
```

### 3.2 Stagger Timing

When multiple elements animate in sequence (staggered reveals):

```
Text lines:        60–80ms stagger between lines
List items:        80–120ms stagger
Grid elements:     100–150ms stagger (use sparingly — max 6 elements)
Large sections:    200–400ms stagger between sub-sections
```

**Rule:** Stagger duration decreases as element count increases. More elements means shorter per-stagger, so the total sequence duration stays under 1.5s.

---

## 4. SCROLL BEHAVIOR

### 4.1 Scroll as Primary Timeline

The scroll position is the primary timeline of the experience. It maps directly to narrative progression. Think of it as the scrubber in a video timeline — the visitor controls the playback rate.

### 4.2 ScrollTrigger Patterns (GSAP)

Standard scroll-triggered reveal pattern:
```javascript
gsap.fromTo(element, 
  { opacity: 0, y: 40 },
  { 
    opacity: 1, 
    y: 0, 
    duration: 0.9, 
    ease: EASING.cinematic,
    scrollTrigger: {
      trigger: element,
      start: 'top 85%',    // Start when top of element is 85% down viewport
      end: 'top 50%',      // Complete when element is 50% up viewport
      toggleActions: 'play none none reverse',
      // Reverse on scroll-up: yes — the experience should be navigable
    }
  }
)
```

**Standard trigger start positions:**
- Atmospheric / background elements: `start: 'top 100%'` (begin before visible)
- Primary content: `start: 'top 80%'`
- Emphasis content: `start: 'top 70%'`
- Pinned elements: `start: 'top top'`

### 4.3 Scroll Pinning Rules

Scroll-pinned sections (where the page "pauses" on a section while the user scrolls) are the most powerful tool in this system and the most dangerous.

**Hard rules for pinning:**
- Maximum **one pinned section** in the full page experience (possibly none)
- Pinned section must have clear affordance that scrolling continues it
- Total pinned scroll distance: maximum 300vh (equivalent to three viewport heights of scrolling)
- Must be removable without breaking surrounding sections
- Must be tested and confirmed working on mobile (often scroll-jacking breaks badly on touch)
- If in doubt: don't pin. A well-timed non-pinned reveal is almost always better.

### 4.4 Scroll Velocity Reactivity

Optional experimental feature: animations whose speed/intensity responds to scroll velocity. Visitor scrolls fast → elements fly in; visitor scrolls slowly → elements drift in.

Implementation:
```javascript
// Track scroll velocity
let lastScrollY = 0;
let velocity = 0;

ScrollTrigger.create({
  onUpdate: (self) => {
    velocity = self.getVelocity(); // px/sec
    const intensity = gsap.utils.clamp(0, 1, Math.abs(velocity) / 2000);
    // Use intensity to modulate animation parameters
  }
})
```

**When to use:** Project cinematic entry, hero section activation.
**When not to use:** Small component interactions, anything where predictability matters more than expressiveness.

---

## 5. TRANSITION SYSTEM

### 5.1 Section Transitions

Between major narrative sections, the transition treatment defines the emotional beat that connects them. Options:

```
FADE-THROUGH: Content fades out, brief dark frame, next content fades in
  Duration: 600ms total
  Use: Between emotionally distinct sections
  
WIPE: New content slides in directionally (up from bottom for progression)
  Duration: 800ms
  Use: Sequential project reveals
  
SCALE-REVEAL: Next section content scales from small to full
  Duration: 900ms
  Use: Returning to main context from deep project view
  
ATMOSPHERIC-BLEND: Background elements transition between states
  Duration: 1.5s
  Use: Color/texture changes between sections
```

### 5.2 Page-Level Transitions (If Multi-Page)

If the portfolio uses multiple pages (separate project detail pages), page transitions must:
- Be consistent in all directional instances
- Complete within 600ms
- Not block rendering of incoming page content
- Not use JavaScript animations that require heavy computation on slow devices

Recommended: Framer Motion `AnimatePresence` with simple opacity + y-translate.

---

## 6. INTERACTION MOTION

### 6.1 Hover States

Hover interactions should feel **tactile** — as if the element has physical properties. The interaction model is: the cursor applies gentle pressure to the element, and the element responds.

**Standard hover vocabulary:**
```javascript
// Subtle scale (for cards, project tiles)
{ scale: 1.015, transition: { duration: 0.3, ease: EASING.spring } }

// Text link underline reveal
// CSS-based: pseudo-element width transition 0 → 100%
// Duration: 250ms, easeOutCubic

// Magnetic attraction (for CTAs, primary buttons)
// Cursor within radius → element origin shifts toward cursor
// Maximum displacement: 8px, easing: spring

// Depth reveal (for project cards)
// Hover reveals a secondary layer of information underneath
// Y-translate of overlay: -100% → 0, Duration: 400ms
```

### 6.2 Button / CTA Motion

Primary buttons should respond to both hover and press states:
```
Hover:  scale(1.02), subtle background brighten (not color change)
Press:  scale(0.97), immediate response (50ms)
Release: spring return to hover state, then to rest
```

**Important:** Press state must feel physically immediate even if hover state is slow. The user's action must register instantly.

### 6.3 Cursor Behavior

Consider a custom cursor for desktop — not for decoration, but for expressiveness:

Default state: Circular dot (8px), white at 80% opacity
Hover on interactive: Circular dot expands (24px), full opacity — indicating interaction zone
Hover on text: Thin I-beam, custom styled
Hover on project: Cursor transforms to "enter" arrow or custom label
Drag state: Circular with directional arrow

**Mobile:** Custom cursor is not rendered. All cursor logic must be gated on `!isTouchDevice`.

---

## 7. MOTION HIERARCHY

### 7.1 Priority Levels

When multiple animations compete for attention (e.g., during section entry), establish a clear hierarchy of what the eye should see first:

```
Priority 1: Primary content reveal (headline, key visual)
Priority 2: Supporting content entry (body text, secondary elements)
Priority 3: Atmospheric elements (background, overlays)
Priority 4: Micro-interactions and details
```

Each priority level should begin animating after the previous one has substantially completed (not necessarily fully — 70% completion is usually the right overlap point).

### 7.2 Attention Sequencing

A well-designed entry sequence guides the eye through a deliberate path:
1. First to move → receives first attention
2. Subsequent elements → build the full picture
3. Final settling → invitation to read

**Anti-pattern:** Everything entering simultaneously. This is energetic but aimless.

---

## 8. PARALLAX / DEPTH RULES

### 8.1 Three-Layer Parallax Model

```
Layer       Rate        Element Types                 Transform
──────────────────────────────────────────────────────────────────
Background  0.15×      Atmospheric texture, gradients  translateY(progress * 0.15)
Midground   0.5×       Section context elements        translateY(progress * 0.5)
Foreground  1.0×       Primary content                 None (follows scroll)
```

`progress` = pixels scrolled within section trigger range.

### 8.2 When NOT to Use Parallax

- On mobile (too many elements + parallax = degraded performance)
- On sections with dense text content (parallax makes text hard to read in motion)
- When the section already has active animation (parallax + animation = chaos)

### 8.3 Depth Without Parallax

Parallax is not the only tool for creating spatial depth. Equally effective:
- Foreground elements that overlap section boundaries
- Background elements visible through semi-transparent overlays
- Scale differences between elements in the same plane
- Blur gradients simulating depth of field

---

## 9. PERFORMANCE CONSTRAINTS

### 9.1 GPU Animation Budget

The following properties are safe to animate (compositor thread, no layout):
```
✓ transform: translate, scale, rotate, skew
✓ opacity
✓ filter: blur (use carefully — expensive on mobile)
✓ clip-path (animatable, compositor-accelerated in modern browsers)
```

The following properties must NEVER be animated:
```
✗ width, height — triggers layout
✗ margin, padding — triggers layout
✗ top, left, right, bottom — triggers layout
✗ background-color — triggers paint (use opacity overlay instead)
✗ border-radius (at scale) — triggers paint on some browsers
✗ box-shadow — triggers paint
```

### 9.2 will-change Management

```javascript
// Add before animation
element.style.willChange = 'transform, opacity';

// Remove after animation completes (important!)
gsap.to(element, {
  ...,
  onComplete: () => { element.style.willChange = 'auto'; }
})
```

**Critical:** `will-change` creates a new compositor layer, consuming GPU memory. Leaving it active on many elements simultaneously will degrade performance. Apply only immediately before animation, remove after.

### 9.3 ScrollTrigger Cleanup

All ScrollTrigger instances must be killed on component unmount (React) or route change (Next.js):

```javascript
useEffect(() => {
  const ctx = gsap.context(() => {
    // All ScrollTrigger setup here
    ScrollTrigger.create({ ... });
  }, sectionRef);
  
  return () => ctx.revert(); // Clean up on unmount
}, []);
```

### 9.4 Frame Budget Awareness

60fps = 16.67ms per frame for all work (JS + layout + paint + composite).

Animation timelines should:
- Do no more than 3–5 simultaneous transform/opacity transitions on desktop
- Do no more than 2 simultaneous transitions on mobile
- Avoid triggering paint during active animation

---

## 10. ACCEPTABLE ANIMATION PATTERNS

These patterns are explicitly approved. Implement freely within these patterns:

```
✓ Fade in/out with vertical drift (y: ±20–40px)
✓ Staggered text line reveals
✓ Scale reveals (0.96 → 1.0) with opacity
✓ Horizontal text marquee (for ambient section titles)
✓ SVG path drawing animations (architecture diagrams)
✓ Counter animations (numbers counting up)
✓ Subtle infinite ambient motion (slow floating, breathing)
✓ Cursor magnetic attraction (limited to ±8px)
✓ Section color/atmosphere transitions
✓ Scroll-velocity reactive intensity
✓ Clip-path reveal (content revealed by expanding clip)
✓ Image parallax within containers
```

---

## 11. FORBIDDEN MOTION PATTERNS

These are explicitly prohibited. Do not implement under any framing:

```
✗ Continuous random particle systems on primary surfaces
✗ Geometric elements rotating for decoration alone
✗ Text that scrambles/glitches without narrative purpose
✗ Loading spinners replaced by elaborate custom animations
✗ Elements that move when the user is reading (not scroll-triggered)
✗ Hover states that move surrounding elements unexpectedly
✗ Background animations that compete with foreground content
✗ Three simultaneous scroll-triggered animations in the same section
✗ Animated gradients (the "aurora" background trend)
✗ Elements that loop visibly and distractingly in the user's peripheral vision
✗ Sound triggers on scroll or hover (without explicit user opt-in)
✗ Full-page takeover transitions that take > 1.5s
```

---

## 12. REDUCED MOTION IMPLEMENTATION

### 12.1 The Reduced Motion Contract

When `prefers-reduced-motion: reduce` is active, the user gets:
- All content visible
- No scroll-triggered reveals
- No parallax
- No hover animations
- Instant transitions (< 150ms opacity only)
- Full functionality

This is implemented at the animation system level — not by checking in each component individually.

```javascript
// lib/animation/useReducedMotion.ts
export function useReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(false);
  
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(query.matches);
    query.addEventListener('change', (e) => setReducedMotion(e.matches));
  }, []);
  
  return reducedMotion;
}

// In animation context: if reducedMotion, skip all animation setup
// Content must be visible at rest state (opacity: 1, y: 0) by default
```

### 12.2 Default State Rule

**Every animated element must be visible at its final state by default.** Animation is applied on top of the base state. If animation fails or is disabled, content is still accessible.

```css
/* Default: visible */
.animated-element {
  opacity: 1;
  transform: translateY(0);
}

/* GSAP sets initial state to hidden via fromTo */
/* This ensures no-JS fallback always shows content */
```

---

*Motion is the portfolio's secondary language. Typography is primary.*
*When motion and typography conflict, typography wins.*

# CLAUDE.md — Portfolio Project Constitution

> This document is the master operating agreement for the cinematic portfolio project.
> Every decision — visual, technical, interactive, architectural — should pass through the lens of this document.
> When in doubt: return here.

---

## 0. CORE IDENTITY STATEMENT

This portfolio is not a resume website. It is not a project gallery. It is not a creative developer showcase.

It is a **cinematic systems experience** built by someone who is obsessive about engineering quality, interaction precision, and design coherence. Every element on the page exists because it earns its place. Nothing is decorative for its own sake. Nothing is impressive for the sake of impressing.

The experience should leave visitors with a single clear feeling:

> *"This person builds with unusual care, depth, and intentionality."*

---

## 1. OVERALL PHILOSOPHY

### 1.1 Coherence Over Novelty

Every interaction, animation, and visual decision must serve the narrative. The temptation will always be to add more — more motion, more effects, more visual complexity. Resist this constantly.

Ask of every element:
- Does this communicate something that would otherwise be lost?
- Does this reinforce the emotional tone of this moment?
- Is this the simplest version that still achieves the goal?

If the answer to all three is not yes, remove it.

### 1.2 Polish Over Feature Count

A single section executed with extraordinary care is more powerful than ten sections built adequately. Prioritize finishing things fully over covering more ground.

**Anti-pattern:** Shipping a hero section, project cards, and a contact form, all at 80% quality.
**Target:** Shipping three sections at 100% quality.

### 1.3 Pacing Over Constant Stimulation

The portfolio is not a fireworks show. Long cinematic pauses, held silences, and deliberate slowness are features — not failures. The visitor should feel like they are being guided through something, not assaulted by it.

Motion budget philosophy: **one primary motion per viewport at a time.**

### 1.4 Emotional Tone Over Spectacle

Every section has an emotional job. The hero creates presence. The work section creates curiosity and depth. The about section creates trust. The contact section creates openness. Design for emotion first; technical implementation follows.

---

## 2. CREATIVE DIRECTION

### 2.1 Primary Reference Feeling

The site should feel like it was made by someone who has studied:
- Apple's product film direction (scale, pacing, restraint)
- Linear's interface aesthetic (precision, monochromatic intelligence)
- Editorial design systems (Monocle, New York Times Magazine — spatial hierarchy)
- Experimental studio work (Aktiv Grotesk's restraint, Sehsucht's motion, HORT's systems thinking)

It should **not** feel like it is imitating any of these. It should feel like it has absorbed these influences and produced something coherent and personal.

### 2.2 Aesthetic Identity

**Tone:** Calm confidence. Intellectual depth. Precision without coldness.

**Visual register:** Mostly monochromatic. Off-black primary surfaces. Warm whites for text. Graphite and muted metallic tones for accents. One restrained accent color used sparingly and meaningfully.

**Motion register:** Slow, deliberate, architectural. Animations that feel like physical objects moving through space, not UI elements flickering in and out.

**Typography register:** Large, cinematic headlines at key narrative moments. Small, precise body text. No decorative font mixing. Type as a spatial object, not just a label.

### 2.3 What This Is Not

Do not let the project drift toward:
- Cyberpunk or neon aesthetics
- Oversaturated gradient backgrounds
- Glowing AI-core visual language (lens flares, particle explosions, electric lines)
- Generic "creative developer portfolio" energy — infinite scroll cards, hover cards, rainbow gradients
- Motion for decoration — elements that animate for no reason other than to feel alive
- Startup-marketing copywriting ("I craft impactful digital experiences that drive results")

If at any moment the design starts looking like a template, stop and return to first principles.

---

## 3. CODING STANDARDS

### 3.1 Language & Tooling

- TypeScript strictly. No `any` types without documented justification.
- ESLint + Prettier enforced. No exceptions.
- Path aliases configured (`@/components`, `@/lib`, `@/hooks`, etc.)
- Absolute imports only. No relative imports beyond one level.

### 3.2 Component Philosophy

- Colocate styles, logic, and types where possible.
- Every component has a single, clear responsibility.
- Animation logic lives in a separate layer from rendering logic (see TECH_ARCHITECTURE.md).
- Prefer composition over inheritance.
- Prefer explicit over implicit.

### 3.3 Naming Conventions

```
Components:   PascalCase   (HeroSection, ProjectCard, CinematicReveal)
Hooks:        camelCase    (useScrollProgress, useCinematicTransition)
Utils:        camelCase    (clamp, lerp, mapRange)
Constants:    SCREAMING    (ANIMATION_DURATION, EASING_CINEMATIC)
Files:        kebab-case   (hero-section.tsx, use-scroll-progress.ts)
```

### 3.4 File Structure

```
/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── sections/           # Full-page narrative sections
│   ├── ui/                 # Atomic reusable components
│   ├── motion/             # Animation wrapper components
│   └── systems/            # Data visualization / diagram components
├── hooks/                  # Custom React hooks
├── lib/
│   ├── animation/          # GSAP timelines, Framer variants
│   ├── utils/              # Math, formatting, clamp/lerp helpers
│   └── constants/          # Design tokens, animation constants
├── public/
│   ├── fonts/
│   ├── images/
│   └── videos/
└── styles/                 # Global styles and CSS variables
```

### 3.5 Performance Standards in Code

- No layout-triggering properties animated (no `width`, `height`, `top`, `left`). Use `transform` and `opacity` exclusively for animation.
- `will-change` applied conservatively, removed after animations complete.
- Images always optimized via `next/image`.
- Video assets always lazy-loaded and compressed.
- No synchronous operations in render paths.

---

## 4. ARCHITECTURE PRINCIPLES

### 4.1 Layered Architecture

The site is structured in three conceptual layers:

1. **Content Layer** — What is being communicated (text, images, data)
2. **Interaction Layer** — How the user navigates and triggers moments
3. **Motion Layer** — How elements move through space and time

These layers must remain separable. Motion logic should not be baked into content components. This allows refinement of each layer independently.

### 4.2 Scene-Based Mental Model

Think of the site as a sequence of scenes, not a scroll document. Each section is a scene with:
- An entry state
- An active state
- An exit state
- An emotional purpose

This mental model prevents sections from bleeding into each other visually or emotionally in ways that weren't intended.

### 4.3 Progressive Enhancement

The site must function without JavaScript for basic content access. Animations and immersive layers are progressive enhancements, not requirements for usability.

Hierarchy:
1. HTML content → always accessible
2. CSS styles → basic visual design
3. JavaScript → interaction and standard motion
4. GPU/WebGL → immersive experimental layers

---

## 5. MOTION PHILOSOPHY

> Full detail in MOTION_SYSTEM.md. This section establishes guiding principles only.

### 5.1 Motion as Architecture

Every animation should do architectural work: establishing spatial relationships, communicating hierarchy, guiding attention, or creating temporal structure. If it does none of these, it should be removed.

### 5.2 Timing Philosophy

Animations in this project are **slower than your instinct**. When in doubt, make it slower. Cinematic motion feels luxurious. UI animation feels fast. This is a cinematic experience.

Baseline timing references:
- Micro-interactions: 150–250ms
- Component transitions: 400–600ms
- Scene transitions: 800ms–1.2s
- Cinematic reveals: 1.5s–2.5s

### 5.3 Easing Philosophy

No linear easing anywhere. Linear motion reads as mechanical and cheap.

Primary easing vocabulary:
- `easeOutExpo` — entries, reveals (fast start, luxurious settle)
- `easeInOutCubic` — page transitions, cross-fades
- `easeOutBack (restrained)` — tactile interactions only, not structural motion
- Custom spring physics — physical objects, hover states

### 5.4 Reduced Motion

A complete reduced-motion experience must exist. Users who prefer `prefers-reduced-motion: reduce` get content without animation, not broken layouts. Respect this without reducing the content quality.

---

## 6. PERFORMANCE REQUIREMENTS

> Full detail in PERFORMANCE_RULES.md.

### Baseline Targets

| Metric | Target | Hard Limit |
|---|---|---|
| LCP | < 1.5s | < 2.5s |
| FID / INP | < 50ms | < 100ms |
| CLS | < 0.05 | < 0.1 |
| Animation framerate | 60fps | 30fps minimum |
| Mobile performance | 60fps on mid-range 2023 phones | 30fps minimum |
| JS bundle (initial) | < 150kb gzipped | < 250kb |
| Total page weight | < 3MB | < 6MB |

### Non-Negotiable Rules

- No WebGL on mobile by default — offer opt-in or graceful degradation to CSS.
- All videos must use lazy loading and intersection observers.
- Images served in AVIF/WebP with appropriate fallbacks.
- Animation frames should never block main thread.
- GSAP ScrollTrigger must be killed and recreated on resize, not left stale.

---

## 7. DESIGN CONSTRAINTS

> Full detail in DESIGN_SYSTEM.md.

### Hard Visual Rules

1. **Maximum two typefaces.** Likely one — a premium variable sans and a monospace for technical elements.
2. **Maximum three font sizes in any single viewport.** Hierarchy through scale and weight, not variety.
3. **Color palette: 5 values maximum.** Background, surface, text-primary, text-secondary, accent.
4. **No box shadows on primary surfaces.** Depth through layering and positioning, not drop shadows.
5. **No border-radius on primary layout elements.** Sharp geometry reads as more serious and engineered.
6. **Whitespace is not waste.** Generous spacing is a design decision. Do not fill empty space.

---

## 8. INTERACTION RULES

### 8.1 Hover Behavior

Hover states should feel **tactile and physical**, not merely colorful. Think of them as revealing depth, not changing decoration.

Good hover patterns:
- Subtle scale (1.0 → 1.015) with spring easing
- Revealing underlying layers or information
- Magnetic attraction toward cursor
- Typography weight shifts

Bad hover patterns:
- Color changes on non-interactive elements
- Box shadow additions
- Random element movements
- Glow effects

### 8.2 Scroll Behavior

Scroll is the primary narrative instrument. Treat it like a film editor treats a timeline.

- Scroll progression maps to narrative progression
- Sections have defined entry and exit points
- Pinned sections (scroll-jacked) used extremely sparingly — maximum one per viewport
- Parallax used for depth, not decoration

### 8.3 Click / Tap

- Every interactive element must have a clear affordance at rest
- Pressed states should feel physical (subtle scale-down)
- Page transitions should be intentional, not instant

---

## 9. AESTHETIC PRINCIPLES

### 9.1 Typography as Space

Type is not decoration. In this system, headline text functions as architectural structure — it creates regions of space and organizes the visual field. Treat font size like a spatial tool.

### 9.2 Silence as Design Tool

Empty space, pauses in animation, blank sections of screen — these are features. Do not feel pressure to fill every moment with visual activity.

### 9.3 Systems over Decoration

When visual elements are added, they should reveal or represent something real: system structure, data relationships, process flows. Abstract decorative visuals should be used minimally.

### 9.4 Material Thinking

Even in a flat digital medium, elements should behave as if they have physical properties: weight, momentum, resistance. A headline doesn't snap into place — it arrives, carries its weight, and settles.

---

## 10. UX PHILOSOPHY

### 10.1 The Visitor Journey

The intended visitor is someone who evaluates craft. They are technical, discerning, and suspicious of fakery. They will not be impressed by surface-level spectacle — they will look for depth, consistency, and real judgment.

The portfolio's UX job is to:
1. Establish presence and quality immediately (hero)
2. Create curiosity about the work (project teasing)
3. Demonstrate depth through the project stories
4. Build trust through the about section
5. Make contact feel like a natural conclusion, not an afterthought

### 10.2 Navigation Philosophy

Navigation should be minimal and non-intrusive. Visitors should be guided by the narrative flow of the page, not by a persistent nav forcing choices. A subtle floating nav exists as an escape hatch, not a primary wayfinding tool.

### 10.3 Accessibility

Full WCAG 2.1 AA compliance is the baseline. This is not in conflict with cinematic design — it requires more care and yields better work.

- All interactive elements keyboard accessible
- Focus states visible and intentional (not browser default)
- ARIA labels on all non-text interactive elements
- Color contrast ratios met on all text
- No information conveyed by color alone

---

## 11. EXPERIMENTATION PHILOSOPHY

> Full detail in EXPERIMENTS.md.

### 11.1 The Experimentation Protocol

**Phase 1: Ambitious exploration** — Build the idea fully, even if you suspect it's too much.
**Phase 2: Honest critique** — Evaluate against the emotional tone and performance requirements.
**Phase 3: Reduction** — Simplify to the essential gesture.
**Phase 4: Integration** — Embed the simplified version into the coherent system.

Never skip Phase 2. Never ship Phase 1 work directly.

### 11.2 What Earns the Right to Stay

An experimental element earns its place if:
- It communicates something that couldn't be communicated more simply
- It performs within budget on mobile
- It passes the reduced-motion test
- It integrates with the surrounding sections without disrupting flow
- It serves the emotional purpose of its section

### 11.3 The Cut Rule

**If you've been trying to make an experimental element work for more than two hours and it still feels wrong, cut it.** The instinct that something is wrong is usually right. Move on.

---

## 12. MOBILE RESPONSIVENESS STANDARDS

### 12.1 Mobile is Not a Downgrade

The mobile experience is a different experience, not a lesser one. It should be designed deliberately, not adapted from desktop.

Key differences:
- Cinematic full-bleed sections work even better on mobile (narrow, tall viewport)
- Typography scales can be more aggressive on mobile
- WebGL and heavy GPU effects are disabled (or opt-in) on mobile
- Touch interactions replace hover — design for swipe and tap
- Scroll behavior is the dominant interaction — optimize for it

### 12.2 Breakpoints

```
Mobile:  < 768px   — primary mobile experience
Tablet:  768–1024px — transitional layout
Desktop: > 1024px  — full experience
Wide:    > 1440px  — enhanced spacing and scale
```

### 12.3 Mobile Performance Budget

Mobile performance requirements are stricter than desktop:
- No WebGL by default
- Simpler CSS animations only
- Lighter video assets (lower bitrate)
- Reduced parallax depth
- Touch-optimized interactive zones (min 44px tap targets)

---

## 13. IMPLEMENTATION MINDSET

### 13.1 Solo Developer Reality

This is a solo project built iteratively. Every architectural decision must respect this reality:
- Choose boring infrastructure for infrastructure (Next.js, Vercel, standard hosting)
- Choose interesting solutions only for creative problems
- Avoid over-abstraction early — generalize when patterns are proven, not anticipated
- Comments in code should explain *why*, not *what*
- Future-you reading this in six months should be able to understand every decision

### 13.2 Iteration Over Perfection

Ship working versions. Iterate aggressively. The goal is not a theoretically perfect system built in advance — it is a real, deployed, excellent experience built through cycles.

**Never gold-plate before the foundation is solid.**

### 13.3 Dependency Discipline

Every dependency added is a maintenance burden and a performance cost. Add dependencies only when:
- The alternative is significant custom complexity
- The library is actively maintained and widely used
- Its bundle cost is justified by its benefit

Primary animation tools (GSAP, Framer Motion) are pre-approved.
WebGL utilities (Three.js / React Three Fiber) require section-level justification.
Everything else requires explicit decision.

---

## QUICK REFERENCE: DECISION FILTERS

When making any design or implementation decision, ask:

1. **Does it serve the narrative?** If not, remove it.
2. **Is it the simplest version that achieves the goal?** If not, simplify.
3. **Does it perform at 60fps on mobile?** If not, rethink or disable on mobile.
4. **Does it respect reduced-motion preferences?** If not, fix it.
5. **Is it coherent with the rest of the experience?** If not, unify or remove.
6. **Does it make the visitor feel the right emotion for this moment?** If not, recalibrate.

---

*Last reviewed: project initialization*
*Owner: Karan*
*Status: ACTIVE — this document governs all decisions*

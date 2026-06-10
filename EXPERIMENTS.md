# EXPERIMENTS.md — Experimental Ideas & Explorations

> This is the creative laboratory. Ideas here range from high-probability successes
> to deliberate absurdity. The goal is to think expansively first, then apply rigorous
> judgment. The best innovations emerge from genuine exploration, not safe planning.
>
> Every idea here is evaluated honestly: what is the upside, what is the risk,
> what are the failure modes.
>
> Ideas are organized in tiers. Read all tiers — sometimes the "probably excessive"
> ideas contain the seed of a better, restrained version.

---

## TIER 1: LIKELY GOOD

*High confidence these will elevate the experience. Implement with care but without hesitation.*

---

### 1.1 Kinetic Text Reveal (Line-by-Line)

**What:** Headline text is masked and revealed line by line using a clip-path or overflow:hidden reveal. Each line slides up from a hidden state.

**Why it works:** Creates genuine reading anticipation. The eye is guided to follow the text as it arrives. Feels premium and deliberate.

**Implementation:**
```
- Split headline into lines (manual, not character-by-character)
- Each line wrapped in overflow:hidden container
- Inner element translates from y:100% to y:0
- Stagger: 80ms between lines
- Duration: 700ms per line, easeOutExpo
- Triggered by intersection observer or scroll
```

**Failure modes:**
- If the split creates awkward line breaks on mobile (test carefully)
- If the timing is too slow it becomes impatient-making

**Decision:** Implement in hero and first project scene. Test on mobile.

---

### 1.2 Scroll-Driven Section Number Counter

**What:** Section identifiers (01, 02, 03) animate — either counting up as the user enters each section, or using a subtle morphing animation between numbers.

**Why it works:** Creates a sense of progress and chapter-structure without a traditional progress bar.

**Implementation:**
- Monospace font, --text-xs, muted color
- On section entry: number appears with a quick scramble-to-final effect
- Or: simpler — just fade in + scale reveal
- Position: top-left corner of each project section

**Failure mode:** The scramble effect can feel gimmicky if overdone. Keep it 3–4 character swaps maximum, 200ms total.

---

### 1.3 Architecture Diagram Drawn via Scroll

**What:** SVG system diagrams that progressively draw themselves as the user scrolls through the architecture section of a project.

**Why it works:** Creates genuine engagement with technical content. Instead of showing a completed diagram, the visitor watches it being constructed — which mirrors how a system is actually understood.

**Implementation:**
```javascript
// SVG path drawing via stroke-dashoffset
gsap.to('[data-diagram-path]', {
  strokeDashoffset: 0,
  scrollTrigger: {
    trigger: diagramContainer,
    start: 'top 70%',
    end: 'bottom 30%',
    scrub: 1.5,  // Smooth, tied to scroll position
  }
})

// Nodes appear after their connecting paths are drawn
gsap.fromTo('[data-diagram-node]', ...)
```

**Design requirement:** SVGs must be carefully authored with this animation in mind. Path drawing order must be logical (not arbitrary).

**Failure mode:** If the SVG is too complex, the draw animation becomes visual noise. Maximum 15 paths, 10 nodes.

---

### 1.4 Magnetic Button/CTA

**What:** Primary CTA buttons attract the cursor within a radius (~80px), creating a gentle physical pull effect.

**Why it works:** Makes the interaction feel tactile. Communicates that the element is designed for interaction, not just placed there.

**Implementation:**
```javascript
// On mousemove within radius:
const dx = cursorX - buttonCenterX;
const dy = cursorY - buttonCenterY;
const distance = Math.sqrt(dx*dx + dy*dy);
const maxRadius = 80;

if (distance < maxRadius) {
  const strength = (maxRadius - distance) / maxRadius;
  const moveX = dx * strength * 0.3;  // 0.3 = strength multiplier
  const moveY = dy * strength * 0.3;
  gsap.to(button, { x: moveX, y: moveY, duration: 0.2, ease: 'power2.out' });
}
```

**Constraints:** Maximum displacement 12px. Desktop only. Must return to origin when cursor leaves radius.

---

### 1.5 Reading Progress Indicator (Architectural)

**What:** A very subtle visual indicator (not a progress bar — something more interesting) that communicates how far into the portfolio the visitor is.

**Options:**
- A single thin vertical line on the right edge, filling from top to bottom
- The section number in the floating nav updates to show current section
- A subtle scale-down of the nav element proportional to scroll progress

**Why it works:** Gives the visitor a sense of orientation in a long-scroll experience without adding UI chrome.

**Implementation:** Scroll progress via `window.scrollY / (document.body.scrollHeight - window.innerHeight)`.

---

### 1.6 Custom Cursor with Context Awareness

**What:** Custom cursor that changes appearance based on what it's hovering over:
- Default: Small dot (8px)
- Hovering on text: Fades out (text is readable without cursor interference)
- Hovering on interactive element: Expands to ring (24px), showing interaction affordance
- Hovering on project tile: Shows "View" label or arrow

**Why it works:** The cursor becomes an information layer. It reduces the need for explicit hover text labels and feels cohesive with the designed experience.

**Implementation:** `mix-blend-mode: difference` on the cursor dot creates an interesting inversion effect on hover.

**Failure mode:** Must be disabled on touch devices. Must not interfere with text selection. Must feel natural, not distracting.

---

### 1.7 Ambient Sound Layer (Opt-In Only)

**What:** Very subtle ambient audio — not music, not sound effects, but something closer to environmental texture (soft electronic drone, soft white noise) — that activates only on explicit user opt-in.

**Why it works:** For visitors who opt in, it can significantly deepen the immersion of the cinematic experience. For those who don't, no change.

**Implementation:** A small, unobtrusive toggle after a few seconds of interaction. Never autoplay. Single ambient loop, volume at 15% maximum.

**Failure mode:** If the audio quality is low, it destroys the experience. Only implement with high-quality audio. The opt-in mechanism must be extremely clear — never ambiguous about what it does.

**Decision:** Consider carefully. Only implement if the audio can be genuinely good.

---

## TIER 2: RISKY BUT INTERESTING

*High ceiling, real failure modes. Implement in prototype form first. Evaluate honestly before committing.*

---

### 2.1 Scroll-Velocity Reactive Atmosphere

**What:** The background atmospheric element responds to how fast the user is scrolling. Slow scroll → calm, settled atmosphere. Fast scroll → atmosphere intensifies (subtle — not flashing, more like a quickening).

**Why it's interesting:** Creates a physical relationship between the visitor's behavior and the experience's character. Makes fast vs. slow exploration feel different.

**Risk:** If not calibrated carefully, creates constant distraction. The atmospheric change must be subtle enough that it's felt rather than consciously noticed.

**Implementation approach:**
```javascript
let velocity = 0;
ScrollTrigger.addEventListener('scrollEnd', () => velocity = 0);
ScrollTrigger.create({
  onUpdate: (self) => {
    velocity = Math.abs(self.getVelocity());
    // Modulate: noise frequency, grain intensity, or opacity
    const intensity = gsap.utils.clamp(0, 1, velocity / 3000);
    gsap.to(atmosphereElement, { 
      opacity: 0.03 + (intensity * 0.05),  // Very subtle range
      duration: 0.5 
    });
  }
});
```

**Prototype gate:** Build as an isolated prototype. Show to 3 people without explaining it. If none of them notice it, decide if "not noticing" is actually the goal or a failure.

---

### 2.2 Project "World" Atmosphere with Procedural Backgrounds

**What:** Each project section has a unique, procedurally generated atmospheric background — a WebGL noise shader that uses colors derived from the project's visual identity. When transitioning between projects, the backgrounds interpolate.

**Why it's interesting:** Creates genuine spatial differentiation between project worlds without using images or illustrations. The procedural nature means it's always slightly different — live, not static.

**Risk:**
- WebGL on a background is a constant GPU cost
- Mobile impact is significant
- If done poorly, it looks like the "AI glow" aesthetic this project is explicitly avoiding

**Implementation approach:**
```glsl
// Fragment shader — grain noise background
uniform float uTime;
uniform vec2 uResolution;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform float uIntensity;

// Simplex or Perlin noise for smooth, organic movement
// Very low frequency (slow movement), very low intensity (barely visible)
// Output: soft gradient with barely-perceptible drift
```

**Decision gate:** Build the shader first. Evaluate the visual result before committing to the full integration. The shader must pass: "would this look good if the user sat on this section for 30 seconds?"

---

### 2.3 Interface Parallax Within Project Screenshots

**What:** Project screenshots/UI mockups are shown in a layered composite — different UI layers at different parallax depths. As the user scrolls or moves the cursor, the layers shift subtly, creating the illusion that the interface has physical depth.

**Why it's interesting:** Transforms a flat screenshot into a dimensional object. Makes the product feel alive.

**Risk:** Requires pre-composited layered assets (meaning: the screenshots must be specially prepared with separated layers). Significant production effort. If the layers don't separate well visually, it looks broken.

**Implementation:** Requires Photoshop/Figma preparation of multi-layer exports. The code side is manageable — just parallax transforms on layered absolute-positioned images.

**Decision gate:** Evaluate production effort vs. visual payoff. Consider implementing for one project as a test.

---

### 2.4 Text Scramble on Navigation

**What:** When the floating navigation items are hovered, the text briefly scrambles (characters cycle through random characters) before landing on the correct word.

**Why it's interesting:** Classic technique, but used here very sparingly — only on the 3–4 navigation items. Communicates technical register without being overwhelming.

**Risk:** Can feel like a cliché — "hacker aesthetic" territory. Whether it works depends entirely on the rest of the visual register.

**Decision gate:** Only implement if the overall design is restrained enough that this single moment of technical texture feels like a deliberate accent. If anything else in the design reads as "techy," skip this.

---

### 2.5 Project Entry Animation via Masked Composite

**What:** When entering a project section, the project's interface imagery appears not by fading in but by being "assembled" — pieces of the interface sliding in from different edges, meeting at the center to form the complete view.

**Why it's interesting:** Communicates that the interface was built piece by piece — mirrors the engineering process.

**Risk:** Can feel like a PowerPoint transition if not executed with extreme care. The motion must feel architectural, not theatrical.

**Prototype gate:** Build one version, watch it 20 times at different scroll speeds. Does it still feel good after 20 viewings? If no → cut.

---

### 2.6 Ambient Light System

**What:** A subtle "light source" tracks the cursor position, creating very gentle ambient lighting shifts across the surface of certain elements (cards, panels). As the cursor moves, highlights shift as if the light is physically relocating.

**Why it's interesting:** Creates tactility without adding complexity. The surface feels like it has material properties.

**Risk:** Can feel like a skeuomorphic throwback if not done subtly. At maximum: a 2–3% luminosity shift. Not visible in isolation — only perceptible in aggregate.

---

## TIER 3: PROBABLY EXCESSIVE

*These ideas have genuine appeal but are likely wrong for this project. Documented here to be considered and consciously rejected, not to be implemented.*

---

### 3.1 Full WebGL Scene per Project

**What:** Each project section is rendered inside a Three.js scene with 3D elements representing the project's domain.

**Why it's tempting:** Genuinely impressive. Would demonstrate Three.js skill.

**Why it's wrong:**
- Extremely expensive to maintain (each scene is its own production)
- Performance on mobile becomes untenable
- The visual complexity competes with the project content it's meant to support
- Risks looking like a "look at my WebGL" portfolio rather than a "look at my engineering judgment" portfolio

**What to do instead:** One tasteful atmospheric WebGL background for the whole site. Optional drawn SVG diagrams. These communicate the same technical capability with 10% of the cost and risk.

---

### 3.2 Real-Time Data From Live Projects

**What:** Pull live data from the actual deployed projects (e.g., MarketMind showing live market sentiment data in the portfolio section) and display it animated in the portfolio.

**Why it's tempting:** Shows the system is actually live. Creates a genuinely dynamic portfolio.

**Why it's wrong:**
- Creates a runtime dependency — if the project goes down, the portfolio breaks
- Requires a backend/API layer that adds complexity
- Privacy/rate-limiting concerns
- If the data looks boring at the moment a hiring manager visits, it undercuts the presentation

**What to do instead:** High-quality static screenshots of the system at its best. Optional recorded video of live data.

---

### 3.3 Page Cursor as Narrative Character

**What:** The custom cursor has a complex personality — changes shape, grows or shrinks based on context, has subtle trail effects.

**Why it's tempting:** Could be genuinely expressive.

**Why it's excessive:** A cursor with complex personality requires the visitor to learn its behavior — cognitive overhead for something that should be effortless. The cursor's job is to help, not to perform.

**What to do instead:** The simple context-aware cursor (Tier 1, idea 1.6). Restrained. Purposeful.

---

### 3.4 Scroll-Hijacked Loading Sequence

**What:** The entire page is covered by a loading screen that runs through an elaborate sequence (typewriter text, system initialization messages, animated elements) before revealing the portfolio.

**Why it's tempting:** Creates a very strong first impression of craftsmanship.

**Why it's wrong:**
- Delays the visitor from seeing content — if they've come from a referral link or search, this is actively harmful
- The sequence content is always at risk of feeling self-indulgent
- The loading screen's quality must be impeccable, or it embarrasses the whole site
- Most visitors have seen this approach now — it reads as "creative developer cliché"

**What to do instead:** The hero itself is the first impression. An excellent hero is better than a loading screen plus an adequate hero.

---

### 3.5 Interactive System Diagrams (User-Explorable)

**What:** Architecture diagrams that the visitor can interact with — clicking on components to expand their descriptions, zooming into sub-systems.

**Why it's tempting:** Demonstrates systems depth in an engaging format.

**Why it's excessive:**
- Significant development effort
- Visitor is unlikely to engage deeply with a portfolio's diagrams
- The interaction pattern is unfamiliar and requires learning
- A well-designed static animated diagram communicates 80% of the value

**What to do instead:** Animated SVG diagrams that reveal progressively via scroll. Static, but narrative.

---

## TIER 4: INTENTIONALLY INSANE EXPLORATIONS

*These ideas are included for expansive thinking, not for implementation. They exist to push the boundaries of what's been considered, and sometimes contain seeds of better, scaled-down ideas.*

---

### 4.1 The Portfolio as a Running System

**What:** The entire portfolio is designed to look like it's being "rendered" by a running system — the UI surfaces look like live interface readouts from an active AI process. The hero shows a real-time process log. Project sections show live system monitors.

**Why it's interesting as a concept:** Communicates that this person builds systems that run, not just systems that exist.

**The seed worth keeping:** The aesthetic idea of an "active system" — the project presentation could use subtle visual language borrowed from system monitoring interfaces (monospace readouts, data streams, minimal dashboards) without fully committing to the concept.

---

### 4.2 Cursor Leaves Physical Traces

**What:** As the cursor moves, it leaves a very brief trail — not a particle trail, but more like a physical impression — that decays over 1–2 seconds.

**Interesting element:** Makes the visitor aware of their own movement through the space. Creates a sense that the surface responds to presence.

**The seed worth keeping:** The atmospheric background could subtly respond to cursor position (slight brightness, subtle warp) without a visible trail. The visitor feels the surface responding without seeing an explicit trace.

---

### 4.3 Site Evolves With Visitor Scroll Depth

**What:** The first time a visitor scrolls past 50%, the site subtly changes — a phrase appears in the nav, the footer shows "you made it here," some element acknowledges the engagement.

**Interesting element:** Rewards genuine engagement. Creates a moment of surprise.

**Reality check:** Too easy to feel gimmicky. Too hard to get right. Skip unless you have a genuinely excellent version of this concept.

---

### 4.4 WebGL Text — Headlines as 3D Physical Objects

**What:** Primary headlines rendered as 3D text objects in a WebGL scene — casting light, having material properties, responding to cursor position with physical rotation.

**Why it's interesting:** Typography treated as sculptural object, not flat design.

**Why it won't work here:**
- Expensive
- Accessibility nightmare (WebGL text is not readable by screen readers)
- Competes with the restrained aesthetic
- Performance unacceptable on mobile

**The seed worth keeping:** Typography with subtle 3D-like behavior achieved in CSS — `perspective` transforms on hover, very subtle 3D depth without WebGL.

---

## EXPERIMENT EVALUATION PROTOCOL

Before implementing any experiment from Tier 2 or above:

```
PROTOTYPE REVIEW CHECKLIST

1. Performance test on:
   □ MacBook Pro (target)
   □ Mid-range Android phone (threshold)
   □ Older iPhone (stress test)
   
2. Isolation test:
   □ Does this experiment look good when viewed alone?
   □ Does it still look good in context of surrounding sections?
   
3. Novelty decay test:
   □ Watch the animation 20 times. Does it still feel good?
   
4. Reduced motion test:
   □ Is the content still accessible without the animation?
   
5. Narrative test:
   □ Can you describe what this communicates in one sentence?
   □ Is that sentence about something meaningful (not "it looks cool")?
   
6. Coherence test:
   □ Does this feel like it belongs with the rest of the design?
   □ Or does it feel imported from a different design system?
```

Pass all 6 criteria → proceed.
Fail any 1 → prototype further or cut.

---

*Experimentation is a practice, not a phase.*
*The portfolio will continue to evolve. New experiments will always be possible.*
*The discipline is in knowing what to keep.*

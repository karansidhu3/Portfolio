# SITE_ARCHITECTURE.md — Site Structure & Narrative Architecture

> This document defines what exists on the site, in what order, and why.
> The structure is a narrative — it has a beginning, a middle, and an end.
> Every section earns its position by advancing that narrative.

---

## 1. STRUCTURAL PHILOSOPHY

### 1.1 Scene-Based Architecture

The site is not a page with sections. It is a sequence of scenes. Each scene:
- Has an emotional purpose
- Has a clear entry and exit
- Advances the narrative in a specific direction
- Can be understood in isolation, but gains meaning in context

Think: film sequence, not web page.

### 1.2 Information Architecture Principle

The IA should move from **atmospheric** (who is this person, what is the feeling?) to **specific** (what have they built, how does it work?) to **human** (what do they care about, how do you reach them?).

This mirrors how trust is built: presence first, evidence second, person third.

### 1.3 URL Structure

```
/                    — Main portfolio experience (single-page primary)
/work/[slug]         — Project detail pages (deep dives)
/lab                 — Optional: experimental playground
```

The main page is the primary cinematic experience. Project detail pages are entered as optional depth — for visitors who want to go further. A visitor who only sees the main page should have a complete impression.

---

## 2. SCENE MAP

### SCENE 0 — ENTRY / PRE-LOADER (Optional)

**Emotional purpose:** Signal quality from the first frame. Create the expectation that this is different.

**Duration:** 1.5–2.5 seconds (no longer — respect the visitor's time)

**What happens:**
- Minimal branded element appears (wordmark or initials)
- Very brief atmospheric moment — not a loading bar, not a progress meter
- Transition: dissolve into hero

**When to include:** Only if the hero itself requires asset loading. If the hero is CSS/text-driven (fast), skip the pre-loader entirely. A pre-loader that's longer than asset loading is an anti-pattern.

**Visual:** Single element, centered, subtle animation. Name or "K." or a custom mark. Dark background. Nothing else.

---

### SCENE 1 — HERO

**Emotional purpose:** Establish presence. Create the first moment of "this is different." Communicate identity in the first 5 seconds.

**Narrative job:** The visitor just arrived. They don't know if they should stay. The hero's job is to make them stay.

**Structure:**

```
Layer 0 (Background):
  — Atmospheric procedural element (very subtle — could be a slow grain 
    texture, a barely visible geometric system, or pure darkness)
  — This should be felt more than seen

Layer 1 (Typography):
  — Name: "Karan" — large, confident, single weight
  — Descriptor line: spare, precise, not a job title
    Example: "Software engineer building intelligent systems"
    Anti-example: "Full-stack developer & AI enthusiast"
  — This text arrives with deliberate, unhurried animation

Layer 2 (Subtext):
  — 2–3 lines of contextual framing
  — Specific, not general
  — Written with voice

Layer 3 (Navigation prompt):
  — Very subtle scroll indication — arrow, or text
  — Should appear after main content has settled
```

**Animation sequence:**
1. `t=0` — background atmospheric element fades in (2s, barely perceptible)
2. `t=0.3s` — name arrives (fade + drift up, 900ms, easeOutExpo)
3. `t=0.9s` — descriptor appears (300ms stagger after name)
4. `t=1.8s` — subtext fades in (600ms)
5. `t=3s+` — scroll indicator appears

**Interaction:** 
- Cursor moves → very subtle atmospheric layer responds (parallax, magnetic)
- On scroll begin → hero elements begin exiting (fade, scale down slightly)

**Copy direction:** The headline is not a job title. It is a statement of orientation. "I build software that thinks." or a specific, confident claim about what this person makes.

---

### SCENE 2 — SIGNAL / ORIENTATION

**Emotional purpose:** Bridge between atmospheric arrival and specific work. Orient the visitor in the space.

**Narrative job:** "Here is the shape of what I do." Not a bio, not a project list — a statement of the approach.

**Structure:**
- Short, high-impact typographic statement (2–4 lines, large)
- Perhaps a simple horizontal list of orientations (3 items, spare)
  Example: `AI Systems  ·  Full-Stack  ·  Product Craft`
- A brief (3–4 sentence) framing paragraph — the clearest statement of the engineering philosophy

**Animation:**
- Scroll-triggered reveal, staggered text lines
- The horizontal orientation list has a subtle kinetic treatment (lines draw in from left)

**Visual feel:** This section can be visually spare — almost blank. The content is dense in meaning, not in visual elements. The visual sparseness communicates confidence.

**Transition out:** As visitor scrolls further, this section fades with a gentle overlay, revealing the first project scene beneath.

---

### SCENE 3 — WORK / PROJECT NARRATIVE (First Project)

**Emotional purpose:** Shift from who to what. The first project is the strongest argument for the engineering philosophy stated in Scene 2.

**Narrative job:** Demonstrate, through a specific artifact, the depth and care of the work.

**Project: MarketMind AI (recommended first — most technically sophisticated)**

**Structure:**

```
3.1 — Problem Frame
  Visual: Text only or minimal abstract graphic
  Copy: 2–3 sentences. The real problem, honestly stated.
  "Real-time market intelligence is noise at scale. The meaningful signal
   is buried under the irrelevant. I built a system that knows the difference."
  Duration on screen: User-controlled (scroll-driven)

3.2 — Cinematic Reveal
  Visual: The interface or key visual, revealed with cinematic motion
  Method: Clip-path expansion, or scale reveal from center
  A genuinely impressive visual moment — but earned, not forced
  Duration: 1.5s reveal animation

3.3 — Interface Showcase
  Visual: Actual interface screenshots or live demo embed
  Interaction: Hover shows details, possible light carousel
  Copy: Spare labels only — no paragraphs here

3.4 — Architecture Diagram
  Visual: Custom SVG system diagram (drawn-in animation via ScrollTrigger)
  This is a signature moment — the diagram communicates systems thinking
  Show: data pipeline, agent architecture, key components
  Animation: Lines draw progressively as user scrolls through section

3.5 — Engineering Insights
  Visual: Code-adjacent design — monospace, technical
  Copy: 3–4 technical insights worth sharing
  Format: Brief numbered observations, not a technical essay
  Example: "1. Embeddings similarity over keyword matching eliminated 
              67% of irrelevant signals in initial testing."

3.6 — Outcome
  Visual: Simple, confident
  Copy: What exists. What it does. Honest assessment.
```

**Animation across 3.x:**
- Each sub-section is a scroll-triggered event
- The project scene feels like scrolling through a case study — depth, then more depth
- Total scroll distance for this scene: approximately 200–300vh

**Section pinning consideration:** The project interface showcase (3.3) could be pinned — the interface remains while the user scrolls through details that update around it. This is the one place scroll-pinning is most defensible.

---

### SCENE 4 — WORK / PROJECT NARRATIVE (Second Project)

**Project: Folio / CareerOS (alternating based on deployment status)**

**Emotional purpose:** Show range. The first project established technical depth. This project shows product thinking and real-world application.

**Structure:** Same sequence as Scene 3, but with a different visual register:
- Different compositional approach (if Scene 3 was left-heavy, this is right-heavy or full-width)
- Different atmospheric texture
- If the first project felt precise and data-driven, this one feels more human and product-focused

**Visual differentiation:** Each project scene should feel like entering a different "world" without abandoning the design system. Differentiation achieved through:
- Dominant screenshot color palette of the actual product
- Background atmosphere (this project might have a slightly warmer, lighter bg)
- Different diagram style

---

### SCENE 5 — WORK / PROJECT NARRATIVE (Third Project — if available)

**Project: Timekeep (or TBD project)**

**Structure:** Slightly compressed version of the full narrative. Third project should trust the pattern established by the first two and be able to move faster.

**Alternative approach for third+ projects:** Instead of a full cinematic sequence, a "project shelf" — a more structured, less immersive view of 2–3 additional projects in a spatial grid. This acknowledges that visitor attention naturally reduces through scroll depth and presents remaining work efficiently.

---

### SCENE 6 — ABOUT

**Emotional purpose:** Make this a person, not a portfolio. Build trust through specificity.

**Narrative job:** The work has made the argument. Now the person needs to make themselves legible. Not a bio — a perspective.

**Structure:**
```
6.1 — Core Statement
  Not "Hi, I'm Karan, a software engineer based in Kelowna."
  Something closer to: a specific belief about how software should be built.
  2–4 sentences. Your actual voice.

6.2 — Background (Compressed)
  Timeline or structured narrative — not a resume dump
  Key: UBC CS + Data Science, the formative projects, the shift toward AI systems
  Visual: Could be a subtle horizontal timeline, typographic

6.3 — What I'm Building
  Present tense. The active direction. Creates forward momentum.
  This is the most important part of the about section — it tells the visitor
  what they're investing in by hiring this person.

6.4 — Tools / Technologies (Restrained)
  Not a logo wall. A brief structured list or a prose description.
  "I primarily work in TypeScript, Python, and SQL — the tools that disappear 
   and let you think about the problem."
  
6.5 — Outside the Work (Optional)
  1–2 lines. Human. Not performing interests — an actual detail that reflects 
  something real.
```

**Animation:** This section animates more gently than the project sections. The motion should feel like conversation, not cinematic spectacle.

**Visual:** Clean, spare, text-dominated. This is the section that can afford the most whitespace.

---

### SCENE 7 — CONTACT

**Emotional purpose:** Make the next step feel natural, not forced.

**Narrative job:** The portfolio has made its argument. The visitor who has reached here is engaged. Now make it easy and comfortable to reach out.

**Structure:**
```
7.1 — Final Statement
  Not "Let's work together!" 
  Something more specific: an invitation that qualifies itself.
  "I'm looking for roles where I can work on AI systems that matter.
   If that sounds like you, I'd like to talk."

7.2 — Contact Methods
  Email (primary — direct, no form preferred for simplicity)
  LinkedIn (secondary)
  GitHub (for code-first visitors)
  
7.3 — Current Status Signal
  "Currently open to opportunities in [location/remote]"
  This is practical information that saves everyone time.
```

**Animation:** Quiet, final. No large reveals. The contact section should feel like the natural end of a conversation.

**Visual:** Could use the light-on-dark inversion here — a moment of openness after the richness of the project scenes.

---

### SCENE 8 — FOOTER

**Purpose:** Practical information + subtle identity signature.

```
Copyright
Site built by me (brief tech note — optional)
Last updated
Links (privacy policy if any, source code if desired)
```

**Visual:** Very minimal. 20–30px text. The footer is intentionally not a destination.

---

## 3. NARRATIVE TRANSITIONS

### Section-to-Section Transitions

```
Hero → Signal:          Subtle atmospheric fade, hero text exits upward
Signal → Work (1):      Atmospheric texture shifts, project world enters from below
Work (1) → Work (2):    Project world exits left, new world enters from right
                        (or: brief transition scene — dark frame, project number)
Work (2) → Work (3):    Same pattern, establishing visual language of project changes
Work (3) → About:       Significant atmospheric shift — the page breathes out
About → Contact:        Gentle, simple, text-driven
Contact → Footer:       No transition needed — clean cut
```

### The "Project World" Transition

The most important transition in the site is the movement between project scenes. The visitor should feel they are **entering a different space**, not scrolling to the next card.

Proposed treatment:
1. Current project content exits (scale down, fade)
2. Brief atmospheric pause — dark, with only project number visible
3. New project's atmosphere begins materializing (background shift)
4. New project headline arrives
5. Full project content reveals

Total transition duration: 1.5–2.5 seconds (this is a significant moment, not a quick swap).

---

## 4. MOBILE SITE ARCHITECTURE

On mobile, the site maintains the same scene sequence but with modifications:

```
Scene 0 (Preloader):  Simplified or removed
Scene 1 (Hero):       Full viewport, typography scales down
Scene 2 (Signal):     Present, slightly compressed
Scene 3–5 (Work):     Project narratives present but:
  - No scroll-pinning
  - Diagrams simplified or static
  - Interface showcases shown as scrollable galleries
  - Architecture diagrams: simplified SVG or static
Scene 6 (About):      Full, unchanged
Scene 7 (Contact):    Full, unchanged
```

---

## 5. INFORMATION ARCHITECTURE

### What is Communicated at Each Level

```
LEVEL 1: First impression (0–5 seconds)
  — Identity: this is Karan
  — Register: this is different from a generic portfolio
  — Quality: this was made with care

LEVEL 2: Engagement (5–30 seconds)
  — Orientation: what kind of engineer, what kind of work
  — Quality of thought: the Signal section paragraph
  — Curiosity: the beginning of the first project scene

LEVEL 3: Investment (30s–5 minutes)
  — Project depth: the full project narrative sequences
  — Systems thinking: the architecture diagrams
  — Specificity: the engineering insights sections

LEVEL 4: Trust (end of visit)
  — Person: the about section voice
  — Context: background, current trajectory
  — Accessibility: contact information, current status
```

### Navigation Philosophy

The site's primary navigation is **scroll** — the visitor moves through the narrative by scrolling.

Secondary navigation: a minimal floating element (appears after scrolling past hero):
```
"Work" — anchor to project section
"About" — anchor to about section  
"Contact" — anchor to contact section
```

This nav is:
- Very small (12–14px type)
- Low opacity at rest (60%), full opacity on hover
- Appears on scroll past hero, disappears near contact section
- Does not compete with content

---

## 6. PROJECT DETAIL PAGES (Optional)

For visitors who want the full depth — the case study, the technical write-up — project detail pages provide an expanded version of each project narrative.

### Structure of a Project Detail Page

```
1. Project Identity
   — Name, category, duration
   
2. TL;DR
   — 3 sentences: problem, solution, outcome
   — For visitors who are evaluating quickly

3. Context
   — Why this problem mattered
   — Why this approach was chosen

4. Process
   — Key decisions
   — Non-obvious solutions
   — What was tried and abandoned

5. Technical Architecture
   — Full system diagram
   — Key components and their relationships
   — Technology choices and rationale

6. Interface
   — Screenshots, video, or live embed

7. Engineering Highlights
   — The 3–5 most interesting technical problems solved

8. Reflection
   — What would be done differently
   — What was learned

9. Back navigation
   — Return to portfolio with context (visitor knows where they came from)
```

### Project Page Visual Treatment

Project detail pages share the design system but can push the visual language further than the main portfolio page — since visitors who navigate here have demonstrated deeper interest.

Each project detail page should have a unique atmospheric background that reflects the project's domain.

---

*The architecture is complete when every scene has a clear purpose and every transition has emotional reasoning.*
*Do not add scenes to add content — serve the narrative.*

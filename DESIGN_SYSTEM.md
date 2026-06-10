# DESIGN_SYSTEM.md — Visual Design System

> This document defines the complete visual language of the portfolio.
> It governs every aesthetic decision: type, color, space, depth, composition.
> Deviating from this system requires explicit documented justification.

---

## 1. TYPOGRAPHY SYSTEM

### 1.1 Type Philosophy

Typography is the primary visual instrument in this design system. Before any other design decision is made, the typography must be resolved — because it sets the emotional register for everything else.

**Core belief:** In a restrained, intelligent design system, you do not need more than two typefaces. You do not even need custom illustration if the typography is handled with enough care.

### 1.2 Typeface Selection

**Primary: Editorial Sans / Inter Variable (decision pending)**

The primary typeface should be a premium, variable-weight sans-serif with strong letterform quality at large display sizes. Candidates:

| Option | Character | Best For | Decision Weight |
|---|---|---|---|
| **Neue Montreal** | Geometric intelligence, French editorial | Headlines and body | ★★★★★ |
| **General Sans** | Accessible, contemporary, system-familiar | If system-neutral feel desired | ★★★★☆ |
| **Inter Variable** | Technical precision, UI-native | Body + technical | ★★★☆☆ |
| **Satoshi** | Geometric, clean, free | Budget-conscious | ★★★☆☆ |
| **Aeonik** | Premium, editorial, Apple-adjacent | If licensing permits | ★★★★★ |

*Recommendation: Neue Montreal (licensed via Pangram Pangram) for headlines + Inter Variable for body/UI. Or source a single excellent variable font that serves both roles.*

**Monospace: JetBrains Mono or Geist Mono**
Used exclusively for: code snippets, technical labels, data values, architecture annotations.

### 1.3 Type Scale

A modular scale based on a ratio of 1.25 (Major Third), with key cinematic overrides at the largest sizes.

```
--text-xs:    0.75rem   / 12px   — labels, metadata, timestamps
--text-sm:    0.875rem  / 14px   — captions, secondary info
--text-base:  1rem      / 16px   — body text baseline
--text-lg:    1.25rem   / 20px   — lead copy, intro paragraphs
--text-xl:    1.5rem    / 24px   — section subheadings
--text-2xl:   2rem      / 32px   — secondary headings
--text-3xl:   2.5rem    / 40px   — primary headings
--text-4xl:   3.5rem    / 56px   — hero section (desktop)
--text-5xl:   5rem      / 80px   — cinematic headline (desktop)
--text-6xl:   7rem      / 112px  — max cinematic scale (desktop only)
```

**Mobile scaling:** Cinematic sizes reduce more aggressively on mobile — `--text-6xl` becomes `--text-3xl` on mobile. The reading experience must never be compromised by misscaled type.

### 1.4 Font Weight Usage

Variable font range: 300–800

```
300 (Light)     — atmospheric headlines, large display text with visual fragility
400 (Regular)   — body text, all running copy
500 (Medium)    — UI labels, navigation, subtle emphasis
600 (Semibold)  — section headings, important UI text
700 (Bold)      — strong emphasis, key callouts
800 (Extrabold) — cinematic display moments ONLY, used extremely sparingly
```

**Anti-pattern:** Do not mix more than two weights in a single viewport section. Hierarchy through scale and spacing first; weight as a secondary tool.

### 1.5 Line Height

```
display:    1.0–1.1   — cinematic headlines (tight, editorial)
heading:    1.2–1.3   — section headings
body:       1.6–1.7   — running copy (generous for readability)
ui:         1.4       — labels, buttons, navigation
mono:       1.5       — code blocks
```

### 1.6 Letter Spacing

```
display:    -0.03em to -0.02em   — tight tracking on large type (editorial)
heading:    -0.01em to 0         — slightly tightened
body:       0 to 0.01em          — neutral to very slightly open
uppercase:  0.08em to 0.12em     — required for all-caps labels
```

**Rule:** Large type should track tightly. Small type should track neutrally or slightly openly. Never tighten small body text.

### 1.7 Typography Patterns

```
PATTERN: Cinematic Hero Headline
  Font: Primary, weight 300 or 800 (contrast)
  Size: --text-5xl / --text-6xl
  Tracking: -0.03em
  Leading: 1.0
  Use: One per page, maximum

PATTERN: Section Heading
  Font: Primary, weight 500
  Size: --text-2xl / --text-3xl
  Tracking: -0.01em
  Leading: 1.2
  Use: Once per major section

PATTERN: Lead Paragraph
  Font: Primary, weight 400
  Size: --text-lg
  Leading: 1.7
  Max-width: 65ch
  Use: First paragraph of any narrative section

PATTERN: Technical Label
  Font: Monospace, weight 400
  Size: --text-xs / --text-sm
  Tracking: 0.08em
  Transform: uppercase
  Color: text-secondary
  Use: Diagrams, metadata, system annotations

PATTERN: Project Number
  Font: Monospace, weight 300
  Size: --text-xs
  Tracking: 0.1em
  Transform: uppercase
  Use: Section identifiers
```

---

## 2. COLOR SYSTEM

### 2.1 Color Philosophy

This is a primarily monochromatic system. Color is used to create depth and hierarchy through value (light/dark), not through hue variety. The one accent color exists to mark moments of significance — it should feel like a reward for attention, not a decorative feature.

**Anti-pattern:** Adding color to sections because they feel "boring." If a section feels boring with monochrome, the problem is the layout or content, not the color system.

### 2.2 Core Palette

```css
/* Backgrounds */
--color-bg-primary:    #0A0A0A;   /* Near-black. Slightly warm. Not pure #000. */
--color-bg-secondary:  #111111;   /* Surface cards, raised elements */
--color-bg-tertiary:   #1A1A1A;   /* Slightly elevated components */
--color-bg-inverse:    #F5F2EE;   /* Light mode / section inversion (use sparingly) */

/* Text */
--color-text-primary:  #F0EDE8;   /* Primary text — warm white, not pure white */
--color-text-secondary:#8A8580;   /* Secondary — muted, slightly warm gray */
--color-text-tertiary: #525250;   /* Tertiary — for metadata, labels */
--color-text-inverse:  #1A1917;   /* Text on light backgrounds */

/* Borders & Dividers */
--color-border:        rgba(255,255,255,0.08);   /* Extremely subtle dividers */
--color-border-strong: rgba(255,255,255,0.15);   /* Visible borders when needed */

/* Accent — ONE accent color, used sparingly */
--color-accent:        #C8B89A;   /* Warm muted gold. Not yellow, not orange. */
--color-accent-subtle: rgba(200, 184, 154, 0.15); /* Accent at low opacity for backgrounds */

/* System */
--color-error:         #E05C5C;   /* Errors only */
--color-success:       #6BBF8A;   /* Success states only */
```

### 2.3 Color Usage Rules

**Background hierarchy:** The primary background is the darkest value. Each "layer" above it gets marginally lighter. This creates depth without explicit shadows.

```
z-level 0: --color-bg-primary    (page background)
z-level 1: --color-bg-secondary  (cards, panels)
z-level 2: --color-bg-tertiary   (hover states, active states)
z-level 3: --color-text-tertiary (borders, dividers in z-level 2)
```

**Text hierarchy:**
```
Body copy:         --color-text-primary
Supporting copy:   --color-text-secondary
Labels/metadata:   --color-text-tertiary
Accent moments:    --color-accent
```

**Accent color rules:**
- Maximum 3 uses per page
- Never on body text
- Appropriate for: active navigation items, key numerical data, progress indicators, one meaningful typographic accent
- Never for: backgrounds, borders (except in very specific components), multiple elements in the same section

### 2.4 Section Color Moments

Certain sections may invert — going from dark to light — to create a narrative beat. This should happen maximum twice in the full page experience and requires deliberate compositional planning.

Light section rules:
- Background: `--color-bg-inverse`
- Text: `--color-text-inverse`
- The section should feel like a deliberate exhale, not a design mistake
- Transition between dark and light requires a dedicated transition treatment (gradient fade or masked reveal)

---

## 3. SPACING SYSTEM

### 3.1 Spacing Scale

Base unit: `4px` (0.25rem)

```
--space-1:   4px    / 0.25rem
--space-2:   8px    / 0.5rem
--space-3:   12px   / 0.75rem
--space-4:   16px   / 1rem
--space-6:   24px   / 1.5rem
--space-8:   32px   / 2rem
--space-10:  40px   / 2.5rem
--space-12:  48px   / 3rem
--space-16:  64px   / 4rem
--space-20:  80px   / 5rem
--space-24:  96px   / 6rem
--space-32:  128px  / 8rem
--space-40:  160px  / 10rem
--space-48:  192px  / 12rem
--space-64:  256px  / 16rem
```

### 3.2 Spacing Philosophy

**Generous vertical spacing is a quality signal.** Crowded sections communicate anxiety and insecurity. Spacious sections communicate confidence.

Section padding minimum: `--space-24` top and bottom on desktop, `--space-16` on mobile.

**Line-level spacing:** The gap between a headline and its supporting paragraph should be at least `--space-8`. Never allow headline and body to be visually attached.

**Component internal spacing:** Use the 4px base grid consistently. Never use arbitrary pixel values.

### 3.3 Macro Spacing (Section-Level)

Full-height sections (cinematic scenes): `100vh` minimum height.
Content sections: `min-height: 80vh` to ensure scenes feel substantial.
Between sections: transitions handled by scroll, not by gap — sections butt against each other and transitions are motion-driven.

---

## 4. GRID SYSTEM

### 4.1 Base Grid

12-column grid on desktop, 4-column on mobile.

```
Desktop (>1024px):
  Columns: 12
  Gutter:  24px
  Margin:  80px (desktop) / 40px (tablet)

Tablet (768–1024px):
  Columns: 8
  Gutter:  20px
  Margin:  40px

Mobile (<768px):
  Columns: 4
  Gutter:  16px
  Margin:  20px
```

### 4.2 Key Column Assignments

```
Full-width narrative (hero):          12/12 columns
Cinematic reveal content:             8/12 centered, offset left or right
Body copy / project narrative:        6/12 (max-width: 65ch enforced separately)
Side-by-side content:                 5/12 + 5/12 + gutters
Technical diagrams:                   10/12 centered
Footnotes / metadata:                 4/12 — either edge
```

### 4.3 Off-Grid Moments

Intentional off-grid placement (elements bleeding slightly past grid columns) can be used to create visual tension and cinematic composition. Rules:
- Used maximum once per section
- Always intentional, never accidental
- The off-grid element must be the focal point of that moment

---

## 5. DEPTH SYSTEM

### 5.1 Layering Philosophy

Depth is communicated through:
1. **Scale** — foreground elements are larger
2. **Opacity** — background elements are more transparent
3. **Blur** — background elements have slight blur
4. **Motion parallax** — layers move at different rates during scroll
5. **Color value** — background surfaces are slightly lighter (in dark mode)

Not through: box shadows, drop shadows, border-radius nesting.

### 5.2 Z-Layer System

```
z-index:
  --z-base:        0      — page background
  --z-content:     10     — standard content
  --z-overlay:     100    — atmospheric overlays (procedural bg)
  --z-card:        200    — raised component surfaces
  --z-sticky:      500    — sticky/pinned elements
  --z-nav:         900    — navigation
  --z-modal:       1000   — modals / full-screen overlays
  --z-tooltip:     1100   — tooltips
```

### 5.3 Parallax Depth Rules

Three-layer parallax system:
- **Background layer** (0.1–0.2 multiplier): atmospheric elements, procedural backgrounds
- **Midground layer** (0.4–0.6 multiplier): section context elements
- **Foreground layer** (1.0 multiplier): primary content — moves at scroll speed

Performance rule: Parallax elements must use `transform: translateY()` only. No `top` or `margin` animation. Must be compositor-layer promoted (`will-change: transform`, removed after exit).

---

## 6. COMPONENT PHILOSOPHY

### 6.1 Atomic Structure

Components are organized by complexity:
```
Tokens      → CSS variables (type, color, space, z-index)
Primitives  → Text, Icon, Divider, Label
Elements    → Button, Link, Tag, Badge
Components  → Card, Panel, NavigationItem
Sections    → HeroSection, ProjectScene, AboutSection
Compositions→ ProjectNarrative, ArchitectureDiagram
```

### 6.2 Component Design Principles

**No hardcoded values.** Every color, size, and spacing value should reference a CSS variable from the design token system.

**Props over variants.** Where possible, component variants should be expressed through props, not through separate component files.

**Motion as a separate concern.** Components do not contain their own scroll-driven animation logic. They accept animation state as props from parent animation controllers.

### 6.3 Visual Component Standards

**All interactive components must have:**
- Default state
- Hover state (with transition)
- Active/pressed state
- Focus state (keyboard navigation)
- Disabled state (where applicable)

**Focus states** must be visible and intentional. Suggested: a `2px` offset outline in `--color-accent` at 60% opacity, with a subtle scale that communicates "this is selected."

---

## 7. VISUAL RHYTHM

### 7.1 Repetition and Variation

Good visual design creates a rhythm — a pattern the eye can follow — and then intentionally breaks it at moments of significance. Consistent section structure (same column usage, same spacing rhythm) creates the pattern. Cinematic moments (full-bleed, off-grid, inverted color) are the breaks.

**Rule:** Establish the rhythm in the first two sections before breaking it. Never break it twice in succession.

### 7.2 Visual Weight Distribution

Each section should have a clear visual center of gravity. The eye should know where to look first. This is achieved through:
- Typographic hierarchy (largest element = entry point)
- Contrast (lightest or most saturated element = focal point)
- Motion (moving element = first attention)

Never create sections where two elements compete for primary attention.

---

## 8. CINEMATIC COMPOSITION PRINCIPLES

### 8.1 Rule of Thirds (Adapted)

Not as a rigid grid, but as a principle: important content sits at the intersection of thirds, not at the center. Centered composition is used deliberately for moments of maximum formality or impact — not as a default.

### 8.2 Negative Space as Composition

The empty space in a composition is as deliberate as the filled space. Large empty areas create tension, anticipation, and visual weight. Do not fill them.

### 8.3 Cinematic Framing

Think of each section as a camera shot. Different shots serve different purposes:
- **Wide shot** (full-bleed, small content): establishing context, creating atmosphere
- **Medium shot** (content filling 60–70% of viewport): primary narrative content
- **Close shot** (zoomed, large typography): emotional emphasis, key moments

Sequencing these shot types through the page creates cinematic variety.

---

*This system is a living document.*
*Decisions that deviate from it should be documented with reasoning.*
*Over time, this document should become more specific, not more vague.*

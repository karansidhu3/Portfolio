# Portfolio Redesign Strategy — v2

> Document the creative direction before cutting code. This governs all v2 decisions.

---

## 1. Current Design Diagnosis

The current portfolio has strong foundations — a genuine atmospheric system, correct dark palette, well-reasoned animation philosophy, and real typographic intent. The codebase is clean and the design thinking is articulated.

The problem is not execution quality. The problem is **creative ambition**. The stated aesthetic (cinematic, atmospheric, signature) exceeds what was actually built. What exists is a very well-made conventional creative portfolio — not an award-level digital experience.

---

## 2. What Feels Generic or Outdated

- **Hero typography**: Name in two lines with a horizontal rule and descriptor below — this was 2021-2023's signature creative portfolio pattern. It's expected now.
- **Signal section**: Large statement text + body paragraph is the "mission statement" block found on every agency site.
- **Project entry frames**: 85vh of architectural emptiness + large watermark number. Once distinctive; now widely imitated.
- **Grid layouts**: Every section uses the same 12-col / 5–7 split formula.
- **Contact section**: Minimal heading + email link is a functional non-decision.

---

## 3. What Lacks Emotional Impact

- No single interaction that a visitor would remember five minutes after leaving.
- Motion is consistent and correctly executed but never surprising — every animation arrives, translates, settles. No tension, no silence, no misdirection.
- The atmospheric system is sophisticated but passive. It exists in the background and never becomes foreground.
- Nothing forces engagement. The page is consumed; it is not navigated or explored.

---

## 4. Structural Weaknesses

- The hero bleeds immediately into another text section (Signal) at the same emotional register.
- No breathing room or tonal shift between scenes.
- The site reads: identity → statement → projects × 3 → about → contact. This is every portfolio.
- No section distinguishes this portfolio from 10,000 others beyond execution quality.

---

## 5. Interaction Weaknesses

- Scroll-reveal animations (opacity + y) appear on 90% of interactive elements.
- Hover states are minimal color changes only — no physical quality.
- No exploration mechanic. The visitor moves through the site; they never move within it.

---

## 6. Motion Weaknesses

- The word-clip rise reveal is used three or more times (Hero, About, ProjectEntryFrame). It was distinctive the first time.
- All motion moves in the same direction (upward). No grammar diversity.
- No scrubbed/direct-control motion beyond the atmosphere cross-fades.

---

## 7. Typography Weaknesses

- Hero name at 7rem, weight 200, tight tracking: technically correct, not distinctive.
- Type is used as content delivery, not as a spatial or architectural tool.
- The Geist/Geist Mono pairing is underused as a design voice.

---

## 8. Atmosphere Problems

- The AtmosphereController transitions are too subtle to create a perceptible register change.
- The grain overlay is good but currently competes with nothing — it needs contrast to be felt.
- The warm/cool tension is genuine but never becomes the visual subject.

---

## 9. Opportunities for Signature Moments

1. **Scroll-driven image sequence** — An internal-scroll cinema portal. Nothing like this exists on developer portfolios. Up to 65 JPG frames, canvas-rendered, scrubbed via component-internal scroll. This is the site's memory.
2. **Name at expanded scale** — Weight 100, font-size 11vw, treating the letterforms as architectural objects. Not "bigger text" but "different relationship with text."
3. **Marquee band** — Infinite horizontal ticker between sections, ultra-small monospace. Creates a "living" quality in a transitional space.
4. **Contact as typographic resolution** — The email address at 3.5vw in mono, line-broken editorially. The site's last typographic event.
5. **Metrics in About** — Engineering statistics as editorial catalog entries.

---

## 10. Proposed Creative Direction

**Theme**: Precision in Motion — the portfolio of an engineer who thinks in systems and authors with care.

**Emotional arc**: Presence (hero) → Evidence (sequence) → Declaration (signal) → Depth (projects) → Trust (about) → Invitation (contact).

**Reference feeling**: The restraint of a fashion house lookbook applied to a technical portfolio. A24 title card pacing. Linear's typographic intelligence. Apple product film patience.

---

## 11. Proposed Visual Language

- Hero name: weight 100, 11vw, treating letters as spatial objects
- Monospace meta-text as design elements (coordinates, indices, years)
- Thin 1px borders as spatial organizers
- Canvas-rendered image sequences
- Marquee tickers as living separators
- Large email address as final typography
- Film-style vignette on sequence portal
- Grain stays; it earns its place

**Color**: no changes to the palette — it's genuinely excellent.

---

## 12. Proposed Motion Philosophy

Each section gets exactly one motion vocabulary word it hasn't used before:
- Hero: clip-rise (existing, keep)
- Sequence: physical scrub via internal scroll (new, direct control)
- Marquee band: infinite CSS translate (new, continuous)
- Signal: horizontal extension from a point (new direction)
- Projects: clip-rise (existing, appropriate for titles)
- About: counter tick-up on metrics (new, mechanical)
- Contact: no animation — the email address exists, patient, waiting

---

## 13. Proposed Interaction Philosophy

One section invites exploration rather than consumption: the ScrollSequence. The internal scroll mechanic is the only moment where the visitor must act, not just observe. By contrast, this makes it the most memorable.

---

## 14. Section-by-Section Redesign Plan

### Hero (Scene 1)
- Name: weight 100, `clamp(4rem, 11.5vw, 14rem)`, letterSpacing -0.02em (more architectural)
- Add: top metadata strip — small mono text, "01" on left, "2025 · Kelowna" on right
- Remove: right-column subtext paragraph ("I build AI-native products…")
- Keep: descriptor as single line below rule
- Animation: same clip-rise, add metadata fade at t=0

### Marquee Band (NEW — between Hero and Reel)
- Full-width infinite horizontal ticker
- Ultra-small monospace text: skill/tech keywords + project names
- 1px border top and bottom
- CSS animation (no JS), respects reduced-motion

### ScrollSequence Section (NEW — Scene 1.5)
- Full-width, 80vh display height
- Internal scroll container captures scroll independently of page
- Canvas rendering: `object-fit: cover` via drawImage
- Up to 65 JPG frames
- Preload all images in parallel with loading bar
- Vertical progress bar (right edge, 1px accent)
- Frame counter (bottom-right, mono)
- Per-frame captions (bottom-left, mono)
- Scroll hint that disappears after first interaction
- Vignette overlay (edge darkening)
- Placeholder state when no frames provided
- Reduced motion: static first frame only

### Signal (Scene 2)
- Remove: tags row (AI Systems · Full-Stack · Product Craft) — redundant with About
- Statement: larger scale `clamp(2.25rem, 3.8vw, 4.5rem)` (up from 3.2vw)
- Keep: body paragraph (it's good content)
- Add: thin 1px left border on content column (draws in via scaleY on scroll trigger)

### Projects (Scenes 3–5)
- ProjectEntryFrame: reduce from 85vh to 70vh (less padding, same composition)
- Watermark: opacity 0.07 → slightly more present
- Content sections: no structural change (they're solid)

### About (Scene 6)
- Add: metrics row before the heading — 4-column catalog band
  - `03` Projects shipped
  - `2+` Years building AI systems
  - `TypeScript · Python · SQL` Primary stack
  - `UBC CS · 2026` Institution
- Keep: heading word-reveal (good)
- Keep: body prose
- Remove: bottom metadata strip (covered by metrics row)

### Contact (Scene 7)
- Statement heading: smaller `clamp(1rem, 1.6vw, 1.75rem)` (was 2.4vw)
- Email address: large `clamp(2rem, 3.5vw, 4.5rem)`, monospace, broken across two lines
- Social links: keep, below
- This section is now typographically dominated by the email address

### Footer
- Simplify to: left "KS", center "2025", right "karan sidhu"
- Single line, same border treatment

---

## 15. Navigation Redesign

Current `Navigation.tsx` (floating right) stays but gets refined:
- Current position (top-right) is architecturally fine for this design
- Consider: switch to `SiteNav.tsx` for the top-bar treatment (includes KS wordmark)
- SiteNav delay: reduce from 3.5s to 0.6s — the nav shouldn't wait for the whole hero

---

## 16. Layout Restructuring

- Hero: remove 2-column below-rule layout → single column, left-aligned
- Reel: full-width (no grid-container), edge-to-edge
- Signal: keep grid but make statement 10 of 12 cols (from 9)
- About: new 4-column metrics band, then existing 2-column prose
- Contact: single column, wider proportions

---

## 17. Performance Considerations

- ScrollSequence preloads all frames in parallel. For 65 frames × ~150KB = ~10MB. Acceptable.
- Canvas rendering: O(1) per frame swap, zero layout reflow.
- ResizeObserver handles canvas dimension sync without window.resize polling.
- Marquee uses CSS `transform: translateX` animation — GPU composited, zero JS.
- All animations remain on `transform` and `opacity` only.

---

## 18. What Gets Removed Entirely

1. **Right-column hero subtext** ("I build AI-native products where engineering depth and product thinking happen in the same head") — redundant with About section
2. **Signal tags row** (AI Systems · Full-Stack Engineering · Product Craft) — redundant
3. **About section bottom metadata strip** — replaced by the metrics row
4. **Navigation.tsx floating nav** — replaced with SiteNav

---

## 19. What Becomes a Focal Point

1. **ScrollSequence** — the site's signature interaction and memory
2. **Hero name at expanded scale** — architectural typography
3. **Contact email at large mono scale** — the final frame
4. **Marquee band** — living quality in transitional space

---

## 20. Implementation Roadmap

### Phase 1 — The Signature Feature (This Session)
- [x] Strategy document
- [ ] ScrollSequence component
- [ ] MarqueeBand component
- [ ] Hero redesign (layout + typography)
- [ ] Page structure update (new sections)
- [ ] globals.css utilities

### Phase 2 — Content Sections
- [ ] Signal redesign
- [ ] About metrics row
- [ ] Contact email redesign
- [ ] Footer simplification

### Phase 3 — Nav + Polish
- [ ] SiteNav timing update
- [ ] Navigation polish
- [ ] Hover states upgrade
- [ ] ProjectEntryFrame height reduction
- [ ] Final spacing/rhythm refinement

---

*Status: ACTIVE — governs all v2 decisions*
*Owner: Karan*

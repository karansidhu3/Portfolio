# ROADMAP.md — Development Roadmap

> This roadmap is realistic for a solo developer building this alongside other projects.
> It is organized by phase, not by time. Time estimates are given but should be treated
> as guidance, not commitment. Quality gates between phases are non-negotiable.
>
> **Principle:** Deploy early. Improve continuously. A live good site beats a local perfect site.

---

## PHASE OVERVIEW

```
Phase 0: Foundation         (1–2 days)     — Setup, tokens, environment
Phase 1: Content Skeleton   (3–5 days)     — All content, basic layout, no animation
Phase 2: Design System      (3–4 days)     — Typography, color, spacing, grid
Phase 3: Motion Layer       (1–2 weeks)    — Core animations, scroll behavior
Phase 4: Project Narratives (1–2 weeks)    — Full project scene implementation
Phase 5: Experimental       (1 week)       — Experiments, prototype, cut or keep
Phase 6: Optimization       (3–4 days)     — Performance, accessibility, polish
Phase 7: Content Production (ongoing)      — Copy, screenshots, videos
Phase 8: Launch Prep        (2–3 days)     — Domain, analytics, final review
Phase 9: Ongoing            (continuous)   — Refinement, new projects
```

**Total to first deploy: 4–6 weeks of consistent part-time effort.**
**Target for "done enough to send to a job application": End of Phase 4 + Phase 8.**

---

## PHASE 0: FOUNDATION

*Goal: A working development environment with all infrastructure decisions made.*

### Tasks

- [ ] **Initialize Next.js project**
  ```bash
  npx create-next-app@latest portfolio --typescript --tailwind --app
  ```
  
- [ ] **Configure TypeScript strict mode**
  ```json
  // tsconfig.json
  { "compilerOptions": { "strict": true } }
  ```

- [ ] **Set up path aliases**
  ```json
  // tsconfig.json
  { "paths": { "@/*": ["./src/*"] } }
  ```

- [ ] **Configure Tailwind with CSS variables**
  - Define all design tokens as CSS custom properties in `globals.css`
  - Map token values to Tailwind `extend` config
  - Establish the color palette, spacing scale, and typography scale

- [ ] **Install and configure animation libraries**
  ```bash
  npm install gsap framer-motion
  npm install @gsap/react  # optional - useGSAP hook
  ```

- [ ] **Set up font loading**
  - Source and license the primary typeface
  - Add to `public/fonts/`
  - Configure `next/font` in layout

- [ ] **Configure ESLint + Prettier**
  - Enable React-specific rules
  - Configure import ordering rules
  - Set up pre-commit hooks (optional)

- [ ] **Set up Vercel project**
  - Connect GitHub repo
  - Configure environment variables (if any)
  - Verify automatic deployment works

- [ ] **Create component directory structure**
  - All empty files with placeholder exports
  - Establishes the architecture before content fills it

### Quality Gate for Phase 0

```
✓ `npm run dev` works
✓ TypeScript compiles without errors
✓ Deployed to Vercel (even if completely empty)
✓ Design tokens visible in browser devtools as CSS variables
✓ Primary font loading correctly
```

---

## PHASE 1: CONTENT SKELETON

*Goal: All content visible on the page, correctly structured, with zero animation.*
*The site should be readable and functional at the end of this phase.*

### Why This Phase Matters

Building animation on top of undefined content is a mistake. Content shapes animation decisions — the rhythm of a headline reveal depends on how many words it has, the project section animation depends on how many sub-sections exist.

Know the content before the motion.

### Tasks

- [ ] **Write all copy**
  - Hero headline + descriptor
  - Signal section statement + paragraph
  - Project problem statements (all 3)
  - Project engineering insights (3–5 per project)
  - About section (all sub-sections)
  - Contact section copy
  
  Copy should be written in the target voice. First draft is fine. The copy will be refined in Phase 7 but the structural copy must exist now.

- [ ] **Implement HTML structure for all sections**
  - Each section is a `<section>` with appropriate role/aria attributes
  - Content rendered as standard HTML (h1, h2, p, ul — semantic)
  - No custom animation logic yet
  - Basic `className` applied (Tailwind utility classes for spacing/layout)

- [ ] **Implement basic responsive layout**
  - Grid system applied to all sections
  - Mobile layout functional (basic, not refined)
  - Viewport heights set on hero and other full-screen sections

- [ ] **Add all images as static assets**
  - All screenshots at final quality
  - Optimized via `next/image`
  - Aspect ratios defined (no CLS)

- [ ] **Implement floating navigation**
  - No scroll behavior yet — just static positioning
  - Three links: Work, About, Contact
  - Anchor targets set on sections

- [ ] **Add footer**

### Quality Gate for Phase 1

```
✓ All content readable on desktop and mobile
✓ All images loading without layout shift
✓ Navigation anchors work
✓ No TypeScript errors
✓ Lighthouse performance score > 70 (baseline before animation)
✓ WCAG contrast ratios pass on all text
```

---

## PHASE 2: DESIGN SYSTEM IMPLEMENTATION

*Goal: The site looks exactly right, visually, before any animation.*
*If you could take a screenshot of every section, they would look publication-ready.*

### Why This Phase is Separate

The temptation is to jump from skeleton → animation, skipping careful visual design. This produces sites that animate beautifully but look wrong at rest. Design the final visual state first, then animate toward it.

### Tasks

- [ ] **Typography implementation**
  - All type scales applied correctly
  - All weights, tracking, and line-heights matching DESIGN_SYSTEM.md
  - Hero headline at final cinematic scale
  - Body text at final width (max-width: 65ch)
  - All monospace elements (labels, code) using correct font and tracking

- [ ] **Color implementation**
  - All sections at correct background colors
  - Text hierarchy (primary, secondary, tertiary) visible and working
  - Accent color applied to its maximum 3 uses
  - Border/divider colors correct

- [ ] **Spacing implementation**
  - Section padding applied
  - Inter-element spacing matches system
  - Grid columns applied correctly
  - Mobile spacing verified

- [ ] **Component visual states**
  - Navigation items: rest + hover (CSS only)
  - All interactive elements have visible hover states
  - Focus styles implemented and tested

- [ ] **Depth system**
  - Z-index structure correct
  - Section layering established
  - No elements accidentally above others

### Quality Gate for Phase 2

```
✓ Static screenshots of all sections look publication-ready
✓ Typography is correct across all sizes — measure actual rendered sizes
✓ All interactive elements have hover states
✓ Focus states visible on keyboard navigation
✓ The site looks intentional even without animation
✓ Lighthouse accessibility score > 90
```

---

## PHASE 3: CORE MOTION LAYER

*Goal: The fundamental animation vocabulary is implemented and working.*
*This phase establishes the motion patterns that all subsequent sections use.*

### Tasks

- [ ] **Implement GSAP context architecture**
  - `useScrollAnimation` hook
  - `useReducedMotion` hook
  - GSAP cleanup patterns verified

- [ ] **Build animation component library**
  - `RevealText` — scroll-triggered text line reveal
  - `FadeIn` — general purpose fade-in wrapper
  - `StaggerChildren` — staggered child reveal
  - `ParallaxLayer` — parallax wrapper with config props
  - `CinematicReveal` — clip-path reveal for images

- [ ] **Implement hero animation sequence**
  - Full entry sequence as specified in SITE_ARCHITECTURE.md
  - Scroll exit behavior (elements leave as user scrolls)
  - Background atmospheric element (CSS only at this stage)
  - Test on mobile

- [ ] **Implement navigation scroll behavior**
  - Appears after scrolling past hero
  - Highlights current section
  - Smooth anchor scrolling

- [ ] **Implement section entry animations**
  - Signal section text reveal
  - About section reveals
  - Contact section reveals

- [ ] **Implement custom cursor (desktop)**
  - Smooth cursor follower (RAF-based, not CSS transition)
  - Context-aware state changes
  - Mobile disabled (touch check)

- [ ] **Implement page transition (if using multiple pages)**
  - `AnimatePresence` at layout level
  - Consistent enter/exit for project detail pages

### Quality Gate for Phase 3

```
✓ All animations run at 60fps (verify with Chrome Performance panel)
✓ Reduced motion: all animations disabled, content still visible
✓ Mobile animations work correctly (no flicker, no layout issues)
✓ ScrollTrigger cleanup verified (navigate away and back — no duplicate triggers)
✓ Hero sequence timing feels right (test with 5 fresh viewers)
```

---

## PHASE 4: PROJECT NARRATIVES

*Goal: All three project scenes are fully implemented with complete narrative sequences.*
*This is the deepest implementation phase — each project scene is a mini-production.*

### Tasks (per project, × 3)

- [ ] **Project scene shell**
  - Section structure with data binding to `projects.ts`
  - Entry transition (atmospheric shift from previous section)

- [ ] **Problem frame implementation**
  - Copy in final voice
  - Animation: measured text reveal

- [ ] **Cinematic reveal**
  - Interface/product image revealed with clip-path or scale animation
  - This is the most technically careful moment — timing must be perfect

- [ ] **Interface showcase**
  - Screenshot gallery or single hero image
  - Hover interaction if applicable
  - Mobile: scrollable gallery

- [ ] **Architecture diagram** (unique per project)
  - SVG authored with scroll-drawing in mind
  - GSAP path draw animation via `strokeDashoffset`
  - Desktop: full diagram with labels
  - Mobile: simplified static version

- [ ] **Engineering insights section**
  - Technical insights in final voice
  - Monospace aesthetic
  - Staggered entry

- [ ] **Outcome section**
  - Honest, spare
  - Any metrics or links

- [ ] **Project transition** (exit to next project scene)
  - Atmospheric transition treatment
  - Project number indicator

### Quality Gate for Phase 4

```
✓ All three project scenes complete
✓ Each project scene feels visually distinct while remaining coherent
✓ Architecture diagrams render and animate correctly
✓ Mobile experience for all project scenes tested and acceptable
✓ Project transition timing feels cinematic, not jarring
✓ Total scroll depth is not exhausting (test with fresh viewers)
```

---

## PHASE 5: EXPERIMENTAL LAYER

*Goal: Implement the highest-potential experiments. Be rigorous about what survives.*

### Tasks

- [ ] **Prototype scroll-velocity reactive atmosphere** (Tier 2, idea 2.1)
  - Build isolated
  - Test with velocity evaluation protocol
  - Keep if passes, cut without regret if not

- [ ] **Prototype WebGL atmospheric background** (Tier 2, idea 2.2)
  - Build shader in isolation
  - Evaluate visual result carefully
  - Measure GPU cost on mid-range hardware
  - Keep if passes, cut without regret if not

- [ ] **Text scramble on navigation** (Tier 2, idea 2.4)
  - Quick to implement — build, evaluate in context
  - One viewing in full context tells you whether it fits

- [ ] **Magnetic button implementation** (Tier 1, idea 1.4)
  - Standard implementation, verified working
  - Applied to primary CTAs only

- [ ] **Cursor ambient light** (Tier 2, idea 2.6)
  - CSS variable approach first (very light)
  - Evaluate subtlety — should be below conscious notice

### Experiment Review Protocol

For each experiment attempted:
1. Build fully
2. View in context 10+ times
3. Ask: "If I removed this, would the site be worse?"
4. If yes → keep. If "maybe" → cut. Never keep a "maybe."

### Quality Gate for Phase 5

```
✓ Every experiment that survived review has a documented reason for surviving
✓ Every experiment that was cut has a documented reason for being cut
✓ Total GPU cost of all experimental elements measured (< 5ms/frame)
✓ Reduced motion: all experiments disabled
✓ The experiments that survived feel like they always belonged, not like they were added
```

---

## PHASE 6: OPTIMIZATION & POLISH

*Goal: The site performs excellently and is accessible to all visitors.*

### Performance Optimization

- [ ] **Lighthouse audit** — all categories > 90
- [ ] **Bundle analysis** — `npm run analyze` (next-bundle-analyzer)
  - Identify and eliminate unnecessary bundle weight
  - Verify GSAP tree-shaking working
  - Check for accidental large imports
- [ ] **Image optimization** — all images AVIF/WebP, correct sizes
- [ ] **Font loading** — verify FOUT acceptable, no FOIT
- [ ] **Video optimization** — all videos compressed (FFmpeg) and lazy loaded
- [ ] **Mobile performance** — test on actual device, not emulator
  - Pixel 6 (mid-range target)
  - iPhone 12 (mid-range target)
  - Older Android (stress test)
- [ ] **WebGL performance** (if used) — GPU frame time < 5ms
- [ ] **Remove all console.log statements**
- [ ] **Remove all unused imports and components**

### Accessibility Audit

- [ ] **Keyboard navigation** — every interactive element reachable, logical order
- [ ] **Screen reader test** — use VoiceOver/NVDA on key sections
- [ ] **Color contrast** — all text meets WCAG AA
- [ ] **Focus states** — visible on all interactive elements
- [ ] **Alt text** — all meaningful images have descriptive alt text
- [ ] **ARIA labels** — all icon-only buttons labeled
- [ ] **Reduced motion** — full audit of all animations

### Polish Checklist

- [ ] **Spacing consistency** — spot-check pixel values across sections
- [ ] **Typography consistency** — verify scale application at multiple viewport sizes
- [ ] **Animation timing feel** — watch full scroll through 5 times fresh
- [ ] **Cross-browser testing**
  - Chrome (primary)
  - Safari (important — many recruiters use Mac)
  - Firefox (secondary)
  - Edge (basic check)
- [ ] **404 page** — simple, on-brand, not embarrassing
- [ ] **Favicon** — designed, multiple sizes
- [ ] **OG image** — for link previews on LinkedIn/Twitter

### Quality Gate for Phase 6

```
✓ Lighthouse: Performance > 90, Accessibility 100, Best Practices > 90
✓ Keyboard navigation works throughout
✓ Reduced motion experience is complete and good
✓ No visible bugs in Chrome, Safari, Firefox
✓ Mobile experience polished and fast
```

---

## PHASE 7: CONTENT PRODUCTION

*This phase runs in parallel with other phases — content production takes time.*

### Copy

- [ ] **Hero copy** — final voice, tested with fresh readers
- [ ] **Signal section copy** — most important paragraph on the site, highest attention
- [ ] **Project narratives** — all three projects in final voice
- [ ] **About section** — personal, specific, not generic
- [ ] **Contact copy** — clear, qualified, inviting

### Visual Assets

- [ ] **Project screenshots** — high quality, representing the system at its best
  - Retina-resolution where possible
  - Consistent framing style across projects
  
- [ ] **Architecture diagrams** — purpose-designed SVGs for each project
  - Authored in Figma or Illustrator
  - Exported with proper path structure for animation
  
- [ ] **Hero visual** (if using)

### Video Production

- [ ] **Project showcase videos** (optional but high-impact)
  - 30–90 seconds per project
  - Screen recording quality: 2x resolution, 30fps minimum
  - Light color grading (Resolve or Premiere)
  - Compression: < 10MB per video after optimization

### Quality Gate for Phase 7

```
✓ All copy has been read aloud (this reveals problems text reading doesn't)
✓ All screenshots are retina-quality
✓ No Lorem Ipsum anywhere in production
✓ Videos compressed and optimized
```

---

## PHASE 8: LAUNCH PREPARATION

*Goal: Deploy to production. The site is live and shareable.*

- [ ] **Configure custom domain**
- [ ] **Verify HTTPS**
- [ ] **Set up analytics** (Vercel Analytics or Umami)
- [ ] **Set up error monitoring** (Sentry — free tier — optional)
- [ ] **Final Lighthouse run** — production URL (not localhost)
- [ ] **Test all external links** — GitHub, LinkedIn, project demos
- [ ] **robots.txt** — allow indexing
- [ ] **sitemap.xml** — generate via Next.js
- [ ] **Meta tags** — title, description, OG tags for all pages
- [ ] **Share the URL** — to 3–5 trusted people. Ask for honest feedback on first impression.
- [ ] **Social announcement** (optional, but drives initial traffic signal)

---

## PHASE 9: ONGOING REFINEMENT

*A portfolio is never done. This phase continues indefinitely.*

### Monthly Review

- Watch a recording of someone else using the site (usability session)
- Check analytics: which sections get the most time? Which are abandoned?
- Read the copy with fresh eyes — does it still feel right?

### Triggers for Update

- New project deployed → add to portfolio
- Hired → update status and current work
- Any section feels embarrassing or dated → refine
- Performance degrades (new browser versions change things) → fix

### The Refinement Philosophy

Each update should leave the site more coherent and more specifically itself. Add fewer things. Remove things that have outlived their purpose. The site should become more precisely right over time, not more comprehensive.

---

## CRITICAL PATH TO "READY FOR JOB APPLICATIONS"

If time is a constraint, here is the minimum viable path:

```
Phase 0: Foundation        — 1 day
Phase 1: Content Skeleton  — 3 days (with all copy drafted)
Phase 2: Design System     — 2 days
Phase 3: Motion Layer      — Hero + nav + basic section reveals only
Phase 4: First 2 projects  — Full narrative, skip third project for now
Phase 6: Accessibility     — Basics only: contrast, keyboard nav, alt text
Phase 8: Launch            — Domain, meta, deploy
```

**Estimated: 10–14 focused days from zero to deployed.**

This produces a site that is incomplete but excellent where it exists. Two fully executed project narratives are more impressive than three half-implemented ones.

Add the third project, the experimental layer, and full polish over the following weeks.

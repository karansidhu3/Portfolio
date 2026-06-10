# PERFORMANCE_RULES.md — Performance & Accessibility Rules

> Performance is a design decision, not an afterthought.
> A portfolio that is visually impressive but slow communicates exactly the wrong thing.
> Every rule in this document exists because a violation has a real, measurable cost
> to the user experience or to the engineering impression the portfolio creates.

---

## 1. FRAME BUDGET

### 1.1 The 60fps Contract

The site commits to 60fps animation on modern desktop hardware. This means every rendered frame must complete all work within **16.67ms**.

```
16.67ms frame budget breakdown:
  JavaScript execution:   ≤ 4ms
  Layout calculation:     ≤ 2ms  (ideally 0ms — avoid layout-triggering animation)
  Paint:                  ≤ 2ms  (ideally 0ms — compositor-only animations)
  Composite:              ≤ 8ms  (GPU work, WebGL)
  Buffer:                 ≤ 0.67ms
```

**Measurement tool:** Chrome DevTools Performance panel. Record a scroll through the page. Every frame that appears as a red bar (> 16.67ms) is a violation.

### 1.2 Animation Frame Rules

Properties that can be safely animated (compositor thread — no layout, no paint):
```
✓ transform: translate, scale, rotate, skew, matrix
✓ opacity
✓ filter: blur (careful — expensive at large radius on mobile)
✓ clip-path (modern browsers — compositor accelerated)
```

Properties that trigger layout (NEVER animate):
```
✗ width, height
✗ margin, padding
✗ top, left, right, bottom
✗ border-width
✗ font-size (triggers layout)
```

Properties that trigger paint (NEVER animate):
```
✗ background-color (use opacity over a color layer instead)
✗ color (for large text — interpolate via opacity)
✗ box-shadow (use a pseudo-element with opacity transition instead)
✗ border-color
```

**The workaround pattern** — when you need a "background color transition":
```css
/* Instead of animating background-color: */
.element {
  position: relative;
}
.element::before {
  content: '';
  position: absolute;
  inset: 0;
  background-color: var(--target-color);
  opacity: 0;
  transition: opacity 400ms ease;
}
.element:hover::before {
  opacity: 1;  /* Animate opacity only — compositor only */
}
```

### 1.3 Simultaneous Animation Limits

```
Desktop maximum: 5 concurrent animated elements at full complexity
Mobile maximum:  2 concurrent animated elements
```

"Full complexity" means: transform + opacity simultaneously. Simple opacity-only animations count as 0.5 elements against this budget.

### 1.4 Mobile Frame Budget

Mobile devices are the stress test. Target: 60fps. Minimum acceptable: 30fps for scroll-linked animations on mid-range devices.

**Mid-range test device profile:** ~200 Speedometer 2.0 score. Representative: Google Pixel 6 (2021), iPhone 12 (2020).

```
Mobile frame budget: 16.67ms (60fps) / 33.3ms (30fps minimum)
  — WebGL: disabled by default
  — Parallax: disabled or reduced to 1 layer
  — Simultaneous animations: maximum 2
  — GSAP: ensure all ScrollTrigger instances are cleaned up
           (memory leaks degrade mobile performance over time)
```

---

## 2. ANIMATION LIMITS

### 2.1 Scroll Animation Count

```
Per section (viewport-height unit):
  — Maximum 3 ScrollTrigger instances actively running
  — Maximum 1 pinned section total across the page
  — Maximum 2 parallax layers active simultaneously
```

### 2.2 Continuous Animation Rules

Continuous animations (things that animate infinitely without user input) are expensive because they prevent the browser from parking the compositor:

```
Maximum continuous animations on screen at one time: 2
Acceptable continuous animations:
  — Very slow ambient drift (opacity, transform — > 8s period)
  — Procedural WebGL background (if GPU-budgeted)
  — Cursor follower (RAF-based, not interval)
  
Not acceptable:
  — Multiple rotating elements
  — Particle systems with > 100 particles
  — CSS keyframe animations on multiple elements simultaneously
  — Animations that prevent the browser from entering a low-power state
```

### 2.3 GSAP Performance Rules

```javascript
// ✓ Good: Scoped context, cleaned up on unmount
useEffect(() => {
  const ctx = gsap.context(() => { ... }, ref);
  return () => ctx.revert();
}, []);

// ✗ Bad: Global ScrollTrigger not cleaned up
gsap.to(element, { scrollTrigger: { ... } }); // Lives forever

// ✓ Good: will-change applied then removed
gsap.to(element, {
  onStart: () => element.style.willChange = 'transform',
  onComplete: () => element.style.willChange = 'auto',
  ...
});

// ✗ Bad: will-change left on always
element.style.willChange = 'transform'; // Creates compositor layer forever

// ✓ Good: Batch DOM reads before animation setup
const bounds = element.getBoundingClientRect(); // Read
gsap.set(element, { x: bounds.width }); // Write

// ✗ Bad: Layout thrashing in animation loop
gsap.ticker.add(() => {
  const w = element.offsetWidth; // Read triggers layout
  gsap.set(element, { x: w });  // Write triggers layout
});
```

---

## 3. LAZY LOADING

### 3.1 Images

All images below the fold must be lazy loaded:

```tsx
// ✓ Good: next/image handles lazy loading automatically
<Image 
  src="/images/project-screenshot.jpg"
  alt="MarketMind dashboard showing sentiment analysis"
  width={1200}
  height={800}
  // loading="lazy" is default for non-priority images
/>

// Priority images (hero, first visible image) must be eager:
<Image 
  src="/images/hero-visual.jpg"
  alt="..."
  priority  // Preloads in <head>
/>
```

### 3.2 Videos

All video elements must use lazy loading via intersection observer:

```typescript
// lib/hooks/useVideoLazyLoad.ts
export function useVideoLazyLoad(videoRef: RefObject<HTMLVideoElement>) {
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Load the video when it enters viewport
          video.src = video.dataset.src || '';
          video.load();
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }  // Start loading 200px before entering viewport
    );
    
    observer.observe(video);
    return () => observer.disconnect();
  }, []);
}

// Usage:
<video
  ref={videoRef}
  data-src="/videos/marketmind-demo.mp4"  // NOT src — data-src
  muted
  playsInline
  loop
/>
```

### 3.3 WebGL Components

WebGL components are always lazy loaded via `next/dynamic`:

```typescript
const WebGLBackground = dynamic(
  () => import('@/components/canvas/WebGLBackground'),
  { 
    ssr: false,
    loading: () => <div className="bg-fallback" />
  }
);
```

### 3.4 Heavy Libraries

GSAP should be loaded after hydration is complete (it has no SSR relevance):

```typescript
// The GSAP import in components is fine — Next.js tree-shakes it
// But register ScrollTrigger only after window is available:
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}
```

---

## 4. ASSET OPTIMIZATION

### 4.1 Image Format Requirements

```
Target format:    AVIF (best compression, modern browsers)
Fallback format:  WebP (wide support, good compression)
Legacy fallback:  JPEG/PNG (where needed)

next/image handles this automatically — just use next/image.
No manual AVIF conversion needed.
```

### 4.2 Image Size Requirements

```
Hero images:          max 1200px wide @ 2x (2400px source)
Project screenshots:  max 1400px wide @ 2x (2800px source)
Thumbnails:           max 400px wide @ 2x (800px source)
Architecture diagrams: SVG (vector — no rasterization needed)

Always define width and height props on next/image.
Never serve an image larger than its display size.
```

### 4.3 Video Compression Requirements

All videos compressed with FFmpeg before committing:

```bash
# MP4 (H.264) — broadest compatibility
ffmpeg -i input.mov \
  -c:v libx264 \
  -crf 23 \           # Quality: 18-28, lower = better quality
  -preset slow \      # More compression, slower encode
  -vf scale=1920:-2 \ # Max 1920px wide
  -c:a aac \
  -b:a 128k \
  output.mp4

# WebM (VP9) — better compression for modern browsers
ffmpeg -i input.mov \
  -c:v libvpx-vp9 \
  -crf 30 \
  -b:v 0 \
  -vf scale=1920:-2 \
  -c:a libopus \
  output.webm
```

**Size targets:**
```
Hero background video (if used): < 3MB (< 5MB max)
Project showcase video (30-90s): < 8MB
Demo walkthrough video:          < 15MB
```

### 4.4 SVG Optimization

All SVG files (especially architecture diagrams) should be optimized:

```bash
# Install svgo
npm install -g svgo

# Optimize a single file
svgo architecture-diagram.svg -o architecture-diagram.optimized.svg

# Verify the optimization didn't break paths needed for animation
# (Some svgo optimizations merge paths — check manually)
```

### 4.5 Font Optimization

```
Format: WOFF2 (only — no WOFF, no TTF in production)
Subset: Use only the character ranges actually needed
  — For variable fonts: specify axis ranges
  — Avoid loading weights that aren't used (each weight = full font file)

Size targets:
  Primary font: < 80KB per weight variant
  Monospace font: < 40KB
  
Self-hosted (no CDN):
  — Vercel edge caches self-hosted fonts efficiently
  — Eliminates cross-origin latency
  — Eliminates external dependency
```

---

## 5. BUNDLE SIZE DISCIPLINE

### 5.1 Bundle Targets

```
Initial JS bundle (gzipped):  < 150KB
Per-route chunk (gzipped):    < 50KB additional
GSAP (tree-shaken):           ~85KB gzipped
Framer Motion (tree-shaken):  ~40KB gzipped
Three.js (if used):           ~160KB gzipped — requires justification
Total initial payload:        < 300KB gzipped (excluding images/fonts/video)
```

### 5.2 Bundle Analysis Workflow

Run before every major deployment:

```bash
# Install analyzer
npm install --save-dev @next/bundle-analyzer

# next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})
module.exports = withBundleAnalyzer({})

# Run analysis
ANALYZE=true npm run build

# Open the generated report
# Look for: unexpected large modules, duplicate packages, unused exports
```

### 5.3 Import Discipline

```typescript
// ✓ GSAP: import only what's needed
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
// NOT: import { gsap, ScrollTrigger, ... } from 'gsap/all'

// ✓ Framer Motion: import only what's used
import { motion, AnimatePresence } from 'framer-motion';
// NOT: import * as motion from 'framer-motion'

// ✓ Lodash: import specific functions
import clamp from 'lodash/clamp';
// NOT: import _ from 'lodash'

// ✓ Icons: import individual icons
import { ArrowRight } from 'lucide-react';
// NOT: import * as Icons from 'lucide-react'
```

---

## 6. MOBILE PERFORMANCE

### 6.1 Mobile-Specific Rules

These rules apply **only** to mobile (< 768px or `isTouchDevice`):

```
WebGL:           DISABLED (always — no exceptions for this portfolio)
Parallax:        DISABLED or single-layer only (max 0.2 rate)
Custom cursor:   DISABLED
Particle systems: DISABLED
will-change:     Apply more conservatively (mobile GPU memory is limited)
Animation count: Max 2 simultaneous
GSAP ScrollTrigger: Kill all triggers on orientation change, reinitialize
```

### 6.2 Mobile Detection

```typescript
// lib/utils/device.ts
export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

// Use for disabling cursor, parallax, WebGL
// Use a hook to ensure React renders correctly:
export function useIsTouch() {
  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => { setIsTouch(isTouchDevice()); }, []);
  return isTouch;
}
```

### 6.3 Mobile Testing Protocol

```
Required devices (physical or BrowserStack):
  — iPhone 12 (iOS Safari — most common portfolio visitor browser on Mac)
  — Google Pixel 6 (Android Chrome — mid-range target)
  — Galaxy A53 (budget Android — stress test)

Test checklist per device:
  □ All content readable
  □ Images load correctly
  □ Videos play (if autoplay, must be muted)
  □ Touch targets ≥ 44×44px
  □ No horizontal overflow
  □ Scroll is smooth (record with 120fps capture if possible)
  □ Navigation anchors work
  □ No performance jank (especially in project sections)
```

---

## 7. ACCESSIBILITY

### 7.1 Standards Baseline

**Target: WCAG 2.1 AA compliance.** Full audit required before launch.

This is not optional or aspirational — accessibility compliance is a minimum standard. Failing it means the portfolio is inaccessible to a meaningful percentage of potential visitors.

### 7.2 Color Contrast Requirements

```
Normal text (< 18pt / < 14pt bold):  4.5:1 minimum contrast ratio
Large text (≥ 18pt / ≥ 14pt bold):  3:1 minimum contrast ratio
UI components and states:            3:1 minimum

Test tool: WebAIM Contrast Checker, or browser DevTools accessibility panel

With the defined color system:
  --color-text-primary (#F0EDE8) on --color-bg-primary (#0A0A0A):
    Contrast ratio: ~17:1 ✓
    
  --color-text-secondary (#8A8580) on --color-bg-primary (#0A0A0A):
    Contrast ratio: ~7:1 ✓ (verify with actual hex values)
    
  --color-text-tertiary (#525250) on --color-bg-primary (#0A0A0A):
    Verify this meets 4.5:1 for body text usage
    May need to lighten if used for body text
```

### 7.3 Keyboard Navigation

```
Required keyboard behaviors:
  — Tab: moves forward through all interactive elements
  — Shift+Tab: moves backward
  — Enter/Space: activates buttons, links
  — Escape: closes any open overlays, modals
  — Arrow keys: within any custom components that have arrow key semantics

Focus order must be logical (matches visual/reading order).
Focus must never be trapped (except in modals — where it should be trapped until closed).

Focus style requirements:
  — Visible, high-contrast ring
  — NOT the browser default (which is often invisible on dark backgrounds)
  — Suggested: 2px solid var(--color-accent), 2px offset
  — Must be visible on all background colors
```

### 7.4 Screen Reader Requirements

```
All images: descriptive alt text
  — Decorative images: alt=""
  — Content images: describes what the image communicates, not what it depicts
  — Example: alt="Architecture diagram showing three-stage document pipeline"
  
Icon-only buttons: aria-label that describes the action
  Example: <button aria-label="View project on GitHub">

SVG animations: aria-hidden="true" on the SVG (content is in surrounding text)

Section landmarks:
  <header>, <main>, <footer>, <nav> used correctly
  Each major section: id + aria-label or aria-labelledby

Heading hierarchy:
  <h1> once per page (name or hero headline)
  <h2> for major sections
  <h3> for sub-sections
  Never skip levels
```

### 7.5 Animation Accessibility

```
@media (prefers-reduced-motion: reduce) must disable:
  — All scroll-triggered animations
  — All hover animations (beyond instant state changes)
  — All continuous animations
  — All parallax effects
  — All custom cursor behavior
  — Any animation that could trigger vestibular issues

What remains in reduced motion mode:
  — All content visible (at final state — opacity: 1, transform: none)
  — Instant color/focus changes on interaction
  — Page transitions limited to 150ms opacity fade
  — No layout shifts
```

### 7.6 Semantic HTML Requirements

```html
<!-- ✓ Correct section structure -->
<section aria-labelledby="work-heading">
  <h2 id="work-heading">Selected Work</h2>
  <!-- Project content -->
</section>

<!-- ✓ Correct navigation -->
<nav aria-label="Main navigation">
  <ul>
    <li><a href="#work">Work</a></li>
    <li><a href="#about">About</a></li>
    <li><a href="#contact">Contact</a></li>
  </ul>
</nav>

<!-- ✗ Wrong: div soup with no semantics -->
<div class="section">
  <div class="heading">Work</div>
  <div class="nav">
    <div class="nav-item">Work</div>
  </div>
</div>
```

---

## 8. GRACEFUL DEGRADATION

### 8.1 Degradation Tiers

The site must function at each degradation level:

```
Tier 1: Full experience
  — Modern browser, JS enabled, WebGL capable
  — Full animations, custom cursor, WebGL atmosphere

Tier 2: Standard experience (most visitors)
  — Modern browser, JS enabled, no WebGL / touch device
  — CSS animations only, no WebGL, no custom cursor
  — Still excellent experience

Tier 3: Reduced experience
  — prefers-reduced-motion: reduce
  — All animations disabled
  — Content visible, full functionality
  — Still communicates everything intended

Tier 4: No JS
  — Content visible (SSR/RSC guarantees this)
  — No animations
  — Navigation with page reloads
  — Fully readable and informative

Tier 5: Print
  — print CSS defined
  — Background colors preserved (background-color: print)
  — Text content cleanly formatted
  — No animations, no video
```

### 8.2 JavaScript Error Handling

A JavaScript error in an animation component must not break the page. Use error boundaries around animation layers:

```tsx
// components/motion/AnimationErrorBoundary.tsx
export class AnimationErrorBoundary extends Component {
  state = { hasError: false };
  
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  
  componentDidCatch(error: Error) {
    console.error('Animation error:', error);
    // Could send to Sentry
  }
  
  render() {
    if (this.state.hasError) {
      // Return children without animation — still functional
      return this.props.children;
    }
    return this.props.children;
  }
}
```

### 8.3 WebGL Fallback

```typescript
// Check WebGL support before initializing
function hasWebGLSupport(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      canvas.getContext('webgl') || 
      canvas.getContext('experimental-webgl')
    );
  } catch {
    return false;
  }
}
```

---

## 9. PERFORMANCE TESTING WORKFLOW

### 9.1 Pre-Commit Checks (Every Change)

```bash
# TypeScript: no errors
npm run type-check

# Build: no warnings
npm run build

# Lighthouse (via CLI):
npm install -g lighthouse
lighthouse http://localhost:3000 --output json
# Check scores: Performance > 90, Accessibility 100
```

### 9.2 Pre-Deployment Checks

```
□ Lighthouse audit on production URL (not localhost — results differ)
  — Performance: > 90
  — Accessibility: 100
  — Best Practices: > 90
  — SEO: > 90

□ WebPageTest (webpagetest.org)
  — Test from: US East, EU West, Asia (where job applications go)
  — LCP: < 1.5s on fast connection
  — LCP: < 3s on 4G mobile

□ Manual scroll test (Chrome DevTools Performance)
  — Record 10 seconds of scrolling
  — No red frames
  — No layout thrashing warnings

□ Cross-browser visual check
  — Chrome, Safari, Firefox, Edge
  — Focus on: animations, fonts, layout
  
□ Physical mobile device test
  — iPhone (Safari), Android (Chrome)
  — Scroll smoothness, touch targets, video
```

### 9.3 Performance Regression Prevention

After every major feature addition, run the full test suite. Never ship a new feature that degrades Lighthouse score below thresholds.

```
// package.json — add to CI if/when set up
"scripts": {
  "perf:lighthouse": "lighthouse http://localhost:3000 --output json --quiet | jq '.categories.performance.score'",
  "perf:check": "npm run build && npm run perf:lighthouse"
}
```

---

## 10. PERFORMANCE AS CRAFT

The performance requirements in this document are not bureaucratic constraints. They are expressions of the same values that drive the design — respect for the visitor's time, care for the device they're using, and commitment to quality at every layer of the stack.

A portfolio that looks beautiful in your browser but stutters on someone's MacBook Air with 47 Chrome tabs open is a portfolio that communicates the wrong thing.

Build it to work everywhere it matters. That's part of the craft.

---

*Performance rules are absolute.*
*There is no visual effect impressive enough to justify failing these standards.*
*The most impressive thing the portfolio can do is be beautiful AND fast.*

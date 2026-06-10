# TECH_ARCHITECTURE.md — Technical Architecture

> This document defines the engineering architecture of the portfolio.
> Every technical decision here is made with the constraint of solo developer maintainability
> and long-term performance on real devices.
> Clever is the enemy of maintainable. Choose boring infrastructure, interesting creative solutions.

---

## 1. FRONTEND ARCHITECTURE

### 1.1 Core Stack

```
Framework:       Next.js 14+ (App Router)
Language:        TypeScript (strict mode)
Styling:         Tailwind CSS + CSS custom properties for design tokens
Animation:       GSAP 3 + ScrollTrigger (primary scroll animation)
                 Framer Motion (React component transitions, presence)
State:           React Context + Zustand (if global state needed)
Fonts:           Self-hosted via next/font (no Google Fonts CDN)
Images:          next/image (automatic WebP/AVIF conversion)
Video:           HTML5 video with custom React wrapper
```

**Rationale for this stack:**

Next.js App Router gives RSC (React Server Components) by default — static sections render on the server, reducing JS hydration cost. The portfolio content is primarily static, making this a good fit.

GSAP is chosen over pure Framer Motion for scroll-driven animations because:
- ScrollTrigger is the best-in-class scroll animation library (more reliable than Framer Motion's useScroll)
- GSAP's timeline API is more expressive for complex sequenced animations
- Performance is better for complex multi-element animations

Framer Motion is kept for:
- `AnimatePresence` (route transition handling)
- Component-level micro-interactions where spring physics are wanted
- Simple triggered animations where GSAP setup would be overkill

### 1.2 Component Architecture

```
app/
├── layout.tsx                    # Root layout (fonts, meta, analytics)
├── page.tsx                      # Main portfolio page — scene composition
├── work/
│   └── [slug]/
│       └── page.tsx              # Dynamic project detail page
└── globals.css                   # CSS variables, base styles

components/
├── sections/
│   ├── HeroSection.tsx           # Scene 1
│   ├── SignalSection.tsx         # Scene 2
│   ├── ProjectScene.tsx          # Scene 3–5 (parameterized)
│   ├── AboutSection.tsx          # Scene 6
│   └── ContactSection.tsx        # Scene 7
│
├── motion/
│   ├── RevealText.tsx            # Scroll-triggered text line reveal
│   ├── FadeIn.tsx                # General purpose fade-in wrapper
│   ├── ParallaxLayer.tsx         # Parallax depth layer wrapper
│   ├── StaggerChildren.tsx       # Staggered children reveal
│   └── CinematicReveal.tsx       # Clip-path reveal for images/ui
│
├── systems/
│   ├── ArchitectureDiagram.tsx   # SVG system diagrams (drawn via GSAP)
│   ├── DataFlowViz.tsx           # Animated data flow visualization
│   └── ProjectTimeline.tsx       # Project timeline component
│
├── ui/
│   ├── Typography.tsx            # Type system components
│   ├── Navigation.tsx            # Floating navigation
│   ├── ProjectCursor.tsx         # Custom cursor
│   ├── SectionLabel.tsx          # Monospace section identifiers
│   └── ScrollIndicator.tsx       # Scroll prompt component
│
└── canvas/                       # WebGL/Three.js components (optional)
    ├── AtmosphericBackground.tsx
    └── ParticleField.tsx

lib/
├── animation/
│   ├── variants.ts               # Framer Motion variant definitions
│   ├── timelines.ts              # GSAP timeline builders
│   ├── easing.ts                 # Easing constants
│   └── hooks/
│       ├── useScrollProgress.ts
│       ├── useReducedMotion.ts
│       ├── useCursorPosition.ts
│       └── useInViewAnimation.ts
│
├── utils/
│   ├── math.ts                   # lerp, clamp, mapRange, damp
│   ├── device.ts                 # isMobile, isTouch, prefersReducedMotion
│   └── timing.ts                 # Animation timing utilities
│
├── data/
│   ├── projects.ts               # Project data (typed)
│   └── navigation.ts             # Navigation structure
│
└── constants/
    ├── design-tokens.ts          # JS-accessible design token values
    └── animation.ts              # Animation duration/easing constants
```

### 1.3 Data Architecture

Project data lives in typed TypeScript files — not a CMS or database. This is intentional for a portfolio:

```typescript
// lib/data/projects.ts
export interface Project {
  slug: string;
  title: string;
  descriptor: string;
  year: number;
  status: 'live' | 'in-development' | 'archived';
  tech: string[];
  
  // Narrative content
  problem: string;          // The problem statement
  approach: string;         // The approach taken
  insights: string[];       // 3–5 engineering insights
  reflection: string;       // Honest reflection
  
  // Media
  heroImage: string;
  screenshotUrls: string[];
  videoUrl?: string;
  demoUrl?: string;
  githubUrl?: string;
  
  // Diagram
  architectureDiagramPath?: string;  // SVG file path
  
  // Display config
  atmosphereColor: string;     // Subtle bg tint for this project
  order: number;               // Narrative order on main page
}

export const projects: Project[] = [ ... ]
```

---

## 2. ANIMATION ARCHITECTURE

### 2.1 The Two-Layer Animation System

Animations are organized into two conceptual layers:

**Layer 1: Scroll-Driven Narrative (GSAP + ScrollTrigger)**
- Runs on the main timeline
- Triggered by scroll position
- Controls all section-level reveals and transitions
- Initialized once on page load, cleaned up on unmount

**Layer 2: Interaction Motion (Framer Motion)**
- Responds to user events (hover, click, focus)
- Lives within individual components
- Uses spring physics for physical feel
- Independent of scroll position

These two layers must not conflict. GSAP controls the `y` and `opacity` of structural elements. Framer Motion controls the `scale` and hover-specific transforms. Never have both libraries animating the same property on the same element.

### 2.2 GSAP Context Architecture

Using GSAP's `context()` API for React compatibility:

```typescript
// hooks/useScrollAnimation.ts
export function useScrollAnimation(
  setupFn: (gsap: GSAP, ScrollTrigger: typeof ST) => void,
  deps: React.DependencyList = []
) {
  const ref = useRef<HTMLElement>(null);
  
  useEffect(() => {
    if (!ref.current) return;
    
    const ctx = gsap.context(() => {
      setupFn(gsap, ScrollTrigger);
    }, ref);
    
    return () => ctx.revert();
  }, deps); // eslint-disable-line
  
  return ref;
}
```

This pattern ensures:
- All GSAP animations are scoped to their component
- Cleanup happens automatically on unmount
- No global ScrollTrigger contamination between sections

### 2.3 Framer Motion Variant System

All Framer Motion animations use pre-defined variant objects from `lib/animation/variants.ts`:

```typescript
// Consistent, typed, centrally maintained
export const variants = {
  fadeInUp: {
    hidden: { opacity: 0, y: 24 },
    visible: { 
      opacity: 1, y: 0,
      transition: { duration: 0.7, ease: EASING.cinematic }
    }
  },
  
  staggerContainer: {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.08, delayChildren: 0.1 }
    }
  },
  
  scaleReveal: {
    hidden: { opacity: 0, scale: 0.96 },
    visible: {
      opacity: 1, scale: 1,
      transition: { duration: 0.8, ease: EASING.cinematic }
    }
  },
  
  // ... all other variants
} as const;
```

---

## 3. RENDERING STRATEGY

### 3.1 React Server Components Strategy

```
Server Components (RSC):
  — HeroSection content (static text)
  — SignalSection (static text)
  — Project data fetching and static shell
  — About content (static text)
  — Contact information
  
Client Components ('use client'):
  — All animation components
  — Custom cursor
  — Navigation (scroll-aware)
  — Interactive project showcases
  — WebGL/Canvas elements
  — Any component using useEffect, useRef, useState
```

**Boundary pattern:** Wrap the animation layer in a Client Component that accepts the static content as children (props). This keeps static content server-rendered while adding client-side animation capability.

```tsx
// components/sections/HeroSection.tsx — Server Component
export default function HeroSection() {
  return (
    <HeroAnimationWrapper>  {/* Client Component */}
      <h1>Karan</h1>
      <p>Descriptor line</p>
    </HeroAnimationWrapper>
  );
}
```

### 3.2 Static Generation

All pages use `generateStaticParams` where applicable. The portfolio is 100% statically generated — no server-side rendering at request time, no API calls during render. Deploy as a static site or serverless functions.

```
Build time: Static generation of all pages
Runtime:    Static file serving (Vercel edge network)
No database, no server, no runtime compute costs
```

### 3.3 Image Rendering

```
All images: next/image with automatic optimization
Hero images: priority={true}, preloaded
Project screenshots: lazy loaded, responsive sizes
Project thumbnails: width/height defined, no CLS
Format priority: AVIF → WebP → JPEG/PNG fallback
```

---

## 4. WEBGL STRATEGY

### 4.1 WebGL Philosophy

WebGL is an enhancement layer, not a requirement. It is used where it genuinely creates something impossible or prohibitively expensive in CSS/SVG. It is not used to demonstrate technical capability — the implementation decisions are the demonstration.

### 4.2 When WebGL is Warranted

**Warranted:**
- Atmospheric procedural backgrounds (noise-based, GPU-efficient)
- Particle field for specific visual moments (if under 10k particles with instanced rendering)
- Custom shader for a specific visual effect that elevates a key scene

**Not warranted:**
- 3D model rendering (unless the subject of a project)
- Particle explosions/transitions
- WebGL for effects achievable in CSS

### 4.3 Implementation Pattern

```typescript
// components/canvas/AtmosphericBackground.tsx
// 
// Pattern: Check capability, lazy load, degrade gracefully

'use client';

import dynamic from 'next/dynamic';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useIsMobile } from '@/hooks/useDevice';

// Lazy load the heavy WebGL component
const WebGLBackground = dynamic(
  () => import('./WebGLBackgroundInner'),
  { 
    ssr: false,          // Never SSR WebGL
    loading: () => null  // No loading state — CSS background shown instead
  }
);

export function AtmosphericBackground() {
  const reducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  
  // Degrade to CSS on mobile or reduced motion
  if (isMobile || reducedMotion) {
    return <div className="atmospheric-bg-css" />;
  }
  
  return <WebGLBackground />;
}
```

### 4.4 Three.js / React Three Fiber Considerations

If Three.js is used (R3F):
- Use `@react-three/fiber` for React integration
- Use `@react-three/drei` for common helpers only
- Limit scene complexity: < 5 unique geometries, < 3 materials, no realtime shadows
- Pixel ratio capped at 2 (`dpr={[1, 2]}`)
- Background scenes should not exceed 1ms GPU frame time (< 6% of the 16.67ms budget)
- Always dispose of geometries, materials, and textures on unmount

---

## 5. STATE MANAGEMENT PHILOSOPHY

### 5.1 State Layers

```
Local state (useState):    Component-specific UI state
URL state (searchParams):  Filter state, tab state (only if needed)
Context:                   Theme, reduced motion, device type
Zustand (if needed):       Cross-component animation coordination
```

For this portfolio, Zustand is likely unnecessary. Context for device/preference state, useState for everything else.

### 5.2 Animation State Pattern

Cross-section animation coordination (e.g., hero must fully exit before project section starts) uses a simple callback pattern via Context, not a state management library:

```typescript
// Sequence is controlled via GSAP timeline, not state
// The hero timeline's onComplete triggers the next timeline
// No React state involved in animation sequencing
```

---

## 6. PERFORMANCE OPTIMIZATION STRATEGY

### 6.1 Bundle Strategy

```
Main bundle target: < 150kb gzipped JS on initial load
Split points:
  — GSAP: loaded async after hydration
  — Three.js: dynamic import, section-specific
  — Project detail pages: separate chunk per route
```

GSAP bundle optimization:
```javascript
// Import only what's needed
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
// NOT: import gsap from 'gsap/all'
```

### 6.2 Font Loading

Self-host all fonts via `next/font`:
```typescript
// app/layout.tsx
import localFont from 'next/font/local';

const primaryFont = localFont({
  src: [
    { path: '../public/fonts/font-light.woff2', weight: '300' },
    { path: '../public/fonts/font-regular.woff2', weight: '400' },
    { path: '../public/fonts/font-medium.woff2', weight: '500' },
    { path: '../public/fonts/font-bold.woff2', weight: '700' },
  ],
  display: 'swap',      // Show system font while loading
  variable: '--font-primary',
});
```

Preload the fonts used on the hero (LCP path).

### 6.3 Video Strategy

```
Hero video (if used): Compressed to < 5MB, autoplay muted, loop
Project videos: Loaded on demand (intersection observer trigger)
Format: MP4 (H.264 for broad compatibility) + WebM (VP9 for smaller size)
Bitrate: 1Mbps target for showcase videos
Poster image: Always defined (shows immediately on load)
```

### 6.4 Critical Rendering Path

```
1. HTML arrives (server-rendered static content)
2. CSS applied (critical CSS inlined via Next.js)
3. Fonts loaded (preloaded, swap)
4. Images start loading (priority images preloaded)
5. JS hydrates (animations initialize)
6. GSAP loads and initializes ScrollTrigger
7. WebGL initializes (deferred, non-blocking)
```

The visitor should see readable content within 1–1.5 seconds on a fast connection. The visual richness adds in layers after that.

---

## 7. RESPONSIVE STRATEGY

### 7.1 Mobile-First vs. Desktop-First Decision

This portfolio uses **desktop-first** for the cinematic experience, with deliberate mobile adaptation — not mobile-first with desktop enhancement.

Rationale: The cinematic ambitions of this portfolio are primarily realized on desktop. The mobile experience is a genuinely good but different experience. Designing desktop-first lets the cinematic vision be expressed fully, then deliberately adapts it.

### 7.2 Responsive Motion Pattern

```typescript
// hooks/useDevice.ts
export function useAnimationConfig() {
  const isMobile = useIsMobile();
  const reducedMotion = useReducedMotion();
  
  return {
    enableWebGL: !isMobile && !reducedMotion,
    enableParallax: !isMobile && !reducedMotion,
    enableCustomCursor: !isMobile,
    animationIntensity: isMobile ? 0.5 : 1.0,  // Scale down animation distances
    staggerDuration: isMobile ? 0.05 : 0.08,
  };
}
```

### 7.3 Tailwind Responsive Conventions

```
Base classes:     Mobile styles (< 768px)
md: prefix:       Tablet and up (768px+)
lg: prefix:       Desktop (1024px+)
xl: prefix:       Wide (1280px+)
2xl: prefix:      Very wide (1536px+) — enhanced spacing only
```

---

## 8. DEPLOYMENT CONSIDERATIONS

### 8.1 Hosting

**Primary: Vercel (free tier)**

Rationale:
- Next.js first-party support
- Automatic image optimization
- Edge network CDN (global fast delivery)
- Preview deployments for each branch
- Zero configuration for this stack
- Free tier sufficient for portfolio traffic

### 8.2 Domain Strategy

Custom domain connected to Vercel. HTTPS automatic. No need for additional infrastructure.

### 8.3 Analytics

Privacy-respecting analytics:
- **Vercel Analytics** (built-in, free tier, no cookies)
- Or: **Umami** (self-hosted, open source, no cookies)
- Not: Google Analytics (cookie consent required, data ownership concerns)

Track:
- Page views per section (via custom events)
- Which projects receive the most time
- Conversion to contact (scroll depth to contact section)

---

## 9. MAINTAINABILITY PHILOSOPHY

### 9.1 Durability Principles

This site should be maintainable by the developer who built it, alone, months after last touching it.

Rules for durability:
- Every non-obvious decision has a comment explaining *why*
- Animation values are constants, not magic numbers
- Component interfaces are typed and have JSDoc comments on non-obvious props
- Project data is in one typed file — easy to add, easy to find
- CSS variables (not Tailwind hardcoded values) for all design tokens

### 9.2 Update Workflow

When adding a new project:
1. Add project object to `lib/data/projects.ts`
2. Add screenshots to `public/images/[slug]/`
3. Add architecture diagram SVG to `public/diagrams/`
4. Add video to `public/videos/` (compressed)
5. The `ProjectScene` component consumes the data object
6. Deploy → done

No component changes needed for a new project unless the new project requires a genuinely new display pattern.

### 9.3 Avoiding Architecture Debt

**Premature abstraction is the main risk.** Do not create an animation orchestration system before you know what you're orchestrating. Do not create a plugin-style project renderer before you know all the project types. Build specifically, then generalize when the pattern is proven by two or three instances.

---

## 10. DEPENDENCY MANIFEST

Current approved dependencies:
```json
{
  "dependencies": {
    "next": "14.x",
    "react": "18.x",
    "react-dom": "18.x",
    "framer-motion": "11.x",
    "gsap": "3.x",
    "zustand": "4.x"        // Only if cross-component state needed
  },
  "devDependencies": {
    "typescript": "5.x",
    "@types/react": "18.x",
    "tailwindcss": "3.x",
    "eslint": "8.x",
    "prettier": "3.x"
  }
}
```

WebGL dependencies (add only when implementing WebGL):
```json
{
  "three": "0.x",               // Only if WebGL used
  "@react-three/fiber": "8.x",  // Only if R3F used
  "@react-three/drei": "9.x"    // Only if R3F used
}
```

**Every other dependency requires explicit justification.**

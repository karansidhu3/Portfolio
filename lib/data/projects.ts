/*
 * Project data — typed, centrally maintained.
 *
 * MEDIA SWAP PATTERN:
 * Each media field is optional. When omitted, the ProjectScene renders a
 * visually coherent placeholder that maintains composition and spacing.
 * To replace placeholders with real assets, add the file paths here.
 * No component changes required.
 *
 *   heroImage:          add path → replaces PlaceholderHero
 *   screenshotUrls:     add paths → replaces PlaceholderScreenshots
 *   screenshotRatios:   per-screenshot aspect ratios (defaults to 'wide')
 *   videoUrl:           add path → enables video showcase
 *   architectureDiagramPath: add SVG path → replaces PlaceholderDiagram
 *
 * Real assets go in:
 *   public/images/[slug]/
 *   public/videos/
 *   public/diagrams/
 */

import type { AspectRatio } from '@/components/ui/MediaContainer';

export type ProjectStatus = 'live' | 'in-development' | 'archived';

/*
 * Placeholder configuration — controls visual treatment of the placeholder
 * until real assets are available. The 'variant' describes what kind of UI
 * the real interface will resemble, so placeholders can suggest the right shape.
 */
export interface PlaceholderConfig {
  /** Visual style for the hero placeholder */
  heroVariant: 'dashboard' | 'pipeline' | 'minimal' | 'list';
  /** Number of screenshot placeholders to show */
  screenshotCount: number;
  /** True when the diagram SVG data attributes are ready for animation */
  diagramReady?: boolean;
}

export interface Project {
  slug: string;
  title: string;
  /** One-line summary — atmospheric, not a job title */
  descriptor: string;
  year: number;
  status: ProjectStatus;
  tech: string[];

  // ─── Narrative Content ──────────────────────────────────────────────────────

  /** 40–80 words: the real problem, honestly stated */
  problem: string;
  /** The non-obvious architectural or product decisions */
  approach: string;
  /** 3–5 specific, transferable engineering insights */
  insights: string[];
  /** Honest reflection — what would be done differently */
  reflection: string;

  // ─── Media (all optional — placeholder renders when omitted) ────────────────

  /** Path relative to /public. When omitted, PlaceholderHero renders. */
  heroImage?: string;
  /** Paths relative to /public. When omitted, PlaceholderScreenshots renders. */
  screenshotUrls?: string[];
  /** Per-screenshot aspect ratios. Defaults to 'wide' for each when omitted. */
  screenshotRatios?: AspectRatio[];
  /** Path relative to /public. When omitted, no video section renders. */
  videoUrl?: string;
  /** External link to live demo */
  demoUrl?: string;
  /** External link to GitHub */
  githubUrl?: string;
  /**
   * Path to SVG file in /public/diagrams/.
   * SVG must have data-diagram-path and data-diagram-node attributes for animation.
   * When omitted, PlaceholderDiagram renders.
   */
  architectureDiagramPath?: string;

  // ─── Placeholder Config ─────────────────────────────────────────────────────

  /** Controls the visual treatment of placeholder media */
  placeholder: PlaceholderConfig;

  // ─── Display Configuration ──────────────────────────────────────────────────

  /**
   * Subtle background tint for this project's scene.
   * Very low opacity — felt rather than seen.
   */
  atmosphereColor: string;

  /** Narrative order on main page (lower = earlier) */
  order: number;

  /**
   * Content layout variant — controls composition of the project content
   * section below the entry frame. Each variant reflects the project's
   * character without changing the entry frame grammar.
   *
   *   'standard'          — problem/metadata split, full content treatment
   *   'interface-forward' — interface screenshots promoted, product emphasis
   *   'compressed'        — minimal structure, more negative space (archived)
   */
  contentLayout: 'standard' | 'interface-forward' | 'compressed';
}

export const projects: Project[] = [
  {
    slug: 'marketmind',
    title: 'MarketMind',
    descriptor:
      'Investment research that accumulates evidence over time instead of answering point-in-time queries.',
    year: 2025,
    status: 'live',
    tech: ['Next.js', 'FastAPI', 'PostgreSQL', 'Qdrant', 'Redis', 'Ollama', 'Docker'],

    problem:
      'Investment research is an evidence accumulation problem, not a search problem. The data is public and voluminous — SEC filings, financial news, sector publications. The hard part: most signals only mean something across time, not in isolation. A company mentioned once in March is noise. The same company appearing across five documents over two months is a thesis.',

    approach:
      'The core design decision was confidence as a decaying function of accumulated evidence — not a static score. Each tracked thesis carries a 90-day half-life: older signals fade, recency is real signal. The daily briefing format (editorial narrative, not a search interface) forced the system to synthesize evidence rather than retrieve it. Running all inference locally via Ollama changed the economics of background ingestion from expensive to essentially free.',

    insights: [
      'A 15% keyword pre-filter before LLM classification controls compute cost without meaningful recall loss — stage ordering matters as much as algorithm choice.',
      'Confidence scoring with half-life decay produces more honest scores than static counts. A company mentioned once in March shouldn\'t still read as a strong signal in August.',
      'Immutable evidence records with explicit re-evaluation on thesis edits prevent silent score drift — the user always knows why a confidence changed.',
      'Qdrant as a dedicated vector store cleanly separates semantic search from relational state. Mixing embedding search into PostgreSQL at this ingestion volume would have created operational complexity without saving infrastructure.',
      'Local-only inference via Ollama eliminated per-query costs entirely, which made continuous background ingestion economically viable.',
    ],

    reflection:
      'The five pre-configured investment themes were mine. The thesis configuration UX — adjusting keywords, adding new themes — was designed but deprioritized. A system this personalized needs configuration to be a first-class feature, not an afterthought. I would build the configuration surface first.',

    githubUrl: 'https://github.com/karansidhu3/MarketMind-AI',
    // heroImage: '/images/marketmind/hero.png',         // Feed page, full viewport, dark theme
    // screenshotUrls: ['/images/marketmind/detail.png'], // Company detail / briefing view

    placeholder: {
      heroVariant: 'dashboard',
      screenshotCount: 3,
    },

    atmosphereColor: 'rgba(200, 184, 154, 0.07)',
    order: 1,
    contentLayout: 'standard',
  },

  {
    slug: 'career-os',
    title: 'Career OS',
    descriptor:
      'Paste a job description. Get a tailored resume and cover letter compiled from your persistent profile.',
    year: 2025,
    status: 'live',
    tech: ['Next.js', 'FastAPI', 'PostgreSQL', 'Claude', 'LaTeX', 'Railway'],

    problem:
      "Manual resume tailoring is an unrewarded skill. Most candidates either send a generic resume or spend hours on each application. The right architecture is a persistent model of yourself — all your experience, projects, and metrics in one place — combined with a generation layer that understands how to compress and select for the specific role, not just how to sound impressive.",

    approach:
      'The critical insight was separating project selection from prose generation. The model commits to which projects to emphasize before writing a single bullet — because a model trying to optimize selection and writing simultaneously produces weak, compressed bullets that try to include everything. Scanner-first prompting (assume ATS screening before human reading) changed the compression strategy entirely: numbers are preserved, not approximated; weak qualifiers are removed, not hedged.',

    insights: [
      "Decoupling project selection from prose generation measurably improves bullet quality. The model writes better when it's committed to a shortlist rather than simultaneously optimizing what to include.",
      "LaTeX compiled via Tectonic produces output that looks like a document, not a web page printed. React-based PDF generators can't match the typographic control without significant custom work.",
      "Claude's prompt caching on the system prompt (which carries the full profile) achieved >85% cache hit rate after the first call — repeated generation is nearly free operationally.",
      "Cover letter editing via a PATCH endpoint that persists changes meant the UI could be opinionated (strongly formatted output) without being precious — users can edit, save, carry forward.",
    ],

    reflection:
      'The system was designed for a single user from the start. Multi-user support was deliberately out of scope, but the profile schema assumed a single fixed identity at a structural level. Supporting a second user would require rethinking the schema, not just adding an auth layer. I would design for multi-tenancy from the first migration even on a personal tool.',

    githubUrl: 'https://github.com/karansidhu3/Career-OS',
    // heroImage: '/images/career-os/hero.png',          // Fit analysis result page
    // screenshotUrls: ['/images/career-os/history.png'], // History panel open, 6+ entries

    placeholder: {
      heroVariant: 'list',
      screenshotCount: 3,
    },

    atmosphereColor: 'rgba(107, 191, 138, 0.055)',
    order: 2,
    contentLayout: 'interface-forward',
  },

  {
    slug: 'timekeep',
    title: 'Timekeep',
    descriptor: 'Workforce scheduling built for shift workers, not HR departments.',
    year: 2024,
    status: 'live',
    tech: ['Next.js', 'TypeScript', 'Supabase', 'PostgreSQL'],

    problem:
      "Scheduling tools for small operational teams are built for HR departments. They require accounts, passwords, and desktop browsers. The actual users — someone clocking in at 6am, a manager editing next week's shifts between tasks — need one-tap actions from a phone, no onboarding, and no features they'll never use. Scheduling software built for HR is the wrong tool for a five-person team.",

    approach:
      'Server Components and Server Actions as the full data layer eliminated client-side state management entirely — no Zustand, no React Query, no optimistic update complexity. The server is the source of truth and the latency is acceptable for this use case. Row Level Security in Supabase enforces authorization at the database layer; the application can\'t accidentally expose one employee\'s data to another regardless of application-level bugs.',

    insights: [
      "Server Components + Server Actions as the complete data layer removed an entire class of problems: no API routes, no client-side caching, no sync state. The tradeoff — stronger latency requirements — was the right call for a scheduling context where data freshness matters.",
      "Row Level Security enforces authorization at the database, not the application. This is a qualitatively different security guarantee — the constraint holds even if the application layer has bugs.",
      "PIN authentication (4-digit, no passwords) was the right tradeoff for shift workers. The threat model doesn't warrant the friction of password management; security theater is worse than calibrated security.",
      "Native select elements over custom time inputs eliminated a full class of mobile input bugs. The browser's native picker is better than what I would have built for this interaction.",
    ],

    reflection:
      'The template system for recurring schedule patterns was the right feature to build first — it reduces weekly admin time dramatically. I built it third. The MVP could have been templates alone, shipped faster, and validated the core value before building clock-in/out and the employee management layer.',

    githubUrl: 'https://github.com/karansidhu3/Timekeep',
    // heroImage: '/images/timekeep/hero.png',            // Admin schedule, desktop, fully populated
    // screenshotUrls: ['/images/timekeep/mobile.png'],   // Employee clock-in, mobile viewport
    screenshotRatios: ['tall'],

    placeholder: {
      heroVariant: 'list',
      screenshotCount: 1,
    },

    atmosphereColor: 'rgba(224, 92, 92, 0.055)',
    order: 3,
    contentLayout: 'compressed',
  },
];

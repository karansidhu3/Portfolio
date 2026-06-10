import { CinematicReveal } from '@/components/motion/CinematicReveal';
import { ImageMedia } from '@/components/ui/MediaContainer';
import { PlaceholderDiagram } from '@/components/ui/placeholder/PlaceholderDiagram';
import { PlaceholderHero } from '@/components/ui/placeholder/PlaceholderHero';
import { PlaceholderScreenshots } from '@/components/ui/placeholder/PlaceholderScreenshots';
import { ProjectEntryFrame } from '@/components/sections/ProjectEntryFrame';
import type { Project } from '@/lib/data/projects';

interface ProjectSceneProps {
  project: Project;
  index: number;
}

/*
 * Scene 3–5 — Project Narrative.
 * Emotional purpose: demonstrate depth and care through specific artifacts.
 *
 * STRUCTURE:
 *   1. ProjectEntryFrame — the cinematic threshold. Consistent grammar across
 *      all three projects: the visitor learns the vocabulary once.
 *   2. Content section — three layout variants that reflect each project's
 *      character. The grammar stays; the composition varies.
 *
 * TYPOGRAPHY AND VISUAL GRAMMAR:
 *
 * The entry frame is cinematic. The content section is documentary —
 * but documentary does not mean underdressed. Every prose section uses
 * the same ruled-band grammar as the metadata strip: a 1px border-top
 * above the label, paddingTop below it, then the content. This creates
 * a consistent editorial cadence across the entire project body.
 *
 * The insight rows are the closest thing to "evidence" on the page.
 * They carry specific, transferable engineering knowledge. At 1.0625rem
 * with py-8 vertical padding, each insight reads as a discrete entry in
 * a catalog — not a line in a list.
 *
 * Approach and Reflection are the most authored prose in the project body.
 * They get 1.0625rem text and 1.75 line-height. The extra 0.0625rem over
 * body text is not visible in isolation — it's felt in reading rhythm.
 *
 * LAYOUT VARIANTS:
 *
 *   'standard' (MarketMind — data/AI system):
 *   Architecture-forward. Problem/metadata split → hero image → screenshots
 *   → architecture diagram → insights → approach/reflection.
 *
 *   'interface-forward' (Folio — product/UX):
 *   Interface promoted above problem. Screenshots first — result before reasoning.
 *   Full-width problem statement. No architecture diagram (honest editorial choice).
 *
 *   'compressed' (Timekeep — archived/mobile):
 *   Minimal structure, deliberate negative space. Archived status reflected
 *   in the layout: fewer elements, reflection weighted above approach.
 *
 * Server component: zero JS cost. Motion lives in ProjectEntryFrame and
 * CinematicReveal only.
 */
export function ProjectScene({ project, index }: ProjectSceneProps) {
  const headingId = `${project.slug}-heading`;
  const sectionId = index === 0 ? 'work' : `project-${project.slug}`;

  return (
    <section
      id={sectionId}
      className="relative"
      aria-labelledby={headingId}
    >
      {/*
       * Per-project atmosphere: gradient tint, transparent at both edges.
       * Fades in over first 12% and out over last 12% — no hard color edge
       * at adjacent section boundaries.
       */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(to bottom, transparent 0%, ${project.atmosphereColor} 12%, ${project.atmosphereColor} 88%, transparent 100%)`,
        }}
        aria-hidden="true"
      />

      {/* Spatial spread entry — unique composition per project */}
      <ProjectEntryFrame
        headingId={headingId}
        index={index}
        title={project.title}
        descriptor={project.descriptor}
        year={project.year}
        tech={project.tech}
      />

      {/* Content section — variant determined by project character */}
      <div className="section-padding relative z-content">
        {project.contentLayout === 'standard' && (
          <StandardLayout project={project} />
        )}
        {project.contentLayout === 'interface-forward' && (
          <InterfaceForwardLayout project={project} />
        )}
        {project.contentLayout === 'compressed' && (
          <CompressedLayout project={project} />
        )}
      </div>
    </section>
  );
}

/* ─── Layout: Standard ────────────────────────────────────────────────────────
 *
 * MarketMind — data/AI system. The architecture is the protagonist.
 * Problem/metadata split → full-width hero → screenshots → diagram → insights.
 * Full documentary treatment — the system rewards deep examination.
 */
function StandardLayout({ project }: { project: Project }) {
  return (
    <div className="grid-container">

      {/* Problem — architectural scale */}
      <div className="col-span-12 md:col-span-10 mb-4">
        <p
          className="text-text-primary"
          style={{
            fontSize: 'clamp(2rem, 3.5vw, 4.5rem)',
            fontWeight: 200,
            lineHeight: 1.25,
            letterSpacing: '-0.025em',
          }}
        >
          {project.problem}
        </p>
      </div>

      {/* Metadata — right-aligned annotation */}
      <div className="col-span-12 mb-16 md:mb-20">
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <p className="text-label" style={{ lineHeight: 1.6 }}>
            {project.year} · {project.status.replace('-', ' ')} · {project.tech.join(' · ')}
          </p>
        </div>
      </div>

      {/* Hero image */}
      <div className="col-span-12 mb-12 md:mb-16">
        <CinematicReveal direction="bottom">
          <ImageMedia
            src={project.heroImage}
            alt={`${project.title} interface overview`}
            ratio="cinema"
            priority={true}
          >
            <PlaceholderHero
              title={project.title}
              variant={project.placeholder.heroVariant}
            />
          </ImageMedia>
        </CinematicReveal>
      </div>

      {/* Screenshots */}
      <div className="col-span-12 mb-16 md:mb-20">
        <SectionLabel>Interface</SectionLabel>
        <ScreenshotGrid project={project} />
      </div>

      {/* Architecture diagram — central to the standard layout */}
      <div className="col-span-12 mb-16 md:mb-20">
        <SectionLabel>System Architecture</SectionLabel>
        <PlaceholderDiagram slug={project.slug} title={project.title} />
      </div>

      {/* Engineering insights — full width, numbers as structural anchors */}
      <div className="col-span-12 mb-16 md:mb-20">
        <SectionLabel>Engineering Insights</SectionLabel>
        <div>
          {project.insights.map((insight, i) => (
            <InsightRow key={i} index={i} text={insight} />
          ))}
        </div>
      </div>

      {/* Approach + reflection */}
      <div className="col-span-12 grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16">
        <div className="md:col-span-5">
          <SectionLabel>Approach</SectionLabel>
          <p
            className="text-text-secondary"
            style={{ fontSize: '1.0625rem', lineHeight: 1.75, letterSpacing: '-0.01em' }}
          >
            {project.approach}
          </p>
        </div>
        <div className="md:col-span-5 md:col-start-7">
          <SectionLabel>Reflection</SectionLabel>
          <p
            className="text-text-secondary"
            style={{ fontSize: '1.0625rem', lineHeight: 1.75, letterSpacing: '-0.01em', marginBottom: '2rem' }}
          >
            {project.reflection}
          </p>
          <ExternalLinks project={project} />
        </div>
      </div>

    </div>
  );
}

/* ─── Layout: Interface-Forward ───────────────────────────────────────────────
 *
 * Folio — product/UX. The interface is the argument.
 *
 * Reversed emphasis: screenshots appear before the problem statement.
 * The visitor encounters the product before the explanation — which mirrors
 * how good product judgment works: the result communicates before the reasoning.
 *
 * Problem statement goes full-width (col-span-9). Not split against metadata —
 * product thinking is declarative, not tabular. Metadata in a ruled band below.
 * No architecture diagram — this is a product-thinking project, not a systems one.
 */
function InterfaceForwardLayout({ project }: { project: Project }) {
  return (
    <div className="grid-container">

      {/* Interface FIRST — the product speaks before the explanation */}
      <div className="col-span-12 mb-16 md:mb-20">
        <CinematicReveal direction="bottom">
          <ImageMedia
            src={project.heroImage}
            alt={`${project.title} interface overview`}
            ratio="cinema"
          >
            <PlaceholderHero
              title={project.title}
              variant={project.placeholder.heroVariant}
            />
          </ImageMedia>
        </CinematicReveal>
      </div>

      {/* Screenshots alongside — the full interface picture */}
      <div className="col-span-12 mb-16 md:mb-20">
        <ScreenshotGrid project={project} />
      </div>

      {/* Problem — architectural scale */}
      <div className="col-span-12 md:col-span-10 mb-4">
        <p
          className="text-text-primary"
          style={{
            fontSize: 'clamp(2rem, 3.5vw, 4.5rem)',
            fontWeight: 200,
            lineHeight: 1.25,
            letterSpacing: '-0.025em',
          }}
        >
          {project.problem}
        </p>
      </div>

      {/* Metadata — right-aligned annotation */}
      <div className="col-span-12 mb-16 md:mb-20">
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <p className="text-label" style={{ lineHeight: 1.6 }}>
            {project.year} · {project.status.replace('-', ' ')} · {project.tech.join(' · ')}
          </p>
        </div>
      </div>

      {/* Insights — product insights across two columns */}
      <div className="col-span-12 mb-16 md:mb-20">
        <SectionLabel>What I Learned</SectionLabel>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
          {project.insights.map((insight, i) => (
            <InsightRow key={i} index={i} text={insight} />
          ))}
        </div>
      </div>

      {/* Approach + reflection */}
      <div className="col-span-12 grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16">
        <div className="md:col-span-5">
          <SectionLabel>Approach</SectionLabel>
          <p
            className="text-text-secondary"
            style={{ fontSize: '1.0625rem', lineHeight: 1.75, letterSpacing: '-0.01em' }}
          >
            {project.approach}
          </p>
        </div>
        <div className="md:col-span-5 md:col-start-7">
          <SectionLabel>Reflection</SectionLabel>
          <p
            className="text-text-secondary"
            style={{ fontSize: '1.0625rem', lineHeight: 1.75, letterSpacing: '-0.01em', marginBottom: '2rem' }}
          >
            {project.reflection}
          </p>
          <ExternalLinks project={project} />
        </div>
      </div>

    </div>
  );
}

/* ─── Layout: Compressed ──────────────────────────────────────────────────────
 *
 * Timekeep — archived/mobile. The project has a finite, honest story.
 *
 * Compressed structure: full problem statement, hero image, insights in a
 * tighter arrangement, no architecture diagram, reflection carries more
 * weight than approach. The negative space is editorial — it says "this
 * project is complete, not abandoned; small, not unfinished."
 *
 * Archival register: the project is documented rather than presented.
 * Less fanfare. More honesty. The compression is the judgment call.
 */
function CompressedLayout({ project }: { project: Project }) {
  return (
    <div className="grid-container">

      {/* Problem — compressed but architecturally present */}
      <div className="col-span-12 md:col-span-10 mb-4">
        <p
          className="text-text-primary"
          style={{
            fontSize: 'clamp(1.75rem, 3vw, 4rem)',
            fontWeight: 200,
            lineHeight: 1.3,
            letterSpacing: '-0.02em',
          }}
        >
          {project.problem}
        </p>
      </div>

      {/* Metadata — right-aligned annotation */}
      <div className="col-span-12 mb-16 md:mb-20">
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <p className="text-label" style={{ lineHeight: 1.6 }}>
            {project.year} · {project.status.replace('-', ' ')} · {project.tech.join(' · ')}
          </p>
        </div>
      </div>

      {/* Hero image */}
      <div className="col-span-12 mb-12 md:mb-16">
        <CinematicReveal direction="bottom">
          <ImageMedia
            src={project.heroImage}
            alt={`${project.title} interface overview`}
            ratio="cinema"
          >
            <PlaceholderHero
              title={project.title}
              variant={project.placeholder.heroVariant}
            />
          </ImageMedia>
        </CinematicReveal>
      </div>

      {/* Screenshots — compact */}
      <div className="col-span-12 mb-16 md:mb-20">
        <ScreenshotGrid project={project} />
      </div>

      {/*
       * Insights — tighter single-column list, labeled "Notes".
       * Archival register: documented, not presented.
       * No architecture diagram — this project's story is human, not systemic.
       */}
      <div className="col-span-12 md:col-span-7 mb-16 md:mb-20">
        <SectionLabel>Notes</SectionLabel>
        <div>
          {project.insights.map((insight, i) => (
            <InsightRow key={i} index={i} text={insight} />
          ))}
        </div>
      </div>

      {/*
       * Reflection weighted above approach in the compressed layout.
       * For an archived project, honest reflection is the primary artifact.
       */}
      <div className="col-span-12 grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16">
        <div className="md:col-span-7">
          <SectionLabel>Reflection</SectionLabel>
          <p
            className="text-text-secondary"
            style={{ fontSize: '1.0625rem', lineHeight: 1.75, letterSpacing: '-0.01em', marginBottom: '2rem' }}
          >
            {project.reflection}
          </p>
          <ExternalLinks project={project} />
        </div>
        <div className="md:col-span-4 md:col-start-9">
          <SectionLabel>Approach</SectionLabel>
          <p
            className="text-text-secondary"
            style={{ fontSize: '1.0625rem', lineHeight: 1.75, letterSpacing: '-0.01em' }}
          >
            {project.approach}
          </p>
        </div>
      </div>

    </div>
  );
}

/* ─── Shared: Screenshot Grid ────────────────────────────────────────────────
 *
 * Renders real screenshots or the placeholder depending on whether
 * screenshotUrls are present. Handles three display cases:
 *
 *   Single tall (portrait mobile): centered, phone-width max, 'tall' ratio
 *   Mixed wide+tall (2 shots): editorial side-by-side, 3fr:2fr columns
 *   Standard (all wide): 1, 2, or 3-column grid
 *
 * Ratios per-screenshot come from project.screenshotRatios; defaults to 'wide'.
 */
function ScreenshotGrid({ project }: { project: Project }) {
  const { screenshotUrls, screenshotRatios, title, placeholder } = project;

  if (!screenshotUrls || screenshotUrls.length === 0) {
    return (
      <PlaceholderScreenshots
        title={title}
        variant={placeholder.heroVariant}
        count={placeholder.screenshotCount}
      />
    );
  }

  // Single portrait screenshot — phone proportions, centered
  if (screenshotUrls.length === 1 && screenshotRatios?.[0] === 'tall') {
    return (
      <div className="flex justify-center">
        <div style={{ width: '100%', maxWidth: '400px' }}>
          <ImageMedia
            src={screenshotUrls[0]}
            alt={`${title} — mobile view`}
            ratio="tall"
          />
        </div>
      </div>
    );
  }

  // Mixed ratios: wide (desktop) + tall (mobile) — editorial side-by-side
  const hasTall = screenshotRatios?.includes('tall') ?? false;
  if (hasTall && screenshotUrls.length === 2) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-4 items-start">
        {screenshotUrls.map((src, i) => (
          <ImageMedia
            key={src}
            src={src}
            alt={`${title} screenshot ${i + 1}`}
            ratio={screenshotRatios?.[i] ?? 'wide'}
          />
        ))}
      </div>
    );
  }

  // Standard: all wide, 1–3 columns
  return (
    <div
      className={`grid gap-4 ${
        screenshotUrls.length === 2
          ? 'grid-cols-1 md:grid-cols-2'
          : screenshotUrls.length >= 3
            ? 'grid-cols-1 md:grid-cols-3'
            : ''
      }`}
    >
      {screenshotUrls.map((src, i) => (
        <ImageMedia
          key={src}
          src={src}
          alt={`${title} screenshot ${i + 1}`}
          ratio={screenshotRatios?.[i] ?? 'wide'}
        />
      ))}
    </div>
  );
}

/* ─── Shared: Section Label ───────────────────────────────────────────────────
 *
 * Every content section (Insights, Approach, Reflection, Interface,
 * System Architecture) opens with a ruled band — the same editorial grammar
 * as the metadata strip. This creates a consistent cadence throughout the
 * project body: ruled line, label, content. The visitor learns the pattern
 * once and reads it fluently thereafter.
 *
 * No margin-bottom on the label itself — the marginBottom here controls the
 * full label block (border + label text) to its content below.
 */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-label" style={{ marginBottom: '1.25rem' }}>
      {children}
    </p>
  );
}

/* ─── Shared: Insight Row ─────────────────────────────────────────────────────
 *
 * Each insight is a discrete entry in a catalog — not a list item.
 * The number indexes the entry (same grammar as the entry frame's watermark
 * scene number, but at label scale). The text is the artifact.
 *
 * py-8: more generous than body-copy rows. The insight deserves to breathe.
 * 1.0625rem: 1px larger than body text. The extra pixel is felt in rhythm,
 * not consciously noticed in isolation.
 * last:border-0: the final entry has no bottom border — it ends against silence.
 */
function InsightRow({ index, text }: { index: number; text: string }) {
  return (
    <div
      className="border-b border-border last:border-0"
      style={{
        display: 'grid',
        gridTemplateColumns: 'clamp(2.5rem, 4vw, 5rem) 1fr',
        gap: '2rem',
        alignItems: 'start',
        paddingTop: '2rem',
        paddingBottom: '2rem',
      }}
    >
      <span
        aria-hidden="true"
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 'clamp(1.75rem, 2.5vw, 3rem)',
          fontWeight: 100,
          lineHeight: 1,
          letterSpacing: '-0.03em',
          color: 'var(--color-text-tertiary)',
        }}
      >
        {String(index + 1).padStart(2, '0')}
      </span>
      <p
        className="text-text-secondary"
        style={{
          fontSize: '1.0625rem',
          lineHeight: 1.7,
          letterSpacing: '-0.005em',
          paddingTop: 'clamp(0.2rem, 0.4vw, 0.4rem)',
        }}
      >
        {text}
      </p>
    </div>
  );
}

/* ─── Shared: External Links ──────────────────────────────────────────────────
 *
 * Demo and GitHub links — used by all layout variants.
 * Plain label-style links, same grammar as Contact section's LinkedIn/GitHub.
 * No button borders — the links are annotations, not CTAs.
 * Only rendered when links exist.
 */
function ExternalLinks({ project }: { project: Project }) {
  if (!project.demoUrl && !project.githubUrl) return null;

  return (
    <div className="flex flex-wrap gap-8">
      {project.demoUrl && (
        <a
          href={project.demoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-label hover:text-text-secondary hover:translate-x-px hover:-translate-y-px transition duration-200 inline-block"
          aria-label={`${project.title} live demo`}
        >
          Live Demo ↗
        </a>
      )}
      {project.githubUrl && (
        <a
          href={project.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-label hover:text-text-secondary hover:translate-x-px hover:-translate-y-px transition duration-200 inline-block"
          aria-label={`${project.title} on GitHub`}
        >
          GitHub ↗
        </a>
      )}
    </div>
  );
}

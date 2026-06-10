interface PlaceholderDiagramProps {
  slug: string;
  title: string;
}

/*
 * Architecture diagram placeholder.
 *
 * Each project gets an SVG that suggests the actual shape of the system.
 * Nodes and paths use data-diagram-path / data-diagram-node attributes so
 * the scroll-draw animation (ArchitectureDiagram.tsx) will work immediately
 * once the SVG is wired in.
 *
 * These diagrams are intentionally abstract — they show topology and flow,
 * not implementation detail. That comes with the real authored diagrams in Phase 4.
 *
 * Swap: add `architectureDiagramPath` to the project entry in lib/data/projects.ts,
 * pointing to a properly authored SVG in /public/diagrams/.
 */
export function PlaceholderDiagram({ slug, title }: PlaceholderDiagramProps) {
  return (
    <div
      className="w-full relative border border-border bg-bg-secondary overflow-hidden"
      style={{ minHeight: 320 }}
      role="img"
      aria-label={`${title} system architecture diagram`}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        {slug === 'marketmind' && <MarketMindDiagram />}
        {slug === 'career-os' && <CareerOsDiagram />}
        {slug === 'timekeep' && <TimekeepDiagram />}
      </div>

      {/* Label */}
      <div className="absolute bottom-4 left-6">
        <span className="text-label" style={{ color: 'var(--color-text-tertiary)', opacity: 0.5 }}>
          System Architecture — {title}
        </span>
      </div>
    </div>
  );
}

// ─── Project-Specific Diagrams ─────────────────────────────────────────────────

function MarketMindDiagram() {
  /*
   * Ingestion pipeline: Sources → Ingest → Pre-filter (15% threshold) →
   * Ollama (classify + embed) → Qdrant (semantic) → PostgreSQL (state) →
   * Daily Briefing (Next.js)
   *
   * Reflects the actual stack: FastAPI backend, Qdrant vector store,
   * Ollama local inference (qwen3:8b + nomic-embed-text), Redis cache,
   * confidence scoring with 90-day half-life decay.
   */
  const nodes = [
    { id: 'sources',  x: 50,  y: 140, label: 'Sources',  sub: 'SEC / News' },
    { id: 'ingest',   x: 190, y: 140, label: 'Ingest',   sub: 'FastAPI' },
    { id: 'filter',   x: 330, y: 140, label: 'Pre-filter', sub: '15% threshold' },
    { id: 'ollama',   x: 470, y: 140, label: 'Ollama',   sub: 'qwen3:8b' },
    { id: 'qdrant',   x: 610, y: 140, label: 'Qdrant',   sub: 'Vector search' },
    { id: 'postgres', x: 750, y: 140, label: 'Postgres', sub: 'State + scores' },
  ];

  const paths: [number, number, number, number][] = [
    [50 + 72, 140, 190 - 10, 140],
    [190 + 72, 140, 330 - 10, 140],
    [330 + 72, 140, 470 - 10, 140],
    [470 + 72, 140, 610 - 10, 140],
    [610 + 72, 140, 750 - 10, 140],
  ];

  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 920 320"
      preserveAspectRatio="xMidYMid meet"
      xmlns="http://www.w3.org/2000/svg"
    >
      {paths.map(([x1, y1, x2, y2], i) => (
        <line
          key={i}
          x1={x1} y1={y1} x2={x2} y2={y2}
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="1"
          strokeDasharray="4 4"
          data-diagram-path
        />
      ))}

      {paths.map(([, , x2, y2], i) => (
        <polygon
          key={i}
          points={`${x2},${y2} ${x2 - 6},${y2 - 4} ${x2 - 6},${y2 + 4}`}
          fill="rgba(255,255,255,0.12)"
        />
      ))}

      {nodes.map(({ x, y, label, sub }) => (
        <g key={label} data-diagram-node>
          <rect x={x} y={y - 30} width="72" height="60" rx="4"
            fill="rgba(255,255,255,0.025)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          <text x={x + 36} y={y - 8} textAnchor="middle"
            fill="rgba(240,237,232,0.6)" fontSize="7.5" fontFamily="var(--font-mono)" letterSpacing="0.06em">
            {label.toUpperCase()}
          </text>
          <text x={x + 36} y={y + 9} textAnchor="middle"
            fill="rgba(255,255,255,0.25)" fontSize="6.5" fontFamily="var(--font-mono)">
            {sub}
          </text>
        </g>
      ))}

      {/* Daily briefing output */}
      <line x1="786" y1="170" x2="786" y2="224"
        stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="4 4" data-diagram-path />
      <rect x="738" y="224" width="96" height="42" rx="4"
        fill="rgba(200,184,154,0.08)" stroke="rgba(200,184,154,0.15)" strokeWidth="1" data-diagram-node />
      <text x="786" y="247" textAnchor="middle"
        fill="rgba(200,184,154,0.65)" fontSize="7.5" fontFamily="var(--font-mono)" letterSpacing="0.08em">
        BRIEFING
      </text>
      <text x="786" y="260" textAnchor="middle"
        fill="rgba(255,255,255,0.25)" fontSize="6.5" fontFamily="var(--font-mono)">
        Next.js
      </text>

      {/* Redis cache note */}
      <rect x="442" y="220" width="60" height="36" rx="4"
        fill="rgba(255,255,255,0.015)" stroke="rgba(255,255,255,0.06)" strokeWidth="1" data-diagram-node />
      <text x="472" y="241" textAnchor="middle"
        fill="rgba(255,255,255,0.3)" fontSize="6.5" fontFamily="var(--font-mono)" letterSpacing="0.06em">
        REDIS
      </text>
      <text x="472" y="252" textAnchor="middle"
        fill="rgba(255,255,255,0.18)" fontSize="6" fontFamily="var(--font-mono)">
        Cache
      </text>
      <line x1="506" y1="170" x2="506" y2="220"
        stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="3 3" data-diagram-path />
    </svg>
  );
}

function CareerOsDiagram() {
  /*
   * Generation pipeline: JD input → FastAPI → Claude tool use →
   * project selection → LaTeX prose → Tectonic compile → PDF output
   *
   * Reflects the actual stack: Next.js (App Router), FastAPI backend,
   * PostgreSQL profile DB, Claude API (tool use), LaTeX/Tectonic,
   * Railway deployment.
   */
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 760 300"
      preserveAspectRatio="xMidYMid meet"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* JD input */}
      <rect x="40" y="120" width="90" height="50" rx="4"
        fill="rgba(255,255,255,0.025)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" data-diagram-node />
      <text x="85" y="142" textAnchor="middle"
        fill="rgba(240,237,232,0.55)" fontSize="7.5" fontFamily="var(--font-mono)" letterSpacing="0.06em">
        JD INPUT
      </text>
      <text x="85" y="156" textAnchor="middle"
        fill="rgba(255,255,255,0.25)" fontSize="6.5" fontFamily="var(--font-mono)">
        Next.js
      </text>

      {/* FastAPI */}
      <line x1="130" y1="145" x2="180" y2="145"
        stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeDasharray="4 4" data-diagram-path />
      <polygon points="180,145 174,141 174,149" fill="rgba(255,255,255,0.12)" />
      <rect x="180" y="120" width="90" height="50" rx="4"
        fill="rgba(255,255,255,0.025)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" data-diagram-node />
      <text x="225" y="142" textAnchor="middle"
        fill="rgba(240,237,232,0.55)" fontSize="7.5" fontFamily="var(--font-mono)" letterSpacing="0.06em">
        FASTAPI
      </text>
      <text x="225" y="156" textAnchor="middle"
        fill="rgba(255,255,255,0.25)" fontSize="6.5" fontFamily="var(--font-mono)">
        Background task
      </text>

      {/* Profile DB feeds into FastAPI */}
      <rect x="160" y="220" width="90" height="46" rx="4"
        fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.08)" strokeWidth="1" data-diagram-node />
      <text x="205" y="246" textAnchor="middle"
        fill="rgba(255,255,255,0.35)" fontSize="7.5" fontFamily="var(--font-mono)" letterSpacing="0.06em">
        POSTGRES
      </text>
      <text x="205" y="259" textAnchor="middle"
        fill="rgba(255,255,255,0.2)" fontSize="6.5" fontFamily="var(--font-mono)">
        Profile DB
      </text>
      <line x1="205" y1="170" x2="205" y2="220"
        stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="3 3" data-diagram-path />

      {/* Claude */}
      <line x1="270" y1="145" x2="330" y2="145"
        stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeDasharray="4 4" data-diagram-path />
      <polygon points="330,145 324,141 324,149" fill="rgba(255,255,255,0.12)" />
      <rect x="330" y="110" width="100" height="70" rx="4"
        fill="rgba(200,184,154,0.06)" stroke="rgba(200,184,154,0.18)" strokeWidth="1" data-diagram-node />
      <text x="380" y="138" textAnchor="middle"
        fill="rgba(200,184,154,0.7)" fontSize="7.5" fontFamily="var(--font-mono)" letterSpacing="0.06em">
        CLAUDE
      </text>
      <text x="380" y="153" textAnchor="middle"
        fill="rgba(200,184,154,0.4)" fontSize="6.5" fontFamily="var(--font-mono)">
        Tool use
      </text>
      <text x="380" y="166" textAnchor="middle"
        fill="rgba(200,184,154,0.3)" fontSize="6" fontFamily="var(--font-mono)">
        Select → Write
      </text>

      {/* LaTeX */}
      <line x1="430" y1="145" x2="490" y2="145"
        stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeDasharray="4 4" data-diagram-path />
      <polygon points="490,145 484,141 484,149" fill="rgba(255,255,255,0.12)" />
      <rect x="490" y="120" width="90" height="50" rx="4"
        fill="rgba(255,255,255,0.025)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" data-diagram-node />
      <text x="535" y="142" textAnchor="middle"
        fill="rgba(240,237,232,0.55)" fontSize="7.5" fontFamily="var(--font-mono)" letterSpacing="0.06em">
        TECTONIC
      </text>
      <text x="535" y="156" textAnchor="middle"
        fill="rgba(255,255,255,0.25)" fontSize="6.5" fontFamily="var(--font-mono)">
        LaTeX → PDF
      </text>

      {/* PDF output */}
      <line x1="580" y1="145" x2="635" y2="145"
        stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeDasharray="4 4" data-diagram-path />
      <polygon points="635,145 629,141 629,149" fill="rgba(255,255,255,0.12)" />
      <rect x="635" y="120" width="90" height="50" rx="4"
        fill="rgba(107,191,138,0.06)" stroke="rgba(107,191,138,0.2)" strokeWidth="1" data-diagram-node />
      <text x="680" y="142" textAnchor="middle"
        fill="rgba(107,191,138,0.7)" fontSize="7.5" fontFamily="var(--font-mono)" letterSpacing="0.06em">
        PDF OUT
      </text>
      <text x="680" y="156" textAnchor="middle"
        fill="rgba(107,191,138,0.35)" fontSize="6.5" fontFamily="var(--font-mono)">
        Resume + CL
      </text>
    </svg>
  );
}

function TimekeepDiagram() {
  /*
   * Server-driven architecture: Next.js Server Components + Server Actions
   * as the full data layer — no separate API routes. Supabase (Postgres + RLS)
   * as backend. Two client surfaces: employee (mobile clock-in/out) and
   * admin (schedule management).
   *
   * Reflects the actual stack: Next.js, TypeScript, Supabase RLS,
   * server-driven data flow (no client-side state management).
   */
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 680 280"
      preserveAspectRatio="xMidYMid meet"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Employee client */}
      <rect x="40" y="60" width="110" height="56" rx="4"
        fill="rgba(255,255,255,0.025)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" data-diagram-node />
      <text x="95" y="84" textAnchor="middle"
        fill="rgba(240,237,232,0.55)" fontSize="7.5" fontFamily="var(--font-mono)" letterSpacing="0.06em">
        EMPLOYEE
      </text>
      <text x="95" y="98" textAnchor="middle"
        fill="rgba(255,255,255,0.25)" fontSize="6.5" fontFamily="var(--font-mono)">
        PIN · Clock in/out
      </text>
      <text x="95" y="109" textAnchor="middle"
        fill="rgba(255,255,255,0.18)" fontSize="6" fontFamily="var(--font-mono)">
        Mobile-first
      </text>

      {/* Admin client */}
      <rect x="40" y="160" width="110" height="56" rx="4"
        fill="rgba(255,255,255,0.025)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" data-diagram-node />
      <text x="95" y="184" textAnchor="middle"
        fill="rgba(240,237,232,0.55)" fontSize="7.5" fontFamily="var(--font-mono)" letterSpacing="0.06em">
        ADMIN
      </text>
      <text x="95" y="198" textAnchor="middle"
        fill="rgba(255,255,255,0.25)" fontSize="6.5" fontFamily="var(--font-mono)">
        Schedules · Templates
      </text>
      <text x="95" y="209" textAnchor="middle"
        fill="rgba(255,255,255,0.18)" fontSize="6" fontFamily="var(--font-mono)">
        Time entry editing
      </text>

      {/* Next.js Server layer */}
      <line x1="150" y1="88" x2="220" y2="130"
        stroke="rgba(255,255,255,0.1)" strokeWidth="1" data-diagram-path />
      <line x1="150" y1="188" x2="220" y2="158"
        stroke="rgba(255,255,255,0.1)" strokeWidth="1" data-diagram-path />
      <rect x="220" y="110" width="130" height="56" rx="4"
        fill="rgba(255,255,255,0.025)" stroke="rgba(255,255,255,0.12)" strokeWidth="1" data-diagram-node />
      <text x="285" y="132" textAnchor="middle"
        fill="rgba(240,237,232,0.6)" fontSize="7.5" fontFamily="var(--font-mono)" letterSpacing="0.06em">
        NEXT.JS
      </text>
      <text x="285" y="147" textAnchor="middle"
        fill="rgba(255,255,255,0.28)" fontSize="6.5" fontFamily="var(--font-mono)">
        Server Components
      </text>
      <text x="285" y="159" textAnchor="middle"
        fill="rgba(255,255,255,0.2)" fontSize="6" fontFamily="var(--font-mono)">
        + Server Actions
      </text>

      {/* Supabase */}
      <line x1="350" y1="138" x2="430" y2="138"
        stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeDasharray="4 4" data-diagram-path />
      <polygon points="430,138 424,134 424,142" fill="rgba(255,255,255,0.12)" />
      <rect x="430" y="100" width="110" height="76" rx="4"
        fill="rgba(107,191,138,0.05)" stroke="rgba(107,191,138,0.15)" strokeWidth="1" data-diagram-node />
      <text x="485" y="128" textAnchor="middle"
        fill="rgba(107,191,138,0.65)" fontSize="7.5" fontFamily="var(--font-mono)" letterSpacing="0.06em">
        SUPABASE
      </text>
      <text x="485" y="143" textAnchor="middle"
        fill="rgba(107,191,138,0.38)" fontSize="6.5" fontFamily="var(--font-mono)">
        Postgres + RLS
      </text>
      <text x="485" y="156" textAnchor="middle"
        fill="rgba(107,191,138,0.28)" fontSize="6" fontFamily="var(--font-mono)">
        Auth at DB layer
      </text>
      <text x="485" y="169" textAnchor="middle"
        fill="rgba(107,191,138,0.22)" fontSize="6" fontFamily="var(--font-mono)">
        Unified identity
      </text>
    </svg>
  );
}

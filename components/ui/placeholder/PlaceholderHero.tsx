import type { PlaceholderConfig } from '@/lib/data/projects';

interface PlaceholderHeroProps {
  title: string;
  variant: PlaceholderConfig['heroVariant'];
}

/*
 * Hero / cinematic reveal placeholder.
 *
 * Renders a dark, atmospheric composition that suggests the interface type
 * without being actual UI. Visual weight and spatial rhythm are production-quality
 * so composition and pacing can be evaluated now.
 *
 * Each variant corresponds to an interface archetype:
 *   dashboard — data-heavy, multi-panel (MarketMind)
 *   list      — structured rows, table-like (Folio)
 *   minimal   — single focus, spare (Timekeep)
 *   pipeline  — linear flow diagram
 *
 * Swap: add `heroImage` path to the project entry in lib/data/projects.ts.
 * The ImageMedia component will replace this placeholder automatically.
 */
export function PlaceholderHero({ title, variant }: PlaceholderHeroProps) {
  return (
    <div
      className="absolute inset-0 bg-bg-secondary flex items-stretch"
      aria-hidden="true"
      role="presentation"
    >
      {/* Grain overlay for texture depth */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.15'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
        }}
      />

      {/* Variant-specific layout */}
      <div className="absolute inset-0">
        {variant === 'dashboard' && <DashboardLayout />}
        {variant === 'list' && <ListLayout />}
        {variant === 'minimal' && <MinimalLayout />}
        {variant === 'pipeline' && <PipelineLayout />}
      </div>

      {/* Bottom label */}
      <div className="absolute bottom-6 left-6">
        <span className="text-label" style={{ color: 'var(--color-text-tertiary)', opacity: 0.6 }}>
          {title} — UI
        </span>
      </div>
    </div>
  );
}

// ─── Layout Variants ───────────────────────────────────────────────────────────

function DashboardLayout() {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 1200 560"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Top navigation bar */}
      <rect x="0" y="0" width="1200" height="48" fill="rgba(255,255,255,0.025)" />
      <rect x="24" y="16" width="80" height="16" rx="2" fill="rgba(255,255,255,0.06)" />
      <rect x="1080" y="14" width="96" height="20" rx="10" fill="rgba(200,184,154,0.12)" />

      {/* Sidebar */}
      <rect x="0" y="48" width="220" height="512" fill="rgba(255,255,255,0.015)" />
      <rect x="0" y="48" width="1" height="512" fill="rgba(255,255,255,0.06)" />
      <rect x="20" y="72" width="120" height="10" rx="2" fill="rgba(255,255,255,0.06)" />
      <rect x="20" y="96" width="80" height="8" rx="2" fill="rgba(255,255,255,0.04)" />
      <rect x="20" y="116" width="100" height="8" rx="2" fill="rgba(255,255,255,0.04)" />
      <rect x="20" y="136" width="90" height="8" rx="2" fill="rgba(255,255,255,0.04)" />
      <rect x="0" y="160" width="220" height="1" fill="rgba(255,255,255,0.05)" />
      <rect x="20" y="180" width="70" height="8" rx="2" fill="rgba(255,255,255,0.035)" />
      <rect x="20" y="200" width="140" height="8" rx="2" fill="rgba(255,255,255,0.035)" />
      <rect x="20" y="220" width="110" height="8" rx="2" fill="rgba(255,255,255,0.035)" />

      {/* Main content area - header */}
      <rect x="240" y="68" width="200" height="20" rx="3" fill="rgba(255,255,255,0.08)" />
      <rect x="240" y="98" width="340" height="10" rx="2" fill="rgba(255,255,255,0.04)" />

      {/* Stat cards row */}
      <rect x="240" y="128" width="220" height="80" rx="4" fill="rgba(255,255,255,0.025)" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      <rect x="256" y="144" width="60" height="8" rx="2" fill="rgba(255,255,255,0.05)" />
      <rect x="256" y="162" width="100" height="18" rx="2" fill="rgba(200,184,154,0.15)" />
      <rect x="256" y="186" width="80" height="7" rx="2" fill="rgba(255,255,255,0.035)" />

      <rect x="476" y="128" width="220" height="80" rx="4" fill="rgba(255,255,255,0.025)" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      <rect x="492" y="144" width="60" height="8" rx="2" fill="rgba(255,255,255,0.05)" />
      <rect x="492" y="162" width="80" height="18" rx="2" fill="rgba(255,255,255,0.08)" />
      <rect x="492" y="186" width="70" height="7" rx="2" fill="rgba(255,255,255,0.035)" />

      <rect x="712" y="128" width="220" height="80" rx="4" fill="rgba(255,255,255,0.025)" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      <rect x="728" y="144" width="60" height="8" rx="2" fill="rgba(255,255,255,0.05)" />
      <rect x="728" y="162" width="90" height="18" rx="2" fill="rgba(255,255,255,0.08)" />
      <rect x="728" y="186" width="65" height="7" rx="2" fill="rgba(255,255,255,0.035)" />

      {/* Main chart panel */}
      <rect x="240" y="228" width="692" height="200" rx="4" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
      {/* Chart lines */}
      <polyline
        points="260,400 340,360 420,380 500,320 580,290 660,310 700,270 780,285 820,260 900,240"
        fill="none"
        stroke="rgba(200,184,154,0.25)"
        strokeWidth="1.5"
      />
      <polyline
        points="260,400 340,395 420,410 500,390 580,400 660,380 700,395 780,370 820,385 900,360"
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="1"
      />
      {/* Chart grid lines */}
      <line x1="260" y1="250" x2="912" y2="250" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
      <line x1="260" y1="290" x2="912" y2="290" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
      <line x1="260" y1="330" x2="912" y2="330" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
      <line x1="260" y1="370" x2="912" y2="370" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />

      {/* Right panel - feed items */}
      <rect x="948" y="68" width="232" height="360" rx="4" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
      <rect x="964" y="84" width="80" height="8" rx="2" fill="rgba(255,255,255,0.07)" />
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i}>
          <rect x="964" y={110 + i * 60} width="200" height="8" rx="2" fill="rgba(255,255,255,0.05)" />
          <rect x="964" y={124 + i * 60} width="160" height="7" rx="2" fill="rgba(255,255,255,0.03)" />
          <rect x="964" y={138 + i * 60} width="60" height="6" rx="2" fill="rgba(200,184,154,0.1)" />
        </g>
      ))}

      {/* Bottom feed row */}
      <rect x="240" y="446" width="692" height="10" rx="2" fill="rgba(255,255,255,0.03)" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect key={i} x={240 + i * 120} y="468" width="100" height="8" rx="2" fill="rgba(255,255,255,0.03)" />
      ))}
    </svg>
  );
}

function ListLayout() {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 1200 560"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Top nav */}
      <rect x="0" y="0" width="1200" height="52" fill="rgba(255,255,255,0.025)" />
      <rect x="24" y="18" width="64" height="14" rx="2" fill="rgba(255,255,255,0.06)" />
      <rect x="500" y="14" width="200" height="24" rx="4" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
      <rect x="1080" y="16" width="96" height="20" rx="4" fill="rgba(107,191,138,0.12)" />

      {/* Column headers */}
      <rect x="40" y="72" width="80" height="8" rx="2" fill="rgba(255,255,255,0.06)" />
      <rect x="320" y="72" width="60" height="8" rx="2" fill="rgba(255,255,255,0.04)" />
      <rect x="520" y="72" width="80" height="8" rx="2" fill="rgba(255,255,255,0.04)" />
      <rect x="720" y="72" width="60" height="8" rx="2" fill="rgba(255,255,255,0.04)" />
      <rect x="900" y="72" width="80" height="8" rx="2" fill="rgba(255,255,255,0.04)" />

      {/* Header divider */}
      <rect x="24" y="92" width="1152" height="1" fill="rgba(255,255,255,0.07)" />

      {/* Application rows */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const y = 104 + i * 52;
        const isActive = i === 1 || i === 4;
        const statusColors = [
          'rgba(107,191,138,0.2)', 'rgba(200,184,154,0.2)', 'rgba(255,255,255,0.07)',
          'rgba(255,255,255,0.07)', 'rgba(107,191,138,0.2)', 'rgba(255,255,255,0.07)',
          'rgba(224,92,92,0.12)', 'rgba(255,255,255,0.07)',
        ];
        return (
          <g key={i}>
            {isActive && (
              <rect x="24" y={y - 2} width="1152" height="48" rx="3" fill="rgba(255,255,255,0.025)" />
            )}
            <rect x="40" y={y + 10} width={120 + (i * 23) % 80} height="8" rx="2" fill="rgba(255,255,255,0.07)" />
            <rect x="320" y={y + 10} width="80" height="8" rx="2" fill="rgba(255,255,255,0.04)" />
            <rect x="520" y={y + 6} width="90" height="16" rx="8" fill={statusColors[i]} />
            <rect x="720" y={y + 10} width="60" height="8" rx="2" fill="rgba(255,255,255,0.04)" />
            <rect x="900" y={y + 10} width="100" height="8" rx="2" fill="rgba(255,255,255,0.04)" />
            <rect x="24" y={y + 44} width="1152" height="1" fill="rgba(255,255,255,0.04)" />
          </g>
        );
      })}
    </svg>
  );
}

function MinimalLayout() {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 1200 560"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Centered minimal card */}
      <rect x="380" y="100" width="440" height="360" rx="6" fill="rgba(255,255,255,0.025)" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />

      {/* Timer display */}
      <rect x="440" y="140" width="320" height="80" rx="4" fill="rgba(255,255,255,0.025)" />
      <rect x="480" y="163" width="240" height="34" rx="3" fill="rgba(255,255,255,0.07)" />

      {/* Control row */}
      <circle cx="560" cy="280" r="28" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      <circle cx="640" cy="280" r="36" fill="rgba(224,92,92,0.12)" stroke="rgba(224,92,92,0.2)" strokeWidth="1" />
      <circle cx="720" cy="280" r="28" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />

      {/* Log entries */}
      <rect x="404" y="348" width="392" height="1" fill="rgba(255,255,255,0.06)" />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x="420" y={360 + i * 26} width={180 + (i * 40) % 80} height="7" rx="2" fill="rgba(255,255,255,0.04)" />
          <rect x="740" y={360 + i * 26} width="44" height="7" rx="2" fill="rgba(255,255,255,0.035)" />
        </g>
      ))}

      {/* Ambient lines */}
      <line x1="0" y1="280" x2="356" y2="280" stroke="rgba(255,255,255,0.025)" strokeWidth="1" />
      <line x1="844" y1="280" x2="1200" y2="280" stroke="rgba(255,255,255,0.025)" strokeWidth="1" />
    </svg>
  );
}

function PipelineLayout() {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 1200 560"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Pipeline nodes */}
      {[
        { x: 100, label: 'Ingest' },
        { x: 340, label: 'Filter' },
        { x: 580, label: 'Embed' },
        { x: 820, label: 'Rank' },
        { x: 1060, label: 'Deliver' },
      ].map(({ x, label }, i) => (
        <g key={i}>
          <rect x={x} y="220" width="160" height="120" rx="4" fill="rgba(255,255,255,0.025)" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
          <rect x={x + 20} y="248" width="80" height="8" rx="2" fill="rgba(255,255,255,0.06)" />
          <rect x={x + 20} y="266" width="60" height="7" rx="2" fill="rgba(255,255,255,0.03)" />
          <rect x={x + 20} y="284" width="70" height="7" rx="2" fill="rgba(255,255,255,0.03)" />
          <rect x={x + 20} y="310" width="50" height="10" rx="2" fill="rgba(200,184,154,0.1)" />
          {i < 4 && (
            <line
              x1={x + 160} y1="280"
              x2={x + 240} y2="280"
              stroke="rgba(255,255,255,0.08)" strokeWidth="1"
              strokeDasharray="4 4"
            />
          )}
          <text x={x + 80} y="370" textAnchor="middle" fill="rgba(255,255,255,0.2)" fontSize="9" fontFamily="monospace" letterSpacing="2">
            {label.toUpperCase()}
          </text>
        </g>
      ))}
    </svg>
  );
}

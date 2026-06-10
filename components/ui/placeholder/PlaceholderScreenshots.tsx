import type { PlaceholderConfig } from '@/lib/data/projects';

interface PlaceholderScreenshotsProps {
  title: string;
  variant: PlaceholderConfig['heroVariant'];
  count: PlaceholderConfig['screenshotCount'];
}

/*
 * Screenshot gallery placeholder.
 *
 * Renders `count` screenshot frames that suggest the interface without being real UI.
 * Each variant produces a different compositional arrangement.
 *
 * Aspect ratio: 16:9 per screenshot (enforced via MediaContainer in parent).
 * Responsive: single column on mobile, multi-column on desktop.
 *
 * Swap: add `screenshotUrls` array to the project entry in lib/data/projects.ts.
 */
export function PlaceholderScreenshots({ title, variant, count }: PlaceholderScreenshotsProps) {
  const frames = Array.from({ length: count });

  return (
    <div
      className={`grid gap-4 ${count === 1 ? '' : count === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-3'}`}
      role="presentation"
      aria-hidden="true"
    >
      {frames.map((_, i) => (
        <div
          key={i}
          className="aspect-[16/9] relative bg-bg-secondary border border-border overflow-hidden"
        >
          <ScreenshotSVG variant={variant} index={i} />
          <div className="absolute bottom-3 left-3">
            <span className="text-label" style={{ color: 'var(--color-text-tertiary)', opacity: 0.5 }}>
              {title} — {String(i + 1).padStart(2, '0')}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

interface ScreenshotSVGProps {
  variant: PlaceholderConfig['heroVariant'];
  index: number;
}

function ScreenshotSVG({ variant, index }: ScreenshotSVGProps) {
  if (variant === 'dashboard') return <DashboardScreenshot index={index} />;
  if (variant === 'list') return <ListScreenshot index={index} />;
  if (variant === 'minimal') return <MinimalScreenshot index={index} />;
  return <DefaultScreenshot index={index} />;
}

function DashboardScreenshot({ index }: { index: number }) {
  // Index 0: main feed view, Index 1: detail panel, Index 2: settings/config
  const configs = [
    { primaryWidth: 280, showChart: true, showFeed: true },
    { primaryWidth: 480, showChart: false, showFeed: false },
    { primaryWidth: 200, showChart: false, showFeed: false },
  ];
  const cfg = configs[index % configs.length];

  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 800 450"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Top bar */}
      <rect x="0" y="0" width="800" height="36" fill="rgba(255,255,255,0.025)" />
      <rect x="16" y="12" width="60" height="12" rx="2" fill="rgba(255,255,255,0.05)" />

      {/* Sidebar */}
      <rect x="0" y="36" width="160" height="414" fill="rgba(255,255,255,0.015)" />
      <rect x="160" y="36" width="1" height="414" fill="rgba(255,255,255,0.05)" />
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect x="16" y={56 + i * 32} width={60 + (i * 20) % 40} height="8" rx="2" fill="rgba(255,255,255,0.04)" />
        </g>
      ))}

      {/* Main content */}
      {cfg.showChart && (
        <>
          <rect x="176" y="52" width="608" height="160" rx="3" fill="rgba(255,255,255,0.015)" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
          <polyline
            points="192,190 270,160 350,175 440,130 530,120 620,140 700,110 760,100"
            fill="none"
            stroke="rgba(200,184,154,0.2)"
            strokeWidth="1.5"
          />
          {[0, 1, 2, 3].map((i) => (
            <line key={i} x1="192" y1={70 + i * 40} x2="784" y2={70 + i * 40} stroke="rgba(255,255,255,0.025)" strokeWidth="1" />
          ))}
        </>
      )}

      {!cfg.showChart && (
        <rect x="176" y="52" width={cfg.primaryWidth} height="360" rx="3" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
      )}

      {cfg.showFeed && (
        <g>
          {[0, 1, 2, 3, 4].map((i) => (
            <g key={i}>
              <rect x="176" y={228 + i * 44} width="608" height="36" rx="2" fill={i === 0 ? 'rgba(255,255,255,0.025)' : 'transparent'} />
              <rect x="192" y={238 + i * 44} width={180 + (i * 50) % 120} height="7" rx="2" fill="rgba(255,255,255,0.055)" />
              <rect x="192" y={252 + i * 44} width={100 + (i * 30) % 80} height="6" rx="2" fill="rgba(255,255,255,0.03)" />
              {i < 4 && <rect x="176" y={264 + i * 44} width="608" height="1" fill="rgba(255,255,255,0.035)" />}
            </g>
          ))}
        </g>
      )}
    </svg>
  );
}

function ListScreenshot({ index }: { index: number }) {
  const showDetail = index === 1;

  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 800 450"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="0" y="0" width="800" height="40" fill="rgba(255,255,255,0.025)" />
      <rect x="16" y="13" width="56" height="14" rx="2" fill="rgba(255,255,255,0.06)" />
      <rect x="340" y="10" width="120" height="20" rx="4" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />

      {showDetail ? (
        <>
          <rect x="0" y="40" width="320" height="410" fill="rgba(255,255,255,0.015)" />
          <rect x="320" y="40" width="1" height="410" fill="rgba(255,255,255,0.05)" />
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <g key={i}>
              <rect x="16" y={56 + i * 50} width={200 + (i * 30) % 80} height="8" rx="2" fill="rgba(255,255,255,i === 2 ? 0.07 : 0.04)" />
              <rect x="16" y={70 + i * 50} width="80" height="7" rx="2" fill="rgba(255,255,255,0.03)" />
              {i < 6 && <rect x="0" y={98 + i * 50} width="320" height="1" fill="rgba(255,255,255,0.04)" />}
            </g>
          ))}
          <rect x="340" y="60" width="440" height="24" rx="3" fill="rgba(255,255,255,0.04)" />
          <rect x="340" y="100" width="200" height="14" rx="2" fill="rgba(255,255,255,0.07)" />
          <rect x="340" y="124" width="420" height="8" rx="2" fill="rgba(255,255,255,0.035)" />
          <rect x="340" y="140" width="380" height="8" rx="2" fill="rgba(255,255,255,0.025)" />
          <rect x="340" y="180" width="440" height="1" fill="rgba(255,255,255,0.05)" />
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <rect x="340" y={196 + i * 48} width="100" height="8" rx="2" fill="rgba(255,255,255,0.05)" />
              <rect x="340" y={210 + i * 48} width="380" height="7" rx="2" fill="rgba(255,255,255,0.03)" />
            </g>
          ))}
        </>
      ) : (
        <>
          <rect x="16" y="56" width="80" height="8" rx="2" fill="rgba(255,255,255,0.05)" />
          <rect x="240" y="56" width="60" height="8" rx="2" fill="rgba(255,255,255,0.035)" />
          <rect x="400" y="56" width="70" height="8" rx="2" fill="rgba(255,255,255,0.035)" />
          <rect x="560" y="56" width="50" height="8" rx="2" fill="rgba(255,255,255,0.035)" />
          <rect x="0" y="74" width="800" height="1" fill="rgba(255,255,255,0.06)" />

          {[0, 1, 2, 3, 4, 5, 6].map((i) => {
            const y = 86 + i * 50;
            const statusW = [60, 80, 60, 72, 60, 80, 60][i];
            const statusColor = [
              'rgba(107,191,138,0.2)', 'rgba(200,184,154,0.2)',
              'rgba(255,255,255,0.05)', 'rgba(255,255,255,0.05)',
              'rgba(107,191,138,0.2)', 'rgba(224,92,92,0.12)',
              'rgba(255,255,255,0.05)',
            ][i];
            return (
              <g key={i}>
                <rect x="16" y={y + 8} width={100 + (i * 37) % 80} height="8" rx="2" fill="rgba(255,255,255,0.06)" />
                <rect x="240" y={y + 8} width="70" height="8" rx="2" fill="rgba(255,255,255,0.03)" />
                <rect x="400" y={y + 4} width={statusW} height="16" rx="8" fill={statusColor} />
                <rect x="560" y={y + 8} width="60" height="8" rx="2" fill="rgba(255,255,255,0.03)" />
                <rect x="0" y={y + 38} width="800" height="1" fill="rgba(255,255,255,0.035)" />
              </g>
            );
          })}
        </>
      )}
    </svg>
  );
}

function MinimalScreenshot({ index }: { index: number }) {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 800 450"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      {index === 0 ? (
        <>
          {/* Timer view */}
          <rect x="240" y="60" width="320" height="330" rx="6" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
          <rect x="280" y="100" width="240" height="60" rx="4" fill="rgba(255,255,255,0.025)" />
          <rect x="310" y="120" width="180" height="20" rx="3" fill="rgba(255,255,255,0.06)" />
          <circle cx="400" cy="260" r="60" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          <circle cx="400" cy="260" r="60" fill="none" stroke="rgba(224,92,92,0.2)" strokeWidth="2"
            strokeDasharray="220 160" strokeLinecap="round" />
          <rect x="370" y="250" width="60" height="22" rx="3" fill="rgba(255,255,255,0.06)" />
          <rect x="290" y="348" width="240" height="1" fill="rgba(255,255,255,0.05)" />
          {[0, 1].map((i) => (
            <g key={i}>
              <rect x="268" y={362 + i * 22} width={160 + (i * 40)} height="7" rx="2" fill="rgba(255,255,255,0.035)" />
              <rect x="494" y={362 + i * 22} width="44" height="7" rx="2" fill="rgba(255,255,255,0.025)" />
            </g>
          ))}
        </>
      ) : (
        <>
          {/* Log view */}
          <rect x="160" y="40" width="480" height="370" rx="4" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
          <rect x="176" y="60" width="100" height="14" rx="3" fill="rgba(255,255,255,0.06)" />
          <rect x="176" y="84" width="448" height="1" fill="rgba(255,255,255,0.05)" />
          {Array.from({ length: 8 }).map((_, i) => (
            <g key={i}>
              <rect x="176" y={96 + i * 36} width={i === 0 ? 44 : 36} height="8" rx="2" fill="rgba(255,255,255,0.05)" />
              <rect x="240" y={96 + i * 36} width={120 + (i * 30) % 80} height="8" rx="2" fill="rgba(255,255,255,0.04)" />
              <rect x="480" y={96 + i * 36} width="60" height="8" rx="2" fill="rgba(255,255,255,0.035)" />
              {i < 7 && <rect x="176" y={116 + i * 36} width="448" height="1" fill="rgba(255,255,255,0.03)" />}
            </g>
          ))}
        </>
      )}
    </svg>
  );
}

function DefaultScreenshot({ index }: { index: number }) {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 800 450"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="0" y="0" width="800" height="36" fill="rgba(255,255,255,0.025)" />
      <rect x="100" y="80" width="600" height="300" rx="4" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
      {Array.from({ length: 5 }).map((_, i) => (
        <rect key={i} x="120" y={100 + i * 50} width={200 + (i * index * 30) % 300} height="10" rx="2" fill="rgba(255,255,255,0.04)" />
      ))}
    </svg>
  );
}

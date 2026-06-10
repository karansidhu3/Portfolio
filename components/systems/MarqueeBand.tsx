/*
 * MarqueeBand — infinite horizontal ticker.
 *
 * CSS-only animation: zero JS, GPU-composited transform, no main-thread cost.
 * Two copies of the item list create a seamless loop — the track animates to -50%
 * (one full copy width), then wraps. The second copy fills the gap invisibly.
 *
 * Respects prefers-reduced-motion: animation paused when reduced motion is active.
 * The band still renders at rest so content remains accessible.
 */

const ITEMS = [
  'TypeScript',
  'Next.js',
  'React',
  'Python',
  'FastAPI',
  'PostgreSQL',
  'Qdrant',
  'Redis',
  'Docker',
  'GSAP',
  'Framer Motion',
  'Claude',
  'Ollama',
  'Supabase',
  'LaTeX',
  'Railway',
  'MarketMind',
  'Career OS',
  'Timekeep',
  'AI Systems',
  'Full-Stack',
  'Product Craft',
] as const;

const SEPARATOR = '·';

export function MarqueeBand() {
  return (
    <div
      style={{
        borderTop: '1px solid var(--color-border)',
        borderBottom: '1px solid var(--color-border)',
        overflow: 'hidden',
        height: '2.25rem',
        display: 'flex',
        alignItems: 'center',
      }}
      aria-hidden="true"
    >
      {/* marquee-track uses @keyframes marquee defined in globals.css */}
      <div className="marquee-track">
        {/* First copy */}
        <MarqueeContent />
        {/* Second copy — enables seamless loop */}
        <MarqueeContent />
      </div>
    </div>
  );
}

function MarqueeContent() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 0,
        paddingRight: '3rem',
        flexShrink: 0,
      }}
    >
      {ITEMS.map((item, i) => (
        <span
          key={`${item}-${i}`}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--color-text-tertiary)',
            whiteSpace: 'nowrap',
            padding: '0 1rem',
          }}
        >
          {item}
          <span style={{ marginLeft: '1rem', opacity: 0.4 }}>{SEPARATOR}</span>
        </span>
      ))}
    </div>
  );
}

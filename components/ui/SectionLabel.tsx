interface SectionLabelProps {
  children: string;
  className?: string;
}

/*
 * Monospace section identifier — used as chapter markers for project scenes.
 * Example: "01 — MarketMind" or "02 — Folio"
 *
 * Typography pattern from DESIGN_SYSTEM.md:
 *   Font: monospace, weight 300–400
 *   Size: --text-xs
 *   Tracking: 0.1em
 *   Transform: uppercase
 *   Color: --color-text-tertiary
 */
export function SectionLabel({ children, className = '' }: SectionLabelProps) {
  return (
    <p className={`text-label ${className}`} aria-hidden="true">
      {children}
    </p>
  );
}

/*
 * Footer — identity signature, nothing more.
 *
 * Three elements, one line: wordmark left, year center, name right.
 * Same mono register as the nav. Intentionally minimal.
 */
export function FooterSection() {
  return (
    <footer
      className="section-padding"
      role="contentinfo"
      style={{ borderTop: '1px solid var(--color-border)' }}
    >
      <div className="grid-container">
        <div
          className="col-span-12 flex items-center justify-between"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-xs)',
            color: 'var(--color-text-tertiary)',
            letterSpacing: '0.04em',
          }}
        >
          <span>KS</span>
          <span>2025</span>
          <span>karan sidhu</span>
        </div>
      </div>
    </footer>
  );
}

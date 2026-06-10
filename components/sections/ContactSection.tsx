/*
 * Scene 7 — Contact.
 * Emotional purpose: the final frame. Quiet, inevitable, resolved.
 *
 * The email address IS the contact invitation — rendered at display scale
 * in monospace, broken editorially across two lines. It is the last
 * typographic event on the page. The statement heading steps back to
 * let it breathe.
 *
 * Line break: karansidhu5550 / @gmail.com
 * The @ symbol begins the second line — a clean semantic break that
 * reads as intentional rather than accidental.
 *
 * No animation. Content exists. The experience is complete.
 * Server component: zero JS cost.
 */
export function ContactSection() {
  return (
    <section
      id="contact"
      className="scene-content section-padding"
      aria-labelledby="contact-heading"
    >
      <div className="grid-container">

        {/* Statement — smaller scale, steps back for the email */}
        <div className="col-span-12 md:col-span-7 mb-12 md:mb-14">
          <h2
            id="contact-heading"
            className="text-text-secondary"
            style={{
              fontSize: 'clamp(1rem, 1.6vw, 1.75rem)',
              fontWeight: 300,
              lineHeight: 1.5,
              letterSpacing: '-0.01em',
            }}
          >
            If what you&apos;ve seen here represents the standard you&apos;re
            working to — reach out.
          </h2>
        </div>

        {/* Email at display scale — the section's typographic focal point */}
        <div className="col-span-12 md:col-span-9 mb-14 md:mb-16">
          <a
            href="mailto:karansidhu5550@gmail.com"
            aria-label="Send email to Karan Sidhu at karansidhu5550@gmail.com"
            className="text-text-primary hover:text-accent hover:-translate-y-1 transition duration-300"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'clamp(1.75rem, 3.5vw, 4.5rem)',
              fontWeight: 300,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              display: 'block',
              textDecoration: 'none',
            }}
          >
            <span style={{ display: 'block' }}>karansidhu5550</span>
            <span style={{ display: 'block' }}>@gmail.com</span>
          </a>
        </div>

        {/* Social links — below the ruled line, secondary register */}
        <div className="col-span-12 md:col-span-6">
          <div
            style={{
              borderTop: '1px solid var(--color-border)',
              paddingTop: '1.5rem',
            }}
          >
            <div className="flex gap-8">
              <a
                href="https://www.linkedin.com/in/karan-sidhu3/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-label hover:text-text-secondary hover:translate-x-px hover:-translate-y-px transition duration-200 inline-block"
                aria-label="Karan Sidhu on LinkedIn"
              >
                LinkedIn ↗
              </a>
              <a
                href="https://github.com/karansidhu3"
                target="_blank"
                rel="noopener noreferrer"
                className="text-label hover:text-text-secondary hover:translate-x-px hover:-translate-y-px transition duration-200 inline-block"
                aria-label="Karan Sidhu on GitHub"
              >
                GitHub ↗
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

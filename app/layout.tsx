import type { Metadata, Viewport } from 'next';
import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';

import '@/app/globals.css';
import { AtmosphereController } from '@/components/systems/AtmosphereController';
import { GrainOverlay } from '@/components/ui/GrainOverlay';

/*
 * FONT SETUP
 *
 * Geist Sans + Geist Mono — designed pair from Vercel.
 * Free, variable-weight, open source (MIT).
 *
 * Geist Sans: geometric humanist, precise without coldness. At display scale
 * (112px, weight 200) the letterforms read as engineered rather than default.
 * A visible step up from Inter: the 'a', 'g', and 'e' have real character.
 *
 * Geist Mono: designed to pair with Geist Sans. Same proportional rhythm,
 * same visual weight. Used for all labels, metadata, and code elements.
 *
 * CSS variables exported:
 *   GeistSans.variable → --font-geist-sans
 *   GeistMono.variable → --font-geist-mono
 *
 * globals.css reads these via:
 *   --font-primary: var(--font-geist-sans, system-ui, sans-serif)
 *   --font-mono: var(--font-geist-mono, 'Courier New', monospace)
 *
 * If Neue Montreal is licensed later:
 *   import localFont from 'next/font/local';
 *   const primaryFont = localFont({ src: [...], variable: '--font-primary-family' });
 *   Update globals.css: --font-primary: var(--font-primary-family, ...)
 */

export const metadata: Metadata = {
  title: {
    default: 'Karan Sidhu — Software Engineer',
    template: '%s — Karan Sidhu',
  },
  description:
    'Software engineer building intelligent systems. AI-native product engineering with depth and care.',
  keywords: ['software engineer', 'AI systems', 'full-stack', 'product engineering'],
  authors: [{ name: 'Karan Sidhu' }],
  creator: 'Karan Sidhu',
  metadataBase: new URL('https://karansidhu.com'),
  openGraph: {
    type: 'website',
    locale: 'en_CA',
    siteName: 'Karan Sidhu',
    title: 'Karan Sidhu — Software Engineer',
    description:
      'Software engineer building intelligent systems. AI-native product engineering with depth and care.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Karan Sidhu — Software Engineer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Karan Sidhu — Software Engineer',
    description:
      'Software engineer building intelligent systems. AI-native product engineering with depth and care.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0a0a0a',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-bg-primary text-text-primary antialiased">
        {/*
         * Environmental layer — three composited elements:
         *
         * 1. Vignette: radial gradient from transparent center to dark cool edges.
         *    The transparent zone (inner 52%) safely contains the content grid at all
         *    viewport widths. Edge darkening starts in the peripheral zone — felt at the
         *    edges of vision without obscuring text. Creates the sense of looking through
         *    a lens rather than at a screen.
         *
         * 2. Warm primary light source: upper-left, amber, 12% opacity.
         *    Strong enough to read as a motivated light source — implied practical light
         *    off the upper-left frame edge. The specific ellipse position (20%, 12%) gives
         *    it deliberate asymmetry. Not centered = not decorative.
         *
         * 3. Cool ambient echo: lower-right, blue-purple, 4% opacity.
         *    The bilateral opposite of the warm source. Creates warm/cool tension across
         *    the viewport — the perceptual mechanism that produces depth.
         *    Two light sources of the same temperature = flat. Two temperatures = space.
         *
         * This layer persists across sections. The space is continuous; the content changes.
         */}
        {/*
         * Persistent environmental base layer — vignette + structural warm/cool tension.
         * This layer does not change with scroll. It is the constant foundation
         * of the space: edge darkening (lens effect), ambient warm key, cool fill.
         *
         * The scroll-reactive atmospheric states are handled by AtmosphereController
         * below — additive layers that augment this base as sections change.
         */}
        <div
          aria-hidden="true"
          style={{
            position: 'fixed',
            inset: 0,
            pointerEvents: 'none',
            background: [
              'radial-gradient(ellipse 96% 94% at 50% 50%, transparent 52%, rgba(5, 5, 10, 0.72) 100%)',
              'radial-gradient(ellipse 75% 50% at 20% 12%, rgba(210, 185, 145, 0.08) 0%, transparent 65%)',
              'radial-gradient(ellipse 55% 42% at 80% 90%, rgba(130, 145, 210, 0.04) 0%, transparent 58%)',
            ].join(', '),
          }}
        />
        {/*
         * AtmosphereController — scroll-reactive per-section light states.
         * Cross-fades between atmospheric moods as sections enter view.
         * Client component; zero server cost.
         */}
        <AtmosphereController />
        <GrainOverlay />
        {children}
      </body>
    </html>
  );
}

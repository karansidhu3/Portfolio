import Image from 'next/image';
import { ReactNode } from 'react';

/*
 * MediaContainer — standardized aspect ratio container.
 *
 * All media in the portfolio flows through this component.
 * Swap from placeholder to real asset by adding `src` to the project data.
 *
 * Aspect ratio is enforced via the `ratio` prop. The container maintains its
 * ratio at all viewport sizes — responsive behavior is stable regardless of
 * whether the content is a placeholder or a real asset.
 *
 * Supported ratios:
 *   'cinema'    21:9  — hero / cinematic reveal
 *   'wide'      16:9  — standard screenshot, video
 *   'photo'      4:3  — secondary screenshots
 *   'square'     1:1  — thumbnails, icons
 *   'tall'       3:4  — mobile screenshots
 */

export type AspectRatio = 'cinema' | 'wide' | 'photo' | 'square' | 'tall';

const RATIO_MAP: Record<AspectRatio, string> = {
  cinema: 'aspect-[21/9]',
  wide: 'aspect-[16/9]',
  photo: 'aspect-[4/3]',
  square: 'aspect-square',
  tall: 'aspect-[3/4]',
};

// Numeric ratio values for calculations
export const RATIO_VALUES: Record<AspectRatio, number> = {
  cinema: 21 / 9,
  wide: 16 / 9,
  photo: 4 / 3,
  square: 1,
  tall: 3 / 4,
};

interface MediaContainerBaseProps {
  ratio?: AspectRatio;
  className?: string;
  children: ReactNode;
}

/*
 * Base container — wraps any content (placeholder or real) at the correct ratio.
 */
export function MediaContainer({
  ratio = 'wide',
  className = '',
  children,
}: MediaContainerBaseProps) {
  return (
    <div className={`relative w-full overflow-hidden ${RATIO_MAP[ratio]} ${className}`}>
      {children}
    </div>
  );
}

/*
 * ImageMedia — renders a real image or passes children (placeholder) through.
 *
 * When `src` is provided: renders next/image with proper optimization.
 * When `src` is omitted: renders children (pass a placeholder component).
 *
 * This makes asset replacement a single-field change in projects.ts.
 */
interface ImageMediaProps {
  src?: string;
  alt: string;
  ratio?: AspectRatio;
  priority?: boolean;
  className?: string;
  children?: ReactNode;
}

export function ImageMedia({
  src,
  alt,
  ratio = 'wide',
  priority = false,
  className = '',
  children,
}: ImageMediaProps) {
  return (
    <MediaContainer ratio={ratio} className={className}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1440px) 80vw, 1200px"
        />
      ) : (
        children
      )}
    </MediaContainer>
  );
}

import { ScrollSequence } from '@/components/systems/ScrollSequence';

/*
 * Reel section — the portfolio's signature interaction.
 *
 * An internal-scroll cinema portal between the hero and the declaration.
 * The visitor scrubs through a sequence of frames at their own pace.
 * Unlike every other section, this one demands action — not just attention.
 *
 * To activate: add JPG frames to /public/reel/ and list them in REEL_FRAMES.
 * The sequence renders a placeholder state until frames are provided.
 *
 * Frame format: sequential JPGs, any aspect ratio — cover-fill handles all.
 * Recommended: 1920×1080 or 2560×1440, JPEG quality 75–85 for performance.
 * Target: 40–65 frames per sequence.
 */

const REEL_FRAMES: string[] = [
  '/reel/001.jpg',
  '/reel/002.jpg',
  '/reel/003.jpg',
  '/reel/004.jpg',
  '/reel/005.jpg',
  '/reel/006.jpg',
  '/reel/007.jpg',
  '/reel/008.jpg',
  '/reel/009.jpg',
  '/reel/010.jpg',
  '/reel/011.jpg',
  '/reel/012.jpg',
  '/reel/013.jpg',
  '/reel/014.jpg',
  '/reel/015.jpg',
  '/reel/016.jpg',
  '/reel/017.jpg',
  '/reel/018.jpg',
  '/reel/019.jpg',
  '/reel/020.jpg',
  '/reel/021.jpg',
  '/reel/022.jpg',
  '/reel/023.jpg',
  '/reel/024.jpg',
];

// Replace with your own project captions once real reel frames are captured
const REEL_CAPTIONS: string[] = [];

export function ReelSection() {
  return (
    <section
      id="reel"
      aria-label="Project reel"
      style={{ position: 'relative' }}
    >
      <ScrollSequence
        frames={REEL_FRAMES}
        captions={REEL_CAPTIONS}
        frameHeight={60}
        displayHeight="80vh"
        label="Portfolio reel — scroll to advance frames"
      />
    </section>
  );
}

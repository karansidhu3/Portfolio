'use client';

import { motion } from 'framer-motion';

/*
 * Scroll indicator — appears after the hero entry sequence settles.
 *
 * Delay of 3.5s matches the hero animation sequence end:
 *   t=0.0  atmosphere + name start (0.1s timeline delay)
 *   t=1.05 descriptor enters
 *   t=1.95 subtext enters
 *   t=2.65 subtext settles
 *   t=3.5  scroll indicator appears (~850ms after everything settles)
 *
 * A single vertical line that fills from top to bottom, then stays.
 * No label. No loop. Architectural rather than instructional.
 *
 * The filled line is a formal cue — it points without explaining.
 * Repeated pulsing would feel mechanical and impatient.
 * A line that fills once and holds is patient, confident, quiet.
 */
export function ScrollIndicator() {
  return (
    <motion.div
      className="flex flex-col items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 3.5, duration: 0.8, ease: 'easeOut' }}
      aria-hidden="true"
    >
      <motion.div
        className="w-px h-8 bg-text-tertiary origin-top"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{
          delay: 0.3,
          duration: 1.4,
          ease: 'easeOut',
        }}
      />
    </motion.div>
  );
}

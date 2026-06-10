/*
 * Timing utilities for animation sequencing.
 */

/** Returns a promise that resolves after ms milliseconds */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Throttle a function to fire at most once per interval */
export function throttle<T extends (...args: unknown[]) => unknown>(
  fn: T,
  interval: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= interval) {
      lastCall = now;
      fn(...args);
    }
  };
}

/** RAF-based loop with cleanup. Returns a cancel function. */
export function rafLoop(callback: (deltaTime: number) => void): () => void {
  let rafId: number;
  let lastTime = performance.now();

  const loop = (currentTime: number) => {
    const deltaTime = (currentTime - lastTime) / 1000; // seconds
    lastTime = currentTime;
    callback(deltaTime);
    rafId = requestAnimationFrame(loop);
  };

  rafId = requestAnimationFrame(loop);
  return () => cancelAnimationFrame(rafId);
}

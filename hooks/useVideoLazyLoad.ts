'use client';

import { RefObject, useEffect } from 'react';

/*
 * Lazy-loads a video element when it enters the viewport.
 *
 * Usage:
 *   const videoRef = useRef<HTMLVideoElement>(null);
 *   useVideoLazyLoad(videoRef);
 *   return <video ref={videoRef} data-src="/video.mp4" muted playsInline loop />;
 *
 * The video element must use data-src instead of src.
 * The actual src is set when the element comes into view.
 */
export function useVideoLazyLoad(
  videoRef: RefObject<HTMLVideoElement | null>,
  rootMargin: string = '200px'
) {
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const src = video.dataset.src;
          if (src) {
            video.src = src;
            video.load();
          }
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [videoRef, rootMargin]);
}

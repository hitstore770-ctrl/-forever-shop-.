"use client";

import { useCallback, useEffect, useRef, type ReactNode } from "react";
import { useMotionValueEvent, useReducedMotion, useScroll, type MotionValue } from "framer-motion";

/*
  Scroll-driven image sequence on a <canvas>.

  Why a canvas sequence and not a <video> whose currentTime is scrubbed:
  scrubbing a video from scroll is unreliable on mobile — iOS refuses to seek
  smoothly on a non-user-initiated play, decoding lags the scroll by whole
  frames, and the whole thing regularly appears frozen. Pre-decoded stills
  drawn to a canvas have none of that: every frame is a plain image, and the
  only per-scroll work is one drawImage call.

  What makes this survive on a phone:
  - Draws are coalesced into a single requestAnimationFrame, so a burst of
    scroll events costs one paint, not thirty.
  - Frames load with bounded concurrency in index order, so the opening frames
    are ready first, and the canvas shows the nearest already-loaded frame
    rather than blanking out while later frames are still arriving.
  - The backing store is sized in device pixels (DPR capped at 2 — a 3x phone
    would otherwise allocate 2.25x the pixels for no visible gain) and the
    frame is cover-fitted manually, so it never stretches.
  - prefers-reduced-motion collapses the whole thing to the final frame with no
    pinned scroll distance at all.

  The parent owns the art direction; this component only owns the pinning and
  the drawing. `overlay` receives the same scroll progress the frames use, so
  captions can be timed against the animation without a second useScroll.
*/

export type CanvasScrollSequenceProps = {
  /** Total frames in the sequence. */
  frameCount: number;
  /**
   * Maps a 0-based frame index to a URL. Kept in a ref internally, so an
   * inline arrow here will not restart the preload on every render.
   */
  getFrameSrc: (index: number) => string;
  /**
   * Scroll distance the pinned canvas occupies, in viewport heights. 300 means
   * the visitor scrolls three screens to play the sequence once — lower is
   * faster and more frenetic, higher is slower and more cinematic.
   */
  scrollVh?: number;
  /**
   * Rendered above the canvas, inside the pinned viewport, and handed the same
   * scroll progress the frames use so captions can be timed against the
   * animation without a second useScroll.
   *
   * Caveat worth knowing before writing one: in this framer-motion version,
   * binding a MotionValue to a plain style property (opacity, colour, ...)
   * renders once at mount and then stops updating, while transform-backed
   * properties on the same element keep tracking. Drive non-transform
   * properties from useMotionValueEvent instead — see DoorSequence.
   */
  overlay?: (progress: MotionValue<number>) => ReactNode;
  /** Sits behind the canvas: visible while frames load, and if they all fail. */
  fallback?: ReactNode;
  className?: string;
  /** Describe the animation for assistive tech; the canvas itself is inert. */
  label?: string;
};

const MAX_DPR = 2;
const LOAD_CONCURRENCY = 6;

export default function CanvasScrollSequence({
  frameCount,
  getFrameSrc,
  scrollVh = 300,
  overlay,
  fallback,
  className = "",
  label,
}: CanvasScrollSequenceProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Loaded frames, sparse: index -> image, or null until that frame arrives.
  const framesRef = useRef<(HTMLImageElement | null)[]>([]);
  const rafRef = useRef(0);
  const pendingFrameRef = useRef(0);
  const drawnFrameRef = useRef(-1);
  const getFrameSrcRef = useRef(getFrameSrc);
  // Held in a ref so an inline arrow from the parent cannot restart the
  // preload on every render. Written in an effect rather than during render,
  // which React forbids.
  useEffect(() => {
    getFrameSrcRef.current = getFrameSrc;
  }, [getFrameSrc]);

  const prefersReducedMotion = useReducedMotion();

  // With no pinned distance there is nothing to scrub, so reduced motion gets
  // a single static frame in a normal-height section.
  const effectiveScrollVh = prefersReducedMotion ? 100 : scrollVh;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Picks the requested frame, else the closest one already decoded — earlier
  // frames win ties, since holding the previous image reads as a stall rather
  // than a jump forward.
  const resolveFrame = useCallback((index: number) => {
    const frames = framesRef.current;
    if (frames[index]) return frames[index];
    for (let offset = 1; offset < frames.length; offset++) {
      if (frames[index - offset]) return frames[index - offset];
      if (frames[index + offset]) return frames[index + offset];
    }
    return null;
  }, []);

  const draw = useCallback(
    (index: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const image = resolveFrame(index);
      if (!image) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const { width, height } = canvas; // device pixels
      if (!width || !height) return;

      // cover fit: fill the viewport, crop the overflow, never distort
      const sourceWidth = image.naturalWidth || width;
      const sourceHeight = image.naturalHeight || height;
      const scale = Math.max(width / sourceWidth, height / sourceHeight);
      const drawWidth = sourceWidth * scale;
      const drawHeight = sourceHeight * scale;

      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(image, (width - drawWidth) / 2, (height - drawHeight) / 2, drawWidth, drawHeight);
      drawnFrameRef.current = index;

      // Reveal on the first successful paint. Deliberately a direct style
      // write rather than React state: this component must not re-render after
      // mount (see the note on `overlay` below).
      if (canvas.style.opacity !== "1") canvas.style.opacity = "1";
    },
    [resolveFrame],
  );

  const scheduleDraw = useCallback(
    (index: number) => {
      pendingFrameRef.current = index;
      if (rafRef.current) return; // a paint is already queued; it'll pick up the latest
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = 0;
        draw(pendingFrameRef.current);
      });
    },
    [draw],
  );

  // --- preload -------------------------------------------------------------
  useEffect(() => {
    let cancelled = false;
    const frames: (HTMLImageElement | null)[] = new Array(frameCount).fill(null);
    framesRef.current = frames;
    drawnFrameRef.current = -1;

    // Reduced motion only ever shows the last frame, so start there.
    pendingFrameRef.current = prefersReducedMotion ? frameCount - 1 : 0;

    let cursor = 0;

    const loadNext = () => {
      if (cancelled || cursor >= frameCount) return;
      const index = cursor++;
      const image = new Image();
      image.decoding = "async";
      image.onload = () => {
        if (cancelled) return;
        frames[index] = image;
        // Repaint if this frame is the one the scroll position actually wants,
        // or if we are still showing a stand-in that this frame improves on.
        if (index === pendingFrameRef.current || drawnFrameRef.current !== pendingFrameRef.current) {
          scheduleDraw(pendingFrameRef.current);
        }
        loadNext();
      };
      image.onerror = () => {
        if (cancelled) return;
        loadNext();
      };
      image.src = getFrameSrcRef.current(index);
    };

    for (let i = 0; i < Math.min(LOAD_CONCURRENCY, frameCount); i++) loadNext();

    return () => {
      cancelled = true;
      // Drop references so the decoded bitmaps can be collected on navigation
      // instead of lingering for the rest of the session.
      framesRef.current = [];
    };
  }, [frameCount, prefersReducedMotion, scheduleDraw]);

  // --- sizing --------------------------------------------------------------
  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = canvas?.parentElement;
    if (!canvas || !stage) return;

    const resize = (width: number, height: number) => {
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      const nextWidth = Math.round(width * dpr);
      const nextHeight = Math.round(height * dpr);
      if (canvas.width === nextWidth && canvas.height === nextHeight) return;
      canvas.width = nextWidth;
      canvas.height = nextHeight;
      drawnFrameRef.current = -1; // resizing clears the backing store
      draw(pendingFrameRef.current);
    };

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      resize(width, height);
    });
    observer.observe(stage);
    return () => observer.disconnect();
  }, [draw]);

  // --- scroll --------------------------------------------------------------
  useMotionValueEvent(scrollYProgress, "change", (value) => {
    if (prefersReducedMotion) return;
    const index = Math.max(0, Math.min(frameCount - 1, Math.round(value * (frameCount - 1))));
    if (index === pendingFrameRef.current && index === drawnFrameRef.current) return;
    scheduleDraw(index);
  });

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label={label}
      className={`relative ${className}`}
      style={{ height: `${effectiveScrollVh}vh` }}
    >
      <div className="sticky top-0 h-svh w-full overflow-hidden bg-pearl">
        {fallback ? <div className="absolute inset-0">{fallback}</div> : null}
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="relative block h-full w-full opacity-0 transition-opacity duration-700"
        />
        {overlay?.(scrollYProgress)}
      </div>
    </section>
  );
}

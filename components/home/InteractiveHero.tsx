"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "framer-motion";
import BrutalButton from "@/components/home/BrutalButton";
import TimeHeadline from "@/components/home/TimeHeadline";
import ZmanimBadge from "@/components/home/ZmanimBadge";
import { cn } from "@/lib/cn";
import {
  HERO_CTA,
  HERO_EYEBROW,
  HERO_SUBHEAD,
  HERO_TITLE_LINES,
  JOIN_ANCHOR_ID,
  TRACK_TEASERS,
} from "@/lib/home-data";

// Scroll-scrubbed opening sequence.
//
// A 300vh section supplies the scroll distance; the screen inside it is pinned
// so the visitor scrolls *through* the animation rather than past it. One
// master timeline on `scrub` drives three things off the same progress: the
// canvas frame index, the headline's exit, and the entrance of the four track
// cards.
//
// ---------------------------------------------------------------------------
// Why a canvas and not a <video>
//
// Scrubbing a <video> by scroll position means asking the browser for a seek
// on every frame, and a seek is a decode the browser is free to service late.
// On iOS that reliably stalls. Drawing pre-rendered frames onto a canvas costs
// one blit per frame and cannot stall.
//
// ---------------------------------------------------------------------------
// Frames
//
// No character sequence exists yet, so `drawPlaceholder` renders the figure
// procedurally — a brutalist pictogram that walks in, stops, and raises an arm.
// It is real motion you can tune today, not a grey box.
//
// To swap in a real sequence, pass `getFrameSrc`. The component then preloads
// with bounded concurrency and draws the nearest decoded frame when the exact
// one has not arrived, so scrubbing never shows a blank screen:
//
//   ffmpeg -i character.mov -vf "fps=30,scale=1080:-2" \
//     public/frames/character/frame-%03d.webp
//
//   <InteractiveHero
//     getFrameSrc={(i) => `/frames/character/frame-${String(i).padStart(3,"0")}.webp`}
//   />
//
// Keep the sequence around 1080px wide. A full-resolution image sequence is
// exactly what exhausts memory on a mid-range phone.
// ---------------------------------------------------------------------------

gsap.registerPlugin(ScrollTrigger, useGSAP);

const FRAME_COUNT = 150;
const MAX_DPR = 2;
const LOAD_CONCURRENCY = 6;

/** Timeline positions, in progress units (the timeline runs 0 → 1). */
const PHASE = {
  scrubStart: 0.3,
  scrubEnd: 0.88,
  textOutStart: 0.3,
  textOutEnd: 0.6,
  cardsStart: 0.6,
  cardsEnd: 0.85,
} as const;

export type InteractiveHeroProps = {
  /** "HH:mm" Jerusalem sunset, computed on the server. */
  sunset: string;
  /** Supply to draw a real image sequence instead of the placeholder. */
  getFrameSrc?: (index: number) => string;
};

// ---------------------------------------------------------------------------
// Placeholder renderer
// ---------------------------------------------------------------------------

/**
 * Draws the stand-in character for `frame` of `total`.
 *
 * Reads the page's own ink colour from the custom property rather than
 * hard-coding navy, so the figure inverts along with everything else when the
 * dark toggle is thrown.
 */
function drawPlaceholder(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  frame: number,
  total: number,
  ink: string,
  accent: string,
) {
  const t = frame / Math.max(1, total - 1);

  // Walk in from the inline-start edge (right, in RTL) and stop at centre.
  const walkT = Math.min(1, t / 0.78);
  const gestureT = Math.max(0, (t - 0.8) / 0.2);

  // Starts fully off-canvas. Phase 1 is the headline's screen, and a figure
  // standing behind the type there would just be clutter under it — the walk
  // only becomes visible once the headline has started to leave.
  const x = width * (1.12 - 0.62 * walkT);

  // Sized and seated to occupy the middle band. The ground line has to clear
  // the track cards and the CTA that occupy the bottom of the pinned screen,
  // or the figure draws underneath them and is never seen.
  const unit = Math.min(width, height) / 12;
  const groundY = height * 0.55;

  // Stride phase stops advancing once the figure has arrived.
  const stride = walkT < 1 ? Math.sin(frame * 0.34) : 0;
  const bob = walkT < 1 ? Math.abs(Math.cos(frame * 0.34)) * unit * 0.06 : 0;
  const hipY = groundY - unit * 2.2 - bob;

  ctx.clearRect(0, 0, width, height);
  ctx.lineCap = "butt";
  ctx.lineJoin = "miter";
  ctx.strokeStyle = ink;
  ctx.fillStyle = ink;

  // Ground rule.
  ctx.lineWidth = Math.max(3, unit * 0.06);
  ctx.beginPath();
  ctx.moveTo(width * 0.04, groundY);
  ctx.lineTo(width * 0.96, groundY);
  ctx.stroke();

  ctx.lineWidth = Math.max(6, unit * 0.24);

  // Legs.
  ctx.beginPath();
  ctx.moveTo(x, hipY);
  ctx.lineTo(x + stride * unit * 0.55, groundY);
  ctx.moveTo(x, hipY);
  ctx.lineTo(x - stride * unit * 0.55, groundY);
  ctx.stroke();

  // Torso.
  const shoulderY = hipY - unit * 1.5;
  ctx.beginPath();
  ctx.moveTo(x, hipY);
  ctx.lineTo(x, shoulderY);
  ctx.stroke();

  // Arms. The trailing arm lifts into a gesture once the walk has finished.
  const gestureLift = gestureT * Math.PI * 0.62;
  ctx.beginPath();
  ctx.moveTo(x, shoulderY);
  ctx.lineTo(x - stride * unit * 0.45, shoulderY + unit * 0.95);
  ctx.moveTo(x, shoulderY);
  ctx.lineTo(
    x + Math.sin(gestureLift) * unit * 1.0 + stride * unit * 0.45,
    shoulderY + Math.cos(gestureLift) * unit * 0.95,
  );
  ctx.stroke();

  // Head — a square, to stay in the system.
  const headSize = unit * 0.78;
  ctx.fillRect(x - headSize / 2, shoulderY - headSize * 1.15, headSize, headSize);

  // A bronze mark that appears with the gesture, so the end of the sequence
  // reads as an arrival rather than the figure simply stopping.
  if (gestureT > 0) {
    ctx.globalAlpha = gestureT;
    ctx.fillStyle = accent;
    const markSize = unit * 0.34;
    ctx.fillRect(
      x + Math.sin(gestureLift) * unit * 1.0 - markSize / 2,
      shoulderY + Math.cos(gestureLift) * unit * 0.95 - markSize * 1.6,
      markSize,
      markSize,
    );
    ctx.globalAlpha = 1;
  }
}

export default function InteractiveHero({ sunset, getFrameSrc }: InteractiveHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLUListElement>(null);

  // Mutable render state, deliberately outside React: the timeline writes to
  // `frame` up to sixty times a second and a re-render per frame would defeat
  // the entire point of using a canvas.
  const frameStateRef = useRef({ frame: 0 });
  const framesRef = useRef<(HTMLImageElement | null)[]>([]);
  const sizeRef = useRef({ width: 0, height: 0 });
  const inkRef = useRef({ ink: "#020617", accent: "#b49a55" });

  const prefersReducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const canvas = canvasRef.current;
      const section = sectionRef.current;
      const pin = pinRef.current;
      if (!canvas || !section || !pin) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      framesRef.current = new Array(FRAME_COUNT).fill(null);

      // -- colour tokens -------------------------------------------------
      const readInk = () => {
        const styles = getComputedStyle(section);
        inkRef.current = {
          ink: styles.getPropertyValue("--kb-fg").trim() || "#020617",
          accent: styles.getPropertyValue("--kb-accent").trim() || "#b49a55",
        };
      };
      readInk();

      // -- drawing --------------------------------------------------------
      const render = () => {
        const { width, height } = sizeRef.current;
        if (!width || !height) return;

        const index = Math.max(
          0,
          Math.min(FRAME_COUNT - 1, Math.round(frameStateRef.current.frame)),
        );

        if (!getFrameSrc) {
          drawPlaceholder(
            ctx,
            width,
            height,
            index,
            FRAME_COUNT,
            inkRef.current.ink,
            inkRef.current.accent,
          );
          return;
        }

        // Nearest decoded frame, so a not-yet-loaded index shows the closest
        // real image rather than clearing the canvas.
        let image = framesRef.current[index];
        if (!image) {
          for (let offset = 1; offset < FRAME_COUNT; offset += 1) {
            image =
              framesRef.current[index - offset] ?? framesRef.current[index + offset] ?? null;
            if (image) break;
          }
        }
        ctx.clearRect(0, 0, width, height);
        if (!image) return;

        // Manual cover fit.
        const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
        const drawW = image.naturalWidth * scale;
        const drawH = image.naturalHeight * scale;
        ctx.drawImage(image, (width - drawW) / 2, (height - drawH) / 2, drawW, drawH);
      };

      // -- sizing ---------------------------------------------------------
      const resize = () => {
        const parent = canvas.parentElement;
        if (!parent) return;
        const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
        const cssW = parent.clientWidth;
        const cssH = parent.clientHeight;
        canvas.width = Math.round(cssW * dpr);
        canvas.height = Math.round(cssH * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        sizeRef.current = { width: cssW, height: cssH };
        readInk();
        render();
      };

      resize();
      const observer = new ResizeObserver(resize);
      if (canvas.parentElement) observer.observe(canvas.parentElement);

      // Re-read tokens when the dark toggle flips, and repaint.
      const themeObserver = new MutationObserver(() => {
        readInk();
        render();
      });
      themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-kb-dark"],
      });

      // -- optional real sequence -----------------------------------------
      let cancelled = false;
      if (getFrameSrc) {
        let next = 0;
        const loadNext = () => {
          if (cancelled) return;
          const index = next;
          next += 1;
          if (index >= FRAME_COUNT) return;
          const image = new Image();
          image.decoding = "async";
          image.onload = () => {
            if (cancelled) return;
            framesRef.current[index] = image;
            render();
            loadNext();
          };
          image.onerror = loadNext;
          image.src = getFrameSrc(index);
        };
        for (let i = 0; i < LOAD_CONCURRENCY; i += 1) loadNext();
      }

      // -- reduced motion --------------------------------------------------
      // No pin, no scrub: the last frame is drawn once and the cards are
      // simply present. A 300vh section the visitor has to scroll through to
      // reach the content is exactly what that setting is asking us to skip.
      if (prefersReducedMotion) {
        frameStateRef.current.frame = FRAME_COUNT - 1;
        render();
        if (cardsRef.current) cardsRef.current.style.opacity = "1";
        return () => {
          cancelled = true;
          observer.disconnect();
          themeObserver.disconnect();
        };
      }

      // -- master timeline -------------------------------------------------
      const cards = cardsRef.current?.children;

      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          pin,
          // The 300vh section already supplies the scroll distance, so GSAP
          // must not add its own spacer on top of it.
          pinSpacing: false,
          invalidateOnRefresh: true,
        },
      });

      // Phase 1 (0 → 30%) is the headline holding, which is the absence of a
      // tween rather than one of its own.

      // Phase 2: frames scrub, headline leaves.
      timeline.to(
        frameStateRef.current,
        {
          frame: FRAME_COUNT - 1,
          duration: PHASE.scrubEnd - PHASE.scrubStart,
          onUpdate: render,
        },
        PHASE.scrubStart,
      );

      if (textRef.current) {
        timeline.to(
          textRef.current,
          { opacity: 0, y: -50, duration: PHASE.textOutEnd - PHASE.textOutStart },
          PHASE.textOutStart,
        );
      }

      // Phase 3: the tracks arrive around the figure.
      //
      // The container fades with them. Animating only the <li>s left the
      // grid's own dark ground — it draws the rules between the cells —
      // sitting on screen as a solid slab through phases 1 and 2.
      if (cardsRef.current) {
        timeline.fromTo(
          cardsRef.current,
          { opacity: 0 },
          { opacity: 1, duration: (PHASE.cardsEnd - PHASE.cardsStart) * 0.5 },
          PHASE.cardsStart,
        );
      }

      if (cards && cards.length) {
        timeline.fromTo(
          cards,
          { opacity: 0, scale: 0.82, y: 34 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: PHASE.cardsEnd - PHASE.cardsStart,
            stagger: 0.04,
          },
          PHASE.cardsStart,
        );
      }

      // Holds the timeline open to a full 1.0 so the phase positions above
      // map onto scroll progress directly. Without it the last tween's end
      // would be treated as 100% and every phase would land early.
      timeline.to({}, { duration: 0.02 }, 0.98);

      return () => {
        cancelled = true;
        observer.disconnect();
        themeObserver.disconnect();
      };
    },
    { scope: sectionRef, dependencies: [prefersReducedMotion, getFrameSrc] },
  );

  return (
    <section
      ref={sectionRef}
      className={cn(
        "relative bg-kb",
        prefersReducedMotion ? "min-h-svh" : "h-[300vh]",
      )}
    >
      <div
        ref={pinRef}
        className="top-0 flex h-svh w-full flex-col justify-between overflow-hidden border-b-[3px] border-kb bg-kb px-5 pt-24 sm:px-8 sm:pt-28"
        style={{ paddingBottom: "calc(var(--kb-nav-h) + env(safe-area-inset-bottom) + 1.5rem)" }}
      >
        {/* The sequence sits behind everything and never takes pointer input. */}
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 block h-full w-full"
        />

        <ZmanimBadge time={sunset} className="absolute top-5 right-5 z-20 sm:top-7 sm:right-8" />

        <div ref={textRef} className="relative z-10 mx-auto w-full max-w-7xl">
          <p className="text-[0.6rem] leading-relaxed font-bold tracking-[0.14em] text-kb-accent sm:text-xs sm:tracking-[0.3em]">
            {HERO_EYEBROW}
          </p>

          <h1 className="mt-7 text-[3.4rem] leading-[0.92] font-extrabold tracking-[-0.045em] text-kb sm:mt-10 sm:text-[7.5rem] lg:text-[9.5rem]">
            {HERO_TITLE_LINES.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-snug font-medium text-kb-dim sm:mt-8 sm:text-2xl">
            {HERO_SUBHEAD}
          </p>
        </div>

        <div className="relative z-10 mx-auto w-full max-w-7xl">
          {/* Four tracks, revealed around the figure in the final phase. Two
              columns on a phone so they frame the character rather than
              burying it; four across once there is width. */}
          <ul
            ref={cardsRef}
            // Starts hidden in CSS so there is no flash of the grid before
            // GSAP takes over on mount. The timeline (or the reduced-motion
            // branch) is what brings it back.
            className="grid grid-cols-2 gap-[3px] border-[3px] border-kb bg-kb-inv opacity-0 sm:grid-cols-4"
          >
            {TRACK_TEASERS.map((label, index) => (
              <li key={label} className="flex min-h-[6.5rem] flex-col justify-between bg-kb p-3 sm:min-h-[9rem] sm:p-5">
                <span className="text-[0.55rem] font-bold tracking-[0.25em] text-kb-faint tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="mt-3 text-sm leading-[1.1] font-extrabold tracking-[-0.03em] text-kb sm:text-lg">
                  {label}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
            <BrutalButton
              onClick={() =>
                document.getElementById(JOIN_ANCHOR_ID)?.scrollIntoView({
                  behavior: prefersReducedMotion ? "auto" : "smooth",
                  block: "start",
                })
              }
            >
              {HERO_CTA}
            </BrutalButton>

            <TimeHeadline className="text-sm font-extrabold tracking-tight text-kb-accent sm:text-base" />
          </div>
        </div>
      </div>
    </section>
  );
}
